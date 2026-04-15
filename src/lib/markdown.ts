import type { ContractData } from "../types/contract";
import { CLAUSES } from "../data/clauses";

const DISCLAIMER = `---

> **免責事項**
> 本文書は婚前契約書のドラフトです。法的助言ではなく、効力を担保するものではありません。
> 実際の運用にあたっては、弁護士へのご相談および公証役場での公正証書化をご検討ください。`;

export function generateMarkdown(data: ContractData): string {
  const { meta, answers, includedClauses } = data;
  const A = meta.partyA.name || "甲";
  const B = meta.partyB.name || "乙";
  const dateStr = meta.date
    ? new Date(meta.date).toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "　　年　　月　　日";

  const lines: string[] = [];
  lines.push("# 婚前契約書\n");
  lines.push(`締結日：${dateStr}\n`);
  const fmtBirthDate = (d: string) =>
    d
      ? new Date(d).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" }) + "生"
      : "　　年　　月　　日生";

  const clauseMeta = {
    ...meta,
    partyA: { ...meta.partyA, name: "甲" },
    partyB: { ...meta.partyB, name: "乙" },
  };

  lines.push(`**甲（第一当事者）**`);
  lines.push(`氏名：${meta.partyA.name || "　　　　　"}`);
  lines.push(`生年月日：${fmtBirthDate(meta.partyA.birthDate)}`);
  lines.push(`住所：${meta.partyA.address || "　　　　　"}\n`);
  lines.push(`**乙（第二当事者）**`);
  lines.push(`氏名：${meta.partyB.name || "　　　　　"}`);
  lines.push(`生年月日：${fmtBirthDate(meta.partyB.birthDate)}`);
  lines.push(`住所：${meta.partyB.address || "　　　　　"}\n`);
  lines.push(
    `${A}（以下「甲」という）と${B}（以下「乙」という）は、婚姻に際して以下のとおり契約を締結する。\n`
  );

  const chapters: Record<number, { title: string; clauses: typeof CLAUSES }> = {};
  for (const clause of CLAUSES) {
    if (!includedClauses[clause.id]) continue;
    if (!chapters[clause.chapter]) {
      chapters[clause.chapter] = { title: "", clauses: [] };
    }
    chapters[clause.chapter].clauses.push(clause);
  }

  const chapterTitles: Record<number, string> = {
    1: "財産・経済",
    2: "家事・生活",
    3: "親族・家族",
    4: "子育て",
    5: "相互の尊重",
    6: "住宅・不動産",
    7: "その他",
  };

  let newChapterNum = 0;
  let newArticleNum = 0;
  for (const [chNum, { clauses }] of Object.entries(chapters)) {
    const chNumber = Number(chNum);
    newChapterNum++;
    lines.push(`\n## 第${newChapterNum}章　${chapterTitles[chNumber] || ""}\n`);
    for (const clause of clauses) {
      newArticleNum++;
      const text = clause.template(answers, clauseMeta)
        .replace(/^第\d+条/, `第${newArticleNum}条`);
      lines.push(text + "\n");
    }
  }

  lines.push("\n---\n");
  lines.push("## 署名\n");
  lines.push(`甲（${A}）　　　　　　　　　　　　　　　　　　　印\n`);
  lines.push(`乙（${B}）　　　　　　　　　　　　　　　　　　　印\n`);
  lines.push(DISCLAIMER);

  return lines.join("\n");
}

export function downloadMarkdown(data: ContractData): void {
  const md = generateMarkdown(data);
  const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const dateStr = data.meta.date.replace(/-/g, "");
  a.href = url;
  a.download = `婚前契約書_${dateStr}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
