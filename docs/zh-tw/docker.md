# 使用 Docker 執行

如果您只想在本地執行，最好的方法是使用 Docker。

首先，如果您尚未安裝，請先安裝 Docker：[取得 Docker](https://docs.docker.com/get-docker/)

接著執行：

```bash
docker run -d -p 3000:3000 \
  -e AI_PROVIDER=openai \
  -e AI_MODEL=gpt-4o \
  -e OPENAI_API_KEY=your_api_key \
  ghcr.io/dayuanjiang/next-ai-draw-io:latest
```

或使用 env 檔案：

```bash
cp env.example .env
# 編輯 .env 填入您的設定
docker run -d -p 3000:3000 --env-file .env ghcr.io/dayuanjiang/next-ai-draw-io:latest
```

### 使用伺服器端模型設定

您可以將 `ai-models.json` 檔案掛載到容器中，以提供多個伺服器端模型，而無需暴露使用者的 API 金鑰：

```bash
docker run -d -p 3000:3000 \
  -e OPENAI_API_KEY=your_api_key \
  -v $(pwd)/ai-models.json:/app/ai-models.json:ro \
  ghcr.io/dayuanjiang/next-ai-draw-io:latest
```

如果您偏好將設定檔放在容器內的不同路徑，請設定 `AI_MODELS_CONFIG_PATH`：

```bash
docker run -d -p 3000:3000 \
  -e OPENAI_API_KEY=your_api_key \
  -e AI_MODELS_CONFIG_PATH=/config/ai-models.json \
  -v $(pwd)/ai-models.json:/config/ai-models.json:ro \
  ghcr.io/dayuanjiang/next-ai-draw-io:latest
```

在瀏覽器中開啟 [http://localhost:3000](http://localhost:3000)。

將環境變數替換為您偏好的 AI 提供商設定。請參閱 [AI 提供商](./ai-providers.md) 查看可用選項。

> **離線部署：** 如果 `embed.diagrams.net` 被封鎖，請參閱 [離線部署](./offline-deployment.md) 了解設定選項。
