import type { Clause, Answer, ContractMeta } from "../types/contract";

// ヘルパー: 回答からテキストを取得
function getAnswer(answers: Record<string, Answer>, id: string): Answer | undefined {
  return answers[id];
}

function formatCustomText(text: string | undefined): string {
  if (!text) return "";
  let t = text.trim().replace(/\n{2,}/g, "\n");
  if (t && !t.endsWith("。") && !t.endsWith("．")) t += "。";
  return t;
}

export const CLAUSES: Clause[] = [
  // ===== 第1章 財産・経済 =====
  {
    id: "art-1",
    chapter: 1,
    articleNumber: 1,
    title: "婚前財産の帰属",
    category: "財産",
    required: false,
    hint: "結婚前からそれぞれが持っている財産（貯金・不動産・有価証券など）の扱いを明確にします。",
    questions: [
      {
        id: "q-premarital-asset",
        label: "結婚前からそれぞれが持っている財産（婚前財産）はどうしますか?",
        type: "single",
        allowCustom: true,
        customPlaceholder: "例：婚前財産のうち不動産は共有とし、それ以外は各自の固有財産とする。",
        customMaxLength: 300,
        hint: "婚前財産を明確にしておくと、万一の際の財産分与でトラブルを防げます。",
        choices: [
          { id: "own", label: "それぞれの固有財産とする（人気）", value: "own" },
          { id: "share", label: "婚姻後は共有財産とする", value: "share" },
          { id: "list", label: "別途リストアップして決める", value: "list" },
        ],
      },
    ],
    template: (answers: Record<string, Answer>, meta: ContractMeta) => {
      const a = getAnswer(answers, "q-premarital-asset");
      const A = meta.partyA.name || "甲";
      const B = meta.partyB.name || "乙";
      let text = "";
      if (a?.selectedId === "custom") {
        text = formatCustomText(a.customText);
      } else if (a?.selectedId === "own") {
        text = `婚姻前から${A}及び${B}がそれぞれ所有する財産（以下「婚前財産」という）は、各自の固有財産とし、婚姻後もその帰属は変わらないものとする。`;
      } else if (a?.selectedId === "share") {
        text = `婚姻前から${A}及び${B}がそれぞれ所有する財産（以下「婚前財産」という）は、婚姻と同時に両者の共有財産とする。`;
      } else if (a?.selectedId === "list") {
        text = `婚姻前から${A}及び${B}がそれぞれ所有する財産（以下「婚前財産」という）は、別途作成する財産目録に基づき、その帰属を定める。財産目録は本契約書に添付するものとする。`;
      } else {
        text = `婚姻前から${A}及び${B}がそれぞれ所有する財産（以下「婚前財産」という）は、各自の固有財産とし、婚姻後もその帰属は変わらないものとする。`;
      }
      return `第1条（婚前財産の帰属）\n${text}`;
    },
  },
  {
    id: "art-2",
    chapter: 1,
    articleNumber: 2,
    title: "生活費の負担",
    category: "財産",
    required: false,
    hint: "毎月の家賃・光熱費・食費などの生活費をどう分担するか決めます。",
    questions: [
      {
        id: "q-living-cost",
        label: "毎月の生活費はどう分担しますか?",
        type: "single",
        allowCustom: true,
        customPlaceholder: "例：収入比7:3で負担する。ただし一方の収入が著しく低下した場合は都度協議する。",
        customMaxLength: 300,
        hint: "収入差がある場合は「収入に応じて負担」がトラブルになりにくい傾向があります。",
        choices: [
          { id: "by-income", label: "収入に応じた割合で負担する（人気）", value: "by-income" },
          { id: "half", label: "半額ずつ負担する", value: "half" },
          { id: "one-side", label: "一方が全額負担する", value: "one-side" },
          { id: "joint-account", label: "共同口座を設けて負担する", value: "joint-account" },
        ],
      },
    ],
    template: (answers, meta) => {
      const a = getAnswer(answers, "q-living-cost");
      const A = meta.partyA.name || "甲";
      const B = meta.partyB.name || "乙";
      let text = "";
      if (a?.selectedId === "custom") {
        text = formatCustomText(a.customText);
      } else if (a?.selectedId === "by-income") {
        text = `${A}及び${B}の婚姻後の生活費（家賃・光熱費・食費・日用品費等）は、両者の収入比に応じた割合で分担するものとする。収入に変動が生じた場合は、両者が誠実に協議のうえ分担割合を見直すものとする。`;
      } else if (a?.selectedId === "half") {
        text = `${A}及び${B}の婚姻後の生活費（家賃・光熱費・食費・日用品費等）は、両者が折半して負担するものとする。`;
      } else if (a?.selectedId === "one-side") {
        text = `婚姻後の生活費（家賃・光熱費・食費・日用品費等）は、${A}が全額負担するものとする。ただし、状況の変化に応じて両者が協議のうえ見直すことができる。`;
      } else if (a?.selectedId === "joint-account") {
        text = `${A}及び${B}は婚姻後に共同口座を設け、両者が合意した額を毎月拠出し、生活費（家賃・光熱費・食費・日用品費等）はこの共同口座から支出するものとする。拠出割合は両者の収入状況に応じて協議のうえ定める。`;
      } else {
        text = `${A}及び${B}の婚姻後の生活費（家賃・光熱費・食費・日用品費等）は、両者の収入比に応じた割合で分担するものとする。`;
      }
      return `第2条（生活費の負担）\n${text}`;
    },
  },
  {
    id: "art-3",
    chapter: 1,
    articleNumber: 3,
    title: "個人事業・副業",
    category: "財産",
    required: false,
    hint: "どちらかが個人事業主・フリーランス・副業をしている場合の財産の扱いを明確にします。",
    questions: [
      {
        id: "q-side-business",
        label: "個人事業や副業はどちらかありますか?",
        type: "single",
        allowCustom: true,
        customPlaceholder: "例：甲の個人事業による収益は甲の固有財産とし、乙はその経営に関与しない。",
        customMaxLength: 300,
        hint: "個人事業の財産と共有財産を分けておくと、廃業時や離婚時にトラブルになりません。",
        choices: [
          { id: "own-asset", label: "事業による財産はそれぞれの固有財産とする", value: "own-asset" },
          { id: "share-profit", label: "事業利益の一部を共有財産に入れる", value: "share-profit" },
          { id: "not-applicable", label: "個人事業・副業はない", value: "not-applicable" },
        ],
      },
    ],
    template: (answers, meta) => {
      const a = getAnswer(answers, "q-side-business");
      const A = meta.partyA.name || "甲";
      const B = meta.partyB.name || "乙";
      let text = "";
      if (a?.selectedId === "custom") {
        text = formatCustomText(a.customText);
      } else if (a?.selectedId === "not-applicable") {
        text = `${A}及び${B}は、本契約締結時点において個人事業・副業を行っていないことを確認する。将来個人事業・副業を開始する場合は、その財産の帰属について両者が事前に協議のうえ書面で定めるものとする。`;
      } else if (a?.selectedId === "own-asset") {
        text = `${A}及び${B}がそれぞれ行う個人事業・副業に関する財産（収益・設備・権利等）は、各自の固有財産とする。`;
      } else if (a?.selectedId === "share-profit") {
        text = `${A}及び${B}がそれぞれ行う個人事業・副業による利益のうち、両者が別途合意した割合を共有財産に算入するものとする。割合は毎年4月に両者が協議のうえ定める。`;
      } else {
        text = `${A}及び${B}がそれぞれ行う個人事業・副業に関する財産（収益・設備・権利等）は、各自の固有財産とする。`;
      }
      return `第3条（個人事業・副業）\n${text}`;
    },
  },
  {
    id: "art-4",
    chapter: 1,
    articleNumber: 4,
    title: "会社株式・起業",
    category: "財産",
    required: false,
    hint: "どちらかが会社を経営・起業する場合の株式や持分の扱いを決めます。",
    questions: [
      {
        id: "q-company-stock",
        label: "会社の株式や持分はどう扱いますか?",
        type: "single",
        allowCustom: true,
        customPlaceholder: "例：甲が設立した会社の株式は甲の固有財産とし、乙の同意なく処分できる。",
        customMaxLength: 300,
        hint: "会社経営者や起業予定の方は、事業用財産と個人財産を明確に分けておくことが重要です。",
        choices: [
          { id: "own-stock", label: "株式・持分はそれぞれの固有財産とする", value: "own-stock" },
          { id: "not-applicable", label: "会社経営・起業の予定はない", value: "not-applicable" },
        ],
      },
    ],
    template: (answers, meta) => {
      const a = getAnswer(answers, "q-company-stock");
      const A = meta.partyA.name || "甲";
      const B = meta.partyB.name || "乙";
      let text = "";
      if (a?.selectedId === "custom") {
        text = formatCustomText(a.customText);
      } else if (a?.selectedId === "not-applicable") {
        text = `${A}及び${B}は、本契約締結時点において会社経営・起業の予定がないことを確認する。将来起業・経営に参画する場合は、株式・持分の帰属について両者が事前に協議のうえ書面で定めるものとする。`;
      } else {
        text = `${A}及び${B}がそれぞれ保有・取得する会社の株式・持分（婚姻前・婚姻後を問わず）は、各自の固有財産とする。ただし、婚姻後に両者が共同出資した会社の株式・持分はその出資割合に応じた共有財産とする。`;
      }
      return `第4条（会社株式・起業）\n${text}`;
    },
  },
  {
    id: "art-5",
    chapter: 1,
    articleNumber: 5,
    title: "投資資産",
    category: "財産",
    required: false,
    hint: "株式・投資信託・FX・暗号資産など、投資で増減する財産の扱いを決めます。",
    questions: [
      {
        id: "q-investment",
        label: "投資資産（株・投資信託・不動産投資など）はどう扱いますか?",
        type: "single",
        allowCustom: true,
        customPlaceholder: "例：婚姻後に購入した投資信託は共有財産とし、売却には両者の合意を要する。",
        customMaxLength: 300,
        hint: "投資の利益・損失をどちらが負担するか事前に決めておくとスムーズです。",
        choices: [
          { id: "own-invest", label: "各自の投資資産はそれぞれの固有財産とする", value: "own-invest" },
          { id: "share-invest", label: "婚姻後の投資資産は共有財産とする", value: "share-invest" },
          { id: "not-applicable", label: "投資はしていない", value: "not-applicable" },
        ],
      },
    ],
    template: (answers, meta) => {
      const a = getAnswer(answers, "q-investment");
      const A = meta.partyA.name || "甲";
      const B = meta.partyB.name || "乙";
      let text = "";
      if (a?.selectedId === "custom") {
        text = formatCustomText(a.customText);
      } else if (a?.selectedId === "own-invest") {
        text = `${A}及び${B}がそれぞれ行う有価証券・投資信託・不動産投資・暗号資産等の投資に関する財産は、各自の固有財産とし、その損益は各自が負担するものとする。`;
      } else if (a?.selectedId === "share-invest") {
        text = `婚姻後に${A}及び${B}が取得する有価証券・投資信託・不動産投資・暗号資産等の投資に関する財産は、両者の共有財産とし、その損益は等分に帰属するものとする。`;
      } else {
        text = `${A}及び${B}は、本契約締結時点において投資を行っていないことを確認する。将来投資を開始する場合は、その資産の帰属について両者が事前に協議のうえ書面で定めるものとする。`;
      }
      return `第5条（投資資産）\n${text}`;
    },
  },
  {
    id: "art-6",
    chapter: 1,
    articleNumber: 6,
    title: "個人債務",
    category: "財産",
    required: false,
    hint: "婚姻前から抱えているローン・奨学金・カードローンなどの負債の扱いを明確にします。",
    questions: [
      {
        id: "q-personal-debt",
        label: "婚姻前からある個人の借金・ローンはどうしますか?",
        type: "single",
        allowCustom: true,
        customPlaceholder: "例：甲の婚前の奨学金残高については、甲が返済義務を負い、乙は一切の責任を負わない。",
        customMaxLength: 300,
        hint: "婚前の借金は原則として個人の債務ですが、明記しておくと安心です。",
        choices: [
          { id: "own-debt", label: "それぞれの婚前の債務は各自が責任を持つ（人気）", value: "own-debt" },
          { id: "share-debt", label: "婚姻後は共同で返済する", value: "share-debt" },
          { id: "not-applicable", label: "個人の借金・ローンはない", value: "not-applicable" },
        ],
      },
    ],
    template: (answers, meta) => {
      const a = getAnswer(answers, "q-personal-debt");
      const A = meta.partyA.name || "甲";
      const B = meta.partyB.name || "乙";
      let text = "";
      if (a?.selectedId === "custom") {
        text = formatCustomText(a.customText);
      } else if (a?.selectedId === "own-debt") {
        text = `婚姻前から${A}及び${B}がそれぞれ負担する債務（奨学金・ローン・クレジットカード債務等）は、各自が返済義務を負い、他方はその返済について何ら責任を負わないものとする。`;
      } else if (a?.selectedId === "share-debt") {
        text = `婚姻前から${A}及び${B}がそれぞれ負担する債務（奨学金・ローン・クレジットカード債務等）は、婚姻後は両者が協力して返済するものとする。返済計画は両者が別途協議のうえ定める。`;
      } else {
        text = `${A}及び${B}は、本契約締結時点において個人の借金・ローンが存在しないことを相互に確認する。将来、一方が個人的に債務を負う場合は、その返済は当該当事者が単独で負担するものとする。`;
      }
      return `第6条（個人債務）\n${text}`;
    },
  },
  {
    id: "art-7",
    chapter: 1,
    articleNumber: 7,
    title: "専業期間中の財産",
    category: "財産",
    required: false,
    hint: "育児・介護・病気などで一方が専業になった場合の財産の扱いを決めます。",
    questions: [
      {
        id: "q-homemaker-period",
        label: "どちらかが専業（主夫・主婦）になった場合の財産はどうしますか?",
        type: "single",
        allowCustom: true,
        customPlaceholder: "例：専業期間中も就業側の収入の30%を専業側の固有財産として積み立てる。",
        customMaxLength: 300,
        hint: "専業期間中の財産形成が不公平にならないよう、事前に取り決めておくと安心です。",
        choices: [
          { id: "share-all", label: "専業期間中も収入は共有財産とする（人気）", value: "share-all" },
          { id: "allowance", label: "専業側に生活費・小遣いを支給する", value: "allowance" },
          { id: "separate", label: "就業側の収入は就業側の固有財産とする", value: "separate" },
        ],
      },
    ],
    template: (answers, meta) => {
      const a = getAnswer(answers, "q-homemaker-period");
      const A = meta.partyA.name || "甲";
      const B = meta.partyB.name || "乙";
      let text = "";
      if (a?.selectedId === "custom") {
        text = formatCustomText(a.customText);
      } else if (a?.selectedId === "share-all") {
        text = `育児・介護・傷病等の事情により${A}又は${B}の一方が専業となった期間中も、就業側の収入は両者の共有財産とするものとする。専業側は家事・育児・介護への貢献により共有財産形成に寄与したものとみなす。`;
      } else if (a?.selectedId === "allowance") {
        text = `育児・介護・傷病等の事情により${A}又は${B}の一方が専業となった期間中、就業側は専業側に毎月生活費及び小遣いを支給するものとする。金額は両者が協議のうえ定め、定期的に見直しを行う。`;
      } else {
        text = `育児・介護・傷病等の事情により${A}又は${B}の一方が専業となった期間中、就業側の収入は就業側の固有財産とする。ただし、専業側の生活に必要な費用は就業側が全額負担するものとする。`;
      }
      return `第7条（専業期間中の財産）\n${text}`;
    },
  },
  {
    id: "art-8",
    chapter: 1,
    articleNumber: 8,
    title: "財産分与の基本方針",
    category: "財産",
    required: false,
    hint: "万一離婚となった場合に、婚姻後に形成した共有財産をどう分けるかを決めます。",
    questions: [
      {
        id: "q-property-division",
        label: "万一離婚した際の財産分与はどうしますか?",
        type: "single",
        allowCustom: true,
        customPlaceholder: "例：婚姻期間中に形成した財産は、各自の就業期間・貢献度を考慮した割合で分与する。",
        customMaxLength: 300,
        hint: "財産分与は離婚時に重要な問題です。事前に方針を決めておくと紛争を防げます。",
        choices: [
          { id: "equal", label: "婚姻後の共有財産は折半する（人気）", value: "equal" },
          { id: "contribution", label: "貢献度・収入比に応じて分ける", value: "contribution" },
          { id: "negotiate", label: "その時点で誠実に協議する", value: "negotiate" },
        ],
      },
    ],
    template: (answers, meta) => {
      const a = getAnswer(answers, "q-property-division");
      const A = meta.partyA.name || "甲";
      const B = meta.partyB.name || "乙";
      let text = "";
      if (a?.selectedId === "custom") {
        text = formatCustomText(a.customText);
      } else if (a?.selectedId === "equal") {
        text = `婚姻後に${A}及び${B}が共同で形成した財産（共有財産）は、離婚の際に等分に分与するものとする。ただし、婚前財産及び第三者から贈与・相続を受けた財産は固有財産として分与の対象外とする。`;
      } else if (a?.selectedId === "contribution") {
        text = `婚姻後に${A}及び${B}が共同で形成した財産（共有財産）は、離婚の際に各自の収入への貢献度・家事育児等への寄与度を総合的に考慮した割合で分与するものとする。具体的な割合は、離婚協議の際に両者が誠実に協議のうえ定める。`;
      } else {
        text = `婚姻後に${A}及び${B}が共同で形成した財産（共有財産）は、離婚の際に両者が誠実に協議のうえ分与するものとする。協議に際しては、各自の収入への貢献度・家事育児等への寄与度・婚姻期間等を考慮するものとする。`;
      }
      return `第8条（財産分与の基本方針）\n${text}`;
    },
  },

  // ===== 第2章 家事・生活 =====
  {
    id: "art-9",
    chapter: 2,
    articleNumber: 9,
    title: "家事の分担",
    category: "家事",
    required: false,
    hint: "掃除・洗濯・料理・買い物など、日々の家事をどう分けるかを決めます。",
    questions: [
      {
        id: "q-housework",
        label: "家事の分担はどうしますか?",
        type: "single",
        allowCustom: true,
        customPlaceholder: "例：料理は甲、掃除・洗濯は乙が主に担当し、買い物は二人で行う。",
        customMaxLength: 300,
        hint: "家事分担を明確にしておくと、生活が始まってからの不満が軽減されます。",
        choices: [
          { id: "equal-housework", label: "等分に分担する（人気）", value: "equal-housework" },
          { id: "role-based", label: "得意分野・役割分担に応じて決める", value: "role-based" },
          { id: "one-side", label: "一方が主に担当する", value: "one-side" },
          { id: "outsource", label: "家事代行サービスを活用する", value: "outsource" },
        ],
      },
    ],
    template: (answers, meta) => {
      const a = getAnswer(answers, "q-housework");
      const A = meta.partyA.name || "甲";
      const B = meta.partyB.name || "乙";
      let text = "";
      if (a?.selectedId === "custom") {
        text = formatCustomText(a.customText);
      } else if (a?.selectedId === "equal-housework") {
        text = `${A}及び${B}は、料理・掃除・洗濯・買い物等の日常的な家事を等分に分担するものとする。具体的な役割分担は両者が協議のうえ定め、生活状況の変化に応じて定期的に見直しを行う。`;
      } else if (a?.selectedId === "role-based") {
        text = `${A}及び${B}は、それぞれの得意分野・勤務状況・体調等を考慮し、日常的な家事を役割分担して行うものとする。役割分担の内容は両者が別途協議のうえ定め、定期的に見直しを行う。`;
      } else if (a?.selectedId === "one-side") {
        text = `日常的な家事（料理・掃除・洗濯・買い物等）は主として${A}が担当するものとする。${B}は${A}の家事労働に対して感謝と敬意を持って接し、可能な範囲で補助するものとする。`;
      } else {
        text = `${A}及び${B}は、家事代行サービスを積極的に活用し、日常的な家事（料理・掃除・洗濯等）の一部を外注するものとする。費用は生活費として共同で負担する。`;
      }
      return `第9条（家事の分担）\n${text}`;
    },
  },
  {
    id: "art-10",
    chapter: 2,
    articleNumber: 10,
    title: "キャリア・就労の相互支援",
    category: "家事",
    required: false,
    hint: "お互いのキャリアアップや転職・独立を応援し合う姿勢を明確にします。",
    questions: [
      {
        id: "q-career-support",
        label: "お互いのキャリアや仕事についてどのような姿勢で臨みますか?",
        type: "single",
        allowCustom: true,
        customPlaceholder: "例：転勤や海外赴任が生じた場合は、二人で話し合ったうえで同行・単身赴任・転職等の選択肢を検討する。",
        customMaxLength: 300,
        hint: "キャリアに関する考え方をすり合わせておくと、将来の転職・転勤時に意見の食い違いが防げます。",
        choices: [
          { id: "mutual-support", label: "お互いのキャリアを最大限尊重・支援し合う（人気）", value: "mutual-support" },
          { id: "discuss-case-by-case", label: "大きな変化は都度二人で話し合って決める", value: "discuss-case-by-case" },
        ],
      },
    ],
    template: (answers, meta) => {
      const a = getAnswer(answers, "q-career-support");
      const A = meta.partyA.name || "甲";
      const B = meta.partyB.name || "乙";
      let text = "";
      if (a?.selectedId === "custom") {
        text = formatCustomText(a.customText);
      } else if (a?.selectedId === "discuss-case-by-case") {
        text = `${A}及び${B}は、転職・転勤・留学・独立等の大きなキャリアの変化が生じる場合、事前に十分な時間をかけて二人で話し合い、互いが納得できる方向性を決定するものとする。`;
      } else {
        text = `${A}及び${B}は、互いのキャリアアップ・転職・独立・留学・学び直し等の意思を最大限尊重し、積極的に支援し合うものとする。一方のキャリアを理由に他方のキャリアを不当に制限・妨害しないものとする。`;
      }
      return `第10条（キャリア・就労の相互支援）\n${text}`;
    },
  },
  {
    id: "art-11",
    chapter: 2,
    articleNumber: 11,
    title: "氏（姓）の選択",
    category: "家事",
    required: false,
    hint: "結婚後の苗字についての考え方を記録します。",
    questions: [
      {
        id: "q-surname",
        label: "結婚後の氏（苗字）はどうしますか?",
        type: "single",
        allowCustom: true,
        customPlaceholder: "例：仕事上は旧姓を継続使用し、法律上は乙の姓に変更する。",
        customMaxLength: 200,
        hint: "日本では現在、夫婦同姓が法律上の原則ですが、旧姓使用・通称使用なども可能です。",
        choices: [
          { id: "party-a", label: "{{partyA}}さんの姓に統一する", value: "party-a" },
          { id: "party-b", label: "{{partyB}}さんの姓に統一する", value: "party-b" },
          { id: "keep-both-work", label: "法律上は同姓、仕事では旧姓を使用する", value: "keep-both-work" },
          { id: "discuss", label: "両者で引き続き話し合って決める", value: "discuss" },
        ],
      },
    ],
    template: (answers, meta) => {
      const a = getAnswer(answers, "q-surname");
      const A = meta.partyA.name || "甲";
      const B = meta.partyB.name || "乙";
      let text = "";
      if (a?.selectedId === "custom") {
        text = formatCustomText(a.customText);
      } else if (a?.selectedId === "party-a") {
        text = `婚姻後の氏は${A}の氏を称するものとする。`;
      } else if (a?.selectedId === "party-b") {
        text = `婚姻後の氏は${B}の氏を称するものとする。`;
      } else if (a?.selectedId === "keep-both-work") {
        text = `法律上の婚姻届には一方の氏を使用し、他方は職場等において旧姓（通称名）を引き続き使用することができるものとする。旧姓使用にかかる手続き等は両者が協力して行う。`;
      } else {
        text = `婚姻後の氏については、両者がさらに話し合い、合意のうえで婚姻届を提出する際に決定するものとする。`;
      }
      return `第11条（氏の選択）\n${text}`;
    },
  },

  // ===== 第3章 親族・家族 =====
  {
    id: "art-12",
    chapter: 3,
    articleNumber: 12,
    title: "親の介護",
    category: "親族",
    required: false,
    hint: "将来、両親の介護が必要になった場合の対応方針を決めます。",
    questions: [
      {
        id: "q-parent-care",
        label: "両親の介護が必要になった場合はどうしますか?",
        type: "single",
        allowCustom: true,
        customPlaceholder: "例：各自の親の介護は各自が主に担当し、配偶者は精神的・経済的にサポートする。",
        customMaxLength: 300,
        hint: "介護問題は予測が難しく、柔軟な対応が重要です。方針だけでも決めておきましょう。",
        choices: [
          { id: "own-parents", label: "それぞれの親はそれぞれが主担当、パートナーがサポートする（人気）", value: "own-parents" },
          { id: "together", label: "二人で協力して双方の親を支える", value: "together" },
          { id: "professional", label: "介護サービス・施設を積極的に利用する", value: "professional" },
          { id: "discuss", label: "必要になった時点で話し合って決める", value: "discuss" },
        ],
      },
    ],
    template: (answers, meta) => {
      const a = getAnswer(answers, "q-parent-care");
      const A = meta.partyA.name || "甲";
      const B = meta.partyB.name || "乙";
      let text = "";
      if (a?.selectedId === "custom") {
        text = formatCustomText(a.customText);
      } else if (a?.selectedId === "own-parents") {
        text = `${A}の親の介護については${A}が主担当とし、${B}が精神的・実務的にサポートする。同様に、${B}の親の介護については${B}が主担当とし、${A}がサポートするものとする。介護にかかる費用は、基本的に各自の親の介護費用は各自が負担する。ただし、家計に余裕がある場合は共同で費用を分担するよう誠実に協議する。`;
      } else if (a?.selectedId === "together") {
        text = `${A}及び${B}は、双方の親に介護が必要となった場合、互いに協力して介護に当たるものとする。介護にかかる費用・時間・負担は両者が誠実に協議のうえ分担する。`;
      } else if (a?.selectedId === "professional") {
        text = `${A}及び${B}は、双方の親に介護が必要となった場合、介護サービス・介護施設等の専門的サービスを積極的に活用するものとする。費用については両者が協議のうえ分担し、在宅介護と施設介護のバランスを双方の状況に応じて検討する。`;
      } else {
        text = `${A}及び${B}は、双方の親に介護が必要となった場合、その時点での家族の状況・健康状態・経済状況等を考慮し、両者が誠実に協議のうえ方針を決定するものとする。`;
      }
      return `第12条（親の介護）\n${text}`;
    },
  },
  {
    id: "art-13",
    chapter: 3,
    articleNumber: 13,
    title: "親族との関係",
    category: "親族",
    required: false,
    hint: "お互いの親族とどのように付き合うかの基本方針を決めます。",
    questions: [
      {
        id: "q-family-relation",
        label: "お互いの親族（両親・兄弟姉妹等）との付き合いについてどう考えますか?",
        type: "single",
        allowCustom: true,
        customPlaceholder: "例：親族の冠婚葬祭には可能な限り参加し、帰省は年に少なくとも1回は行う。",
        customMaxLength: 300,
        hint: "親族との付き合い方は価値観の違いが出やすい分野です。基本方針を決めておきましょう。",
        choices: [
          { id: "respect-both", label: "お互いの親族を尊重し、関係を大切にする（人気）", value: "respect-both" },
          { id: "independent", label: "それぞれが自分の親族と主体的に関わる", value: "independent" },
          { id: "discuss", label: "具体的な付き合い方は都度話し合う", value: "discuss" },
        ],
      },
    ],
    template: (answers, meta) => {
      const a = getAnswer(answers, "q-family-relation");
      const A = meta.partyA.name || "甲";
      const B = meta.partyB.name || "乙";
      let text = "";
      if (a?.selectedId === "custom") {
        text = formatCustomText(a.customText);
      } else if (a?.selectedId === "respect-both") {
        text = `${A}及び${B}は、互いの親族（両親・兄弟姉妹・祖父母等）を敬い、良好な関係を維持するよう誠実に努めるものとする。冠婚葬祭・帰省・行事参加等については、両者が相互の負担を考慮しながら誠実に協議して決定する。`;
      } else if (a?.selectedId === "independent") {
        text = `${A}は${A}の親族と、${B}は${B}の親族と、それぞれが主体的な関係を築くものとする。他方の親族との付き合いは強制せず、両者の意思を尊重する。`;
      } else {
        text = `${A}及び${B}の親族との具体的な付き合い方については、個別の事情に応じて両者が誠実に協議のうえ決定するものとする。一方が他方の親族との付き合いを不当に制限しないものとする。`;
      }
      return `第13条（親族との関係）\n${text}`;
    },
  },

  // ===== 第4章 子育て =====
  {
    id: "art-14",
    chapter: 4,
    articleNumber: 14,
    title: "子供を持つことについての考え方",
    category: "子育て",
    required: false,
    hint: "子供を持つかどうか、持つ場合の基本的な考え方を確認します。",
    questions: [
      {
        id: "q-having-children",
        label: "子供を持つことについてどのようにお考えですか?",
        type: "single",
        allowCustom: true,
        customPlaceholder: "例：子供は授かりものと考え、自然な経過に任せる。不妊治療は二人で話し合ったうえで検討する。",
        customMaxLength: 300,
        hint: "子供を持つ・持たないはとてもデリケートな問題です。正直に気持ちを共有することが大切です。",
        choices: [
          { id: "want-children", label: "子供を持つことを希望している", value: "want-children" },
          { id: "discuss-later", label: "将来的に話し合って決める", value: "discuss-later" },
          { id: "no-children", label: "子供を持たない選択をしている（チャイルドフリー）", value: "no-children" },
        ],
      },
    ],
    template: (answers, meta) => {
      const a = getAnswer(answers, "q-having-children");
      const A = meta.partyA.name || "甲";
      const B = meta.partyB.name || "乙";
      let text = "";
      if (a?.selectedId === "custom") {
        text = formatCustomText(a.customText);
      } else if (a?.selectedId === "want-children") {
        text = `${A}及び${B}は、婚姻後に子供を持つことを希望し、互いに協力し合いながら子育てに臨む意思を確認する。子供の人数・時期については、健康状態・経済状況・生活環境等を考慮し、両者が誠実に協議のうえ決定するものとする。`;
      } else if (a?.selectedId === "no-children") {
        text = `${A}及び${B}は、子供を持たない生き方（チャイルドフリー）を選択することを互いに確認し、尊重するものとする。この選択は両者の合意のうえでのものであり、外部からの圧力によって変更を強いられることなく尊重される。`;
      } else {
        text = `${A}及び${B}は、子供を持つかどうかについて、結婚後も継続的に二人で話し合い、互いの気持ちと状況を尊重しながら決定するものとする。一方が他方に対して子供を持つこと・持たないことを強制しないものとする。`;
      }
      return `第14条（子供を持つことについての考え方）\n${text}`;
    },
  },
  {
    id: "art-15",
    chapter: 4,
    articleNumber: 15,
    title: "育児の分担",
    category: "子育て",
    required: false,
    hint: "子供が生まれた場合の育児（授乳以外）・保育園送迎・学校行事等の分担を決めます。",
    questions: [
      {
        id: "q-childcare",
        label: "子供の育児はどう分担しますか?",
        type: "single",
        allowCustom: true,
        customPlaceholder: "例：平日の保育園送りは甲、迎えは乙、週末の育児は折半する。",
        customMaxLength: 300,
        hint: "育児分担を事前に決めておくと、産後の育児疲れによる関係悪化を防げます。",
        choices: [
          { id: "equal-childcare", label: "二人で等分に分担する（人気）", value: "equal-childcare" },
          { id: "role-based", label: "得意分野や時間帯で役割分担する", value: "role-based" },
          { id: "discuss", label: "生まれてから話し合って決める", value: "discuss" },
        ],
      },
    ],
    template: (answers, meta) => {
      const a = getAnswer(answers, "q-childcare");
      const A = meta.partyA.name || "甲";
      const B = meta.partyB.name || "乙";
      let text = "";
      if (a?.selectedId === "custom") {
        text = formatCustomText(a.customText);
      } else if (a?.selectedId === "equal-childcare") {
        text = `${A}及び${B}は、子供の育児（授乳を除く身体的ケア・保育園送迎・学校行事参加・病院受診・夜間対応等）を等分に分担するものとする。育休の取得は両者が可能な限り取得するよう努め、復職後も育児分担を継続する。`;
      } else if (a?.selectedId === "role-based") {
        text = `${A}及び${B}は、それぞれの得意分野・勤務時間帯・体力等を考慮し、子供の育児を役割分担して行うものとする。具体的な役割分担は子供の誕生後に両者が協議のうえ決定し、成長段階に応じて定期的に見直しを行う。`;
      } else {
        text = `${A}及び${B}は、子供が生まれた際に育児の分担について誠実に協議するものとする。協議に際しては、両者が均等に育児に参加できるよう努め、一方に育児負担が偏らないよう配慮するものとする。`;
      }
      return `第15条（育児の分担）\n${text}`;
    },
  },
  {
    id: "art-16",
    chapter: 4,
    articleNumber: 16,
    title: "教育方針",
    category: "子育て",
    required: false,
    hint: "子供の教育（学校選択・習い事・教育費等）についての基本方針を決めます。",
    questions: [
      {
        id: "q-education",
        label: "子供の教育方針についてどのようにお考えですか?",
        type: "single",
        allowCustom: true,
        customPlaceholder: "例：公教育を基本としつつ、子供の希望に応じて習い事・塾を検討する。教育費は優先的に共有財産から支出する。",
        customMaxLength: 300,
        hint: "教育方針は価値観の違いが出やすい分野です。大枠の方向性だけでも揃えておきましょう。",
        choices: [
          { id: "child-first", label: "子供の意思・個性を最優先に考える（人気）", value: "child-first" },
          { id: "discuss", label: "その都度二人で話し合って決める", value: "discuss" },
          { id: "public", label: "公教育を基本とし、習い事は子供の希望に応じて検討", value: "public" },
        ],
      },
    ],
    template: (answers, meta) => {
      const a = getAnswer(answers, "q-education");
      const A = meta.partyA.name || "甲";
      const B = meta.partyB.name || "乙";
      let text = "";
      if (a?.selectedId === "custom") {
        text = formatCustomText(a.customText);
      } else if (a?.selectedId === "child-first") {
        text = `${A}及び${B}は、子供の教育について子供の意思・個性・才能を最優先に考えるものとする。学校・習い事・進路等の重要な選択については、子供の年齢に応じた意思を尊重しながら、両者が協議のうえ決定する。教育費は家計の状況を考慮しつつ、子供の可能性を広げるために優先的に充当するものとする。`;
      } else if (a?.selectedId === "public") {
        text = `${A}及び${B}は、子供の教育は公教育を基本とし、子供の希望・適性に応じて習い事・塾・私立学校等を検討するものとする。教育費の負担については両者が協議のうえ定める。`;
      } else {
        text = `${A}及び${B}は、子供の教育方針（学校選択・習い事・進路等）について、その都度両者が誠実に協議のうえ決定するものとする。協議においては子供の意思・個性を尊重するものとする。`;
      }
      return `第16条（教育方針）\n${text}`;
    },
  },
  {
    id: "art-17",
    chapter: 4,
    articleNumber: 17,
    title: "親権・監護権・養育費（万一の場合）",
    category: "子育て",
    required: false,
    hint: "万一離婚となった場合の子供の親権・監護権・養育費についての基本方針です。",
    questions: [
      {
        id: "q-custody",
        label: "万一離婚した際の子供の親権・養育費についての基本方針はどうしますか?",
        type: "single",
        allowCustom: true,
        customPlaceholder: "例：離婚の際は親権者を定め、非親権者は子供と月1回以上の面会交流を行い、養育費は収入に応じた額を支払う。",
        customMaxLength: 300,
        hint: "法律的には親権・養育費は離婚時に改めて決めますが、基本方針を持っておくと平和的解決につながります。",
        choices: [
          { id: "negotiate", label: "子供の最善の利益を最優先に誠実に話し合う（人気）", value: "negotiate" },
          { id: "joint", label: "共同親権を基本に、養育費は収入に応じて決める", value: "joint" },
        ],
      },
    ],
    template: (answers, meta) => {
      const a = getAnswer(answers, "q-custody");
      const A = meta.partyA.name || "甲";
      const B = meta.partyB.name || "乙";
      let text = "";
      if (a?.selectedId === "custom") {
        text = formatCustomText(a.customText);
      } else if (a?.selectedId === "joint") {
        text = `${A}及び${B}は、万一離婚する場合、子供の親権については可能な限り共同での行使を検討し、監護権・面会交流については子供との関係継続を最優先に協議するものとする。養育費は、負担する側の収入・子供の生活水準・双方の資力等を考慮して誠実に協議のうえ決定する。`;
      } else {
        text = `${A}及び${B}は、万一離婚する場合、子供の親権・監護権・面会交流・養育費等の取り決めについて、子供の最善の利益を最優先事項として誠実に協議するものとする。協議が整わない場合は、調停・裁判等の法的手続きによる解決を検討する。`;
      }
      return `第17条（親権・監護権・養育費）\n${text}`;
    },
  },

  // ===== 第5章 相互の尊重 =====
  {
    id: "art-18",
    chapter: 5,
    articleNumber: 18,
    title: "個人の自由の尊重",
    category: "尊重",
    required: false,
    hint: "趣味・友人関係・プライバシーなど、お互いの個人としての自由を守ります。",
    questions: [
      {
        id: "q-personal-freedom",
        label: "お互いの個人の自由（趣味・友人・プライバシー等）についてどのようにお考えですか?",
        type: "single",
        allowCustom: true,
        customPlaceholder: "例：月に1回は各自が自由に使える「ひとり時間」を確保する。",
        customMaxLength: 200,
        hint: "パートナーを尊重しながら自分自身も大切にする。それが長続きする関係の秘訣です。",
        choices: [
          { id: "respect-freedom", label: "お互いの個人的な趣味・友人関係を尊重し合う（人気）", value: "respect-freedom" },
          { id: "discuss", label: "都度話し合いながら調整する", value: "discuss" },
        ],
      },
    ],
    template: (answers, meta) => {
      const a = getAnswer(answers, "q-personal-freedom");
      const A = meta.partyA.name || "甲";
      const B = meta.partyB.name || "乙";
      let text = "";
      if (a?.selectedId === "custom") {
        text = formatCustomText(a.customText);
      } else {
        text = `${A}及び${B}は、婚姻後もそれぞれが一個人として尊重されることを確認し、互いの趣味・友人関係・プライベートな時間を尊重するものとする。一方が他方の行動を不当に制限・監視・干渉しないものとする。`;
      }
      return `第18条（個人の自由の尊重）\n${text}`;
    },
  },
  {
    id: "art-19",
    chapter: 5,
    articleNumber: 19,
    title: "暴力・ハラスメントの禁止",
    category: "尊重",
    required: true,
    hint: "身体的・精神的・経済的なあらゆる暴力・ハラスメントを禁止する条項です。必須条項のため、スキップできません。",
    questions: [],
    template: (_answers, meta) => {
      const A = meta.partyA.name || "甲";
      const B = meta.partyB.name || "乙";
      return `第19条（暴力・ハラスメントの禁止）\n${A}及び${B}は、身体的暴力・精神的暴力（モラルハラスメントを含む）・経済的暴力・性的暴力等、あらゆる形態のDV（ドメスティックバイオレンス）及びハラスメント行為を行わないことを誓約する。この条項はいかなる事情があっても変更・削除することができない必須条項とする。`;
    },
  },
  {
    id: "art-20",
    chapter: 5,
    articleNumber: 20,
    title: "不貞行為",
    category: "尊重",
    required: false,
    hint: "浮気・不貞行為があった場合の取り決めです。",
    questions: [
      {
        id: "q-infidelity",
        label: "不貞行為（浮気・婚外恋愛等）に関してどのような取り決めをしますか?",
        type: "single",
        allowCustom: true,
        customPlaceholder: "例：不貞行為があった場合、相手方は慰謝料として100万円を支払う義務を負う。",
        customMaxLength: 300,
        hint: "慰謝料金額の記載は任意です。記載することで抑止力になる場合があります。",
        choices: [
          { id: "prohibit-standard", label: "不貞行為を禁止し、違反した場合は誠実に対処する", value: "prohibit-standard" },
          { id: "prohibit-penalty", label: "不貞行為を禁止し、慰謝料の支払いを定める", value: "prohibit-penalty" },
          { id: "open", label: "オープンな関係性を選択する（お互いの同意のうえで）", value: "open" },
        ],
      },
    ],
    template: (answers, meta) => {
      const a = getAnswer(answers, "q-infidelity");
      const A = meta.partyA.name || "甲";
      const B = meta.partyB.name || "乙";
      let text = "";
      if (a?.selectedId === "custom") {
        text = formatCustomText(a.customText);
      } else if (a?.selectedId === "prohibit-penalty") {
        text = `${A}及び${B}は、婚姻期間中に相手方以外の第三者と肉体関係（不貞行為）を結ばないことを誓約する。この誓約に違反した場合、違反した当事者は相手方に対して誠実に謝罪するとともに、協議のうえ定めた損害賠償を支払うものとする。`;
      } else if (a?.selectedId === "open") {
        text = `${A}及び${B}は、両者の完全な合意と相互尊重を前提として、婚外の関係を認めるオープンな関係性を選択する。ただし、この選択は常に両者の完全な合意のうえで成立し、一方が異議を申し出た場合は直ちに見直しを行うものとする。`;
      } else {
        text = `${A}及び${B}は、婚姻期間中に相手方以外の第三者と肉体関係（不貞行為）を結ばないことを誓約する。この誓約に違反した場合、両者は事態の深刻さを認識し、誠実に話し合い、関係の修復または法的解決を検討するものとする。`;
      }
      return `第20条（不貞行為）\n${text}`;
    },
  },
  {
    id: "art-21",
    chapter: 5,
    articleNumber: 21,
    title: "メンタルヘルスと相互サポート",
    category: "尊重",
    required: false,
    hint: "心身の健康についてお互いに気を配り、専門家への相談を妨げない取り決めです。",
    questions: [
      {
        id: "q-mental-health",
        label: "メンタルヘルス（心の健康）についてどのような姿勢でいますか?",
        type: "single",
        allowCustom: true,
        customPlaceholder: "例：精神的に辛い状況が続く場合は、二人で話し合ったうえでカウンセリングの利用を検討する。",
        customMaxLength: 200,
        hint: "心の健康を大切にすることが、長続きするパートナーシップの基盤です。",
        choices: [
          { id: "support-mental", label: "お互いの心身の健康を気にかけ、専門家への相談を勧め合う（人気）", value: "support-mental" },
          { id: "discuss", label: "必要が生じた際に話し合う", value: "discuss" },
        ],
      },
    ],
    template: (answers, meta) => {
      const a = getAnswer(answers, "q-mental-health");
      const A = meta.partyA.name || "甲";
      const B = meta.partyB.name || "乙";
      let text = "";
      if (a?.selectedId === "custom") {
        text = formatCustomText(a.customText);
      } else {
        text = `${A}及び${B}は、互いの心身の健康を気にかけ、精神的に辛い状態が続く場合は医師・カウンセラー等の専門家への相談を互いに勧め合うものとする。専門家への相談・受診を妨害せず、むしろ積極的に支援するものとする。`;
      }
      return `第21条（メンタルヘルスと相互サポート）\n${text}`;
    },
  },

  // ===== 第6章 住宅・不動産 =====
  {
    id: "art-22",
    chapter: 6,
    articleNumber: 22,
    title: "住宅の取得・持分",
    category: "住宅",
    required: false,
    hint: "婚姻後に自宅を購入する場合の持分割合を決めます。",
    questions: [
      {
        id: "q-housing",
        label: "自宅を購入する場合の持分はどうしますか?",
        type: "single",
        allowCustom: true,
        customPlaceholder: "例：頭金は甲が全額負担し、ローンは折半とする。持分は出資割合に応じて定める。",
        customMaxLength: 300,
        hint: "持分割合は出資割合に合わせるのが一般的です。将来の売却時に重要になります。",
        choices: [
          { id: "equal-share", label: "折半で共有する（人気）", value: "equal-share" },
          { id: "by-contribution", label: "出資・ローン負担割合に応じて持分を決める", value: "by-contribution" },
          { id: "one-side", label: "一方の単独所有とする", value: "one-side" },
          { id: "not-planning", label: "住宅購入の予定はない・賃貸でいく", value: "not-planning" },
        ],
      },
    ],
    template: (answers, meta) => {
      const a = getAnswer(answers, "q-housing");
      const A = meta.partyA.name || "甲";
      const B = meta.partyB.name || "乙";
      let text = "";
      if (a?.selectedId === "custom") {
        text = formatCustomText(a.customText);
      } else if (a?.selectedId === "equal-share") {
        text = `婚姻後に${A}及び${B}が共同で住宅を取得する場合、その持分は${A}と${B}が各2分の1ずつとするものとする。住宅ローンの負担も原則として折半とし、変更が生じる場合は両者が協議のうえ決定する。`;
      } else if (a?.selectedId === "by-contribution") {
        text = `婚姻後に${A}及び${B}が共同で住宅を取得する場合、その持分は頭金・住宅ローン等の出資割合に応じて定めるものとする。具体的な持分割合は取得時に両者が協議のうえ決定し、登記に反映させる。`;
      } else if (a?.selectedId === "one-side") {
        text = `婚姻後に取得する住宅は${A}の単独所有とする。ただし、他方の住居費用の負担・居住権については別途協議のうえ定めるものとする。`;
      } else {
        text = `${A}及び${B}は、婚姻後は賃貸住宅に居住するものとし、住宅購入については将来の状況に応じて両者が誠実に協議のうえ判断するものとする。`;
      }
      return `第22条（住宅の取得・持分）\n${text}`;
    },
  },
  {
    id: "art-23",
    chapter: 6,
    articleNumber: 23,
    title: "住宅ローンと離婚時の処理",
    category: "住宅",
    required: false,
    hint: "万一離婚となった場合に自宅の住宅ローンや売却をどう処理するかを決めます。",
    questions: [
      {
        id: "q-housing-divorce",
        label: "万一離婚となった場合の自宅・住宅ローンの処理はどうしますか?",
        type: "single",
        allowCustom: true,
        customPlaceholder: "例：離婚の際は自宅を市場価格で売却し、残債を返済後の残額を持分割合で分配する。",
        customMaxLength: 300,
        hint: "住宅ローンが残っている場合の離婚は複雑になりがちです。基本方針を持っておきましょう。",
        choices: [
          { id: "sell", label: "売却して残額を分配する（人気）", value: "sell" },
          { id: "one-side-takeover", label: "一方が継続居住し、ローンを引き継ぐ", value: "one-side-takeover" },
          { id: "discuss", label: "その時点で誠実に話し合う", value: "discuss" },
        ],
      },
    ],
    template: (answers, meta) => {
      const a = getAnswer(answers, "q-housing-divorce");
      const A = meta.partyA.name || "甲";
      const B = meta.partyB.name || "乙";
      let text = "";
      if (a?.selectedId === "custom") {
        text = formatCustomText(a.customText);
      } else if (a?.selectedId === "sell") {
        text = `${A}及び${B}が離婚する場合、共有する住宅は原則として市場価格で売却するものとする。売却代金から住宅ローン残債・売却費用を控除した残額は、両者の持分割合に応じて分配するものとする。`;
      } else if (a?.selectedId === "one-side-takeover") {
        text = `${A}及び${B}が離婚する場合、一方が継続して住宅に居住することを希望する場合は、当該居住者が住宅ローン残債を引き継ぐとともに、他方の持分相当額を金銭で精算するものとする。具体的な金額は、離婚時の不動産評価額を基準に両者が協議のうえ定める。`;
      } else {
        text = `${A}及び${B}が離婚する場合、共有する住宅及び住宅ローンの処理については、その時点での住宅価値・ローン残高・双方の生活状況等を考慮し、両者が誠実に協議のうえ決定するものとする。`;
      }
      return `第23条（住宅ローンと離婚時の処理）\n${text}`;
    },
  },

  // ===== 第7章 その他 =====
  {
    id: "art-24",
    chapter: 7,
    articleNumber: 24,
    title: "死亡時の相続",
    category: "その他",
    required: false,
    hint: "万一どちらかが亡くなった場合の財産相続についての意思確認です。遺言書の作成も検討しましょう。",
    questions: [
      {
        id: "q-inheritance",
        label: "万一一方が亡くなった場合の財産相続についてどのようにお考えですか?",
        type: "single",
        allowCustom: true,
        customPlaceholder: "例：将来的にそれぞれ遺言書を作成し、相互扶養のため配偶者に優先的に相続させる。",
        customMaxLength: 300,
        hint: "法定相続では配偶者が最低でも2分の1を相続しますが、意思を明確にするには遺言書が重要です。",
        choices: [
          { id: "will-plan", label: "将来的に遺言書を作成し、意思を明確にする（人気）", value: "will-plan" },
          { id: "legal", label: "法定相続に従う", value: "legal" },
          { id: "discuss", label: "その都度話し合って決める", value: "discuss" },
        ],
      },
    ],
    template: (answers, meta) => {
      const a = getAnswer(answers, "q-inheritance");
      const A = meta.partyA.name || "甲";
      const B = meta.partyB.name || "乙";
      let text = "";
      if (a?.selectedId === "custom") {
        text = formatCustomText(a.customText);
      } else if (a?.selectedId === "will-plan") {
        text = `${A}及び${B}は、将来的にそれぞれ公正証書遺言を作成し、相互の生活保障のため配偶者が遺産を適切に相続できるよう意思を明確にするものとする。遺言書の作成にあたっては互いに情報を開示し、協力して進めるものとする。`;
      } else if (a?.selectedId === "legal") {
        text = `${A}及び${B}の相続については、民法の定める法定相続の規定に従うものとする。`;
      } else {
        text = `${A}及び${B}の一方が亡くなった場合の相続については、その時点での状況（子の有無・親族関係・財産状況等）を考慮し、遺言書の有無に関わらず関係者が誠実に協議のうえ対応するものとする。`;
      }
      return `第24条（死亡時の相続）\n${text}`;
    },
  },
  {
    id: "art-25",
    chapter: 7,
    articleNumber: 25,
    title: "別居・離婚の手続き",
    category: "その他",
    required: false,
    hint: "万一別居や離婚を検討する際に、まず話し合いを試みることを定めます。",
    questions: [
      {
        id: "q-separation",
        label: "関係が困難になった場合、まず何をしますか?",
        type: "single",
        allowCustom: true,
        customPlaceholder: "例：離婚を考える前に、まず6ヶ月以上カウンセリングや家族療法を試みる。",
        customMaxLength: 300,
        hint: "困難な状況でも、まず対話を試みる姿勢が関係を救うことがあります。",
        choices: [
          { id: "mediation-first", label: "まずはカウンセリング・調停を試みる（人気）", value: "mediation-first" },
          { id: "cool-off", label: "冷静になる期間を設け、それでも解決しない場合は法的手続きへ", value: "cool-off" },
          { id: "legal", label: "合意できない場合は法的手続きによる", value: "legal" },
        ],
      },
    ],
    template: (answers, meta) => {
      const a = getAnswer(answers, "q-separation");
      const A = meta.partyA.name || "甲";
      const B = meta.partyB.name || "乙";
      let text = "";
      if (a?.selectedId === "custom") {
        text = formatCustomText(a.customText);
      } else if (a?.selectedId === "mediation-first") {
        text = `${A}及び${B}は、婚姻関係が困難な状況に陥った場合、離婚を決断する前に夫婦カウンセリング・家族療法・調停等を利用し、関係改善を誠実に試みるものとする。それらを試みた後もなお合意に至らない場合は、協議離婚または法的手続きによる離婚を検討するものとする。`;
      } else if (a?.selectedId === "cool-off") {
        text = `${A}及び${B}は、重大な問題が生じた場合、即座に法的手続きに移行せず、一定期間（概ね3ヶ月以上）の冷静な協議期間を設けるものとする。その期間中も解決に至らない場合は、調停または裁判による解決を検討するものとする。`;
      } else {
        text = `${A}及び${B}は、婚姻関係が解消困難な状況に陥った場合、まず両者が誠実に協議離婚を試みるものとする。協議が整わない場合は、家庭裁判所の調停・審判・裁判等の法的手続きにより解決するものとする。`;
      }
      return `第25条（別居・離婚の手続き）\n${text}`;
    },
  },
  {
    id: "art-26",
    chapter: 7,
    articleNumber: 26,
    title: "契約の見直し",
    category: "その他",
    required: true,
    hint: "生活の変化に合わせてこの契約を見直す機会を定めます。必須条項のためスキップできません。",
    questions: [],
    template: (_answers, meta) => {
      const A = meta.partyA.name || "甲";
      const B = meta.partyB.name || "乙";
      return `第26条（契約の見直し）\n${A}及び${B}は、本契約の内容を定期的（少なくとも3年に1回）に見直すものとする。また、子供の誕生・転居・転職・重大な病気・親の介護開始等の生活上の重大な変化が生じた場合は、速やかに本契約の見直しを協議するものとする。改定は両者の書面による合意をもって行う。`;
    },
  },
  {
    id: "art-27",
    chapter: 7,
    articleNumber: 27,
    title: "紛争解決",
    category: "その他",
    required: false,
    hint: "本契約に関して紛争が生じた場合の解決方法を定めます。",
    questions: [
      {
        id: "q-dispute",
        label: "本契約に関して争いが生じた場合の解決方法はどうしますか?",
        type: "single",
        allowCustom: true,
        customPlaceholder: "例：まず2週間以内に両者で話し合い、解決しない場合は弁護士を交えた調停を利用する。",
        customMaxLength: 300,
        hint: "紛争解決の手続きをあらかじめ決めておくと、感情的になりにくくなります。",
        choices: [
          { id: "negotiation-first", label: "まず両者で誠実に話し合い、解決しない場合は法的手続きへ（人気）", value: "negotiation-first" },
          { id: "mediation", label: "第三者（弁護士・調停機関等）を交えて解決する", value: "mediation" },
        ],
      },
    ],
    template: (answers, meta) => {
      const a = getAnswer(answers, "q-dispute");
      const A = meta.partyA.name || "甲";
      const B = meta.partyB.name || "乙";
      let text = "";
      if (a?.selectedId === "custom") {
        text = formatCustomText(a.customText);
      } else if (a?.selectedId === "mediation") {
        text = `本契約に関して${A}と${B}の間に紛争が生じた場合、両者はまず誠実に協議を行い、協議が整わない場合は弁護士・家事調停等の第三者機関を介した解決を試みるものとする。`;
      } else {
        text = `本契約に関して${A}と${B}の間に紛争が生じた場合、両者はまず誠実な協議により解決を図るものとする。協議によって解決できない場合は、家庭裁判所の調停または通常訴訟によって解決するものとする。`;
      }
      return `第27条（紛争解決）\n${text}`;
    },
  },
  {
    id: "art-28",
    chapter: 7,
    articleNumber: 28,
    title: "準拠法",
    category: "その他",
    required: true,
    hint: "本契約の準拠法（どの国の法律に基づくか）を定めます。必須条項のためスキップできません。",
    questions: [],
    template: (_answers, _meta) => {
      return `第28条（準拠法）\n本契約は日本法に準拠し、日本法に従って解釈されるものとする。`;
    },
  },
];

// 章番号別に条文を取得するヘルパー
export function getClausesByChapter(chapterNumber: number): Clause[] {
  return CLAUSES.filter((c) => c.chapter === chapterNumber);
}

// 条文IDで取得するヘルパー
export function getClauseById(id: string): Clause | undefined {
  return CLAUSES.find((c) => c.id === id);
}
