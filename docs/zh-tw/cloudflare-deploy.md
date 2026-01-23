# 在 Cloudflare Workers 上部署

本專案可以使用 **OpenNext adapter** 部署為 **Cloudflare Worker**，為您提供：

- 全球邊緣部署
- 極低延遲
- 免費 `workers.dev` 託管
- 透過 R2 支援完整的 Next.js ISR (可選)

> **重要 Windows 注意事項：** OpenNext 和 Wrangler 在 **原生 Windows 上可能不完全可靠**。建議選項：
>
> - 使用 **GitHub Codespaces** (運作完美)
> - 或使用 **WSL (Linux)**
>
> 純 Windows 建置可能會因 WASM 檔案路徑問題而失敗。

---

## 前置需求

1. 一個 **Cloudflare 帳號** (免費層級即可進行基本部署)
2. **Node.js 18+**
3. 安裝 **Wrangler CLI** (開發相依套件即可)：

```bash
npm install -D wrangler
```

4. Cloudflare 登入：

```bash
npx wrangler login
```

> **注意：** 僅當您想要啟用 R2 進行 ISR 快取時才需要付款方式。基本 Workers 部署是免費的。

---

## 步驟 1 — 安裝相依套件

```bash
npm install
```

---

## 步驟 2 — 設定環境變數

Cloudflare 在本地測試時使用不同的檔案。

### 1) 建立 `.dev.vars` (用於 Cloudflare 本地 + 部署)

```bash
cp env.example .dev.vars
```

填入您的 API 金鑰和設定。

### 2) 確保 `.env.local` 也存在 (用於常規 Next.js 開發)

```bash
cp env.example .env.local
```

填入相同的值。

---

## 步驟 3 — 選擇您的部署類型

### 選項 A：不使用 R2 部署 (簡單、免費)

如果您不需要 ISR 快取，可以不使用 R2 進行部署：

**1. 使用簡單的 `open-next.config.ts`：**

```ts
import { defineCloudflareConfig } from "@opennextjs/cloudflare/config"

export default defineCloudflareConfig({})
```

**2. 使用簡單的 `wrangler.jsonc` (沒有 r2_buckets)：**

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "main": ".open-next/worker.js",
  "name": "next-ai-draw-io-worker",
  "compatibility_date": "2025-12-08",
  "compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"],
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS"
  },
  "services": [
    {
      "binding": "WORKER_SELF_REFERENCE",
      "service": "next-ai-draw-io-worker"
    }
  ]
}
```

跳至 **步驟 4**。

---

### 選項 B：使用 R2 部署 (完整 ISR 支援)

R2 啟用 **增量靜態再生 (ISR)** 快取。需要在您的 Cloudflare 帳號上設定付款方式。

**1. 在 Cloudflare 儀表板中建立 R2 bucket**：

- 前往 **Storage & Databases (儲存與資料庫) → R2**
- 點擊 **Create bucket (建立 bucket)**
- 命名為：`next-inc-cache`

**2. 設定 `open-next.config.ts`：**

```ts
import { defineCloudflareConfig } from "@opennextjs/cloudflare/config"
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache"

export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
})
```

**3. 設定 `wrangler.jsonc` (包含 R2)：**

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "main": ".open-next/worker.js",
  "name": "next-ai-draw-io-worker",
  "compatibility_date": "2025-12-08",
  "compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"],
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS"
  },
  "r2_buckets": [
    {
      "binding": "NEXT_INC_CACHE_R2_BUCKET",
      "bucket_name": "next-inc-cache"
    }
  ],
  "services": [
    {
      "binding": "WORKER_SELF_REFERENCE",
      "service": "next-ai-draw-io-worker"
    }
  ]
}
```

> **重要：** `bucket_name` 必須與您在 Cloudflare 儀表板中建立的名稱完全相符。

---

## 步驟 4 — 註冊 workers.dev 子網域 (僅首次需要)

在第一次部署之前，您需要一個 workers.dev 子網域。

**選項 1：透過 Cloudflare 儀表板 (推薦)**

存取：https://dash.cloudflare.com → Workers & Pages → Overview → Set up a subdomain (設定子網域)

**選項 2：部署期間**

當您執行 `npm run deploy` 時，Wrangler 可能會提示：

```
Would you like to register a workers.dev subdomain? (Y/n)
```

輸入 `Y` 並選擇一個子網域名稱。

> **注意：** 在 CI/CD 或非互動式環境中，提示不會出現。請先透過儀表板註冊。

---

## 步驟 5 — 部署到 Cloudflare

```bash
npm run deploy
```

指令碼執行的動作：

- 建置 Next.js 應用程式
- 透過 OpenNext將其轉換為 Cloudflare Worker
- 上傳靜態資產
- 發佈 Worker

您的應用程式將可透過以下網址存取：

```
https://<worker-name>.<your-subdomain>.workers.dev
```

---

## 常見問題與修復

### `You need to register a workers.dev subdomain`

**原因：** 您的帳號未註冊 workers.dev 子網域。

**修復：** 前往 https://dash.cloudflare.com → Workers & Pages → Set up a subdomain (設定子網域)。

---

### `Please enable R2 through the Cloudflare Dashboard`

**原因：** wrangler.jsonc 中設定了 R2，但您的帳號未啟用 R2。

**修復：** 啟用 R2 (需要付款方式) 或使用選項 A (不使用 R2 部署)。

---

### `No R2 binding "NEXT_INC_CACHE_R2_BUCKET" found`

**原因：** `wrangler.jsonc` 中遺失 `r2_buckets` 區段。

**修復：** 新增 `r2_buckets` 區段或切換至選項 A (無 R2)。

---

### `Can't set compatibility date in the future`

**原因：** wrangler 設定中的 `compatibility_date` 設定為未來日期。

**修復：** 將 `compatibility_date` 更改為今天或更早的日期。

---

### Windows 錯誤：`resvg.wasm?module` (ENOENT)

**原因：** Windows 檔名不能包含 `?`，但 wasm 資產在其檔名中使用了 `?module`。

**修復：** 在 Linux (WSL, Codespaces, 或 CI) 上建置/部署。

---

## 可選：本地預覽

部署前先在本地預覽 Worker：

```bash
npm run preview
```

---

## 摘要

| 功能 | 無 R2 | 有 R2 |
|---------|------------|---------|
| 成本 | 免費 | 需要付款方式 |
| ISR 快取 | 否 | 是 |
| 靜態頁面 | 是 | 是 |
| API 路由 | 是 | 是 |
| 設定複雜度 | 簡單 | 中等 |

選擇 **無 R2** 用於測試或簡單應用程式。選擇 **有 R2** 用於需要 ISR 快取的生產環境應用程式。
