export function Footer() {
  return (
    <footer className="px-6 py-12 bg-zinc-900 text-zinc-400">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm flex items-center gap-3">
          <span className="font-semibold text-white tracking-tight">회고 아카이브</span>
          <span className="text-zinc-500">·</span>
          <span className="text-zinc-500">© {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-5 text-sm">
          <a
            href="#form"
            className="hover:text-white transition-colors"
          >
            결정 적기
          </a>
          <a
            href="https://github.com/hyunn522/Retrospect_Archive"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub →
          </a>
        </div>
      </div>
    </footer>
  );
}
