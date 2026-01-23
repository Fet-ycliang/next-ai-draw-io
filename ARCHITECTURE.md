# 專案架構與建置指南

## 1. 專案概覽

本專案 **Next AI Draw.io** 是一個混合型應用程式，同時以現代網頁應用程式和桌面應用程式的形式運行。

-   **網頁框架**: [Next.js](https://nextjs.org/) (App Router)
-   **桌面框架**: [Electron](https://www.electronjs.org/)
-   **語言**: TypeScript
-   **樣式**: Tailwind CSS, Shadcn UI (根據 `components` 結構推斷)
-   **圖表核心**: `react-drawio`
-   **AI 整合**: Vercel AI SDK

## 2. 目錄結構

| 目錄 | 說明 |
|-----------|-------------|
| `app/` | Next.js App Router 原始碼。包含頁面、佈局和 API 路由。 |
| `app/[lang]/` | 國際化路由 (i18n)。 |
| `app/api/` | 後端 API 路由 (處理 AI 請求等)。 |
| `components/` | React 元件 (UI 元素、圖表編輯器)。 |
| `contexts/` | 用於狀態管理的 React Context 提供者。 |
| `electron/` | Electron 專屬原始碼。 |
| `electron/main/` | 主行程程式碼 (控制應用程式生命週期)。 |
| `electron/preload/` | 預載腳本 (主行程與渲染行程之間的橋樑)。 |
| `lib/` | 工具函數和共用邏輯。 |
| `public/` | 靜態資源 (圖片、圖示)。 |
| `scripts/` | 建置和開發過程的輔助腳本。 |

## 3. 架構圖

### 高層架構

```mermaid
graph TD
    User[使用者] --> WebApp[網頁應用程式 (Next.js)]
    User --> DesktopApp[桌面應用程式 (Electron)]
    
    subgraph "網頁應用程式 / 渲染層"
        UI[React UI]
        Editor[Draw.io 編輯器]
        AI_Client[AI SDK 客戶端]
    end
    
    subgraph "後端 / 伺服器"
        NextAPI[Next.js API 路由]
        AI_Gateway[AI 閘道 / 提供者]
    end
    
    subgraph "Electron 主行程"
        Main[主行程]
        FS[檔案系統存取]
    end

    WebApp -->|HTTP| NextAPI
    DesktopApp -->|IPC| Main
    DesktopApp -->|HTTP| NextAPI
    NextAPI -->|API 呼叫| AI_Gateway
    
    UI --> Editor
    UI --> AI_Client
```

## 4. 建置與開發步驟

### 先決條件
- Node.js (建議 v18+)
- npm

### 安裝
```bash
npm install
```

### 網頁開發
在本地執行網頁應用程式：
```bash
npm run dev
# 透過 http://localhost:6002 存取
```

### Electron 開發
在開發模式下執行桌面應用程式：
```bash
npm run electron:dev
```

### 生產環境建置 (網頁)
為生產環境建置網頁應用程式：
```bash
npm run build
# 然後啟動它：
npm run start
```

### 生產環境建置 (桌面)
建置桌面應用程式安裝檔 (exe, dmg 等)：
```bash
# 建置所有平台 (如果主機支援)
npm run dist:all

# 建置特定平台
npm run dist:win  # Windows
npm run dist:mac  # macOS
npm run dist:linux # Linux
```

## 5. 關鍵設定檔
-   `package.json`: 相依套件和腳本。
-   `next.config.ts`: Next.js 設定。
-   `electron/electron-builder.yml`: 建置 Electron 安裝檔的設定。
-   `tailwind.config.js` / `postcss.config.mjs`: 樣式設定。
-   `.env.local`: 環境變數 (API 金鑰等)。
