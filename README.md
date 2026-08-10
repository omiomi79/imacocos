# ImaCoCoS

コミケのコスプレ撮影エリアの混み具合を、匿名でリアルタイムに共有する有志ツール。

- 本番: https://imacocos.pages.dev
- 構成: Cloudflare Pages（フロント）+ Pages Functions（API）+ D1（DB）。すべて無料枠

## 開発

```bash
npm install
npm run dev          # フロントだけ。API は動かない
```

API も含めて動かす場合（初回はローカル D1 の作成が必要）:

```bash
npm run db:init:local   # ローカル D1 にテーブルを作る
npm run cf:dev          # ビルドして Pages Functions ごと起動
```

## セットアップ（初回のみ）

```bash
npx wrangler login      # ブラウザで Cloudflare を認証
npm run db:create       # 出力された database_id を wrangler.toml に貼る
npm run db:init         # 本番 D1 にテーブルを作る
npx wrangler pages secret put HASH_SALT   # 端末ハッシュ用のソルト（任意の長い文字列）
```

## デプロイ

GitHub の `main` に push すると Cloudflare Pages が自動でビルド・デプロイする。
手動で上げたいときは:

```bash
npm run deploy
```

## 開催ごとにやること

- `src/areas.ts` の `AREAS` を、その回で使えるエリアに合わせて更新する
  （`id` は変更しない。過去投稿と紐付かなくなる）
- 荒らしワードが増えたら `functions/_ngwords.ts` に追記する

## 設計メモ

- **投稿は匿名**。IP は保存せず、`IP + UA + ソルト` の SHA-256 の先頭32文字だけを持つ。
  これを連投防止・二重通報の防止・BAN に使う
- **表示は直近 N 時間だけ**（既定2時間）。「いま」の情報以外は価値がないため
- 荒らし対策は多層: URL 一律禁止 / NG ワード / 同一文字の連打検出 / 30秒クールダウン /
  1時間20件上限 / 通報3件で自動非表示 / `bans` テーブルによる手動 BAN
- 画面を見ていない間はポーリングを止める（会場では電池と電波が貴重）
