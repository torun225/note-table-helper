# Note Table Helper

note.comで記事を作成する際に、表をTeX形式で簡単に入力できるようにする補助ツールです。

## 機能

- 直感的なUIで表データを入力
- 自動的にTeX形式（`$$\begin{array}...\end{array}$$`）に変換
- TeXコードをクリップボードにコピー
- note.comのエディタに直接挿入
- **履歴機能**：作成した表を保存し、後から再編集可能
  - 最大20件まで保存
  - 保存した表の一覧表示
  - 履歴からの読み込みと再編集
  - 個別削除・一括削除

## 対応ブラウザ

- Firefox（Manifest V2）
- Google Chrome / Chromium系ブラウザ（Manifest V3）

## インストール方法

### Firefox版

1. `firefox`フォルダに移動
2. Firefoxで `about:debugging#/runtime/this-firefox` を開く
3. 「一時的なアドオンを読み込む」をクリック
4. `firefox/manifest.json` を選択

### Chrome版

1. `chrome`フォルダに移動
2. Chromeで `chrome://extensions/` を開く
3. 右上の「デベロッパーモード」を有効にする
4. 「パッケージ化されていない拡張機能を読み込む」をクリック
5. `chrome`フォルダを選択

## 使い方

### 基本的な使い方

1. note.comの記事作成ページを開く
2. ブラウザのツールバーにある Note Table Helper のアイコンをクリック
3. 表の行数と列数を設定
4. 「表を生成」ボタンをクリック
5. 表のセルにデータを入力（自動的にTeX形式に変換されます）
6. 以下のいずれかの方法で使用：
   - 「TeXをコピー」：クリップボードにコピーして手動で貼り付け
   - 「note.comに挿入」：note.comのエディタに直接挿入
   - 「履歴に保存」：後で再編集できるように保存

### 履歴機能の使い方

1. 表を作成後、「履歴に保存」ボタンをクリックして保存
2. 保存された表は「保存した表の履歴」セクションに表示されます
3. 履歴から表を読み込むには：
   - 履歴アイテムの「読込」ボタンをクリック
   - 表のデータが復元され、再編集が可能になります
4. 履歴の削除：
   - 個別削除：各アイテムの「削除」ボタン
   - 一括削除：「全て削除」ボタン
5. 履歴はブラウザのlocalStorageに保存されます（最大20件）

## TeX形式の例

以下のような表データ：

| パーツ名 | 製品 | 備考 |
|---------|------|------|
| CPU | Intel Core i7-4790 | |
| メモリ | CFD販売 W3U1600PS-8G | 8GB x 4 DDR3-1600 |

このようなTeX形式に変換されます：

```tex
$$\begin{array}{|l|l|l|} \hline
\text{パーツ名} & \text{製品} & \text{備考} \\ \hline
\text{CPU} & \text{Intel Core i7-4790} & \text{} \\ \hline
\text{メモリ} & \text{CFD販売 W3U1600PS-8G} & \text{8GB x 4 DDR3-1600} \\ \hline
\end{array}$$
```

## プロジェクト構造

```
note-table-helper/
├── firefox/              # Firefox版アドオン
│   ├── manifest.json     # Manifest V2
│   ├── icons/
│   ├── popup/
│   └── content/
├── chrome/               # Chrome版拡張機能
│   ├── manifest.json     # Manifest V3
│   ├── icons/
│   ├── popup/
│   └── content/
├── create_icons.py       # アイコン生成スクリプト
└── README.md
```

## 開発者向け

### アイコンの再生成

```bash
python3 create_icons.py
```

### 主要なファイル

- `popup/popup.html`: 拡張機能のポップアップUI
- `popup/popup.js`: 表生成、TeX変換、履歴管理ロジック
- `popup/popup.css`: ポップアップのスタイル
- `content/content.js`: note.comのページに挿入されるスクリプト
- `manifest.json`: 拡張機能の設定ファイル

### 技術仕様

- **履歴の保存先**: ブラウザのlocalStorage
- **保存形式**: JSON形式
- **保存期限**: ブラウザのストレージをクリアするまで永続
- **最大保存件数**: 20件（古いものから自動削除）

## ライセンス

MIT License

## 作成者

Claude Code を使用して作成されました。

## 注意事項

- note.comのサイト構造が変更された場合、エディタへの自動挿入機能が動作しなくなる可能性があります
- その場合は「TeXをコピー」機能を使用して手動で貼り付けてください
