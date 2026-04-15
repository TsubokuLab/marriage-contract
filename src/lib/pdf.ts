import type { ContractData } from "../types/contract";

export async function downloadPdf(data: ContractData): Promise<void> {
  const html2pdf = (await import("html2pdf.js")).default;
  const { CLAUSES } = await import("../data/clauses");

  const { meta, answers, includedClauses } = data;
  const A = meta.partyA.name || "甲";
  const B = meta.partyB.name || "乙";
  // 条文内は甲/乙表記に統一（名前はヘッダーの「（以下「甲」という）」で定義済み）
  const clauseMeta = { ...meta, partyA: { ...meta.partyA, name: "甲" }, partyB: { ...meta.partyB, name: "乙" } };

  // 空欄アンダーライン（手書き用）
  const blank = (w = "100px") =>
    `<span style="display:inline-block;min-width:${w};border-bottom:1px solid #555;">&nbsp;</span>`;

  // 生年月日のフォーマット
  const fmtBirthDate = (d: string) =>
    d
      ? new Date(d).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" }) + "生"
      : blank("120px");
  const dateStr = meta.date
    ? new Date(meta.date).toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "　　年　　月　　日";

  const chapterTitles: Record<number, string> = {
    1: "財産・経済",
    2: "家事・生活",
    3: "親族・家族",
    4: "子育て",
    5: "相互の尊重",
    6: "住宅・不動産",
    7: "その他",
  };

  const chapters: Record<number, typeof CLAUSES> = {};
  for (const clause of CLAUSES) {
    if (!includedClauses[clause.id]) continue;
    if (!chapters[clause.chapter]) chapters[clause.chapter] = [];
    chapters[clause.chapter].push(clause);
  }

  let clausesHtml = "";
  for (const [chNum, clauses] of Object.entries(chapters)) {
    const chNumber = Number(chNum);
    clausesHtml += `
      <div style="font-size:12pt;font-weight:700;border-left:4px solid #c45;padding:0 10px 16px 10px;margin:20px 0 10px;background:#fff5f7;line-height:1.5;box-sizing:border-box;">第${chNumber}章　${chapterTitles[chNumber] || ""}</div>`;
    for (const clause of clauses) {
      const text = clause.template(answers, clauseMeta);
      const lines = text.split("\n");
      const title = lines[0] || "";
      const body = lines.slice(1).join("\n");
      clausesHtml += `
        <div style="margin-bottom:12px;page-break-inside:avoid;">
          <p style="font-weight:700;font-size:9.5pt;margin:0 0 2px;">${title}</p>
          <p style="font-size:9.5pt;text-indent:1em;line-height:1.85;color:#222;margin:0;">${body.replace(/\n/g, "<br>")}</p>
        </div>`;
    }
  }

  // ★ margin:0 にして、要素内の padding で余白を作る方式
  //    → 要素は A4 幅 (210mm) ぴったり、padding で左右 20mm・上下 15mm の余白
  //    → html2pdf の margin は 0 のままなので縮小・クリップが発生しない
  const contentHtml = `
    <div style="
      width: 210mm;
      padding: 15mm 20mm;
      box-sizing: border-box;
      font-family: 'Hiragino Sans','Hiragino Kaku Gothic ProN','Yu Gothic',Meiryo,sans-serif;
      font-size: 9.5pt;
      line-height: 1.85;
      color: #111;
      background: #fff;
      word-break: break-all;
    ">
      <!-- タイトル -->
      <h1 style="font-size:19pt;font-weight:700;text-align:center;letter-spacing:0.15em;border-bottom:2px solid #222;padding-bottom:10px;margin:0 0 6px;">
        婚前契約書
      </h1>
      <p style="text-align:right;font-size:9pt;color:#555;margin:0 0 16px;">締結日：${dateStr}</p>

      <!-- 当事者情報 -->
      <div style="border:1px solid #bbb;border-radius:4px;padding:10px 12px;margin-bottom:16px;background:#fafafa;">
        <p style="font-weight:700;font-size:9pt;margin:0 0 3px;color:#333;">甲（第一当事者）</p>
        <p style="font-size:9pt;color:#333;margin:0 0 2px;">
          氏名：${meta.partyA.name || blank("120px")}&emsp;
          生年月日：${fmtBirthDate(meta.partyA.birthDate)}
        </p>
        <p style="font-size:9pt;color:#333;margin:0 0 8px;">住所：${meta.partyA.address || blank("240px")}</p>
        <p style="font-weight:700;font-size:9pt;margin:0 0 3px;color:#333;">乙（第二当事者）</p>
        <p style="font-size:9pt;color:#333;margin:0 0 2px;">
          氏名：${meta.partyB.name || blank("120px")}&emsp;
          生年月日：${fmtBirthDate(meta.partyB.birthDate)}
        </p>
        <p style="font-size:9pt;color:#333;margin:0;">住所：${meta.partyB.address || blank("240px")}</p>
      </div>

      <!-- 前文 -->
      <p style="font-size:9.5pt;margin:0 0 20px;line-height:1.9;">
        ${A}（以下「甲」という）と${B}（以下「乙」という）は、婚姻に際して以下のとおり契約を締結する。
      </p>

      <!-- 条文 -->
      ${clausesHtml}

      <!-- 署名欄 -->
      <div style="margin-top:32px;padding-top:14px;border-top:1px solid #aaa;page-break-inside:avoid;">
        <p style="font-weight:700;font-size:9.5pt;margin:0 0 14px;">以上の内容に合意し、本契約書に署名する。</p>
        <div style="display:flex;align-items:flex-end;margin-bottom:20px;gap:8px;">
          <span style="font-size:9.5pt;min-width:140px;">甲（${A}）</span>
          <div style="flex:1;border-bottom:1px solid #555;height:22px;"></div>
          <span style="font-size:9pt;color:#555;width:20px;">印</span>
        </div>
        <div style="display:flex;align-items:flex-end;margin-bottom:20px;gap:8px;">
          <span style="font-size:9.5pt;min-width:140px;">乙（${B}）</span>
          <div style="flex:1;border-bottom:1px solid #555;height:22px;"></div>
          <span style="font-size:9pt;color:#555;width:20px;">印</span>
        </div>
      </div>

      <!-- 免責事項 -->
      <div style="margin-top:20px;padding:8px 10px;border:1px solid #ddd;border-radius:3px;font-size:7.5pt;color:#777;line-height:1.7;background:#fafafa;">
        【免責事項】本文書は婚前契約書のドラフトです。法的助言ではなく、効力を担保するものではありません。
        実際の運用にあたっては、弁護士へのご相談および公証役場での公正証書化をご検討ください。
      </div>
    </div>`;

  const dateForFile = data.meta.date.replace(/-/g, "");

  const element = document.createElement("div");
  element.innerHTML = contentHtml;
  document.body.appendChild(element);

  const opt = {
    // ★ margin: 0 — 余白は要素の padding で管理。クリップ・縮小が発生しない。
    margin: 0,
    filename: `婚前契約書_${dateForFile}.pdf`,
    image: { type: "jpeg" as const, quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
    },
    jsPDF: {
      unit: "mm" as const,
      format: "a4",
      orientation: "portrait" as const,
    },
  };

  try {
    await html2pdf().set(opt).from(element).save();
  } finally {
    document.body.removeChild(element);
  }
}
