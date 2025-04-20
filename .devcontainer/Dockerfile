FROM node:18-bullseye-slim

# 作業用ディレクトリ
WORKDIR /workspace

# 必要パッケージ（gitなど）をインストール
RUN apt-get update && \
    apt-get install -y git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# グローバルツール（任意）
# RUN npm install -g serve

# デフォルトユーザーの設定
CMD [ "bash" ]
