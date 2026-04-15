import { useState } from "react";
import { ChevronDown, ChevronUp, SkipForward } from "lucide-react";
import type { Clause } from "../../types/contract";
import { useContract } from "../../state/ContractContext";
import { QuestionCard } from "./QuestionCard";
import { Card } from "../ui/Card";

interface ClauseWizardCardProps {
  clause: Clause;
}

export function ClauseWizardCard({ clause }: ClauseWizardCardProps) {
  const { data, toggleClause } = useContract();
  const included = data.includedClauses[clause.id] ?? true;
  const [hintOpen, setHintOpen] = useState(false);

  const isRequired = clause.required;

  return (
    <Card className="relative">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-[#08131a]">
            第{clause.articleNumber}条（{clause.title}）
          </h3>
          <button
            type="button"
            onClick={() => setHintOpen((v) => !v)}
            className="flex items-center gap-1 text-sm text-[#ff6b9d] hover:text-[#e55a8a] transition-colors mt-1"
            aria-expanded={hintOpen}
          >
            <span>💡 この条文について</span>
            {hintOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>

        {/* Skip toggle */}
        {!isRequired && (
          <button
            type="button"
            onClick={() => toggleClause(clause.id, !included)}
            className={[
              "flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition-all duration-150 flex-shrink-0",
              included
                ? "border-[rgba(8,19,26,0.14)] text-[rgba(8,19,26,0.5)] hover:border-[rgba(8,19,26,0.3)]"
                : "border-[#ff6b9d] bg-[#fff0f5] text-[#ff6b9d]",
            ].join(" ")}
            aria-pressed={!included}
          >
            <SkipForward size={12} />
            {included ? "スキップする" : "含める"}
          </button>
        )}
        {isRequired && (
          <span className="text-xs text-white bg-[#ff6b9d] px-2 py-1 rounded-full flex-shrink-0">
            必須
          </span>
        )}
      </div>

      {/* Hint */}
      {hintOpen && (
        <p className="text-sm text-[rgba(8,19,26,0.66)] bg-[#fff8e7] rounded-xl px-4 py-3 mb-4 leading-relaxed slide-down">
          {clause.hint}
        </p>
      )}

      {/* Skipped state */}
      {!included && (
        <div className="py-6 text-center">
          <p className="text-sm text-[rgba(8,19,26,0.4)]">この条文はスキップされています</p>
          <button
            type="button"
            onClick={() => toggleClause(clause.id, true)}
            className="mt-2 text-sm text-[#ff6b9d] hover:underline"
          >
            スキップを取り消す
          </button>
        </div>
      )}

      {/* Questions */}
      {included && clause.questions.length > 0 && (
        <div className="space-y-6">
          {clause.questions.map((q) => (
            <QuestionCard key={q.id} question={q} />
          ))}
        </div>
      )}

      {/* Required clause with no questions */}
      {included && clause.questions.length === 0 && isRequired && (
        <div className="py-3 px-4 bg-[#fff0f5] rounded-xl">
          <p className="text-sm text-[rgba(8,19,26,0.66)]">
            この条文は必須のため固定で含まれます。
          </p>
        </div>
      )}
    </Card>
  );
}
