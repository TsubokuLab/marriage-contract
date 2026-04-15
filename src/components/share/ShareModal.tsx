import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Copy, Download, AlertTriangle } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { useContract } from "../../state/ContractContext";
import { encodeToUrl, isUrlTooLong } from "../../lib/share";
import { showToast } from "../ui/Toast";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const { data } = useContract();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shareUrl, setShareUrl] = useState("");
  const [tooLong, setTooLong] = useState(false);


  useEffect(() => {
    if (!isOpen) return;
    const url = encodeToUrl(data);
    setShareUrl(url);
    setTooLong(isUrlTooLong(data));

    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 240,
        margin: 2,
        color: { dark: "#08131a", light: "#ffffff" },
      }).catch(console.error);
    }
  }, [isOpen, data]);

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast("URLをコピーしました！", "success");
    } catch {
      showToast("コピーに失敗しました", "error");
    }
  }

  function downloadQr() {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "婚前契約書QR.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="URLでシェア 🔗" size="sm">
      <div className="space-y-4">
        {/* Privacy warning */}
        <div className="bg-[#fff8e7] rounded-xl p-3 flex gap-2">
          <AlertTriangle size={16} className="text-[#916626] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[#916626] leading-relaxed">
            シェアURLには入力した回答内容がすべて含まれます。氏名・住所などの個人情報を入力している場合は特にご注意いただき、信頼できる相手にのみ共有してください。
          </p>
        </div>

        {/* Too long warning */}
        {tooLong && (
          <div className="bg-[#fff0f5] rounded-xl p-3 flex gap-2">
            <AlertTriangle size={16} className="text-[#ff6b9d] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[#ff6b9d] leading-relaxed">
              入力内容が多いためURLが長くなっています。QRコードの読み取り精度が低下する場合があります。
            </p>
          </div>
        )}

        {/* QR Code */}
        <div className="flex flex-col items-center gap-3">
          <canvas ref={canvasRef} className="rounded-xl border border-[rgba(8,19,26,0.1)]" />
          <Button variant="ghost" size="sm" onClick={downloadQr} className="flex items-center gap-2">
            <Download size={14} />
            QRコードを保存
          </Button>
        </div>

        {/* URL copy */}
        <div>
          <p className="text-xs text-[rgba(8,19,26,0.5)] mb-2">または URL をコピー</p>
          <div className="flex gap-2">
            <input
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-[rgba(8,19,26,0.14)] bg-[#f9f9f9] text-[rgba(8,19,26,0.6)] truncate"
            />
            <Button size="sm" onClick={copyUrl} className="flex items-center gap-1 flex-shrink-0">
              <Copy size={14} />
              コピー
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
