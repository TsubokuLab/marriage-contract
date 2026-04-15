export type QuestionType = "single" | "multi" | "text" | "number" | "date";

export type Choice = {
  id: string;
  label: string;
  value?: string;
};

export type Question = {
  id: string;
  label: string;
  type: QuestionType;
  choices?: Choice[];
  allowCustom?: boolean;
  customPlaceholder?: string;
  customMaxLength?: number;
  hint?: string;
  placeholder?: string;
  required?: boolean;
};

export type Answer = {
  selectedId?: string;
  selectedIds?: string[];
  customText?: string;
  textValue?: string;
  numberValue?: number;
};

export type ClauseCategory =
  | "財産"
  | "家事"
  | "親族"
  | "子育て"
  | "尊重"
  | "住宅"
  | "その他";

export type Clause = {
  id: string;
  chapter: number;
  articleNumber: number;
  title: string;
  category: ClauseCategory;
  required: boolean;
  questions: Question[];
  template: (answers: Record<string, Answer>, meta: ContractMeta) => string;
  hint: string;
};

export type Chapter = {
  number: number;
  title: string;
  emoji: string;
  description: string;
  bgColor: string;
  category: ClauseCategory;
};

export type ContractMeta = {
  date: string;
  partyA: {
    name: string;
    birthDate: string;
    address: string;
  };
  partyB: {
    name: string;
    birthDate: string;
    address: string;
  };
};

export type ContractData = {
  meta: ContractMeta;
  answers: Record<string, Answer>;
  includedClauses: Record<string, boolean>;
  version: number;
};

export type WizardStep =
  | { type: "intro" }
  | { type: "meta" }
  | { type: "chapter"; chapterNumber: number }
  | { type: "preview" };
