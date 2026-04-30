import { ArrowRightIcon, PencilIcon } from './Icons';

export function Hero() {
  return (
    <section className="relative bg-[var(--color-surface-canvas)] overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10 bg-aurora" />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[520px] sm:h-[640px] bg-dotgrid bg-dotgrid-fade"
      />

      <div className="max-w-[1080px] mx-auto px-6 sm:px-10 pt-14 sm:pt-[100px] md:pt-[120px] pb-12 sm:pb-[85px]">
        <div className="flex flex-col items-center text-center gap-6 sm:gap-10">
          <span
            className="t-tag-lg inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-[var(--color-text-primary)]"
            style={{
              background: 'var(--glass-tint-1)',
              border: '1px solid rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(14px) saturate(140%)',
              WebkitBackdropFilter: 'blur(14px) saturate(140%)',
              boxShadow:
                'inset 0 1px 0 var(--glass-inner-highlight), 0 6px 16px -8px rgba(0,0,0,0.10)',
            }}
          >
            <span aria-hidden className="block w-2 h-2 rounded-full bg-[var(--color-brand)]" />
            회고 아카이브
          </span>

          <h1 className="t-display-lg text-[var(--color-text-primary)] max-w-[18ch]">
            그때 왜 그렇게
            <br />
            결정했더라?
          </h1>

          <p className="t-body-lg max-w-[36ch] sm:max-w-[46ch]">
            결정은 기억나도, 맥락은 흐려져요.
            <br className="hidden sm:block" />
            한 줄 적어두면, 7일 뒤 그때의 나를 다시 만나요.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
            <a href="#form" className="btn-primary justify-center">
              <PencilIcon size={18} />
              한 줄 남기러 가기
              <ArrowRightIcon size={18} />
            </a>
            <a href="#how" className="btn-ghost justify-center">
              어떻게 작동하나요
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 t-caption-md">
            <span>무료</span>
            <span aria-hidden className="block w-1 h-1 rounded-full bg-[var(--color-text-secondary)] opacity-60" />
            <span>7일 뒤 메일 1통</span>
            <span aria-hidden className="block w-1 h-1 rounded-full bg-[var(--color-text-secondary)] opacity-60" />
            <span>스팸 없음</span>
          </div>
        </div>
      </div>
    </section>
  );
}
