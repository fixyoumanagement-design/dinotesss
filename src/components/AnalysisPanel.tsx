import React, { useState } from 'react';
import { 
  X, 
  BrainCircuit, 
  Search, 
  Zap, 
  Sparkles, 
  ExternalLink, 
  Check, 
  AlertCircle, 
  ArrowRight,
  ShieldAlert,
  Compass,
  Lightbulb
} from 'lucide-react';
import { Idea, AIAnalysisResult } from '../types';
import { DiniNeko } from './DiniNeko';

interface AnalysisPanelProps {
  idea: Idea;
  onClose: () => void;
  onApplyInsights: (newNotes: string, newDecisions?: string[]) => void;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({
  idea,
  onClose,
  onApplyInsights,
}) => {
  const [mode, setMode] = useState<'deep' | 'research' | 'quick'>('deep');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(idea.analysis || null);
  const [applied, setApplied] = useState(false);

  const handleRunAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          title: idea.title,
          problem: idea.problem,
          hypothesis: idea.hypothesis,
          notes: idea.notes,
        }),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Gagal menjalankan analisis.');
      }

      setAnalysis(json.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Terjadi kendala saat menghubungi asisten pemikir.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdoptAction = (actionItem: string) => {
    const addition = `\n\n- [ ] **Langkah Validasi**: ${actionItem}`;
    onApplyInsights((idea.notes || '') + addition, [actionItem]);
    setApplied(true);
    setTimeout(() => setApplied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAF9F5] border border-[#DDD9CE] rounded-2xl w-full max-w-3xl shadow-xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#ECE8DC] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <DiniNeko size="sm" mood={loading ? 'thinking' : 'calm'} />
            <div>
              <h2 className="text-base font-semibold text-[#252826] flex items-center gap-2">
                <span>Ruang Analisis Pemikiran</span>
                <span className="text-[11px] font-normal text-[#8A8F88] font-serif">
                  思考スペース
                </span>
              </h2>
              <p className="text-xs text-[#71776F] line-clamp-1">
                Membedah ide: "{idea.title || 'Ide tanpa judul'}"
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#91968E] hover:text-[#232724] rounded-lg hover:bg-[#F2EFE8] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="px-6 py-3 bg-[#F4F2EB] border-b border-[#E8E4DA] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#656A63] font-medium">Model Pendekatan:</span>
            <div className="inline-flex p-0.5 bg-[#E8E5DC] rounded-lg">
              <button
                type="button"
                onClick={() => setMode('deep')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                  mode === 'deep'
                    ? 'bg-white text-[#252926] shadow-xs'
                    : 'text-[#6C716B] hover:text-[#252926]'
                }`}
              >
                <BrainCircuit className="w-3.5 h-3.5 text-[#72548C]" />
                <span>Deep Thinking (3.1 Pro)</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('research')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                  mode === 'research'
                    ? 'bg-white text-[#252926] shadow-xs'
                    : 'text-[#6C716B] hover:text-[#252926]'
                }`}
              >
                <Search className="w-3.5 h-3.5 text-[#4E7652]" />
                <span>Riset Pasar & Web (3.5 Flash)</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('quick')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                  mode === 'quick'
                    ? 'bg-white text-[#252926] shadow-xs'
                    : 'text-[#6C716B] hover:text-[#252926]'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-[#C0693E]" />
                <span>Ringkas Cepat (3.1 Lite)</span>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRunAnalysis}
            disabled={loading}
            className="px-3.5 py-1.5 bg-[#2B302C] text-white hover:bg-[#1E221F] disabled:opacity-50 rounded-lg font-medium transition-colors flex items-center gap-1.5 shadow-xs"
          >
            {loading ? (
              <>
                <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Sedang Menganalisis...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#D1D8CC]" />
                <span>Mulai Analisis</span>
              </>
            )}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Gagal memproses</p>
                <p className="text-red-600 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {applied && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Wawasan berhasil disematkan ke dalam catatan ide!</span>
            </div>
          )}

          {!analysis && !loading && (
            <div className="text-center py-12 px-4 border border-dashed border-[#DDD9CE] rounded-xl bg-white/40">
              <Compass className="w-8 h-8 text-[#A6ABA2] mx-auto mb-2" />
              <p className="font-medium text-[#3A3F39] text-sm">
                Belum ada analisis untuk ide ini
              </p>
              <p className="text-[#7A8078] max-w-md mx-auto mt-1 leading-relaxed">
                Pilih model di atas lalu klik "Mulai Analisis" untuk mengurai akar masalah, memvalidasi asumsi, atau mencari data pembanding dari internet.
              </p>
            </div>
          )}

          {loading && (
            <div className="text-center py-14 space-y-3">
              <div className="w-8 h-8 border-2 border-[#8E9B87] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-medium text-[#3D423C]">
                {mode === 'deep'
                  ? 'Menjalankan penalaran mendalam (High Thinking)...'
                  : mode === 'research'
                  ? 'Menjelajah data dan bukti lapangan lewat Google Search...'
                  : 'Menyusun ringkasan esensi masalah...'}
              </p>
              <p className="text-xs text-[#8A8F87]">
                Pikiran tenang menghasilkan keputusan yang jernih.
              </p>
            </div>
          )}

          {analysis && !loading && (
            <div className="space-y-6 animate-fadeIn">
              {/* Esensi / Summary */}
              <div className="p-4 bg-white border border-[#E4E0D5] rounded-xl shadow-xs">
                <span className="text-[11px] font-semibold text-[#576056] uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-[#517957]" />
                  Esensi & Sudut Pandang Masalah
                </span>
                <p className="text-sm text-[#262A27] leading-relaxed font-serif">
                  {analysis.summary}
                </p>
              </div>

              {/* Grid: Problem Breakdown & Key Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Akar Problem */}
                <div className="p-4 bg-white border border-[#E4E0D5] rounded-xl space-y-2">
                  <span className="font-semibold text-[#3B403A] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C04A3E]" />
                    Akar Friksi & Masalah Utama
                  </span>
                  <ul className="space-y-1.5 text-[#4D534C] list-disc list-inside">
                    {analysis.problemBreakdown?.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Wawasan Kunci */}
                <div className="p-4 bg-white border border-[#E4E0D5] rounded-xl space-y-2">
                  <span className="font-semibold text-[#3B403A] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#52796F]" />
                    Peluang & Wawasan Strategis
                  </span>
                  <ul className="space-y-1.5 text-[#4D534C] list-disc list-inside">
                    {analysis.keyInsights?.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Blind Spot & Risko */}
              {analysis.potentialRisks?.length > 0 && (
                <div className="p-4 bg-[#FCF8F5] border border-[#ECDCD3] rounded-xl space-y-2">
                  <span className="font-semibold text-[#7E4334] flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-[#C04A3E]" />
                    Blind Spot & Asumsi Rentan
                  </span>
                  <ul className="space-y-1 text-[#65483F] list-disc list-inside">
                    {analysis.potentialRisks.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Items */}
              {analysis.actionItems?.length > 0 && (
                <div className="p-4 bg-[#F5F8F4] border border-[#DAE4D8] rounded-xl space-y-2.5">
                  <span className="font-semibold text-[#355239] flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-[#4E7652]" />
                    Langkah Nyata Berikutnya (24 Jam ke Depan)
                  </span>
                  <div className="space-y-2">
                    {analysis.actionItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-3 p-2 bg-white/90 rounded border border-[#D5E0D3]"
                      >
                        <span className="text-[#323E33]">{item}</span>
                        <button
                          type="button"
                          onClick={() => handleAdoptAction(item)}
                          className="text-[11px] font-medium text-[#46674A] hover:text-[#253928] px-2 py-0.5 rounded bg-[#EAF0E8] hover:bg-[#DDE6DA] transition-colors whitespace-nowrap"
                        >
                          + Masukkan ke Catatan
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Google Search Grounding Sources */}
              {analysis.groundingSources && analysis.groundingSources.length > 0 && (
                <div className="p-3.5 bg-white border border-[#E2DFD4] rounded-xl space-y-2">
                  <span className="text-[11px] font-semibold text-[#666B64] uppercase tracking-wider block">
                    Sumber Riset Terverifikasi (Google Search)
                  </span>
                  <div className="space-y-1.5">
                    {analysis.groundingSources.map((source, idx) => (
                      <a
                        key={idx}
                        href={source.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="flex items-center justify-between gap-2 p-1.5 rounded hover:bg-[#F5F4EE] text-[#425044] transition-colors"
                      >
                        <span className="truncate">{source.title}</span>
                        <ExternalLink className="w-3 h-3 text-[#8A9088] shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
