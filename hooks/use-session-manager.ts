"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
    type ChatSession,
    createEmptySession,
    deleteSession as deleteSessionFromDB,
    enforceSessionLimit,
    extractTitle,
    getAllSessionMetadata,
    getSession,
    isIndexedDBAvailable,
    migrateFromLocalStorage,
    type SessionMetadata,
    type StoredMessage,
    saveSession,
} from "@/lib/session-storage"

export interface SessionData {
    messages: StoredMessage[]
    xmlSnapshots: [number, string][]
    diagramXml: string
    thumbnailDataUrl?: string
    diagramHistory?: { svg: string; xml: string }[]
}

export interface UseSessionManagerReturn {
    // 狀態
    sessions: SessionMetadata[]
    currentSessionId: string | null
    currentSession: ChatSession | null
    isLoading: boolean
    isAvailable: boolean

    // 操作
    switchSession: (id: string) => Promise<SessionData | null>
    deleteSession: (id: string) => Promise<{ wasCurrentSession: boolean }>
    // forSessionId：選擇性工作階段 ID 以驗證保存目標是否為正確的工作階段（防止舊的防抖寫入）
    saveCurrentSession: (
        data: SessionData,
        forSessionId?: string | null,
    ) => Promise<void>
    refreshSessions: () => Promise<void>
    clearCurrentSession: () => void
}

interface UseSessionManagerOptions {
    /** 來自 URL 參數的工作階段 ID - 如果提供，載入此工作階段；如果為 null，則開始空白 */
    initialSessionId?: string | null
}

