export default function ThanksPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold mb-4">회고 한 줄 남기기</h1>
        <p className="text-zinc-600 mb-8">
          지금 어떻게 됐나요? 잘 됐든, 후회되든 한 줄만 적어보세요.
          <br />
          (현재는 베타 단계라 수동 응답이에요. 메일에 답장 보내주시면 직접 회신드릴게요.)
        </p>
        <a href="mailto:yeonwoogie@gmail.com?subject=회고 한 줄" className="underline">
          답장으로 회고 보내기
        </a>
      </div>
    </main>
  );
}
