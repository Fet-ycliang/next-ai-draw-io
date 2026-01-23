"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
    extractPdfText,
    extractTextFileContent,
    isPdfFile,
    isTextFile,
    MAX_EXTRACTED_CHARS,
} from "@/lib/pdf-utils"

export interface FileData {
    text: string
    charCount: number
    isExtracting: boolean
}

/**
 * 用於處理檔案上傳的 Hook，特別是 PDF 和文字檔案。
 * 處理文字提取、字元限制驗證和清理。
 */
export function useFileProcessor() {
    const [files, setFiles] = useState<File[]>([])
    const [pdfData, setPdfData] = useState<Map<File, FileData>>(new Map())

    const handleFileChange = async (newFiles: File[]) => {
        setFiles(newFiles)

        // 立即為新的 PDF/文字檔案提取文字
        for (const file of newFiles) {
            const needsExtraction =
                (isPdfFile(file) || isTextFile(file)) && !pdfData.has(file)
            if (needsExtraction) {
                // 標記為提取中
                setPdfData((prev) => {
                    const next = new Map(prev)
                    next.set(file, {
                        text: "",
                        charCount: 0,
                        isExtracting: true,
                    })
                    return next
                })

                // 非同步提取文字
                try {
                    let text: string
                    if (isPdfFile(file)) {
                        text = await extractPdfText(file)
                    } else {
                        text = await extractTextFileContent(file)
                    }

                    // 檢查字元限制
                    if (text.length > MAX_EXTRACTED_CHARS) {
                        const limitK = MAX_EXTRACTED_CHARS / 1000
                        toast.error(
                            `${file.name}: 內容超過 ${limitK}k 個字元限制 (${(text.length / 1000).toFixed(1)}k chars)`,
                        )
                        setPdfData((prev) => {
                            const next = new Map(prev)
                            next.delete(file)
                            return next
                        })
                        // 從清單中移除檔案
                        setFiles((prev) => prev.filter((f) => f !== file))
                        continue
                    }

                    setPdfData((prev) => {
                        const next = new Map(prev)
                        next.set(file, {
                            text,
                            charCount: text.length,
                            isExtracting: false,
                        })
                        return next
                    })
                } catch (error) {
                    console.error("Failed to extract text:", error)
                    toast.error(`Failed to read file: ${file.name}`)
                    setPdfData((prev) => {
                        const next = new Map(prev)
                        next.delete(file)
                        return next
                    })
                }
            }
        }

        // 清理已移除檔案的 pdfData
        setPdfData((prev) => {
            const next = new Map(prev)
            for (const key of prev.keys()) {
                if (!newFiles.includes(key)) {
                    next.delete(key)
                }
            }
            return next
        })
    }

    return {
        files,
        pdfData,
        handleFileChange,
        setFiles, // 匯出以供外部控制（例如清除檔案）
    }
}
