import { NOTES } from './areas';
import { PostForm } from './components/PostForm';

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="brand-lockup">
          <img className="brand-mark" src="/brand/cocos-mark.webp" alt="" aria-hidden="true" />
          <div className="brand-copy">
            <img className="brand-wordmark" src="/brand/cocos-wordmark.webp" alt="CoCoS" />
            <p>COSPLAY LOCATION SIGNAL</p>
          </div>
        </div>
        <div className="system-pill">
          <span aria-hidden="true">●</span> C108 / X SHARE
        </div>
      </header>

      <main>
        <PostForm />
      </main>

      <footer className="footer">
        <p className="footer-code">IMACOCOS // UNOFFICIAL TOOL</p>
        <ul>
          {NOTES.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
        <p>入力内容は保存されず、Xの投稿画面へ渡されます。個人を特定できる情報や誹謗中傷は書かないでください。</p>
        <p>撮影は必ず本人の許可を取り、会場のルールを守ってください。</p>
      </footer>
    </div>
  );
}
