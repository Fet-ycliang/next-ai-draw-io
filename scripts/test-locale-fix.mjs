import { match } from "@formatjs/intl-localematcher";

// Simulating the fix: using "zh-tw" instead of "zh_tw"
const locales = ["en", "zh-tw", "ja"];
const defaultLocale = "zh-tw";

// User languages from Negotiator (standard output)
const userLanguages = ["zh-CN", "zh", "en"];

try {
    console.log("Locales:", locales);
    console.log("User languages:", userLanguages);
    const locale = match(userLanguages, locales, defaultLocale);
    console.log("Matched locale:", locale); // Should be "zh-tw"
} catch (e) {
    console.error("Error:", e.message);
}

// Test case 2: exact match
try {
    const userLangs2 = ["zh-tw", "en"];
    console.log("User languages:", userLangs2);
    const locale2 = match(userLangs2, locales, defaultLocale);
    console.log("Matched locale:", locale2); // Should be "zh-tw"
} catch (e) {
    console.error("Error:", e.message);
}
