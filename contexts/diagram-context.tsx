"use client"

import type React from "react"
import { createContext, useContext, useEffect, useRef, useState } from "react"
import type { DrawIoEmbedRef } from "react-drawio"
import { toast } from "sonner"
import type { ExportFormat } from "@/components/save-dialog"
import { getApiEndpoint } from "@/lib/base-path"
import {
    extractDiagramXML,
    isRealDiagram,
    validateAndFixXml,
} from "../lib/utils"

interface DiagramContextType {
    chartXML: string
    latestSvg: string
    diagramHistory: { svg: string; xml: string }[]
    setDiagramHistory: (history: { svg: string; xml: string }[]) => void
    loadDiagram: (chart: string, skipValidation?: boolean) => string | null
    handleExport: () => void
    handleExportWithoutHistory: () => void
    resolverRef: React.Ref<((value: string) => void) | null>
    drawioRef: React.Ref<DrawIoEmbedRef | null>
    handleDiagramExport: (data: any) => void
    clearDiagram: () => void
    saveDiagramToFile: (
        filename: string,
        format: ExportFormat,
        sessionId?: string,
        successMessage?: string,
    ) => void
    getThumbnailSvg: () => Promise<string | null>
    captureValidationPng: () => Promise<string | null>
    isDrawioReady: boolean
    onDrawioLoad: () => void
    resetDrawioReady: () => void
    showSaveDialog: boolean
    setShowSaveDialog: (show: boolean) => void
}

const DiagramContext = createContext<DiagramContextType | undefined>(undefined)

