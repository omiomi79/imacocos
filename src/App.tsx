import { useState } from 'react';
import { NOTES } from './areas';
import { assetPath } from './assetPath';
import { PostForm } from './components/PostForm';
import { SearchPanel } from './components/SearchPanel';

const TABS = [
  { id: 'post', label: '投稿する', code: 'POST' },
  { id: 'find', label: '探す', code: 'FIND' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function App() {
  const [tab, setTab] = useState<TabId>('post');

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

      <nav className="tabs" role="tablist" aria-label="画面の切り替え">
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
            <span className="tab-label">{item.label}</span>
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
          {NOTES.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
        <p>入力内容は保存されず、Xの投稿画面へ渡されます。個人を特定できる情報や誹謗中傷は書かないでください。</p>
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
