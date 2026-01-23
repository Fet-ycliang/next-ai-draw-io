import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

const locales = ["en", "zh-tw", "zh", "ja"];
const defaultLocale = "zh-tw";

function test(headers) {
    console.log("Testing headers:", JSON.stringify(headers));
    const languages = new Negotiator({ headers }).languages();
    console.log("Negotiator languages:", languages);
    
    try {
        const locale = match(languages, locales, defaultLocale);
        console.log("Matched locale:", locale);
    } catch (e) {
        console.log("Match error:", e.message);
    }
    console.log("---");
}

// Case 1: Pure zh-CN
test({ 'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8' });

// Case 2: Pure zh
test({ 'accept-language': 'zh,en;q=0.9' });

// Case 3: zh-tw
test({ 'accept-language': 'zh-tw,zh;q=0.9,en;q=0.8' });

// Case 4: No headers
test({});
