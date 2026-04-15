import { useState } from "react";
import { FileText, FileDown } from "lucide-react";
import { Modal } from "../ui/Modal";
import { useContract } from "../../state/ContractContext";
import { downloadMarkdown } from "../../lib/markdown";
import { downloadPdf } from "../../lib/pdf";
import { showToast } from "../ui/Toast";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DownloadModal({ isOpen, onClose }: DownloadModalProps) {
  const { data } = useContract();
  const [pdfLoading, setPdfLoading] = useState(false);

  async function handlePdf() {
    setPdfLoading(true);
    try {
      await downloadPdf(data);
      showToast("PDFをダウンロードしました！", "success");
      onClose();
    } catch (e) {
      console.error(e);
      showToast("PDF生成に失敗しました", "error");
    } finally {
      setPdfLoading(false);
    }
  }

  function handleMarkdown() {
    downloadMarkdown(data);
    showToast("Markdownをダウンロードしました！", "success");
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="ダウンロード 📥" size="sm">
      <div className="space-y-3">
        <p className="text-sm text-[rgba(8,19,26,0.6)] leading-relaxed">
          完成した婚前契約書ドラフトをダウンロードします。
        </p>

        <button
          type="button"
          onClick={handlePdf}
          disabled={pdfLoading}
          className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-[#ffd6e3] hover:bg-[#fff5f7] transition-all text-left disabled:opacity-50"
        >
          <div className="w-12 h-12 rounded-xl bg-[#fff0f5] flex items-center justify-center flex-shrink-0">
            <FileDown size={24} className="text-[#ff6b9d]" />
          </div>
          <div>
            <p className="font-semibold text-[#08131a]">PDF形式</p>
            <p className="text-xs text-[rgba(8,19,26,0.5)] mt-0.5">
              印刷・提出に最適。A4サイズで出力されます。
            </p>
          </div>
          {pdfLoading && (
            <svg className="animate-spin w-5 h-5 text-[#ff6b9d] ml-auto" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          )}
        </button>

        <button
          type="button"
          onClick={handleMarkdown}
          className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-[rgba(8,19,26,0.14)] hover:bg-[#f9f9f9] transition-all text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-[#f5f5ff] flex items-center justify-center flex-shrink-0">
            <FileText size={24} className="text-[#5ac8b8]" />
          </div>
          <div>
            <p className="font-semibold text-[#08131a]">Markdown形式</p>
            <p className="text-xs text-[rgba(8,19,26,0.5)] mt-0.5">
              テキスト編集に便利。GitHub等で管理できます。
            </p>
          </div>
        </button>

        <p className="text-xs text-[rgba(8,19,26,0.4)] text-center mt-4 leading-relaxed">
          ⚠️ 出力された文書は法的効力を保証するものではありません。
          公正証書化を検討される場合は弁護士にご相談ください。
        </p>
      </div>
    </Modal>
  );
}
