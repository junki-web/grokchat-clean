# Grok Chat App

GrokのAPIを使ったチャット＋画像生成Webアプリです。

## 機能
- Grok-3 によるAIチャット
- grok-2-image-1212（Aurora）による画像生成
- 画像生成時はGrokがプロンプトを提案→ユーザーが編集→生成

## デプロイ手順（Vercel）

### 1. GitHubにpush

```bash
git init
git add .
git commit -m "initial commit"
gh repo create grok-chat-app --public --push
```

または [github.com](https://github.com) で新規リポジトリ作成後:
```bash
git remote add origin https://github.com/あなたのユーザー名/grok-chat-app.git
git push -u origin main
```

### 2. Vercelにデプロイ

1. [vercel.com](https://vercel.com) にアクセス → GitHubでログイン
2. **"Add New Project"** → 上記リポジトリを選択
3. **"Environment Variables"** に以下を追加:
   - Key: `XAI_API_KEY`
   - Value: xAIのAPIキー（[console.x.ai](https://console.x.ai) で取得）
4. **"Deploy"** をクリック

デプロイ完了後、発行されたURLにスマホからアクセスするだけで使えます。

## ファイル構成

```
├── index.html       # チャットUI（スマホ最適化）
├── api/
│   ├── chat.js      # チャット用Vercel Function
│   └── image.js     # 画像生成用Vercel Function
├── vercel.json      # Vercel設定
└── README.md
```

## 料金の目安（xAI API）
- チャット（grok-3）: $3 / 1M input tokens、$15 / 1M output tokens
- 画像生成: $0.07 / 枚
- 個人利用では数百円/月程度
