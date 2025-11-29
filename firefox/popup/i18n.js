const translations = {
  ja: {
    rows: '行:',
    cols: '列:',
    hasHeader: 'ヘッダー行',
    generateTable: '生成',
    pasteTeX: 'TeXをペースト',
    resetTable: 'リセット',
    copyTex: 'TeXをコピー',
    insertToNote: 'Noteに挿入',
    headerPlaceholder: 'ヘッダー',
    dataPlaceholder: 'データ',
    messages: {
      rowsColsError: '行数と列数は2以上である必要があります',
      texNotGenerated: '表データがありません',
      texCopied: 'コピーしました',
      copyFailed: 'コピーに失敗しました',
      insertedToNote: '挿入しました',
      insertFailed: '挿入に失敗しました。editor.note.comのページで実行してください。',
      tabGetFailed: 'タブの取得に失敗しました',
      texPasted: 'TeXを読み込みました',
      pasteFailed: 'クリップボードの読み込みに失敗しました',
      invalidTeX: '無効なTeX形式です',
      tableReset: 'リセットしました'
    }
  },
  en: {
    rows: 'Rows:',
    cols: 'Cols:',
    hasHeader: 'Header',
    generateTable: 'Generate',
    pasteTeX: 'Paste TeX',
    resetTable: 'Reset',
    copyTex: 'Copy TeX',
    insertToNote: 'Insert to Note',
    headerPlaceholder: 'Header',
    dataPlaceholder: 'Data',
    messages: {
      rowsColsError: 'Rows and columns must be at least 2',
      texNotGenerated: 'No table data',
      texCopied: 'Copied',
      copyFailed: 'Copy failed',
      insertedToNote: 'Inserted',
      insertFailed: 'Insertion failed. Please run on editor.note.com page.',
      tabGetFailed: 'Failed to get tab',
      texPasted: 'TeX loaded',
      pasteFailed: 'Failed to read clipboard',
      invalidTeX: 'Invalid TeX format',
      tableReset: 'Reset'
    }
  }
};

class I18n {
  constructor() {
    this.currentLang = 'ja'; // デフォルトは日本語
    this.loadLanguage();
  }

  loadLanguage() {
    const savedLang = localStorage.getItem('language');
    if (savedLang && translations[savedLang]) {
      this.currentLang = savedLang;
    }
  }

  setLanguage(lang) {
    if (translations[lang]) {
      this.currentLang = lang;
      localStorage.setItem('language', lang);
      this.updateUI();
    }
  }

  get(key) {
    const keys = key.split('.');
    let value = translations[this.currentLang];

    for (const k of keys) {
      value = value[k];
      if (!value) return key;
    }

    return value;
  }

  updateUI() {
    // data-i18n属性を持つ要素を更新
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      element.textContent = this.get(key);
    });

    // data-i18n-placeholder属性を持つ要素を更新
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      element.placeholder = this.get(key);
    });

    // 言語切り替えボタンのアクティブ状態を更新
    document.querySelectorAll('.lang-btn').forEach(btn => {
      if (btn.dataset.lang === this.currentLang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
}

const i18n = new I18n();