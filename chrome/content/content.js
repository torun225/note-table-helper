// note.comのエディタにTeXコードを挿入する

// メッセージリスナーの設定
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'insertTeX') {
    const success = insertTeXToEditor(message.tex);
    sendResponse({ success: success });
  }
  return true;
});

// エディタにTeXコードを挿入
function insertTeXToEditor(tex) {
  try {
    // note.comのエディタ要素を探す
    // note.comは複数のエディタタイプがあるため、複数のセレクタを試す
    const editorSelectors = [
      // 通常のテキストエディタ
      'textarea.o-textEditor__textarea',
      'div[contenteditable="true"]',
      'textarea[placeholder*="本文"]',
      'textarea[placeholder*="テキスト"]',
      // その他の可能性のあるエディタ
      'textarea',
      '[contenteditable="true"]'
    ];

    let editor = null;

    // エディタを見つける
    for (const selector of editorSelectors) {
      const element = document.querySelector(selector);
      if (element && isVisible(element)) {
        editor = element;
        break;
      }
    }

    if (!editor) {
      console.error('エディタが見つかりませんでした');
      return false;
    }

    // エディタのタイプに応じて挿入
    if (editor.tagName === 'TEXTAREA') {
      insertToTextarea(editor, tex);
    } else if (editor.contentEditable === 'true') {
      insertToContentEditable(editor, tex);
    } else {
      console.error('サポートされていないエディタタイプです');
      return false;
    }

    // 変更イベントをトリガー
    editor.dispatchEvent(new Event('input', { bubbles: true }));
    editor.dispatchEvent(new Event('change', { bubbles: true }));

    return true;
  } catch (error) {
    console.error('挿入エラー:', error);
    return false;
  }
}

// textareaに挿入
function insertToTextarea(textarea, text) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const currentValue = textarea.value;

  // カーソル位置にテキストを挿入
  const newValue = currentValue.substring(0, start) + text + currentValue.substring(end);
  textarea.value = newValue;

  // カーソル位置を挿入後の位置に移動
  const newCursorPos = start + text.length;
  textarea.setSelectionRange(newCursorPos, newCursorPos);

  // フォーカスを当てる
  textarea.focus();
}

// contentEditableな要素に挿入
function insertToContentEditable(element, text) {
  // 選択範囲を取得
  const selection = window.getSelection();

  // エディタ内にフォーカスがない場合は末尾に挿入
  if (!selection.rangeCount || !element.contains(selection.anchorNode)) {
    element.focus();
    const range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  // テキストノードを挿入
  const range = selection.getRangeAt(0);
  range.deleteContents();

  const textNode = document.createTextNode(text);
  range.insertNode(textNode);

  // カーソルを挿入後の位置に移動
  range.setStartAfter(textNode);
  range.setEndAfter(textNode);
  selection.removeAllRanges();
  selection.addRange(range);

  // フォーカスを当てる
  element.focus();
}

// 要素が表示されているかチェック
function isVisible(element) {
  return element.offsetWidth > 0 &&
         element.offsetHeight > 0 &&
         window.getComputedStyle(element).display !== 'none' &&
         window.getComputedStyle(element).visibility !== 'hidden';
}

console.log('Note Table Helper: Content script loaded');
