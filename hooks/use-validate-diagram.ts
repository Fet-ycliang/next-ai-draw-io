"use client"

/**
 * 使用 AI SDK 的 useObject 進行基於 VLM 的圖表驗證的 Hook。
 */

import { experimental_useObject as useObject } from "@ai-sdk/react"
import { useCallback, useRef } from "react"
import { getApiEndpoint } from "@/lib/base-path"
import {
    type ValidationResult,
    ValidationResultSchema,
} from "@/lib/validation-schema"

export type { ValidationResult }

// 失敗情況下的預設有效結果
const DEFAULT_VALID_RESULT: ValidationResult = {
    valid: true,
    issues: [],
    suggestions: [],
}

interface UseValidateDiagramOptions {
    onSuccess?: (result: ValidationResult) => void
    onError?: (error: Error) => void
}

// 為命令式 API 追蹤待處理的驗證承諾
type PendingValidation = {
    resolve: (result: ValidationResult) => void
    reject: (error: Error) => void
}

export function useValidateDiagram(options: UseValidateDiagramOptions = {}) {
    const { onSuccess, onError } = options
    const pendingValidationRef = useRef<PendingValidation | null>(null)

    const { object, submit, isLoading, error, stop } = useObject({
        api: getApiEndpoint("/api/validate-diagram"),
        schema: ValidationResultSchema,
        onFinish: ({
            object,
            error: finishError,
        }: {
            object: ValidationResult | undefined
            error: Error | undefined
        }) => {
            if (finishError) {
                console.error(
                    "[useValidateDiagram] Validation error:",
                    finishError,
                )
                onError?.(finishError)
                pendingValidationRef.current?.reject(finishError)
                pendingValidationRef.current = null
                return
            }

            if (object) {
                const result = object as ValidationResult
                onSuccess?.(result)
                pendingValidationRef.current?.resolve(result)
                pendingValidationRef.current = null
            }
        },
        onError: (err: Error) => {
            console.error("[useValidateDiagram] Stream error:", err)
            onError?.(err)
            pendingValidationRef.current?.reject(err)
            pendingValidationRef.current = null
        },
    })

    /**
     * 驗證圖表影像。
     * 傳回使用驗證結果解析的承諾。
     */
    const validate = useCallback(
        async (
            imageData: string,
            sessionId?: string,
        ): Promise<ValidationResult> => {
            // 拒絕任何待處理的驗證以防止承諾洩漏
            if (pendingValidationRef.current) {
                pendingValidationRef.current.reject(
                    new Error("Validation superseded by new request"),
                )
                pendingValidationRef.current = null
            }

            return new Promise((resolve, reject) => {
                // 儲存承諾處理程式
                pendingValidationRef.current = { resolve, reject }

                // 提交驗證請求
                submit({ imageData, sessionId })
            })
        },
        [submit],
    )

    /**
     * 使用備用方案進行驗證 - 在錯誤時傳回預設有效結果。
     * 使用此選項可避免驗證失敗時阻止使用者。
     */
    const validateWithFallback = useCallback(
        async (
            imageData: string,
            sessionId?: string,
        ): Promise<ValidationResult> => {
            try {
                return await validate(imageData, sessionId)
            } catch (error) {
                console.warn(
                    "[useValidateDiagram] Validation failed, using fallback:",
                    error,
                )
                return DEFAULT_VALID_RESULT
            }
        },
        [validate],
    )

    return {
        // 驗證函式
        validate,
        validateWithFallback,
        stop,

        // 狀態
        isValidating: isLoading,
        partialResult: object as ValidationResult | undefined,
        error,
    }
}
