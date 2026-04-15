import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, SkipForward, Eye } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ProgressBar } from "../components/wizard/ProgressBar";
import { ClauseWizardCard } from "../components/wizard/ClauseWizardCard";
import { useContract } from "../state/ContractContext";
import { CHAPTERS } from "../data/chapters";
import { CLAUSES } from "../data/clauses";

type Step = "intro" | "meta" | { chapterNumber: number } | "preview";

const TOTAL_STEPS = 2 + CHAPTERS.length; // intro + meta + 7 chapters

function stepIndex(step: Step): number {
  if (step === "intro") return 0;
  if (step === "meta") return 1;
  if (step === "preview") return TOTAL_STEPS - 1;
  return 1 + step.chapterNumber; // meta=1, chapter1=2, ...
}

function nextStep(step: Step): Step {
  if (step === "intro") return "meta";
  if (step === "meta") return { chapterNumber: 1 };
  if (step === "preview") return "preview";
  const next = step.chapterNumber + 1;
  if (next > CHAPTERS.length) return "preview";
  return { chapterNumber: next };
}

function prevStep(step: Step): Step {
  if (step === "intro") return "intro";
  if (step === "meta") return "intro";
  if (step === "preview") return { chapterNumber: CHAPTERS.length };
  if (step.chapterNumber === 1) return "meta";
  return { chapterNumber: step.chapterNumber - 1 };
}

