# 離線部署

透過自建 draw.io 來取代 `embed.diagrams.net`，離線部署 Next AI Draw.io。

**注意：** `NEXT_PUBLIC_DRAWIO_BASE_URL` 是一個 **建置時 (build-time)** 變數。更改它需要重新建置 Docker image。

## Docker Compose 設定

1. 複製 repository 並在 `.env` 中定義 API 金鑰。
2. 建立 `docker-compose.yml`：

```yaml
services:
  drawio:
    image: jgraph/drawio:latest
    ports: ["8080:8080"]
  next-ai-draw-io:
    build:
      context: .
      args:
        - NEXT_PUBLIC_DRAWIO_BASE_URL=http://localhost:8080
    ports: ["3000:3000"]
    env_file: .env
    depends_on: [drawio]
```

3. 執行 `docker compose up -d` 並開啟 `http://localhost:3000`。

## 設定與重要警告

**`NEXT_PUBLIC_DRAWIO_BASE_URL` 必須是使用者瀏覽器可存取的。**

| 情境 | URL 值 |
|----------|-----------|
| Localhost (本機) | `http://localhost:8080` |
| 遠端/伺服器 | `http://您的伺服器IP:8080` |

**切勿使用** 內部 Docker 別名如 `http://drawio:8080`；瀏覽器無法解析它們。
