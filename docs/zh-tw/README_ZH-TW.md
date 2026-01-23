# Next AI Draw.io

<div align="center">

**AI 驅動的圖表創建工具 - 對話、繪製、視覺化**

[English](../../README.md) | [中文](../cn/README_CN.md) | 繁體中文 | [日本語](../ja/README_JA.md)

[![TrendShift](https://trendshift.io/api/badge/repositories/15449)](https://next-ai-drawio.jiang.jp/)

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Next.js](https://img.shields.io/badge/Next.js-16.x-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.x-61dafb)](https://react.dev/)
[![Sponsor](https://img.shields.io/badge/Sponsor-❤-ea4aaa)](https://github.com/sponsors/DayuanJiang)

[![Live Demo](../../public/live-demo-button.svg)](https://next-ai-drawio.jiang.jp/)

</div>

一個集成了 AI 功能的 Next.js 網頁應用，與 draw.io 圖表無縫結合。透過自然語言指令和 AI 輔助視覺化來創建、修改和增強圖表。

> 註：感謝 <img src="https://raw.githubusercontent.com/DayuanJiang/next-ai-draw-io/main/public/doubao-color.png" alt="" height="20" /> [字節跳動豆包](https://console.volcengine.com/ark/region:ark+cn-beijing/overview?briefPage=0&briefType=introduce&type=new&utm_campaign=doubao&utm_content=aidrawio&utm_medium=github&utm_source=coopensrc&utm_term=project) 的贊助支持，本專案的 Demo 現已接入強大的 K2-thinking 模型！

https://github.com/user-attachments/assets/b2eef5f3-b335-4e71-a755-dc2e80931979

## 目錄
- [Next AI Draw.io](#next-ai-drawio)
  - [目錄](#目錄)
  - [範例](#範例)
  - [功能特性](#功能特性)
  - [MCP 伺服器（預覽）](#mcp-伺服器預覽)
    - [Claude Code CLI](#claude-code-cli)
  - [快速開始](#快速開始)
    - [線上試用](#線上試用)
    - [桌面應用](#桌面應用)
    - [使用 Docker 執行](#使用-docker-執行)
    - [安裝](#安裝)
  - [部署](#部署)
    - [部署到騰訊雲 EdgeOne Pages](#部署到騰訊雲-edgeone-pages)
    - [部署到 Vercel](#部署到-vercel)
    - [部署到 Cloudflare Workers](#部署到-cloudflare-workers)
  - [多提供商支援](#多提供商支援)
  - [工作原理](#工作原理)
  - [支援與聯繫](#支援與聯繫)
  - [常見問題](#常見問題)
  - [Star 歷史](#star-歷史)

## 範例

以下是一些範例提示詞及其生成的圖表：

<div align="center">
<table width="100%">
  <tr>
    <td colspan="2" valign="top" align="center">
      <strong>動畫 Transformer 連接器</strong><br />
      <p><strong>提示詞：</strong> 給我一個帶有**動畫連接器**的 Transformer 架構圖。</p>
      <img src="../../public/animated_connectors.svg" alt="帶動畫連接器的 Transformer 架構" width="480" />
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <strong>GCP 架構圖</strong><br />
      <p><strong>提示詞：</strong> 使用**GCP 圖示**生成一個 GCP 架構圖。在這個圖中，用戶連接到託管在實例上的前端。</p>
      <img src="../../public/gcp_demo.svg" alt="GCP 架構圖" width="480" />
    </td>
    <td width="50%" valign="top">
      <strong>AWS 架構圖</strong><br />
      <p><strong>提示詞：</strong> 使用**AWS 圖示**生成一個 AWS 架構圖。在這個圖中，用戶連接到託管在實例上的前端。</p>
      <img src="../../public/aws_demo.svg" alt="AWS 架構圖" width="480" />
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <strong>Azure 架構圖</strong><br />
      <p><strong>提示詞：</strong> 使用**Azure 圖示**生成一個 Azure 架構圖。在這個圖中，用戶連接到託管在實例上的前端。</p>
      <img src="../../public/azure_demo.svg" alt="Azure 架構圖" width="480" />
    </td>
    <td width="50%" valign="top">
      <strong>貓咪素描</strong><br />
      <p><strong>提示詞：</strong> 給我畫一隻可愛的貓。</p>
      <img src="../../public/cat_demo.svg" alt="貓咪繪圖" width="240" />
    </td>
  </tr>
</table>
</div>

## 功能特性

-   **LLM 驅動的圖表創建**：利用大語言模型透過自然語言指令直接創建和操作 draw.io 圖表
-   **基於圖像的圖表複製**：上傳現有圖表或圖像，讓 AI 自動複製和增強
-   **PDF 和文字檔案上傳**：上傳 PDF 文件和文字檔案，提取內容並從現有文件生成圖表
-   **AI 推理過程顯示**：查看支援模型的 AI 思考過程（OpenAI o1/o3、Gemini、Claude 等）
-   **圖表歷史記錄**：全面的版本控制，追蹤所有變更，允許您查看和恢復 AI 編輯前的圖表版本
-   **互動式聊天介面**：與 AI 即時對話來完善您的圖表
-   **雲架構圖支援**：專門支援生成雲架構圖（AWS、GCP、Azure）
-   **動畫連接器**：在圖表元素之間創建動態動畫連接器，實現更好的視覺化效果

## MCP 伺服器（預覽）

> **預覽功能**：此功能為實驗性功能，可能不穩定。

透過 MCP（模型上下文協議）在 Claude Desktop、Cursor 和 VS Code 等 AI 代理中使用 Next AI Draw.io。

```json
{
  "mcpServers": {
    "drawio": {
      "command": "npx",
      "args": ["@next-ai-drawio/mcp-server@latest"]
    }
  }
}
```

### Claude Code CLI

```bash
claude mcp add drawio -- npx @next-ai-drawio/mcp-server@latest
```

然後讓 Claude 創建圖表：
> "創建一個展示使用者認證流程的流程圖，包含登入、MFA 和會話管理"

圖表會即時顯示在瀏覽器中！

詳情請參閱 [MCP 伺服器 README](../../packages/mcp-server/README.md)，了解 VS Code、Cursor 等客戶端配置。

## 快速開始

### 線上試用

無需安裝！直接在我們的演示站點試用：

[![Live Demo](../../public/live-demo-button.svg)](https://next-ai-drawio.jiang.jp/)

> **使用自己的 API Key**：您可以使用自己的 API Key 來繞過演示站點的用量限制。點擊聊天面板中的設定圖示即可配置您的 Provider 和 API Key。您的 Key 僅保存在瀏覽器本地，不會被存儲在伺服器上。

### 桌面應用

從 [Releases 頁面](https://github.com/DayuanJiang/next-ai-draw-io/releases) 下載適用於您平台的原生桌面應用：

支援的平台：Windows、macOS、Linux。

### 使用 Docker 執行

[查看 Docker 指南](./docker.md)

### 安裝

1. 複製 repository：

```bash
git clone https://github.com/DayuanJiang/next-ai-draw-io
cd next-ai-draw-io
npm install
cp env.example .env.local
```

詳細設定說明請參閱 [提供商配置指南](./ai-providers.md)。

2. 執行開發伺服器：

```bash
npm run dev
```

3. 在瀏覽器中打開 [http://localhost:6002](http://localhost:6002) 查看應用。

## 部署

### 部署到騰訊雲 EdgeOne Pages

您可以透過 [騰訊雲 EdgeOne Pages](https://pages.edgeone.ai/zh) 一鍵部署。

直接點擊此按鈕一鍵部署：
[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://console.cloud.tencent.com/edgeone/pages/new?repository-url=https%3A%2F%2Fgithub.com%2FDayuanJiang%2Fnext-ai-draw-io)

查看 [騰訊雲 EdgeOne Pages 文件](https://pages.edgeone.ai/zh/document/product-introduction) 了解更多詳情。

同時，透過騰訊雲 EdgeOne Pages 部署，也會獲得 [每日免費的 DeepSeek 模型額度](https://edgeone.cloud.tencent.com/pages/document/169925463311781888)。

### 部署到 Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FDayuanJiang%2Fnext-ai-draw-io)

部署 Next.js 應用最簡單的方式是使用 Next.js 創建者提供的 [Vercel 平台](https://vercel.com/new)。請確保在 Vercel 控制台中 **設定環境變數**，就像您在本地 `.env.local` 文件中所做的那樣。

查看 [Next.js 部署文件](https://nextjs.org/docs/app/building-your-application/deploying) 了解更多詳情。

### 部署到 Cloudflare Workers

[查看 Cloudflare 部署指南](./cloudflare-deploy.md)


## 多提供商支援

-   [字節跳動豆包](https://console.volcengine.com/ark/region:ark+cn-beijing/overview?briefPage=0&briefType=introduce&type=new&utm_campaign=doubao&utm_content=aidrawio&utm_medium=github&utm_source=coopensrc&utm_term=project)
-   AWS Bedrock（預設）
-   OpenAI
-   Anthropic
-   Google AI
-   Google Vertex AI
-   Azure OpenAI
-   Ollama
-   OpenRouter
-   DeepSeek
-   SiliconFlow
-   ModelScope
-   SGLang
-   Vercel AI Gateway

除 AWS Bedrock 和 OpenRouter 外，所有提供商都支援自訂端點。

📖 **[詳細的提供商配置指南](./ai-providers.md)** - 查看各提供商的設定說明。

### 服務端多模型配置

管理員可以配置多個服務端模型，讓所有用戶無需提供個人 API Key 即可使用。透過 `AI_MODELS_CONFIG` 環境變數（JSON 字串）或 `ai-models.json` 文件配置。

**模型要求**：此任務需要強大的模型能力，因為它涉及生成具有嚴格格式約束的長文字（draw.io XML）。推薦使用 Claude Sonnet 4.5、GPT-5.1、Gemini 3 Pro 和 DeepSeek V3.2/R1。

注意：`claude` 系列已在帶有 AWS、Azure、GCP 等雲架構 Logo 的 draw.io 圖表上進行訓練，因此如果您想創建雲架構圖，這是最佳選擇。


## 工作原理

本應用使用以下技術：

-   **Next.js**：用於前端框架和路由
-   **Vercel AI SDK**（`ai` + `@ai-sdk/*`）：用於流式 AI 響應和多提供商支援
-   **react-drawio**：用於圖表表示和操作

圖表以 XML 格式表示，可在 draw.io 中渲染。AI 處理您的指令並相應地生成或修改此 XML。


## 支援與聯繫

**特別感謝 [字節跳動豆包](https://console.volcengine.com/ark/region:ark+cn-beijing/overview?briefPage=0&briefType=introduce&type=new&utm_campaign=doubao&utm_content=aidrawio&utm_medium=github&utm_source=coopensrc&utm_term=project) 贊助演示站點的 API Token 使用！** 註冊火山引擎 ARK 平台即可獲得 50 萬免費 Token！

如果您覺得這個專案有用，請考慮 [贊助](https://github.com/sponsors/DayuanJiang) 來幫助我託管線上演示站點！

如需支援或諮詢，請在 GitHub repository 上提交 issue 或聯繫維護者：

-   信箱：me[at]jiang.jp

## 常見問題

請參閱 [FAQ](./FAQ.md) 了解常見問題和解決方案。

## Star 歷史

[![Star History Chart](https://api.star-history.com/svg?repos=DayuanJiang/next-ai-draw-io&type=date&legend=top-left)](https://www.star-history.com/#DayuanJiang/next-ai-draw-io&type=date&legend=top-left)

---
