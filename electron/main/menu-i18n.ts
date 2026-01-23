/**
 * Electron 選單的國際化支援
 * 不使用 Electron 內建角色的選單標籤的翻譯
 */

import { getUserLocale } from "./config-manager"

export type MenuLocale = "en" | "zh" | "ja"

export interface MenuTranslations {
    // 應用程式選單（僅限 macOS）
    settings: string

    // 檔案選單
    file: string

    // 編輯選單
    edit: string

    // 檢視選單
    view: string

    // 設定選單
    configuration: string
    switchPreset: string
    managePresets: string
    addConfigurationPreset: string

    // 視窗選單
    window: string

    // 說明選單
    help: string
    documentation: string
    reportIssue: string
}

const translations: Record<MenuLocale, MenuTranslations> = {
    en: {
        // 應用程式選單
        settings: "Settings...",

        // 檔案選單
        file: "File",

        // 編輯選單
        edit: "Edit",

        // 檢視選單
        view: "View",

        // 設定選單
        configuration: "Configuration",
        switchPreset: "Switch Preset",
        managePresets: "Manage Presets...",
        addConfigurationPreset: "Add Configuration Preset...",

        // 視窗選單
        window: "Window",

        // 說明選單
        help: "Help",
        documentation: "Documentation",
        reportIssue: "Report Issue",
    },

    zh: {
        // 應用程式選單
        settings: "设置...",

        // 檔案選單
        file: "文件",

        // 編輯選單
        edit: "编辑",

        // 檢視選單
        view: "查看",

        // 設定選單
        configuration: "配置",
        switchPreset: "切换预设",
        managePresets: "管理预设...",
        addConfigurationPreset: "添加配置预设...",

        // 視窗選單
        window: "窗口",

        // 說明選單
        help: "帮助",
        documentation: "文档",
        reportIssue: "报告问题",
    },

    ja: {
        // 應用程式選單
        settings: "設定...",

        // 檔案選單
        file: "ファイル",

        // 編輯選單
        edit: "編集",

        // 檢視選單
        view: "表示",

        // 設定選單
        configuration: "設定",
        switchPreset: "プリセット切り替え",
        managePresets: "プリセット管理...",
        addConfigurationPreset: "設定プリセットを追加...",

        // 視窗選單
        window: "ウインドウ",

        // 說明選單
        help: "ヘルプ",
        documentation: "ドキュメント",
        reportIssue: "問題を報告",
    },
}

/**
 * 獲取給定語言環境的選單翻譯
 * 如果不支援語言環境，則回退到英文
 */
export function getMenuTranslations(locale: string): MenuTranslations {
    // 正規化語言環境（例如 "zh-CN" -> "zh"，"ja-JP" -> "ja"）
    const normalized = locale.toLowerCase().split("-")[0]

    if (normalized === "zh") return translations.zh
    if (normalized === "ja") return translations.ja
    return translations.en
}

/**
 * 從 Electron 應用程式偵測系統語言環境
 * 傳回下列其中之一："en", "zh", "ja"
 */
export function detectSystemLocale(appLocale: string): MenuLocale {
    const normalized = appLocale.toLowerCase().split("-")[0]

    if (normalized === "zh") return "zh"
    if (normalized === "ja") return "ja"
    return "en"
}

/**
 * 從儲存的偏好設定或系統預設值取得語言環境
 * 先檢查組態檔案中的使用者語言偏好設定
 */
export function getPreferredLocale(appLocale: string): MenuLocale {
    // 先嘗試從儲存的偏好設定取得
    const savedLocale = getUserLocale()
    if (savedLocale) {
        return savedLocale
    }

    // 回退到系統語言環境
    return detectSystemLocale(appLocale)
}
