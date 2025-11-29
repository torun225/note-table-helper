// コンテキストメニュー項目を作成
browser.contextMenus.create({
  id: "open-note-table-helper",
  title: "Note Table Helper を開く",
  contexts: ["page", "selection", "editable"],
  documentUrlPatterns: ["https://editor.note.com/*"]
});

// コンテキストメニューがクリックされたときの処理
browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "open-note-table-helper") {
    // Firefox: ポップアップを新しいウィンドウで開く
    browser.windows.create({
      url: browser.runtime.getURL("popup/popup.html"),
      type: "popup",
      width: 570,
      height: 520
    });
  }
});
