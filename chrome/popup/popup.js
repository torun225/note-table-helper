// DOM要素の取得
const hasHeaderCheckbox = document.getElementById('hasHeader');
const tableContainer = document.getElementById('tableContainer');
const copyTexBtn = document.getElementById('copyTex');
const insertToNoteBtn = document.getElementById('insertToNote');
const messageDiv = document.getElementById('message');

let currentTableData = [];

// 表を描画
function renderTable() {
  const rows = currentTableData.length;
  const cols = currentTableData[0]?.length || 0;
  const hasHeader = hasHeaderCheckbox.checked;

  // テーブルHTMLの生成
  let tableHTML = '<div class="table-wrapper">';
  tableHTML += '<table class="editable-table">';

  // 列削除ボタンの行（上部）
  tableHTML += '<tr class="col-controls">';
  for (let j = 0; j < cols; j++) {
    tableHTML += `<td><button class="delete-col-btn" data-col="${j}" title="列を削除">×</button></td>`;
  }
  tableHTML += `<td class="add-col-cell"><button class="add-col-btn" title="列を追加">+列</button></td>`;
  tableHTML += '</tr>';

  // データ行
  for (let i = 0; i < rows; i++) {
    tableHTML += '<tr>';

    const cellType = (i === 0 && hasHeader) ? 'th' : 'td';

    for (let j = 0; j < cols; j++) {
      tableHTML += `<${cellType}>`;
      tableHTML += `<input type="text" data-row="${i}" data-col="${j}" value="${currentTableData[i][j] || ''}" placeholder="${i === 0 && hasHeader ? i18n.get('headerPlaceholder') : i18n.get('dataPlaceholder')}">`;
      tableHTML += `</${cellType}>`;
    }

    tableHTML += `<td class="row-controls"><button class="delete-row-btn" data-row="${i}" title="行を削除">×</button></td>`;
    tableHTML += '</tr>';
  }

  // 行追加ボタンの行（下部）
  tableHTML += '<tr class="row-add-controls">';
  tableHTML += `<td colspan="${cols + 1}" class="add-row-cell"><button class="add-row-btn" title="行を追加">+行</button></td>`;
  tableHTML += '</tr>';

  tableHTML += '</table>';
  tableHTML += '</div>';

  tableContainer.innerHTML = tableHTML;

  // 入力イベントリスナーの追加
  const inputs = tableContainer.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('input', handleCellInput);
  });

  // 削除ボタンのイベントリスナー
  tableContainer.querySelectorAll('.delete-row-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const row = parseInt(e.target.dataset.row);
      deleteRow(row);
    });
  });

  tableContainer.querySelectorAll('.delete-col-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const col = parseInt(e.target.dataset.col);
      deleteColumn(col);
    });
  });

  // 追加ボタンのイベントリスナー
  tableContainer.querySelector('.add-row-btn')?.addEventListener('click', addRow);
  tableContainer.querySelector('.add-col-btn')?.addEventListener('click', addColumn);

  // TeXを更新
  updateTeXOutput();
}

// 行を追加
function addRow() {
  const cols = currentTableData[0]?.length || 3;
  currentTableData.push(Array(cols).fill(''));
  renderTable();
}

// 列を追加
function addColumn() {
  currentTableData.forEach(row => row.push(''));
  renderTable();
}

// 行を削除
function deleteRow(rowIndex) {
  if (currentTableData.length <= 1) {
    showMessage('最低1行は必要です', 'error');
    return;
  }
  currentTableData.splice(rowIndex, 1);
  renderTable();
}

// 列を削除
function deleteColumn(colIndex) {
  if (currentTableData[0]?.length <= 1) {
    showMessage('最低1列は必要です', 'error');
    return;
  }
  currentTableData.forEach(row => row.splice(colIndex, 1));
  renderTable();
}

// セルの入力を処理
function handleCellInput(event) {
  const row = parseInt(event.target.dataset.row);
  const col = parseInt(event.target.dataset.col);
  currentTableData[row][col] = event.target.value;
  updateTeXOutput();
}

// TeXコードを生成
function generateTeX() {
  const rows = currentTableData.length;
  const cols = currentTableData[0]?.length || 0;

  if (rows === 0 || cols === 0) {
    return '';
  }

  // 列の定義（すべて左寄せで縦線あり）
  const colDef = Array(cols).fill('l').join('|');

  let tex = `$$\\begin{array}{|${colDef}|} \\hline`;

  for (let i = 0; i < rows; i++) {
    const rowData = currentTableData[i].map(cell => {
      // 空のセルは \text{} として出力
      if (!cell || cell.trim() === '') {
        return '\\text{}';
      }
      // セルの内容を \text{} で囲む
      return `\\text{${cell}}`;
    });

    tex += rowData.join(' & ');
    tex += ' \\\\ \\hline';
  }

  tex += '\\end{array}$$';

  return tex;
}

