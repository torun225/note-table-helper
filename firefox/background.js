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
    // Firefox: ポップアップを開く
    browser.browserAction.openPopup();
  }
});
