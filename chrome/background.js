// コンテキストメニュー項目を作成
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "open-note-table-helper",
    title: "Note Table Helper を開く",
    contexts: ["page", "selection", "editable"],
    documentUrlPatterns: ["https://editor.note.com/*"]
  });
});

// コンテキストメニューがクリックされたときの処理
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "open-note-table-helper") {
    // Chrome: ポップアップを新しいウィンドウで開く
    chrome.windows.create({
      url: chrome.runtime.getURL("popup/popup.html"),
      type: "popup",
      width: 570,
      height: 520
    });
  }
});
