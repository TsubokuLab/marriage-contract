interface ProgressBarProps {
  current: number;
  total: number;
}

const encouragements = [
  { threshold: 0, message: "さあ、始めましょう！💍" },
  { threshold: 15, message: "いいスタートです！✨" },
  { threshold: 30, message: "いい感じですね！💕 焦らずいきましょう" },
  { threshold: 50, message: "折り返し地点！🌸 半分まで来ました" },
  { threshold: 70, message: "もう少し！🎉 ゴールが見えてきました" },
  { threshold: 90, message: "あと少し！💫 頑張っています" },
  { threshold: 100, message: "お疲れさまでした！🎊 素敵なスタートを切れますように" },
];

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  const message = encouragements
    .slice()
    .reverse()
    .find((e) => percentage >= e.threshold)?.message ?? "";

  return (
    <div
      className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-sm border-b border-[rgba(8,19,26,0.08)] px-4 py-2"
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`進捗 ${percentage}%`}
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-[rgba(8,19,26,0.66)]">{message}</span>
          <span className="text-xs font-semibold text-[#ff6b9d]">{percentage}%</span>
        </div>
        <div className="h-2 bg-[#ffd6e3] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${percentage}%`,
              background: "linear-gradient(90deg, #ff6b9d, #ffb88c)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