// TeXの出力を更新（内部的に使用）
function updateTeXOutput() {
  // TeXを生成するが、表示はしない
  generateTeX();
}

// メッセージを表示
function showMessage(text, type) {
  messageDiv.textContent = text;
  messageDiv.className = `message ${type}`;
  setTimeout(() => {
    messageDiv.className = 'message';
  }, 3000);
}

// TeXをクリップボードにコピー
function copyTeXToClipboard() {
  const tex = generateTeX();

  if (!tex) {
    showMessage(i18n.get('messages.texNotGenerated'), 'error');
    return;
  }

  navigator.clipboard.writeText(tex).then(() => {
    showMessage(i18n.get('messages.texCopied'), 'success');
  }).catch(err => {
    showMessage(i18n.get('messages.copyFailed'), 'error');
    console.error('コピーエラー:', err);
  });
}

// note.comに挿入
function insertToNote() {
  const tex = generateTeX();

  if (!tex) {
    showMessage(i18n.get('messages.texNotGenerated'), 'error');
    return;
  }

  // アクティブなタブにメッセージを送信
  browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
    if (tabs[0]) {
      browser.tabs.sendMessage(tabs[0].id, {
        action: 'insertTeX',
        tex: tex
      }).then(response => {
        if (response && response.success) {
          showMessage(i18n.get('messages.insertedToNote'), 'success');
        } else {
          showMessage(i18n.get('messages.insertFailed'), 'error');
        }
      }).catch(err => {
        showMessage(i18n.get('messages.insertFailed'), 'error');
        console.error('挿入エラー:', err);
      });
    }
  }).catch(err => {
    showMessage(i18n.get('messages.tabGetFailed'), 'error');
    console.error('タブ取得エラー:', err);
  });
}

// TeXをパースして表データに変換
function parseTeX(tex) {
  // $$ で囲まれた部分を抽出
  const match = tex.match(/\$\$(.+?)\$\$/s);
  if (!match) {
    return null;
  }

  const content = match[1].trim();

  // \begin{array} と \end{array} の間を抽出
  const arrayMatch = content.match(/\\begin\{array\}\{[^}]+\}(.+?)\\end\{array\}/s);
  if (!arrayMatch) {
    return null;
  }

  const tableContent = arrayMatch[1].trim();

  // 各行を分割
  const rows = tableContent.split('\\\\').map(row => row.trim()).filter(row => row && row !== '\\hline');

  if (rows.length === 0) {
    return null;
  }

  // 各行のセルを分割
  const tableData = rows.map(row => {
    // \hline を削除
    row = row.replace(/\\hline/g, '').trim();

    // & で分割してセルを取得
    const cells = row.split('&').map(cell => {
      cell = cell.trim();

      // \text{} の中身を取得
      const textMatch = cell.match(/\\text\{([^}]*)\}/);
      if (textMatch) {
        return textMatch[1];
      }

      return '';
    });

    return cells;
  });

  return tableData;
}

// TeXをクリップボードから読み込んで表として読み込む
function pasteTeXFromClipboard() {
  navigator.clipboard.readText().then(tex => {
    const tableData = parseTeX(tex);

    if (!tableData || tableData.length === 0) {
      showMessage(i18n.get('messages.invalidTeX'), 'error');
      return;
    }

    // テーブルデータを設定
    currentTableData = tableData;

    // 表を再描画
    renderTable();

    showMessage(i18n.get('messages.texPasted'), 'success');
  }).catch(err => {
    showMessage(i18n.get('messages.pasteFailed'), 'error');
    console.error('ペーストエラー:', err);
  });
}

// 言語切り替えの処理
function setupLanguageSwitcher() {
  const langButtons = document.querySelectorAll('.lang-btn');
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      i18n.setLanguage(lang);
      if (currentTableData.length > 0) {
        renderTable(); // 表を再描画して新しい言語のプレースホルダーを適用
      }
    });
  });
}

// イベントリスナーの設定
hasHeaderCheckbox.addEventListener('change', () => {
  if (currentTableData.length > 0) {
    renderTable(); // ヘッダー設定変更時に再描画
  }
});
document.getElementById('pasteTeX').addEventListener('click', pasteTeXFromClipboard);
copyTexBtn.addEventListener('click', copyTeXToClipboard);
insertToNoteBtn.addEventListener('click', insertToNote);

// 初期化
setupLanguageSwitcher();
i18n.updateUI();

// 初期表を生成
currentTableData = Array(3).fill(null).map(() => Array(3).fill(''));
renderTable();
