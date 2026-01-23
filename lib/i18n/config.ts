export const i18n = {
    defaultLocale: "zh-tw",
    locales: ["zh-tw", "en", "zh", "ja"],
} as const

export type Locale = (typeof i18n)["locales"][number]
