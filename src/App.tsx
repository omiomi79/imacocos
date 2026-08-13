import { useState } from 'react';
import { assetPath } from './assetPath';
import { PostForm } from './components/PostForm';
import { SearchPanel } from './components/SearchPanel';
import { LANGUAGES, useI18n, type LanguageCode } from './i18n';

const TABS = [
  { id: 'post', labelKey: 'tab.post', code: 'POST' },
  { id: 'find', labelKey: 'tab.find', code: 'FIND' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function App() {
  const [tab, setTab] = useState<TabId>('post');
  const { lang, setLang, t } = useI18n();

  return (
    <div className="app">
      <header className="header">
        <div className="brand-lockup">
          <img className="brand-mark" src={assetPath('/brand/cocos-mark.webp')} alt="" aria-hidden="true" />
          <div className="brand-copy">
            <img className="brand-wordmark" src={assetPath('/brand/cocos-wordmark.webp')} alt="CoCoS" />
            <p>COSPLAY LOCATION SIGNAL</p>
          </div>
        </div>
        <div className="system-pill">
          <span aria-hidden="true">●</span> C108 / X SHARE
        </div>
      </header>

      {/* 何語か分からない人でも探せるよう、見出しは英語で固定する */}
      <div className="lang-picker">
        <label className="lang-label" htmlFor="lang-select">
          Select Language
        </label>
        <select
          id="lang-select"
          className="select small"
          value={lang}
          onChange={(event) => setLang(event.target.value as LanguageCode)}
        >
          {LANGUAGES.map((language) => (
            <option key={language.code} value={language.code}>
              {language.label}
            </option>
          ))}
        </select>
      </div>

      <nav className="tabs" role="tablist" aria-label={t('nav.label')}>
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`tab-${item.id}`}
            className="tab"
            aria-selected={tab === item.id}
            aria-controls={`panel-${item.id}`}
            onClick={() => {
              setTab(item.id);
              // 下までスクロールした状態で切り替えると、移った先で上部が見切れる
              window.scrollTo({ top: 0 });
            }}
          >
            <span className="tab-code">{item.code}</span>
            <span className="tab-label">{t(item.labelKey)}</span>
          </button>
        ))}
      </nav>

      <main>
        {/* 入力途中の内容が消えないよう、切り替えても両方マウントしたままにする */}
        <div role="tabpanel" id="panel-post" aria-labelledby="tab-post" hidden={tab !== 'post'}>
          <PostForm />
        </div>
        <div role="tabpanel" id="panel-find" aria-labelledby="tab-find" hidden={tab !== 'find'}>
          <SearchPanel />
        </div>
      </main>

      <footer className="footer">
        <p className="footer-code">IMACOCOS // UNOFFICIAL TOOL</p>
        <ul>
          <li>{t('footer.note1')}</li>
          <li>{t('footer.note2')}</li>
        </ul>
        <p>{t('footer.privacy')}</p>
        {/* 撮影マナーは、読んでほしい撮影者の目に入る共有ページ側に置いている */}
        <p className="copyright">
          © 2026 おみ（
          <a href="https://x.com/omiomi79" target="_blank" rel="noopener noreferrer">
            @omiomi79
          </a>
          ）
        </p>
      </footer>
    </div>
  );
}
