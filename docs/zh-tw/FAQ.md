# 常見問題 (FAQ)

---

## 1. 無法匯出 PDF

**問題**：網頁版匯出 PDF 時跳轉到 `convert.diagrams.net/node/export` 後沒有反應

**原因**：內嵌的 Draw.io 不支援直接匯出 PDF，它依賴外部轉換服務，而該服務無法在 iframe 中運作

**解決方案**：先匯出為圖片 (PNG)，然後再列印成 PDF

**相關議題**：#539, #125

---

## 2. 無法存取 embed.diagrams.net (離線/內網部署)

**問題**：內網環境顯示「無法找到 embed.diagrams.net 的伺服器 IP 位址」

**關鍵點**：`NEXT_PUBLIC_*` 環境變數是 **建置時 (build-time)** 變數，它們會被打包進 JS 程式碼中。**執行時 (Runtime) 設定是無效的！**

**解決方案**：必須在建置時透過 `args` 傳遞：

```yaml
# docker-compose.yml
services:
  drawio:
    image: jgraph/drawio:latest
    ports: ["8080:8080"]
  next-ai-draw-io:
    build:
      context: .
      args:
        - NEXT_PUBLIC_DRAWIO_BASE_URL=http://your-server-ip:8080/
    ports: ["3000:3000"]
    env_file: .env
```

**內網使用者**：修改 Dockerfile 並在外部網路建置映像檔，然後傳輸到內網

**相關議題**：#295, #317

---

## 3. 自建模型只思考不畫圖

**問題**：本地部署的模型 (例如 Qwen, LiteLLM) 只輸出思考過程，不產生圖表

**可能原因**：
1. **模型太小** - 小型模型難以正確遵循工具呼叫指令，建議使用 32B+ 參數的模型
2. **工具呼叫未啟用** - 模型服務需要設定工具使用功能

**解決方案**：啟用工具呼叫，例如 vLLM：
```bash
python -m vllm.entrypoints.openai.api_server \
    --model Qwen/Qwen3-32B \
    --enable-auto-tool-choice \
    --tool-call-parser hermes
```

**相關議題**：#269, #75

---

## 4. 上傳圖片後顯示 "No Image Provided"

**問題**：上傳圖片後，系統顯示 "No image provided" 錯誤

**可能原因**：
1. 模型不支援視覺功能 (例如 Kimi K2, DeepSeek, Qwen 純文字模型)

**解決方案**：
- 使用具備視覺能力的模型：GPT-5.2, Claude 4.5 Sonnet, Gemini 3 Pro
- 名稱中包含 `vision` 或 `vl` 的模型通常支援圖片
- 更新至最新版本 (v0.4.9+)

**相關議題**：#324, #421, #469
