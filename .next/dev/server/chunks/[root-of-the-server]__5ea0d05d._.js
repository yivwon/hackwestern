module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/Downloads/hackwestern/app/api/gemini/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$hackwestern$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/hackwestern/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$hackwestern$2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/hackwestern/node_modules/@google/generative-ai/dist/index.mjs [app-route] (ecmascript)");
;
;
async function POST(request) {
    try {
        const { fullText, highlightedText, userQuestion } = await request.json();
        // Validate that we have at least something to work with
        if (!userQuestion && !highlightedText) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$hackwestern$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Missing required fields"
            }, {
                status: 400
            });
        }
        // Get API key from environment
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn("[v0] GEMINI_API_KEY not configured");
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$hackwestern$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                answer: "Gemini API key not configured. Please add GEMINI_API_KEY to your environment variables to enable AI responses."
            }, {
                status: 200
            });
        }
        let prompt;
        if (userQuestion && !highlightedText) {
            // Learn tab case: just a question
            prompt = `You are a helpful financial education assistant. Answer the following question clearly and concisely:

${userQuestion}

Provide a clear, educational response suitable for someone learning about finance.`;
        } else if (highlightedText && !userQuestion) {
            // Highlight case: explain the highlighted text
            prompt = `You are a helpful financial education assistant. A user is reading about finance and has highlighted some text.

${fullText ? `Full context:\n"${fullText}"\n\n` : ""}Highlighted text:
"${highlightedText}"

Please explain the highlighted text in simple terms for someone learning about finance.`;
        } else {
            // Both: highlighted text + question
            prompt = `You are a helpful financial education assistant. A user is reading about finance and has highlighted some text.

${fullText ? `Full context:\n"${fullText}"\n\n` : ""}Highlighted text:
"${highlightedText}"

User's question: ${userQuestion}

Provide a clear, concise, and educational response.`;
        }
        const genAI = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$hackwestern$2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GoogleGenerativeAI"](apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-exp"
        });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const answer = response.text();
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$hackwestern$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            answer
        });
    } catch (error) {
        console.error("[v0] Gemini API error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$hackwestern$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to process request",
            details: error instanceof Error ? error.message : "Unknown error"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__5ea0d05d._.js.map