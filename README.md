# ImaCoCoS

コミケ会場での場所・状態・ひとことを整形し、Xの投稿画面へ渡す有志ツール。
入力内容はImaCoCoS側には保存しない。

- 本番: https://imacocos.pages.dev
- 構成: Cloudflare Pages（フロント）+ Pages Functions（Xカード用共有ページ）

## 開発

```bash
npm install
npm run dev          # フロントだけ。Xカード用 /share は動かない
```

Xカード用の共有ページも含めて動かす場合:

```bash
npm run cf:dev        # ビルドして Pages Functions ごと起動
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
- 見取り図を追加するときは `npm run map:optimize -- <入力画像> <エリアID>` で軽量な
  WebPを `public/maps/` に作り、`src/areas.ts` の `map` を設定する

## 設計メモ

- X APIやXログイン連携は使わず、Web Intentで利用者自身の投稿画面を開く
- 本文は「場所 → 状態 → 任意のひとこと → `#ImaCoCoS`」の順で整形する
- `/share` が投稿内リンクのXカード用メタ情報を返す
- 見取り図が登録されたエリアでは `summary_large_image` カードに画像を出す
- 旧リアルタイム投稿APIとD1関連コードは互換用に残っているが、現在の画面からは使用しない
