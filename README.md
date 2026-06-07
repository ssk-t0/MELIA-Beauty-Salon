# MELIA Beauty Salon

表参道の架空プライベートビューティーサロンのポートフォリオ用Webサイトです。

## サイト概要

| 項目 | 内容 |
|---|---|
| サイト名 | MELIA Beauty Salon |
| コンセプト | 高級感・清潔感・上品さを重視した美容サロン公式サイト |
| ターゲット | 20代後半〜40代女性 |
| 店舗設定 | 東京都渋谷区神宮前（表参道）の完全予約制プライベートサロン |

## 使用技術

- **HTML5** — セマンティックマークアップ、アクセシビリティ対応
- **CSS3** — カスタムプロパティ、Grid / Flexbox レイアウト、アニメーション
- **JavaScript (ES6+)** — フレームワーク不使用のバニラJS
- **Google Fonts** — Cormorant Garamond（英語セリフ体）/ Noto Serif JP（和文明朝）/ Noto Sans JP（和文ゴシック）

## 主な機能

| 機能 | 説明 |
|---|---|
| ハンバーガーメニュー | スマホ用のスライドメニュー、ESCキーで閉じる |
| スムーススクロール | ヘッダー高さを考慮したオフセット付きスクロール |
| FAQアコーディオン | aria属性を使ったアクセシブルな開閉 |
| スクロールアニメーション | IntersectionObserver によるフェードイン |
| ヘッダー影 | スクロール時に自動で影を追加 |
| ページトップボタン | 200px スクロール後に表示、クリックで先頭へ |
| 予約デモモーダル | 予約ボタンを押すとデモである旨を表示 |
| アクティブナビ | スクロール位置に応じてナビリンクをハイライト |

## ページ構成

```
├── ヘッダー（固定・ハンバーガーメニュー対応）
├── メインビジュアル（ヒーロー）
├── コンセプト
├── サービスメニュー（Facial / Body / Bridal）
├── 料金表
├── 施術の流れ（4ステップ）
├── スタッフ紹介（2名）
├── お客様の声（3件）
├── FAQ（アコーディオン）
├── アクセス
├── 予約CTA
└── フッター
```

## ファイル構成

```
MELIA-Beauty-Salon/
├── index.html          # メインHTML
├── css/
│   └── style.css       # スタイルシート
├── js/
│   └── main.js         # JavaScriptファイル
├── assets/
│   └── images/         # 画像ファイルを配置
│       ├── hero.jpg
│       ├── concept.jpg
│       ├── service-facial.jpg
│       ├── service-body.jpg
│       ├── service-bridal.jpg
│       ├── staff01.jpg
│       ├── staff02.jpg
│       └── salon.jpg
└── README.md
```

## 画像について

`assets/images/` フォルダに以下の画像を配置してください。  
画像が存在しない場合もレイアウトは崩れません（グラデーション背景で代替表示されます）。

| ファイル名 | 推奨サイズ | 用途 |
|---|---|---|
| hero.jpg | 1920×1080px 以上 | メインビジュアル |
| concept.jpg | 800×600px 以上 | コンセプトセクション |
| service-facial.jpg | 600×400px 以上 | フェイシャルカードサムネイル |
| service-body.jpg | 600×400px 以上 | ボディカードサムネイル |
| service-bridal.jpg | 600×400px 以上 | ブライダルカードサムネイル |
| staff01.jpg | 400×500px 以上 | スタッフ田中葵の写真 |
| staff02.jpg | 400×500px 以上 | スタッフ佐藤りなの写真 |
| salon.jpg | 800×400px 以上 | アクセスセクション |

> フリー素材サイト（[Unsplash](https://unsplash.com/)、[Pexels](https://www.pexels.com/)、[Pixabay](https://pixabay.com/)）から美容・エステ系の画像を取得して差し替えてください。

## GitHub Pages での公開方法

### 方法1: リポジトリを直接公開する

1. GitHub で新しいリポジトリを作成（例: `melia-beauty-salon`）
2. このフォルダのファイルをすべてプッシュ:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: MELIA Beauty Salon portfolio site"
   git branch -M main
   git remote add origin https://github.com/ユーザー名/melia-beauty-salon.git
   git push -u origin main
   ```
3. GitHub リポジトリの **Settings > Pages** を開く
4. **Source** を `Deploy from a branch` に設定
5. **Branch** を `main` / `/ (root)` に設定して **Save**
6. 数分後、`https://ユーザー名.github.io/melia-beauty-salon/` で公開される

### 方法2: GitHub CLI を使う

```bash
gh repo create melia-beauty-salon --public --source=. --remote=origin --push
# その後 Settings > Pages で上記手順と同様に設定
```

## カスタマイズのポイント

- **カラー変更**: `css/style.css` 上部の `:root { }` 内のカスタムプロパティを変更するだけでサイト全体の配色が変わります
- **店舗情報変更**: `index.html` 内の住所・電話番号・営業時間を検索して置き換えてください
- **メニュー追加**: 料金表の `<tbody>` 内に `<tr>` を追加するだけでメニューを増やせます
- **スタッフ追加**: `staff-grid` 内に `staff-card` のブロックをコピーして追加してください

## SEO・アクセシビリティ対応

- `<title>` と `<meta name="description">` を設定済み
- Open Graph タグ対応
- 正しい見出し階層（h1 → h2 → h3）
- すべての `<img>` に `alt` 属性を設定
- `<button>` に `aria-label` を設定
- `<nav>` に `aria-label` を設定
- FAQに `aria-expanded` / `aria-controls` / `hidden` を使用したアクセシブルな実装
- フォーカスインジケーター（Tab キーでの操作に対応）

---

## 注意事項

> **本サイトは学習・ポートフォリオ用の架空美容サロンサイトです。実在の店舗・企業とは関係ありません。**  
> 掲載している住所・電話番号・スタッフ情報・価格はすべてフィクションです。  
> 予約機能はデモ表示のみで、実際の予約は受け付けていません。