export function DiagramProvider({ children }: { children: React.ReactNode }) {
    const [chartXML, setChartXML] = useState<string>("")
    const [latestSvg, setLatestSvg] = useState<string>("")
    const [diagramHistory, setDiagramHistory] = useState<
        { svg: string; xml: string }[]
    >([])
    const [isDrawioReady, setIsDrawioReady] = useState(false)
    const [showSaveDialog, setShowSaveDialog] = useState(false)
    const hasCalledOnLoadRef = useRef(false)
    const drawioRef = useRef<DrawIoEmbedRef | null>(null)
    const resolverRef = useRef<((value: string) => void) | null>(null)
    // PNG 匯出的解析器（用於 VLM 驗證）
    const pngResolverRef = useRef<((value: string) => void) | null>(null)
    // 追蹤是否期望匯出歷史記錄（由使用者初始化）
    const expectHistoryExportRef = useRef<boolean>(false)
    // 追蹤圖表在 DrawIO 重新掛載後是否已恢復（例如主題變更）
    const hasDiagramRestoredRef = useRef<boolean>(false)
    // 追蹤最新的 chartXML 以便在重新掛載後恢復
    const chartXMLRef = useRef<string>("")

    const onDrawioLoad = () => {
        // 只設定一次就緒狀態以防止無限迴圈
        if (hasCalledOnLoadRef.current) return
        hasCalledOnLoadRef.current = true
        setIsDrawioReady(true)
    }

    const resetDrawioReady = () => {
        hasCalledOnLoadRef.current = false
        setIsDrawioReady(false)
    }

    // 保持 chartXMLRef 與狀態同步以便在重新掛載後恢復
    useEffect(() => {
        chartXMLRef.current = chartXML
    }, [chartXML])

    // 當 DrawIO 在重新掛載後變為就緒時恢復圖表（例如主題/UI 變更）
    useEffect(() => {
        // 當 DrawIO 未就緒時重設恢復旗標（為下一個恢復週期做準備）
        if (!isDrawioReady) {
            hasDiagramRestoredRef.current = false
            return
        }
        // 每個就緒週期只恢復一次
        if (hasDiagramRestoredRef.current) return
        hasDiagramRestoredRef.current = true

        // 如果我們有的話，從參考恢復圖表
        const xmlToRestore = chartXMLRef.current
        if (isRealDiagram(xmlToRestore) && drawioRef.current) {
            drawioRef.current.load({ xml: xmlToRestore })
        }
    }, [isDrawioReady])

    // 追蹤是否期望匯出以保存檔案（儲存原始匯出資料）
    const saveResolverRef = useRef<{
        resolver: ((data: string) => void) | null
        format: ExportFormat | null
    }>({ resolver: null, format: null })

    const handleExport = () => {
        if (drawioRef.current) {
            // 標記此匯出應該保存到歷史記錄
            expectHistoryExportRef.current = true
            drawioRef.current.exportDiagram({
                format: "xmlsvg",
            })
        }
    }

    const handleExportWithoutHistory = () => {
        if (drawioRef.current) {
            // 匯出而不保存到歷史記錄（用於 edit_diagram 提取目前狀態）
            drawioRef.current.exportDiagram({
                format: "xmlsvg",
            })
        }
    }

    // 取得目前圖表作為 SVG 以製作縮圖（由工作階段存儲使用）
    const getThumbnailSvg = async (): Promise<string | null> => {
        if (!drawioRef.current) return null
        // 如果圖表為空，不要匯出
        if (!isRealDiagram(chartXML)) return null

        try {
            const svgData = await Promise.race([
                new Promise<string>((resolve) => {
                    resolverRef.current = resolve
                    drawioRef.current?.exportDiagram({ format: "xmlsvg" })
                }),
                new Promise<string>((_, reject) =>
                    setTimeout(() => reject(new Error("Export timeout")), 3000),
                ),
            ])

            // 更新 latestSvg 使其可用於未來的保存
            if (svgData?.includes("<svg")) {
                setLatestSvg(svgData)
                return svgData
            }
            return null
        } catch {
            // 逾時偶爾會發生 - 不要記錄為錯誤
            return null
        }
    }

    // 擷取目前圖表作為 PNG 以進行 VLM 驗證
    const captureValidationPng = async (): Promise<string | null> => {
        if (!drawioRef.current) return null
        // 如果圖表為空，不要匯出
        if (!isRealDiagram(chartXML)) return null

        try {
            const pngData = await Promise.race([
                new Promise<string>((resolve) => {
                    pngResolverRef.current = resolve
                    drawioRef.current?.exportDiagram({ format: "png" })
                }),
                new Promise<string>((_, reject) =>
                    setTimeout(
                        () => reject(new Error("PNG export timeout")),
                        5000,
                    ),
                ),
            ])

            // PNG 資料應該是 base64 資料 URL
            if (pngData?.startsWith("data:image/png")) {
                return pngData
            }
            return null
        } catch {
            // 逾時偶爾會發生 - 不要記錄為錯誤
            return null
        }
    }

    const loadDiagram = (
        chart: string,
        skipValidation?: boolean,
    ): string | null => {
        let xmlToLoad = chart

        // 在載入前驗證 XML 結構（除非跳過以供內部使用）
        if (!skipValidation) {
            const validation = validateAndFixXml(chart)
            if (!validation.valid) {
                console.warn(
                    "[loadDiagram] Validation error:",
                    validation.error,
                )
                return validation.error
            }
            // 如果套用了自動修復，使用修復後的 XML
            if (validation.fixed) {
                console.log(
                    "[loadDiagram] Auto-fixed XML issues:",
                    validation.fixes,
                )
                xmlToLoad = validation.fixed
            }
        }

        // 即使注入圖表時也要保持 chartXML 同步（例如 display_diagram 工具）
        setChartXML(xmlToLoad)

        if (drawioRef.current) {
            drawioRef.current.load({
                xml: xmlToLoad,
            })
        }

        return null
    }

    const handleDiagramExport = (data: any) => {
        // 處理 PNG 匯出以進行 VLM 驗證
        if (pngResolverRef.current && data.data?.startsWith("data:image/png")) {
            pngResolverRef.current(data.data)
            pngResolverRef.current = null
            return
        }

        // 如果有要求，則處理保存到檔案（在提取前處理原始資料）
        if (saveResolverRef.current.resolver) {
            const format = saveResolverRef.current.format
            saveResolverRef.current.resolver(data.data)
            saveResolverRef.current = { resolver: null, format: null }
            // 對於非 xmlsvg 格式，跳過 XML 提取因為它會失敗
            // 只有 drawio（內部使用 xmlsvg）具有 content 屬性
            if (format === "png" || format === "svg") {
                return
            }
        }

        const extractedXML = extractDiagramXML(data.data)
        setChartXML(extractedXML)
        setLatestSvg(data.data)

        // 只有在這是由使用者初始化的匯出時才添加到歷史記錄
        // 限制為 20 個項目以防止長時間工作階段期間的記憶體洩漏
        const MAX_HISTORY_SIZE = 20
        if (expectHistoryExportRef.current) {
            setDiagramHistory((prev) => {
                const newHistory = [
                    ...prev,
                    {
                        svg: data.data,
                        xml: extractedXML,
                    },
                ]
                // 只保留最後 MAX_HISTORY_SIZE 個項目（循環緩衝區）
                return newHistory.slice(-MAX_HISTORY_SIZE)
            })
            expectHistoryExportRef.current = false
        }

        if (resolverRef.current) {
            resolverRef.current(extractedXML)
            resolverRef.current = null
        }
    }

    const clearDiagram = () => {
        const emptyDiagram = `<mxfile><diagram name="Page-1" id="page-1"><mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/></root></mxGraphModel></diagram></mxfile>`
        // 跳過受信任的內部範本的驗證（loadDiagram 也設定 chartXML）
        loadDiagram(emptyDiagram, true)
        setLatestSvg("")
        setDiagramHistory([])
    }

    const saveDiagramToFile = (
        filename: string,
        format: ExportFormat,
        sessionId?: string,
        successMessage?: string,
    ) => {
        if (!drawioRef.current) {
            console.warn("Draw.io editor not ready")
            return
        }

        // 將格式對應到 draw.io 匯出格式
        const drawioFormat = format === "drawio" ? "xmlsvg" : format

        // 在觸發匯出前設定解析器
        saveResolverRef.current = {
            resolver: (exportData: string) => {
                let fileContent: string | Blob
                let mimeType: string
                let extension: string

                if (format === "drawio") {
                    // 從 SVG 提取 XML 以用於 .drawio 格式
                    const xml = extractDiagramXML(exportData)
                    let xmlContent = xml
                    if (!xml.includes("<mxfile")) {
                        xmlContent = `<mxfile><diagram name="Page-1" id="page-1">${xml}</diagram></mxfile>`
                    }
                    fileContent = xmlContent
                    mimeType = "application/xml"
                    extension = ".drawio"
                } else if (format === "png") {
                    // PNG 資料以 base64 資料 URL 的形式提供
                    fileContent = exportData
                    mimeType = "image/png"
                    extension = ".png"
                } else {
                    // SVG 格式
                    fileContent = exportData
                    mimeType = "image/svg+xml"
                    extension = ".svg"
                }

                // 將保存事件記錄到 Langfuse（標記追蹤）
                logSaveToLangfuse(filename, format, sessionId)

                // 處理下載
                let url: string
                if (
                    typeof fileContent === "string" &&
                    fileContent.startsWith("data:")
                ) {
                    // 已經是資料 URL（PNG）
                    url = fileContent
                } else {
                    const blob = new Blob([fileContent], { type: mimeType })
                    url = URL.createObjectURL(blob)
                }

                const a = document.createElement("a")
                a.href = url
                a.download = `${filename}${extension}`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)

                // 在下載開始後顯示成功提示
                if (successMessage) {
                    toast.success(successMessage, {
                        position: "bottom-left",
                        duration: 2500,
                    })
                }

                // 延遲 URL 撤銷以確保下載完成
                if (!url.startsWith("data:")) {
                    setTimeout(() => URL.revokeObjectURL(url), 100)
                }
            },
            format,
        }

        // 匯出圖表 - 回呼將在 handleDiagramExport 中處理
        drawioRef.current.exportDiagram({ format: drawioFormat })
    }

    // 將保存事件記錄到 Langfuse（只是標記追蹤，不發送內容）
    const logSaveToLangfuse = async (
        filename: string,
        format: string,
        sessionId?: string,
    ) => {
        try {
            await fetch(getApiEndpoint("/api/log-save"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ filename, format, sessionId }),
            })
        } catch (error) {
            console.warn("Failed to log save to Langfuse:", error)
        }
    }

    return (
        <DiagramContext.Provider
            value={{
                chartXML,
                latestSvg,
                diagramHistory,
                setDiagramHistory,
                loadDiagram,
                handleExport,
                handleExportWithoutHistory,
                resolverRef,
                drawioRef,
                handleDiagramExport,
                clearDiagram,
                saveDiagramToFile,
                getThumbnailSvg,
                captureValidationPng,
                isDrawioReady,
                onDrawioLoad,
                resetDrawioReady,
                showSaveDialog,
                setShowSaveDialog,
            }}
        >
            {children}
        </DiagramContext.Provider>
    )
}

export function useDiagram() {
    const context = useContext(DiagramContext)
    if (context === undefined) {
        throw new Error("useDiagram must be used within a DiagramProvider")
    }
    return context
}