export function useSessionManager(
    options: UseSessionManagerOptions = {},
): UseSessionManagerReturn {
    const { initialSessionId } = options
    const [sessions, setSessions] = useState<SessionMetadata[]>([])
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(
        null,
    )
    const [currentSession, setCurrentSession] = useState<ChatSession | null>(
        null,
    )
    const [isLoading, setIsLoading] = useState(true)
    const [isAvailable, setIsAvailable] = useState(false)

    const isInitializedRef = useRef(false)
    // 為 URL 變更的序列守衛 - 防止不按順序的非同步解析
    const urlChangeSequenceRef = useRef(0)

    // 載入工作階段清單
    const refreshSessions = useCallback(async () => {
        if (!isIndexedDBAvailable()) return
        try {
            const metadata = await getAllSessionMetadata()
            setSessions(metadata)
        } catch (error) {
            console.error("Failed to refresh sessions:", error)
        }
    }, [])

    // 在掛載時初始化
    useEffect(() => {
        if (isInitializedRef.current) return
        isInitializedRef.current = true

        async function init() {
            setIsLoading(true)

            if (!isIndexedDBAvailable()) {
                setIsAvailable(false)
                setIsLoading(false)
                return
            }

            setIsAvailable(true)

            try {
                // 先執行遷移（從 localStorage 的一次性轉換）
                await migrateFromLocalStorage()

                // 載入工作階段清單
                const metadata = await getAllSessionMetadata()
                setSessions(metadata)

                // 只有當提供 initialSessionId 時才載入工作階段（來自 URL 參數）
                if (initialSessionId) {
                    const session = await getSession(initialSessionId)
                    if (session) {
                        setCurrentSession(session)
                        setCurrentSessionId(session.id)
                    }
                    // 如果找不到工作階段，保持空白狀態（URL 具有無效的工作階段 ID）
                }
                // 如果沒有 initialSessionId，以空白狀態開始（無自動還原）
            } catch (error) {
                console.error("Failed to initialize session manager:", error)
            } finally {
                setIsLoading(false)
            }
        }

        init()
    }, [initialSessionId])

    // 在初始化後處理 URL 工作階段 ID 變更
    // 注意：意圖上不在 deps 中包含 currentSessionId 以避免競態條件
    // 當 clearCurrentSession() 在 URL 更新之前被調用時
    useEffect(() => {
        if (!isInitializedRef.current) return // 等待初始載入
        if (!isAvailable) return

        // 增加序列以使任何待處理的非同步操作失效
        urlChangeSequenceRef.current++
        const currentSequence = urlChangeSequenceRef.current

        async function handleSessionIdChange() {
            if (initialSessionId) {
                // URL 有工作階段 ID - 載入它
                const session = await getSession(initialSessionId)

                // 檢查此請求是否仍是最新的（序列守衛）
                // 如果不是，在我們載入時發生了更新的 URL 變更
                if (currentSequence !== urlChangeSequenceRef.current) {
                    return
                }

                if (session) {
                    // 只有在工作階段與目前不同時才更新
                    setCurrentSessionId((current) => {
                        if (current !== session.id) {
                            setCurrentSession(session)
                            return session.id
                        }
                        return current
                    })
                }
            }
            // 已移除：清除工作階段的 else 子句
            // 清除現在由 clearCurrentSession() 明確處理
            // 這防止了當 URL 更新是非同步時的競態條件
        }

        handleSessionIdChange()
    }, [initialSessionId, isAvailable])

    // 在視窗獲得焦點時刷新工作階段（多標籤頁同步）
    useEffect(() => {
        const handleFocus = () => {
            refreshSessions()
        }
        window.addEventListener("focus", handleFocus)
        return () => window.removeEventListener("focus", handleFocus)
    }, [refreshSessions])

    // 切換到不同的工作階段
    const switchSession = useCallback(
        async (id: string): Promise<SessionData | null> => {
            if (id === currentSessionId) return null

            // 如果目前工作階段有訊息，先保存它
            if (currentSession && currentSession.messages.length > 0) {
                await saveSession(currentSession)
            }

            // 載入目標工作階段
            const session = await getSession(id)
            if (!session) {
                console.error("Session not found:", id)
                return null
            }

            // 更新狀態
            setCurrentSession(session)
            setCurrentSessionId(session.id)

            return {
                messages: session.messages,
                xmlSnapshots: session.xmlSnapshots,
                diagramXml: session.diagramXml,
                thumbnailDataUrl: session.thumbnailDataUrl,
                diagramHistory: session.diagramHistory,
            }
        },
        [currentSessionId, currentSession],
    )

    // 刪除工作階段
    const deleteSession = useCallback(
        async (id: string): Promise<{ wasCurrentSession: boolean }> => {
            const wasCurrentSession = id === currentSessionId
            await deleteSessionFromDB(id)

            // 如果刪除目前工作階段，清除狀態（呼叫者將顯示新的空白工作階段）
            if (wasCurrentSession) {
                setCurrentSession(null)
                setCurrentSessionId(null)
            }

            await refreshSessions()

            return { wasCurrentSession }
        },
        [currentSessionId, refreshSessions],
    )

    // 保存目前工作階段資料（由呼叫者在外部防抖）
    // forSessionId：如果提供，驗證保存目標是否為正確的工作階段（防止舊的防抖寫入）
    const saveCurrentSession = useCallback(
        async (
            data: SessionData,
            forSessionId?: string | null,
        ): Promise<void> => {
            // 如果提供 forSessionId，驗證它是否與目前工作階段匹配
            // 這防止舊的防抖保存覆寫新切換的工作階段
            if (
                forSessionId !== undefined &&
                forSessionId !== currentSessionId
            ) {
                return
            }

            if (!currentSession) {
                // 如果沒有工作階段，建立新工作階段
                const newSession: ChatSession = {
                    ...createEmptySession(),
                    messages: data.messages,
                    xmlSnapshots: data.xmlSnapshots,
                    diagramXml: data.diagramXml,
                    thumbnailDataUrl: data.thumbnailDataUrl,
                    diagramHistory: data.diagramHistory,
                    title: extractTitle(data.messages),
                }
                await saveSession(newSession)
                await enforceSessionLimit()
                setCurrentSession(newSession)
                setCurrentSessionId(newSession.id)
                await refreshSessions()
                return
            }

            // 更新現有工作階段
            const updatedSession: ChatSession = {
                ...currentSession,
                messages: data.messages,
                xmlSnapshots: data.xmlSnapshots,
                diagramXml: data.diagramXml,
                thumbnailDataUrl:
                    data.thumbnailDataUrl ?? currentSession.thumbnailDataUrl,
                diagramHistory:
                    data.diagramHistory ?? currentSession.diagramHistory,
                updatedAt: Date.now(),
                // Update title if it's still default and we have messages
                title:
                    currentSession.title === "New Chat" &&
                    data.messages.length > 0
                        ? extractTitle(data.messages)
                        : currentSession.title,
            }

            await saveSession(updatedSession)
            setCurrentSession(updatedSession)

            // 更新工作階段清單中繼資料
            setSessions((prev) =>
                prev.map((s) =>
                    s.id === updatedSession.id
                        ? {
                              ...s,
                              title: updatedSession.title,
                              updatedAt: updatedSession.updatedAt,
                              messageCount: updatedSession.messages.length,
                              hasDiagram:
                                  !!updatedSession.diagramXml &&
                                  updatedSession.diagramXml.trim().length > 0,
                              thumbnailDataUrl: updatedSession.thumbnailDataUrl,
                          }
                        : s,
                ),
            )
        },
        [currentSession, currentSessionId, refreshSessions],
    )

    // 清除目前工作階段狀態（用於開始新工作而不載入另一個工作階段）
    const clearCurrentSession = useCallback(() => {
        setCurrentSession(null)
        setCurrentSessionId(null)
    }, [])

    return {
        sessions,
        currentSessionId,
        currentSession,
        isLoading,
        isAvailable,
        switchSession,
        deleteSession,
        saveCurrentSession,
        refreshSessions,
        clearCurrentSession,
    }
}
