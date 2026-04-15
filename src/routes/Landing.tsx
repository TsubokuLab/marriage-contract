import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Shield, Download, Share2, Sparkles } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { hasStoredData, clearStorage } from "../lib/storage";
import { useContract } from "../state/ContractContext";

export function Landing() {
  const navigate = useNavigate();
  const { reset } = useContract();
  const [showOverwriteModal, setShowOverwriteModal] = useState(false);

  useEffect(() => {
    // URLパラメータがある場合はウィザードへ直接
    const params = new URLSearchParams(window.location.search);
    if (params.has("d")) {
      navigate("/wizard");
    }
  }, [navigate]);

  // 「はじめる」: 保存データがあれば上書き確認、なければそのまま開始
  function handleStart() {
    if (hasStoredData()) {
      setShowOverwriteModal(true);
    } else {
      reset();
      clearStorage();
      navigate("/wizard");
    }
  }

  // 上書き確認モーダルで「新しく始める」
  function handleConfirmOverwrite() {
    reset();
    clearStorage();
    setShowOverwriteModal(false);
    navigate("/wizard");
  }

  // 「続きから始める」: プレビュー画面へ直接
  function handleResume() {
    navigate("/preview");
  }

  const features = [
    {
      icon: Sparkles,
      title: "簡単な質問に答えるだけ",
      desc: "法律の知識ゼロでOK。選択肢をクリックするだけで契約書のドラフトが完成します。",
    },
    {
      icon: Download,
      title: "PDFとMarkdownで出力",
      desc: "完成した契約書はPDFとMarkdownの両形式でダウンロードできます。",
    },
    {
      icon: Share2,
      title: "URLで共有・共同編集",
      desc: "QRコードやURLでパートナーと内容をシェアして一緒に作り上げられます。",
    },
    {
      icon: Shield,
      title: "すべてブラウザ内で完結",
      desc: "入力データはサーバーに送信されません。プライバシー安心設計です。",
    },
  ];

  const steps = [
    { emoji: "👤", title: "基本情報を入力", desc: "お二人の氏名・職業などを入力します" },
    { emoji: "💬", title: "質問に答える", desc: "財産・家事・子育てなど7つのテーマ" },
    { emoji: "👀", title: "プレビュー確認", desc: "完成した契約書をリアルタイムで確認" },
    { emoji: "📄", title: "ダウンロード", desc: "PDF・Markdownで書き出し完了！" },
  ];

  return (
    <div className="min-h-screen bg-[#fff5f7]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #ff6b9d, transparent)" }}
          />
          <div
            className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #ffb88c, transparent)" }}
          />
        </div>

        <div className="relative max-w-2xl mx-auto px-4 pt-20 pb-16 text-center">
          <div className="text-6xl mb-4">💍</div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#08131a] mb-4 tracking-tight">
            婚前契約書
            <br />
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #ff6b9d, #ffb88c)" }}
            >
              ジェネレーター
            </span>
          </h1>
          <p className="text-lg text-[rgba(8,19,26,0.66)] mb-3 leading-relaxed">
            質問に答えるだけで、
            <br className="sm:hidden" />
            お二人だけの婚前契約書ドラフトが作れます。
          </p>
          <p className="text-sm text-[rgba(8,19,26,0.5)] mb-10">
            🌸 二人で未来を話し合うワークシートとして活用してください
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" onClick={handleStart} className="text-lg">
              <Heart size={20} />
              はじめる
            </Button>
            {hasStoredData() && (
              <Button size="lg" variant="secondary" onClick={handleResume}>
                続きから再開する
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-2xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center text-[#08131a] mb-8">
          ✨ できること
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-[20px] p-6 border border-[rgba(8,19,26,0.08)] shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                style={{ background: "linear-gradient(135deg, #ffd6e3, #fff8e7)" }}
              >
                <f.icon size={20} className="text-[#ff6b9d]" />
              </div>
              <h3 className="font-semibold text-[#08131a] mb-1">{f.title}</h3>
              <p className="text-sm text-[rgba(8,19,26,0.6)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="max-w-2xl mx-auto px-4 py-8 pb-16">
        <h2 className="text-2xl font-bold text-center text-[#08131a] mb-8">
          📝 使い方
        </h2>
        <div className="space-y-3">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-[rgba(8,19,26,0.08)]"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #ff6b9d, #ffb88c)" }}
              >
                {i + 1}
              </div>
              <div className="text-2xl flex-shrink-0">{step.emoji}</div>
              <div>
                <p className="font-semibold text-[#08131a] text-sm">{step.title}</p>
                <p className="text-xs text-[rgba(8,19,26,0.55)]">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button size="lg" onClick={handleStart}>
            <Heart size={20} />
            さっそく始める
          </Button>
        </div>
      </section>

      {/* Disclaimer */}
      <footer className="border-t border-[rgba(8,19,26,0.08)] py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs text-[rgba(8,19,26,0.5)] leading-relaxed">
            本サービスは、婚前契約書のドラフト作成を支援するツールです。
            出力された文書は法的助言ではなく、効力を担保するものではありません。
            実際の運用にあたっては、弁護士へのご相談および公証役場での公正証書化をご検討ください。
          </p>
          <p className="text-xs text-[rgba(8,19,26,0.35)] mt-2">
            💕 お二人の新しい門出を応援しています
          </p>
        </div>
      </footer>

      {/* Overwrite confirmation Modal */}
      <Modal
        isOpen={showOverwriteModal}
        onClose={() => setShowOverwriteModal(false)}
        title="⚠️ 前回の入力内容があります"
      >
        <p className="text-[rgba(8,19,26,0.66)] mb-6 leading-relaxed">
          前回入力した内容がブラウザに保存されています。<br />
          新しく始めると上書きされますが、よろしいですか？
        </p>
        <div className="flex flex-col gap-3">
          <Button onClick={handleConfirmOverwrite} className="w-full">
            上書きして新しく始める
          </Button>
          <Button variant="ghost" onClick={() => setShowOverwriteModal(false)} className="w-full">
            キャンセル
          </Button>
        </div>
      </Modal>
    </div>
  );
}
