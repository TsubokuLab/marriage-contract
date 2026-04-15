import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { ContractData, Answer, ContractMeta } from "../types/contract";
import { CLAUSES } from "../data/clauses";
import { loadFromStorage, saveToStorage } from "../lib/storage";
import { decodeFromUrl } from "../lib/share";

// 初期値
const defaultMeta: ContractMeta = {
  date: new Date().toISOString().split("T")[0],
  partyA: { name: "", birthDate: "", address: "" },
  partyB: { name: "", birthDate: "", address: "" },
};

function buildDefaultIncludedClauses(): Record<string, boolean> {
  const result: Record<string, boolean> = {};
  for (const clause of CLAUSES) {
    result[clause.id] = true;
  }
  return result;
}

const initialData: ContractData = {
  meta: defaultMeta,
  answers: {},
  includedClauses: buildDefaultIncludedClauses(),
  version: 2,
};

// Action Types
type Action =
  | { type: "SET_META"; payload: Partial<ContractMeta> }
  | { type: "SET_PARTY_A"; payload: Partial<ContractMeta["partyA"]> }
  | { type: "SET_PARTY_B"; payload: Partial<ContractMeta["partyB"]> }
  | { type: "SET_ANSWER"; questionId: string; answer: Answer }
  | { type: "TOGGLE_CLAUSE"; clauseId: string; include: boolean }
  | { type: "RESTORE"; data: ContractData }
  | { type: "RESET" };

// Reducer
function contractReducer(state: ContractData, action: Action): ContractData {
  switch (action.type) {
    case "SET_META":
      return { ...state, meta: { ...state.meta, ...action.payload } };
    case "SET_PARTY_A":
      return {
        ...state,
        meta: { ...state.meta, partyA: { ...state.meta.partyA, ...action.payload } },
      };
    case "SET_PARTY_B":
      return {
        ...state,
        meta: { ...state.meta, partyB: { ...state.meta.partyB, ...action.payload } },
      };
    case "SET_ANSWER":
      return {
        ...state,
        answers: { ...state.answers, [action.questionId]: action.answer },
      };
    case "TOGGLE_CLAUSE":
      return {
        ...state,
        includedClauses: { ...state.includedClauses, [action.clauseId]: action.include },
      };
    case "RESTORE":
      return { ...action.data };
    case "RESET":
      return { ...initialData, includedClauses: buildDefaultIncludedClauses() };
    default:
      return state;
  }
}

// Context
type ContractContextType = {
  data: ContractData;
  setMeta: (payload: Partial<ContractMeta>) => void;
  setPartyA: (payload: Partial<ContractMeta["partyA"]>) => void;
  setPartyB: (payload: Partial<ContractMeta["partyB"]>) => void;
  setAnswer: (questionId: string, answer: Answer) => void;
  toggleClause: (clauseId: string, include: boolean) => void;
  restore: (data: ContractData) => void;
  reset: () => void;
};

const ContractContext = createContext<ContractContextType | null>(null);

export function ContractProvider({ children }: { children: ReactNode }) {
  const [data, dispatch] = useReducer(contractReducer, initialData);

  // 初期化: URLパラメータ or LocalStorage から復元
  useEffect(() => {
    const urlData = decodeFromUrl();
    if (urlData) {
      dispatch({ type: "RESTORE", data: urlData });
      return;
    }
    const stored = loadFromStorage();
    if (stored) {
      dispatch({ type: "RESTORE", data: stored });
    }
  }, []);

  // 自動保存 (debounce 500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      saveToStorage(data);
    }, 500);
    return () => clearTimeout(timer);
  }, [data]);

  const setMeta = useCallback((payload: Partial<ContractMeta>) => {
    dispatch({ type: "SET_META", payload });
  }, []);

  const setPartyA = useCallback((payload: Partial<ContractMeta["partyA"]>) => {
    dispatch({ type: "SET_PARTY_A", payload });
  }, []);

  const setPartyB = useCallback((payload: Partial<ContractMeta["partyB"]>) => {
    dispatch({ type: "SET_PARTY_B", payload });
  }, []);

  const setAnswer = useCallback((questionId: string, answer: Answer) => {
    dispatch({ type: "SET_ANSWER", questionId, answer });
  }, []);

  const toggleClause = useCallback((clauseId: string, include: boolean) => {
    dispatch({ type: "TOGGLE_CLAUSE", clauseId, include });
  }, []);

  const restore = useCallback((d: ContractData) => {
    dispatch({ type: "RESTORE", data: d });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return (
    <ContractContext.Provider
      value={{ data, setMeta, setPartyA, setPartyB, setAnswer, toggleClause, restore, reset }}
    >
      {children}
    </ContractContext.Provider>
  );
}

export function useContract() {
  const ctx = useContext(ContractContext);
  if (!ctx) throw new Error("useContract must be used within ContractProvider");
  return ctx;
}