// メタ情報フォーム
function MetaForm() {
  const { data, setPartyA, setPartyB, setMeta } = useContract();
  const { meta } = data;
  const [sameAddress, setSameAddress] = useState(false);

  // 「同じ住所」チェック時は甲の住所を乙に同期
  useEffect(() => {
    if (sameAddress) {
      setPartyB({ address: meta.partyA.address });
    }
  }, [sameAddress, meta.partyA.address, setPartyB]);

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border-2 border-[#ffd6e3] text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b9d] focus:border-[#ff6b9d] transition-colors";

  function field(label: string, value: string, onChange: (v: string) => void, type = "text") {
    return (
      <div>
        <label className="block text-sm font-medium text-[#08131a] mb-1">{label}</label>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date */}
      <Card>
        <h3 className="font-semibold text-[#08131a] mb-4">📅 締結日</h3>
        {field("締結日 *", meta.date, (v) => setMeta({ date: v }), "date")}
      </Card>

      {/* Party A */}
      <Card>
        <h3 className="font-semibold text-[#08131a] mb-4">👤 甲（第一当事者）</h3>
        <p className="text-xs text-[rgba(8,19,26,0.45)] mb-3">
          ※ 氏名・生年月日・住所は任意です。未入力の場合、PDFに手書き欄が残ります。
        </p>
        <div className="space-y-3">
          {field("氏名", meta.partyA.name, (v) => setPartyA({ name: v }))}
          {field("生年月日", meta.partyA.birthDate, (v) => setPartyA({ birthDate: v }), "date")}
          {field("住所", meta.partyA.address, (v) => setPartyA({ address: v }))}
        </div>
      </Card>

      {/* Party B */}
      <Card>
        <h3 className="font-semibold text-[#08131a] mb-4">👤 乙（第二当事者）</h3>
        <p className="text-xs text-[rgba(8,19,26,0.45)] mb-3">
          ※ 氏名・生年月日・住所は任意です。未入力の場合、PDFに手書き欄が残ります。
        </p>
        <div className="space-y-3">
          {field("氏名", meta.partyB.name, (v) => setPartyB({ name: v }))}
          {field("生年月日", meta.partyB.birthDate, (v) => setPartyB({ birthDate: v }), "date")}
          <div>
            <label className="flex items-center gap-2 mb-2 cursor-pointer select-none w-fit">
              <input
                type="checkbox"
                checked={sameAddress}
                onChange={(e) => setSameAddress(e.target.checked)}
                className="w-4 h-4 accent-[#ff6b9d]"
              />
              <span className="text-sm text-[rgba(8,19,26,0.7)]">甲と同じ住所</span>
            </label>
            <input
              type="text"
              value={meta.partyB.address}
              onChange={(e) => {
                setSameAddress(false);
                setPartyB({ address: e.target.value });
              }}
              disabled={sameAddress}
              className={`${inputClass} disabled:bg-[#f5f5f5] disabled:text-[rgba(8,19,26,0.4)]`}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

// イントロ画面
function IntroStep() {
  return (
    <Card className="text-center py-8">
      <div className="text-5xl mb-4">💍</div>
      <h2 className="text-2xl font-bold text-[#08131a] mb-3">はじめる前に</h2>
      <div className="text-left space-y-4 mt-6">
        <div className="bg-[#fff8e7] rounded-xl p-4">
          <p className="text-sm font-semibold text-[#916626] mb-2">⚠️ 免責事項</p>
          <p className="text-sm text-[rgba(8,19,26,0.66)] leading-relaxed">
            本サービスは婚前契約書のドラフト作成を支援するツールです。
            出力された文書は法的助言ではなく、効力を担保するものではありません。
            弁護士へのご相談および公正証書化をご検討ください。
          </p>
        </div>
        <div className="bg-[#fff0f5] rounded-xl p-4">
          <p className="text-sm font-semibold text-[#ff6b9d] mb-2">💕 このツールについて</p>
          <p className="text-sm text-[rgba(8,19,26,0.66)] leading-relaxed">
            質問に選択肢で答えていくだけで、二人のための婚前契約書ドラフトが自動で作成されます。
            全てのステップに答える必要はありません。スキップしながら自由に進めてください。
          </p>
        </div>
        <div className="bg-[#f0fff4] rounded-xl p-4">
          <p className="text-sm font-semibold text-[#1e7b65] mb-2">✅ 自動保存について</p>
          <p className="text-sm text-[rgba(8,19,26,0.66)] leading-relaxed">
            入力内容はブラウザに自動保存されます。途中で閉じても、次回開いたときに続きから再開できます。
          </p>
        </div>
      </div>
    </Card>
  );
}

// 章ステップ
function ChapterStep({ chapterNumber }: { chapterNumber: number }) {
  const chapter = CHAPTERS.find((c) => c.number === chapterNumber)!;
  const clauses = CLAUSES.filter((c) => c.chapter === chapterNumber);
  const { data, toggleClause } = useContract();

  const [chapterSkipped, setChapterSkipped] = useState(
    clauses.every((c) => !data.includedClauses[c.id] && !c.required)
  );

  function skipAll() {
    clauses.forEach((c) => {
      if (!c.required) toggleClause(c.id, false);
    });
    setChapterSkipped(true);
  }

  function includeAll() {
    clauses.forEach((c) => toggleClause(c.id, true));
    setChapterSkipped(false);
  }

  return (
    <div className="space-y-4">
      {/* Chapter header */}
      <div
        className="rounded-[20px] p-6 border border-[rgba(8,19,26,0.08)]"
        style={{ background: chapter.bgColor }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-3xl mb-2">{chapter.emoji}</div>
            <h2 className="text-xl font-bold text-[#08131a]">
              第{chapter.number}章　{chapter.title}
            </h2>
            <p className="text-sm text-[rgba(8,19,26,0.6)] mt-1 leading-relaxed">
              {chapter.description}
            </p>
          </div>
          {clauses.some((c) => !c.required) && (
            <button
              type="button"
              onClick={chapterSkipped ? includeAll : skipAll}
              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border border-[rgba(8,19,26,0.2)] text-[rgba(8,19,26,0.5)] hover:border-[rgba(8,19,26,0.4)] transition-all bg-white/70 flex-shrink-0"
            >
              <SkipForward size={12} />
              {chapterSkipped ? "章を含める" : "この章をスキップ"}
            </button>
          )}
        </div>
      </div>

      {/* Clauses */}
      {clauses.map((clause) => (
        <ClauseWizardCard key={clause.id} clause={clause} />
      ))}
    </div>
  );
}

export function Wizard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState<Step>(() => {
    const state = location.state as { chapterNumber?: number; step?: string } | null;
    if (state?.step === "meta") return "meta";
    if (state?.chapterNumber) return { chapterNumber: state.chapterNumber };
    return "intro";
  });

  // ステップ変化のたびに確実に最上部へスクロール
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [step]);

  const currentIndex = stepIndex(step);
  const progress = step === "preview" ? TOTAL_STEPS : currentIndex;

  function goNext() {
    const ns = nextStep(step);
    if (ns === "preview") {
      navigate("/preview");
    } else {
      setStep(ns);
    }
  }

  function goPrev() {
    const ps = prevStep(step);
    setStep(ps);
  }

  const isFirst = step === "intro";

  return (
    <div className="min-h-screen bg-[#fff5f7]">
      <ProgressBar current={progress} total={TOTAL_STEPS} />

      <div className="max-w-2xl mx-auto px-4 pt-20 pb-32">
        {step === "intro" && <IntroStep />}
        {step === "meta" && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#08131a]">📝 基本情報</h2>
              <p className="text-sm text-[rgba(8,19,26,0.55)] mt-1">
                お二人の基本情報を入力してください
              </p>
            </div>
            <MetaForm />
          </div>
        )}
        {typeof step === "object" && "chapterNumber" in step && (
          <ChapterStep key={step.chapterNumber} chapterNumber={step.chapterNumber} />
        )}
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-[rgba(8,19,26,0.08)] z-30">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            onClick={goPrev}
            disabled={isFirst}
            className="flex items-center gap-1"
          >
            <ChevronLeft size={18} />
            戻る
          </Button>

          <div className="flex items-center gap-2">
            {step === "meta" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep({ chapterNumber: 1 })}
                className="flex items-center gap-1 text-sm text-[rgba(8,19,26,0.45)]"
              >
                <SkipForward size={14} />
                スキップ
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={() => navigate("/preview")}
              className="flex items-center gap-1 text-sm"
              size="sm"
            >
              <Eye size={16} />
              プレビュー
            </Button>
            <Button onClick={goNext} className="flex items-center gap-1">
              {typeof step === "object" && step.chapterNumber === CHAPTERS.length
                ? "完成！"
                : "次へ"}
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
