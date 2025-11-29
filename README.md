# Note Table Helper

note.comで記事を作成する際に、表をTeX形式で簡単に入力できるようにする補助ツールです。

## 機能

- 直感的なUIで表データを入力
- 自動的にTeX形式（`$$\begin{array}...\end{array}$$`）に変換
- **多言語対応**：日本語/英語の切り替え
- **動的な表編集**：
  - 行・列の追加/削除ボタンで自由に表のサイズを変更
  - ヘッダー行の有無を切り替え可能
- **データの入出力**：
  - TeXコードをクリップボードにコピー
  - editor.note.comのエディタに直接挿入
  - クリップボードからTeX形式をペーストして表をインポート
- **自動保存**：編集中の表を自動保存し、次回起動時に復元
- **テーブルリセット**：ワンクリックで表を初期状態（3×3）にリセット
- **コンテキストメニュー統合**：editor.note.com上で右クリックメニューから起動可能

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

1. editor.note.comの記事作成ページを開く
2. 以下のいずれかの方法でNote Table Helperを起動：
   - ブラウザのツールバーにあるアイコンをクリック
   - ページ上で右クリック→「Note Table Helper を開く」を選択
3. デフォルトで3×3の表が表示されます
4. 表のセルにデータを入力（自動的にTeX形式に変換されます）
5. 必要に応じて表を編集：
   - **ヘッダー行**：チェックボックスで1行目をヘッダーとして扱うか設定
   - **行の追加/削除**：各行の右側の「×」ボタンで削除、下部の「+行」ボタンで追加
   - **列の追加/削除**：各列の上部の「×」ボタンで削除、右側の「+列」ボタンで追加
6. 以下のボタンで表データを活用：
   - **TeXをコピー**：TeX形式のコードをクリップボードにコピー
   - **Noteに挿入**：editor.note.comのエディタに直接挿入
   - **TeXをペースト**：クリップボードからTeX形式をインポートして表を復元
   - **リセット**：表を初期状態（3×3の空の表）にリセット

### 言語切り替え

- 右上の「JP」/「EN」ボタンで日本語/英語を切り替えられます
- 選択した言語は自動的に保存され、次回起動時も適用されます

### 自動保存機能

- 表のデータは編集するたびに自動的に保存されます
- ポップアップを閉じても、次回起動時に前回の編集内容が復元されます
- データはブラウザのlocalStorageに保存されます

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
- `popup/popup.js`: 表生成、TeX変換、データ管理ロジック
- `popup/i18n.js`: 多言語対応（日本語/英語）
- `popup/popup.css`: ポップアップのスタイル
- `content/content.js`: editor.note.comのページに挿入されるスクリプト
- `background.js`: コンテキストメニューの管理
- `manifest.json`: 拡張機能の設定ファイル

### 技術仕様

- **データの保存先**: ブラウザのlocalStorage（Firefox）/ chrome.storage.local（Chrome）
- **保存内容**:
  - 現在編集中の表データ（tableData）
  - ヘッダー行の設定（hasHeader）
  - 言語設定（language）
- **保存形式**: JSON形式
- **保存期限**: ブラウザのストレージをクリアするまで永続
- **対応URL**: https://editor.note.com/* のみ

## ライセンス

MIT License

## 作成者

Claude Code を使用して作成されました。

## 注意事項

- **対応URL**: editor.note.com のみに対応しています
  - 旧URLのnote.comでは動作しません
  - コンテキストメニューはeditor.note.com上でのみ表示されます
- editor.note.comのサイト構造が変更された場合、エディタへの自動挿入機能が動作しなくなる可能性があります
  - その場合は「TeXをコピー」機能を使用して手動で貼り付けてください
- 自動保存機能により、編集中のデータは自動的に保存されますが、複数の表を管理する履歴機能は実装されていません
