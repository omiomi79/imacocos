import { NOTES } from './areas';
import { assetPath } from './assetPath';
import { PostForm } from './components/PostForm';
import { SearchPanel } from './components/SearchPanel';

export default function App() {
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

      <main>
        <PostForm />
        <SearchPanel />
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
