# AI 提供商設定

本指南說明如何為 next-ai-draw-io 設定不同的 AI 模型提供商。

## 快速開始

1. 將 `.env.example` 複製為 `.env.local`
2. 設定您選擇的提供商的 API 金鑰
3. 將 `AI_MODEL` 設定為您想要的模型
4. 執行 `npm run dev`

## 支援的提供商

### 豆包 (字節跳動火山引擎)

> **免費 Token**：註冊 [火山引擎 ARK 平台](https://console.volcengine.com/ark/region:ark+cn-beijing/overview?briefPage=0&briefType=introduce&type=new&utm_campaign=doubao&utm_content=aidrawio&utm_medium=github&utm_source=coopensrc&utm_term=project) 即可獲得所有模型共 50 萬個免費 Token！

```bash
DOUBAO_API_KEY=您的_api_金鑰
AI_MODEL=doubao-seed-1-8-251215  # 或其他豆包模型
```

### Google Gemini

```bash
GOOGLE_GENERATIVE_AI_API_KEY=您的_api_金鑰
AI_MODEL=gemini-2.0-flash
```

可選的自訂端點：

```bash
GOOGLE_BASE_URL=https://您的自訂端點
```

### Google Vertex AI (企業級 GCP)

Google Vertex AI 提供企業級功能和資料駐留。**Express Mode** 允許使用簡單的 API 金鑰驗證，使其與 Vercel 和 Cloudflare 等邊緣執行環境相容。

```bash
GOOGLE_VERTEX_API_KEY=您的_api_金鑰
AI_MODEL=gemini-2.0-flash
```

可選的自訂端點：

```bash
GOOGLE_VERTEX_BASE_URL=https://您的自訂端點
```

### OpenAI

```bash
OPENAI_API_KEY=您的_api_金鑰
AI_MODEL=gpt-4o
```

可選的自訂端點 (用於 OpenAI 相容服務)：

```bash
OPENAI_BASE_URL=https://您的自訂端點/v1
```

### Anthropic

```bash
ANTHROPIC_API_KEY=您的_api_金鑰
AI_MODEL=claude-sonnet-4-5-20250514
```

可選的自訂端點：

```bash
ANTHROPIC_BASE_URL=https://您的自訂端點
```

### DeepSeek (深度求索)

```bash
DEEPSEEK_API_KEY=您的_api_金鑰
AI_MODEL=deepseek-chat
```

可選的自訂端點：

```bash
DEEPSEEK_BASE_URL=https://您的自訂端點
```

### SiliconFlow (OpenAI 相容)

```bash
SILICONFLOW_API_KEY=您的_api_金鑰
AI_MODEL=deepseek-ai/DeepSeek-V3  # 範例；可使用任何 SiliconFlow 模型 ID
```

可選的自訂端點 (預設為推薦網域)：

```bash
SILICONFLOW_BASE_URL=https://api.siliconflow.com/v1  # 或 https://api.siliconflow.cn/v1
```

### SGLang

```bash
SGLANG_API_KEY=您的_api_金鑰
AI_MODEL=您的模型_id
```

可選的自訂端點：

```bash
SGLANG_BASE_URL=https://您的自訂端點/v1
```

### Azure OpenAI

```bash
AZURE_API_KEY=您的_api_金鑰
AZURE_RESOURCE_NAME=您的資源名稱  # 必填：您的 Azure 資源名稱
AI_MODEL=您的部署名稱
```

或使用自訂端點代替資源名稱：

```bash
AZURE_API_KEY=您的_api_金鑰
AZURE_BASE_URL=https://您的資源.openai.azure.com  # AZURE_RESOURCE_NAME 的替代方案
AI_MODEL=您的部署名稱
```

可選的推理設定：

```bash
AZURE_REASONING_EFFORT=low      # 可選：low (低), medium (中), high (高)
AZURE_REASONING_SUMMARY=detailed  # 可選：none (無), brief (簡短), detailed (詳細)
```

### AWS Bedrock

```bash
AWS_REGION=us-west-2
AWS_ACCESS_KEY_ID=您的存取金鑰_id
AWS_SECRET_ACCESS_KEY=您的祕密存取金鑰
AI_MODEL=anthropic.claude-sonnet-4-5-20250514-v1:0
```

注意：在 AWS (Lambda, EC2 搭配 IAM 角色) 上，憑證會自動從 IAM 角色獲取。

### OpenRouter

```bash
OPENROUTER_API_KEY=您的_api_金鑰
AI_MODEL=anthropic/claude-sonnet-4
```

可選的自訂端點：

```bash
OPENROUTER_BASE_URL=https://您的自訂端點
```

### Ollama (本地)

```bash
AI_PROVIDER=ollama
AI_MODEL=llama3.2
```

可選的自訂 URL：

```bash
OLLAMA_BASE_URL=http://localhost:11434
```

### ModelScope (魔搭社區)

```bash
MODELSCOPE_API_KEY=您的_api_金鑰
AI_MODEL=Qwen/Qwen3-235B-A22B-Instruct-2507
```

可選的自訂端點：

```bash
MODELSCOPE_BASE_URL=https://您的自訂端點
```

### Vercel AI Gateway

Vercel AI Gateway 透過單一 API 金鑰提供對多個 AI 提供商的統一存取。這簡化了驗證過程，並允許您在不管理多個 API 金鑰的情況下切換提供商。

**基本用法 (Vercel 託管 Gateway)：**

```bash
AI_GATEWAY_API_KEY=您的_gateway_api_金鑰
AI_MODEL=openai/gpt-4o
```

**自訂 Gateway URL (用於本地開發或自建 Gateway)：**

```bash
AI_GATEWAY_API_KEY=您的自訂_api_金鑰
AI_GATEWAY_BASE_URL=https://您的自訂-gateway.com/v1/ai
AI_MODEL=openai/gpt-4o
```

模型格式使用 `provider/model` 語法：

-   `openai/gpt-4o` - OpenAI GPT-4o
-   `anthropic/claude-sonnet-4-5` - Anthropic Claude Sonnet 4.5
-   `google/gemini-2.0-flash` - Google Gemini 2.0 Flash

**設定說明：**

-   如果未設定 `AI_GATEWAY_BASE_URL`，將使用預設的 Vercel Gateway URL (`https://ai-gateway.vercel.sh/v1/ai`)
-   自訂基本 URL 適用於：
    -   使用自訂 Gateway 實例進行本地開發
    -   自建 AI Gateway 部署
    -   企業代理設定
-   使用自訂基本 URL 時，您也必須提供 `AI_GATEWAY_API_KEY`

從 [Vercel AI Gateway 儀表板](https://vercel.com/ai-gateway) 獲取您的 API 金鑰。

## 自動偵測

如果您只設定了 **一個** 提供商的 API 金鑰，系統將自動偵測並使用該提供商。無需設定 `AI_PROVIDER`。

如果您設定了 **多個** API 金鑰，則必須明確設定 `AI_PROVIDER`：

```bash
AI_PROVIDER=google  # 或：openai, anthropic, deepseek, siliconflow, doubao, azure, bedrock, openrouter, ollama, gateway, sglang, modelscope
```

## 伺服器端多模型設定

管理員可以設定多個伺服器端模型，供所有使用者使用，而無需個人 API 金鑰。

### 設定方法

**選項 1：環境變數** (推薦用於雲端部署)

將 `AI_MODELS_CONFIG` 設定為 JSON 字串：

```bash
AI_MODELS_CONFIG='{"providers":[{"name":"OpenAI","provider":"openai","models":["gpt-4o"],"default":true}]}'
```

**選項 2：設定檔**

在專案根目錄建立 `ai-models.json` 檔案 (或透過 `AI_MODELS_CONFIG_PATH` 設定自訂路徑)。

### 設定範例

```json
{
  "providers": [
    {
      "name": "OpenAI Production",
      "provider": "openai",
      "models": ["gpt-4o", "gpt-4o-mini"],
      "default": true
    },
    {
      "name": "Custom DeepSeek",
      "provider": "deepseek",
      "models": ["deepseek-chat"],
      "apiKeyEnv": "MY_DEEPSEEK_KEY",
      "baseUrlEnv": "MY_DEEPSEEK_URL"
    }
  ]
}
```

### 欄位參考

| 欄位 | 必填 | 說明 |
|-------|----------|-------------|
| `name` | 是 | 顯示名稱 (支援同一提供商的多個設定) |
| `provider` | 是 | 提供商類型 (`openai`, `anthropic`, `google`, `bedrock` 等) |
| `models` | 是 | 模型 ID 列表 |
| `default` | 否 | 設定為 `true` 以自動選擇此提供商的第一個模型作為預設值 |
| `apiKeyEnv` | 否 | 自訂 API 金鑰環境變數名稱 (預設為提供商的標準變數，如 `OPENAI_API_KEY`) |
| `baseUrlEnv` | 否 | 自訂基本 URL 環境變數名稱 |

### 注意事項

- API 金鑰和憑證透過環境變數提供。預設使用標準變數名稱 (例如 `OPENAI_API_KEY`)，但您可以使用 `apiKeyEnv` 指定自訂變數名稱。
- `name` 欄位允許為同一提供商設定多個設定 (例如 "OpenAI Production" 和 "OpenAI Staging" 都使用 `provider: "openai"` 但有不同的 `apiKeyEnv` 值)。
- 如果未提供設定，應用程式將回退至 `AI_PROVIDER`/`AI_MODEL` 環境變數設定。

## 模型能力需求

此任務需要極強的模型能力，因為它涉及生成具有嚴格格式限制 (draw.io XML) 的長篇文字。

**推薦模型**：

-   Claude Sonnet 4.5 / Opus 4.5

**關於 Ollama 的說明**：雖然支援 Ollama 作為提供商，但除非您在本地執行像 DeepSeek R1 或 Qwen3-235B 這樣的高能力模型，否則對於此用例通常不太實用。

## 溫度 (Temperature) 設定

您可以選擇透過環境變數設定溫度：

```bash
TEMPERATURE=0  # 較確定的輸出 (推薦用於圖表)
```

**重要**：對於不支援溫度設定的模型，請保留 `TEMPERATURE` 未設定，例如：
- GPT-5.1 和其他推理模型
- 某些專用模型

未設定時，模型將使用其預設行為。

## 建議

-   **最佳體驗**：使用支援視覺功能的模型 (GPT-4o, Claude, Gemini) 以獲得圖像轉圖表功能
-   **經濟實惠**：DeepSeek 提供具競爭力的價格
-   **隱私**：使用 Ollama 進行完全本地、離線操作 (需要強大的硬體)
-   **靈活性**：OpenRouter 透過單一 API 提供對許多模型的存取
