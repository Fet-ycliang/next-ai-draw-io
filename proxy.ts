import { match as matchLocale } from "@formatjs/intl-localematcher"
import Negotiator from "negotiator"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { i18n } from "./lib/i18n/config"

function getLocale(request: NextRequest): string | undefined {
    // Negotiator expects plain object so we need to transform headers
    const negotiatorHeaders: Record<string, string> = {}
    request.headers.forEach((value, key) => {
        negotiatorHeaders[key] = value
    })

    // @ts-expect-error locales are readonly
    const locales: string[] = i18n.locales

    // Use negotiator and intl-localematcher to get best locale
    // We get all languages from negotiator without filtering against our locales yet
    const languages = new Negotiator({ headers: negotiatorHeaders }).languages()

    try {
        // matchLocale requires valid BCP 47 tags.
        // Our locales are ["en", "zh-tw", "zh", "ja"]
        const locale = matchLocale(languages, locales, i18n.defaultLocale)

        // Normalize to lowercase if needed (e.g. zh-tw -> zh-tw)
        if (i18n.locales.includes(locale.toLowerCase() as any)) {
            return locale.toLowerCase()
        }
        return locale
    } catch (e) {
        // Fallback for any matching errors
        return i18n.defaultLocale
    }
}

export function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // Skip API routes, static files, and Next.js internals
    if (
        pathname.startsWith("/api/") ||
        pathname.startsWith("/_next/") ||
        pathname.includes("/favicon") ||
        /\.(.*)$/.test(pathname)
    ) {
        return
    }

    // Check if there is any supported locale in the pathname
    const pathnameIsMissingLocale = i18n.locales.every(
        (locale) =>
            !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
    )

    // Redirect if there is no locale
    if (pathnameIsMissingLocale) {
        const locale = getLocale(request)

        // Redirect to localized path
        return NextResponse.redirect(
            new URL(
                `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
                request.url,
            ),
        )
    }
}

export const config = {
    // Matcher ignoring `/_next/` and `/api/`
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
