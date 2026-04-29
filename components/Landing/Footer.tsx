export function Footer() {
  return (
    <footer
      className="bg-[var(--color-surface-inverse)] text-[var(--color-text-inverse)]"
    >
      <div className="max-w-[1080px] mx-auto px-6 sm:px-10 py-16 sm:py-[60px]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-10">
          <div>
            <p className="t-tag mb-4 inline-flex items-center gap-2 text-white/70">
              <span aria-hidden className="block w-1.5 h-1.5 rounded-full bg-[var(--color-brand)]" />
              Retrospect Archive
            </p>
            <p className="t-body-md text-white max-w-[36ch]">
              결정의 맥락은 1주일이면 흐려집니다.
              <br />
              한 줄 적어두면, 그때의 마음이 다시 돌아와요.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a href="#form" className="btn-primary">
              결정 적기
              <span aria-hidden>→</span>
            </a>
            <a
              href="https://github.com/hyunn522/Retrospect_Archive"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 text-[0.9375rem] font-bold text-white"
              style={{
                border: '1px solid var(--color-border-on-dark)',
                borderRadius: 'var(--radius-pill)',
              }}
            >
              GitHub
              <span aria-hidden>↗</span>
            </a>
          </div>
        </div>

        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
          style={{ borderTop: '1px solid var(--color-border-on-dark)' }}
        >
          <p className="t-caption-md text-white/60">
            © {new Date().getFullYear()} 회고 아카이브
          </p>
          <p className="t-caption-md text-white/60">
            Built for fake-door validation
          </p>
        </div>
      </div>
    </footer>
  );
}
