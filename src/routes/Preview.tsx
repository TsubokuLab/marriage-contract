import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Share2, Download, Pencil } from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "../components/ui/Button";
import { ShareModal } from "../components/share/ShareModal";
import { DownloadModal } from "../components/share/DownloadModal";
import { useContract } from "../state/ContractContext";
import { CLAUSES } from "../data/clauses";
import { CHAPTERS } from "../data/chapters";

function formatDate(dateStr: string): string {
  if (!dateStr) return "　　年　　月　　日";
  try {
    return new Date(dateStr).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function Preview() {
  const navigate = useNavigate();
  const { data } = useContract();
  const { meta, answers, includedClauses } = data;
  const [shareOpen, setShareOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const confettiFired = useRef(false);

  useEffect(() => {
    if (!confettiFired.current) {
      confettiFired.current = true;
      setTimeout(() => {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.4 },
          colors: ["#ff6b9d", "#ffb88c", "#ffd6e3", "#5ac8b8", "#fff8e7"],
        });
      }, 400);
    }
  }, []);

  const A = meta.partyA.name || "甲";
  const B = meta.partyB.name || "乙";
  // 条文内は甲/乙表記に統一
  const clauseMeta = { ...meta, partyA: { ...meta.partyA, name: "甲" }, partyB: { ...meta.partyB, name: "乙" } };

  // 章ごとにグループ化
  const chapterClauses: Record<number, typeof CLAUSES> = {};
  for (const clause of CLAUSES) {
    if (!includedClauses[clause.id]) continue;
    if (!chapterClauses[clause.chapter]) chapterClauses[clause.chapter] = [];
    chapterClauses[clause.chapter].push(clause);
  }

  const includedChapters = Object.keys(chapterClauses).map(Number).sort((a, b) => a - b);

  // 出力時の連番振り直し（欠番なし）
  const chapterRenumber: Record<number, number> = {};
  const articleRenumber: Record<string, number> = {};
  let newChIdx = 0;
  let newArtIdx = 0;
  for (const chNum of includedChapters) {
    chapterRenumber[chNum] = ++newChIdx;
    for (const clause of chapterClauses[chNum]) {
      articleRenumber[clause.id] = ++newArtIdx;
    }
  }

  return (
    <div className="min-h-screen bg-[#fff5f7]">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-[rgba(8,19,26,0.08)]">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 font-semibold text-[#08131a] hover:text-[#ff6b9d] transition-colors"
          >
            <span className="text-lg">💍</span>
            <span className="text-sm">婚前契約書ジェネレーター</span>
          </button>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShareOpen(true)}
              className="flex items-center gap-1"
            >
              <Share2 size={14} />
              シェア
            </Button>
            <Button
              size="sm"
              onClick={() => setDownloadOpen(true)}
              className="flex items-center gap-1"
            >
              <Download size={14} />
              ダウンロード
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 flex gap-6">
        {/* Sidebar nav (desktop) */}
        <nav className="hidden md:block w-48 flex-shrink-0 sticky top-20 self-start">
          <p className="text-xs font-semibold text-[rgba(8,19,26,0.4)] uppercase tracking-wider mb-3">
            目次
          </p>
          <ul className="space-y-1">
            <li>
              <button
                type="button"
                onClick={() => navigate("/wizard", { state: { step: "meta" } })}
                className="block text-sm text-[rgba(8,19,26,0.6)] hover:text-[#ff6b9d] py-1 transition-colors w-full text-left"
              >
                基本情報
              </button>
            </li>
            {includedChapters.map((chNum) => {
              const chapter = CHAPTERS.find((c) => c.number === chNum);
              return (
                <li key={chNum}>
                  <button
                    type="button"
                    onClick={() => navigate("/wizard", { state: { chapterNumber: chNum } })}
                    className="block text-sm text-[rgba(8,19,26,0.6)] hover:text-[#ff6b9d] py-1 transition-colors w-full text-left"
                  >
                    {chapter?.emoji} 第{chapterRenumber[chNum]}章　{chapter?.title}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Edit button */}
          <div className="mt-6">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate("/wizard")}
              className="w-full flex items-center gap-1 justify-center"
            >
              <Pencil size={13} />
              内容を編集
            </Button>
          </div>
        </nav>

        {/* Contract document */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-[20px] border border-[rgba(8,19,26,0.08)] shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6 sm:p-10">
            {/* Completion message */}
            <div className="text-center mb-8 p-4 bg-[#fff0f5] rounded-xl">
              <div className="text-3xl mb-2">🎉</div>
              <p className="font-semibold text-[#ff6b9d]">婚前契約書ドラフトが完成しました！</p>
              <p className="text-sm text-[rgba(8,19,26,0.55)] mt-1">
                お疲れさまでした。素敵なスタートを切れますように 💕
              </p>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-[#08131a] mb-2 tracking-wide">
              婚前契約書
            </h1>
            <p className="text-center text-sm text-[rgba(8,19,26,0.5)] mb-8">
              締結日：{meta.date ? formatDate(meta.date) : <span className="border-b border-[rgba(8,19,26,0.4)] inline-block min-w-[120px]">&nbsp;</span>}
            </p>

            {/* Meta info */}
            <div id="meta" className="border border-[rgba(8,19,26,0.1)] rounded-xl p-4 mb-8 scroll-mt-20">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-[rgba(8,19,26,0.4)] uppercase mb-2">甲（第一当事者）</p>
                  <p className="text-sm"><span className="text-[rgba(8,19,26,0.5)]">氏名：</span>{meta.partyA.name || <span className="text-[rgba(8,19,26,0.3)] italic">未入力</span>}</p>
                  {meta.partyA.birthDate && (
                    <p className="text-sm"><span className="text-[rgba(8,19,26,0.5)]">生年月日：</span>
                      {new Date(meta.partyA.birthDate).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" })}生
                    </p>
                  )}
                  {meta.partyA.address && <p className="text-sm"><span className="text-[rgba(8,19,26,0.5)]">住所：</span>{meta.partyA.address}</p>}
                </div>
                <div>
                  <p className="text-xs font-semibold text-[rgba(8,19,26,0.4)] uppercase mb-2">乙（第二当事者）</p>
                  <p className="text-sm"><span className="text-[rgba(8,19,26,0.5)]">氏名：</span>{meta.partyB.name || <span className="text-[rgba(8,19,26,0.3)] italic">未入力</span>}</p>
                  {meta.partyB.birthDate && (
                    <p className="text-sm"><span className="text-[rgba(8,19,26,0.5)]">生年月日：</span>
                      {new Date(meta.partyB.birthDate).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" })}生
                    </p>
                  )}
                  {meta.partyB.address && <p className="text-sm"><span className="text-[rgba(8,19,26,0.5)]">住所：</span>{meta.partyB.address}</p>}
                </div>
              </div>
            </div>

            {/* Intro text */}
            <p className="text-sm text-[rgba(8,19,26,0.8)] mb-8 leading-relaxed">
              {A}（以下「甲」という）と{B}（以下「乙」という）は、婚姻に際して以下のとおり契約を締結する。
            </p>

            {/* Chapters */}
            {includedChapters.map((chNum) => {
              const chapter = CHAPTERS.find((c) => c.number === chNum);
              const clauses = chapterClauses[chNum];
              return (
                <section
                  key={chNum}
                  id={`chapter-${chNum}`}
                  className="mb-8 scroll-mt-20"
                >
                  <div
                    className="rounded-xl px-4 py-3 mb-4 border-l-4 border-[#ff6b9d]"
                    style={{ background: chapter?.bgColor ?? "#fff0f5" }}
                  >
                    <h2 className="text-lg font-bold text-[#08131a]">
                      {chapter?.emoji} 第{chapterRenumber[chNum]}章　{chapter?.title}
                    </h2>
                  </div>
                  <div className="space-y-5">
                    {clauses.map((clause) => {
                      const text = clause.template(answers, clauseMeta);
                      const [titleLine, ...bodyLines] = text.split("\n");
                      const renumberedTitle = titleLine.replace(/第\d+条/, `第${articleRenumber[clause.id]}条`);
                      return (
                        <div key={clause.id} className="pl-4 border-l-2 border-[#ffd6e3]">
                          <p className="font-semibold text-sm text-[#08131a] mb-1">{renumberedTitle}</p>
                          <p className="text-sm text-[rgba(8,19,26,0.75)] leading-relaxed whitespace-pre-wrap">
                            {bodyLines.join("\n")}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}

            {/* Signature */}
            <div id="signature" className="mt-10 pt-6 border-t border-[rgba(8,19,26,0.1)] scroll-mt-20">
              <h2 className="text-base font-bold text-[#08131a] mb-6">署名</h2>
              <div className="space-y-6">
                <div className="flex items-end justify-between border-b border-[rgba(8,19,26,0.2)] pb-2">
                  <span className="text-sm">甲（{A}）</span>
                  <span className="text-sm text-[rgba(8,19,26,0.4)]">印</span>
                </div>
                <div className="flex items-end justify-between border-b border-[rgba(8,19,26,0.2)] pb-2">
                  <span className="text-sm">乙（{B}）</span>
                  <span className="text-sm text-[rgba(8,19,26,0.4)]">印</span>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-8 pt-6 border-t border-[rgba(8,19,26,0.06)]">
              <p className="text-xs text-[rgba(8,19,26,0.4)] leading-relaxed">
                本文書は婚前契約書のドラフトです。法的助言ではなく、効力を担保するものではありません。
                実際の運用にあたっては、弁護士へのご相談および公証役場での公正証書化をご検討ください。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Share / Download modals */}
      <ShareModal isOpen={shareOpen} onClose={() => setShareOpen(false)} />
      <DownloadModal isOpen={downloadOpen} onClose={() => setDownloadOpen(false)} />
    </div>
  );
}
