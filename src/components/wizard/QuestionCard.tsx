import { useState } from "react";
import { ChevronDown, ChevronUp, Check, Pencil } from "lucide-react";
import type { Question, Choice } from "../../types/contract";
import { useContract } from "../../state/ContractContext";

interface QuestionCardProps {
  question: Question;
}

const CUSTOM_ID = "custom";

// {{partyA}} / {{partyB}} プレースホルダーを実際の名前に置換
function interpolateLabel(label: string, nameA: string, nameB: string): string {
  return label.replace(/\{\{partyA\}\}/g, nameA).replace(/\{\{partyB\}\}/g, nameB);
}

export function QuestionCard({ question }: QuestionCardProps) {
  const { data, setAnswer } = useContract();
  const answer = data.answers[question.id] ?? {};
  const [hintOpen, setHintOpen] = useState(false);
  const nameA = data.meta.partyA.name || "甲（第一当事者）";
  const nameB = data.meta.partyB.name || "乙（第二当事者）";

  function handleSingleSelect(choice: Choice) {
    setAnswer(question.id, { selectedId: choice.id });
  }

  function handleCustomSelect() {
    setAnswer(question.id, { selectedId: CUSTOM_ID, customText: answer.customText ?? "" });
  }

  function handleCustomText(text: string) {
    setAnswer(question.id, { selectedId: CUSTOM_ID, customText: text });
  }

  function handleMultiToggle(choiceId: string) {
    const current = answer.selectedIds ?? [];
    const next = current.includes(choiceId)
      ? current.filter((id) => id !== choiceId)
      : [...current, choiceId];
    setAnswer(question.id, { selectedIds: next });
  }

  function handleTextChange(val: string) {
    setAnswer(question.id, { textValue: val });
  }

  function handleNumberChange(val: string) {
    const num = parseFloat(val);
    setAnswer(question.id, { numberValue: isNaN(num) ? undefined : num });
  }

  const maxLen = question.customMaxLength ?? 300;
  const customText = answer.customText ?? "";

  return (
    <div className="space-y-3">
      {/* Question label */}
      <p className="text-base font-semibold text-[#08131a] leading-relaxed">
        {question.label}
      </p>

      {/* Hint */}
      {question.hint && (
        <div>
          <button
            type="button"
            onClick={() => setHintOpen((v) => !v)}
            className="flex items-center gap-1 text-sm text-[#ff6b9d] hover:text-[#e55a8a] transition-colors"
            aria-expanded={hintOpen}
          >
            <span>💡 なぜこの質問をするの?</span>
            {hintOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {hintOpen && (
            <p className="mt-2 text-sm text-[rgba(8,19,26,0.66)] bg-[#fff8e7] rounded-xl px-4 py-3 leading-relaxed slide-down">
              {question.hint}
            </p>
          )}
        </div>
      )}

      {/* Single choice */}
      {question.type === "single" && question.choices && (
        <div className="space-y-2" role="radiogroup" aria-label={question.label}>
          {question.choices.map((choice) => {
            const selected = answer.selectedId === choice.id;
            return (
              <button
                key={choice.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => handleSingleSelect(choice)}
                className={[
                  "choice-card w-full text-left px-4 py-3 rounded-2xl border-2 transition-all duration-150",
                  "flex items-center gap-3",
                  selected
                    ? "border-[#ff6b9d] bg-[#fff0f5] selected"
                    : "border-[#ffd6e3] bg-white hover:bg-[#fff8fa] hover:border-[#ffb3cd]",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center",
                    selected
                      ? "border-[#ff6b9d] bg-[#ff6b9d]"
                      : "border-[rgba(8,19,26,0.2)]",
                  ].join(" ")}
                >
                  {selected && <Check size={12} strokeWidth={3} className="text-white" />}
                </span>
                <span className={`text-sm leading-relaxed ${selected ? "font-semibold text-[#ff6b9d]" : "text-[#08131a]"}`}>
                  {interpolateLabel(choice.label, nameA, nameB)}
                </span>
              </button>
            );
          })}

          {/* Custom option */}
          {question.allowCustom && (
            <div>
              <button
                type="button"
                role="radio"
                aria-checked={answer.selectedId === CUSTOM_ID}
                onClick={handleCustomSelect}
                className={[
                  "choice-card w-full text-left px-4 py-3 rounded-2xl border-2 transition-all duration-150",
                  "flex items-center gap-3",
                  answer.selectedId === CUSTOM_ID
                    ? "border-[#ff6b9d] bg-[#fff0f5] selected"
                    : "border-dashed border-[rgba(8,19,26,0.2)] bg-white hover:bg-[#fff8fa]",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center",
                    answer.selectedId === CUSTOM_ID
                      ? "border-[#ff6b9d] bg-[#ff6b9d]"
                      : "border-[rgba(8,19,26,0.2)]",
                  ].join(" ")}
                >
                  {answer.selectedId === CUSTOM_ID && (
                    <Check size={12} strokeWidth={3} className="text-white" />
                  )}
                </span>
                <Pencil size={14} className="text-[rgba(8,19,26,0.4)] flex-shrink-0" />
                <span className="text-sm text-[rgba(8,19,26,0.66)]">
                  ✏️ その他（自分で入力する）
                </span>
              </button>

              {/* Custom text area (slide down) */}
              {answer.selectedId === CUSTOM_ID && (
                <div className="mt-2 slide-down">
                  <div className="relative">
                    <textarea
                      value={customText}
                      onChange={(e) => handleCustomText(e.target.value)}
                      placeholder={question.customPlaceholder ?? "自由に入力してください"}
                      maxLength={maxLen}
                      rows={3}
                      className={[
                        "w-full px-4 py-3 rounded-xl border-2 text-sm leading-relaxed resize-none",
                        "focus:outline-none focus:ring-2 focus:ring-[#ff6b9d] focus:ring-offset-1",
                        "transition-colors duration-150",
                        customText.length > maxLen
                          ? "border-[#b22323]"
                          : "border-[#ffd6e3] focus:border-[#ff6b9d]",
                      ].join(" ")}
                    />
                    <span
                      className={`absolute bottom-2 right-3 text-xs ${
                        customText.length > maxLen ? "text-[#b22323] font-semibold" : "text-[rgba(8,19,26,0.4)]"
                      }`}
                    >
                      {customText.length} / {maxLen}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#916626] flex items-start gap-1">
                    <span>⚠️</span>
                    <span>自由入力した内容は、公正証書化の際に専門家のチェックを受けることを強くおすすめします</span>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Multi choice */}
      {question.type === "multi" && question.choices && (
        <div className="space-y-2" role="group" aria-label={question.label}>
          {question.choices.map((choice) => {
            const selected = (answer.selectedIds ?? []).includes(choice.id);
            return (
              <button
                key={choice.id}
                type="button"
                role="checkbox"
                aria-checked={selected}
                onClick={() => handleMultiToggle(choice.id)}
                className={[
                  "choice-card w-full text-left px-4 py-3 rounded-2xl border-2 transition-all duration-150",
                  "flex items-center gap-3",
                  selected
                    ? "border-[#ff6b9d] bg-[#fff0f5] selected"
                    : "border-[#ffd6e3] bg-white hover:bg-[#fff8fa]",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex-shrink-0 w-5 h-5 rounded flex items-center justify-center",
                    selected
                      ? "border-[#ff6b9d] bg-[#ff6b9d] border-2"
                      : "border-2 border-[rgba(8,19,26,0.2)]",
                  ].join(" ")}
                >
                  {selected && <Check size={12} strokeWidth={3} className="text-white" />}
                </span>
                <span className={`text-sm leading-relaxed ${selected ? "font-semibold text-[#ff6b9d]" : "text-[#08131a]"}`}>
                  {interpolateLabel(choice.label, nameA, nameB)}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Text input */}
      {question.type === "text" && (
        <input
          type="text"
          value={answer.textValue ?? ""}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder={question.placeholder ?? ""}
          className="w-full px-4 py-3 rounded-xl border-2 border-[#ffd6e3] text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b9d] focus:border-[#ff6b9d] transition-colors"
        />
      )}

      {/* Number input */}
      {question.type === "number" && (
        <input
          type="number"
          value={answer.numberValue ?? ""}
          onChange={(e) => handleNumberChange(e.target.value)}
          placeholder={question.placeholder ?? ""}
          className="w-full px-4 py-3 rounded-xl border-2 border-[#ffd6e3] text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b9d] focus:border-[#ff6b9d] transition-colors"
        />
      )}
    </div>
  );
}
