# Next AI Draw.io

<div align="center">

**AI 驅動的圖表創建工具 - 聊天、繪製、視覺化**

English | [中文](./docs/cn/README_CN.md) | [繁體中文](./docs/zh-tw/README_ZH-TW.md) | [日本語](./docs/ja/README_JA.md)

[![TrendShift](https://trendshift.io/api/badge/repositories/15449)](https://next-ai-drawio.jiang.jp/)

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Next.js](https://img.shields.io/badge/Next.js-16.x-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.x-61dafb)](https://react.dev/)
[![Sponsor](https://img.shields.io/badge/Sponsor-❤-ea4aaa)](https://github.com/sponsors/DayuanJiang)

[![Live Demo](./public/live-demo-button.svg)](https://next-ai-drawio.jiang.jp/)

</div>

一個結合 AI 功能與 draw.io 圖表的 Next.js 網頁應用程式。透過自然語言命令和 AI 輔助視覺化來建立、修改和增強圖表。

> 注意：感謝 <img src="https://raw.githubusercontent.com/DayuanJiang/next-ai-draw-io/main/public/doubao-color.png" alt="" height="20" /> [字節跳動豆包](https://console.volcengine.com/ark/region:ark+cn-beijing/overview?briefPage=0&briefType=introduce&type=new&utm_campaign=doubao&utm_content=aidrawio&utm_medium=github&utm_source=coopensrc&utm_term=project) 贊助，展示網站現在使用強大的 K2-thinking 模型！


https://github.com/user-attachments/assets/9d60a3e8-4a1c-4b5e-acbb-26af2d3eabd1



## 目錄
- [Next AI Draw.io](#next-ai-drawio)
  - [目錄](#目錄)
  - [範例](#範例)
  - [功能](#功能)
  - [MCP 伺服器（預覽）](#mcp-伺服器預覽)
    - [Claude Code CLI](#claude-code-cli)
  - [開始使用](#開始使用)
    - [線上試用](#線上試用)
    - [桌面應用程式](#桌面應用程式)
    - [使用 Docker 執行](#使用-docker-執行)
    - [安裝](#安裝)
  - [部署](#部署)
    - [部署到 EdgeOne Pages](#部署到-edgeone-pages)
    - [部署到 Vercel](#部署到-vercel)
    - [部署到 Cloudflare Workers](#部署到-cloudflare-workers)
  - [多提供商支援](#多提供商支援)
  - [運作原理](#運作原理)
  - [支援與聯絡](#支援與聯絡)
  - [常見問題](#常見問題)
  - [星標歷史](#星標歷史)

## 範例

以下是一些範例提示詞及其生成的圖表：

<div align="center">
<table width="100%">
  <tr>
    <td colspan="2" valign="top" align="center">
      <strong>動畫變壓器連接器</strong><br />
      <p><strong>提示詞：</strong>給我一個 **動畫連接器** 的變壓器架構圖。</p>
      <img src="./public/animated_connectors.svg" alt="帶動畫連接器的變壓器架構" width="480" />
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <strong>GCP 架構圖</strong><br />
      <p><strong>提示詞：</strong>使用 **GCP 圖示** 生成 GCP 架構圖。在此圖表中，使用者連接到託管在實例上的前端。</p>
      <img src="./public/gcp_demo.svg" alt="GCP 架構圖" width="480" />
    </td>
    <td width="50%" valign="top">
      <strong>AWS 架構圖</strong><br />
      <p><strong>提示詞：</strong>使用 **AWS 圖示** 生成 AWS 架構圖。在此圖表中，使用者連接到託管在實例上的前端。</p>
      <img src="./public/aws_demo.svg" alt="AWS 架構圖" width="480" />
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <strong>Azure 架構圖</strong><br />
      <p><strong>提示詞：</strong>使用 **Azure 圖示** 生成 Azure 架構圖。在此圖表中，使用者連接到託管在實例上的前端。</p>
      <img src="./public/azure_demo.svg" alt="Azure 架構圖" width="480" />
    </td>
    <td width="50%" valign="top">
      <strong>貓咪素描提示詞</strong><br />
      <p><strong>提示詞：</strong>幫我畫一隻可愛的貓。</p>
      <img src="./public/cat_demo.svg" alt="貓咪繪圖" width="240" />
    </td>
  </tr>
</table>
</div>

## 功能

-   **LLM 驅動的圖表建立**：利用大型語言模型透過自然語言命令直接建立和操作 draw.io 圖表
-   **基於影像的圖表複製**：上傳現有圖表或影像，讓 AI 自動複製和增強它們
-   **PDF 和文字檔案上傳**：上傳 PDF 文件和文字檔案以提取內容並從現有文件生成圖表
-   **AI 推理顯示**：查看支援的模型（OpenAI o1/o3、Gemini、Claude 等）的 AI 思考過程
-   **圖表歷史記錄**：全面的版本控制，追蹤所有變更，允許您在 AI 編輯前查看和恢復圖表的先前版本
-   **互動式聊天介面**：與 AI 溝通以即時完善您的圖表
-   **雲端架構圖支援**：專門支援生成雲端架構圖（AWS、GCP、Azure）
-   **動畫連接器**：在圖表元素之間建立動態和動畫連接器，以獲得更好的視覺化效果

## MCP 伺服器（預覽）

> **預覽功能**：此功能為實驗性質，可能不穩定。

透過 MCP（Model Context Protocol）將 Next AI Draw.io 與 AI 代理（如 Claude Desktop、Cursor 和 VS Code）一起使用。

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

然後要求 Claude 建立圖表：
> 「建立一個流程圖,顯示使用者身份驗證，包括登入、多因素驗證和會話管理」

圖表會即時顯示在您的瀏覽器中！

請參閱 [MCP 伺服器 README](./packages/mcp-server/README.md) 以了解 VS Code、Cursor 和其他客戶端的設定。

## 開始使用

### 線上試用

無需安裝！直接在我們的示範網站上試用該應用程式：

[![即時示範](./public/live-demo-button.svg)](https://next-ai-drawio.jiang.jp/)



> **自備 API 金鑰**：您可以使用自己的 API 金鑰來繞過示範網站的使用限制。點擊聊天面板中的設定圖示以配置您的提供者和 API 金鑰。您的金鑰儲存在瀏覽器本地，絕不會儲存在伺服器上。

### 桌面應用程式

從 [發布頁面](https://github.com/DayuanJiang/next-ai-draw-io/releases) 下載適合您平台的原生桌面應用程式：

支援的平台：Windows、macOS、Linux。

### 使用 Docker 運行

[前往 Docker 指南](./docs/en/docker.md)

### 安裝

1. 複製儲存庫：

```bash
git clone https://github.com/DayuanJiang/next-ai-draw-io
cd next-ai-draw-io
npm install
cp env.example .env.local
```

請參閱 [提供者配置指南](./docs/en/ai-providers.md) 以了解每個提供者的詳細設定說明。

2. 運行開發伺服器：

```bash
npm run dev
```

3. 在瀏覽器中打開 [http://localhost:6002](http://localhost:6002) 以查看應用程式。

## 部署

### 部署到 EdgeOne Pages

您可以使用 [Tencent EdgeOne Pages](https://pages.edgeone.ai/) 一鍵部署。

透過此按鈕部署： 

[![部署到 EdgeOne Pages](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?repository-url=https%3A%2F%2Fgithub.com%2FDayuanJiang%2Fnext-ai-draw-io)

查看 [Tencent EdgeOne Pages 文件](https://pages.edgeone.ai/document/deployment-overview) 以了解更多詳情。

此外，透過 Tencent EdgeOne Pages 部署還將為您提供 [DeepSeek 模型的每日免費配額](https://pages.edgeone.ai/document/edge-ai)。

### 部署到 Vercel 

[![使用 Vercel 部署](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FDayuanJiang%2Fnext-ai-draw-io)

最簡單的部署方式是使用 [Vercel](https://vercel.com/new)，Next.js 的創建者。請務必在 Vercel 儀表板中 **設定環境變數**，就像您在本地 `.env.local` 檔案中所做的一樣。

請參閱 [Next.js 部署文件](https://nextjs.org/docs/app/building-your-application/deploying) 以了解更多詳情。

### 部署到 Cloudflare Workers

[前往 Cloudflare 部署指南](./docs/en/cloudflare-deploy.md)



## 多提供者支援

-   [ByteDance Doubao](https://console.volcengine.com/ark/region:ark+cn-beijing/overview?briefPage=0&briefType=introduce&type=new&utm_campaign=doubao&utm_content=aidrawio&utm_medium=github&utm_source=coopensrc&utm_term=project)
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


除了 AWS Bedrock 和 OpenRouter 之外,所有提供者都支援自訂端點。

📖 **[詳細提供者配置指南](./docs/en/ai-providers.md)** - 查看每個提供者的設定說明。

### 伺服器端多模型配置

管理員可以配置多個伺服器端模型，供所有使用者使用，無需個人 API 金鑰。透過 `AI_MODELS_CONFIG` 環境變數（JSON 字串）或 `ai-models.json` 檔案進行配置。

**模型需求**：此任務需要強大的模型功能來生成具有嚴格格式限制（draw.io XML）的長文本。推薦的模型包括 Claude Sonnet 4.5、GPT-5.1、Gemini 3 Pro 和 DeepSeek V3.2/R1。

請注意，`claude` 系列已針對包含 AWS、Azure、GCP 等雲端架構標誌的 draw.io 圖表進行訓練。因此，如果您想建立雲端架構圖，這是最佳選擇。


## 運作原理

應用程式使用以下技術：

-   **Next.js**：用於前端框架和路由
-   **Vercel AI SDK**（`ai` + `@ai-sdk/*`）：用於串流 AI 回應和多提供者支援
-   **react-drawio**：用於圖表表示和操作

圖表以 XML 格式表示，可在 draw.io 中渲染。AI 處理您的命令並相應地生成或修改此 XML。


## 支援與聯絡

**特別感謝 [ByteDance Doubao](https://console.volcengine.com/ark/region:ark+cn-beijing/overview?briefPage=0&briefType=introduce&type=new&utm_campaign=doubao&utm_content=aidrawio&utm_medium=github&utm_source=coopensrc&utm_term=project) 贊助示範網站的 API token 使用！** 在 ARK 平台註冊即可獲得所有模型 50 萬免費 token！

如果您認為此專案有用，請考慮 [贊助](https://github.com/sponsors/DayuanJiang) 以幫助我託管即時示範網站！

如需支援或查詢，請在 GitHub 儲存庫上開啟問題或聯絡維護者：

-   Email: me[at]jiang.jp

## 常見問題

請參閱 [常見問題](./docs/en/FAQ.md) 以了解常見問題和解決方案。

## Star 歷史

[![Star 歷史圖表](https://api.star-history.com/svg?repos=DayuanJiang/next-ai-draw-io&type=date&legend=top-left)](https://www.star-history.com/#DayuanJiang/next-ai-draw-io&type=date&legend=top-left)

---
