import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Sparkles, 
  Check, 
  History, 
  Plus, 
  Trash2, 
  Share2, 
  Tag, 
  Calendar,
  CheckCircle2,
  HelpCircle,
  Clock
} from 'lucide-react';
import { Idea, IdeaCategory, IdeaStatus, ColorTheme, DecisionItem } from '../types';
import { HankoStamp } from './HankoStamp';
import { DiniNeko } from './DiniNeko';

interface IdeaEditorProps {
  idea: Idea;
  onSave: (updated: Idea, changeSummary: string) => void;
  onBack: () => void;
  onOpenAnalysis: (idea: Idea) => void;
  onOpenWorkspace: (idea: Idea) => void;
}

const CATEGORIES: IdeaCategory[] = [
  'Produk',
  'Kreatif',
  'Bisnis',
  'Teknologi',
  'Kehidupan',
  'Riset',
];

const STATUSES: { value: IdeaStatus; label: string }[] = [
  { value: 'draft', label: 'Draf Mentah' },
  { value: 'analyzing', label: 'Sedang Dianalisis' },
  { value: 'validated', label: 'Tervalidasi' },
  { value: 'paused', label: 'Dijeda' },
  { value: 'done', label: 'Selesai / Terwujud' },
];

const COLORS: Record<ColorTheme, { value: ColorTheme; label: string; class: string }> = {
  cream: { value: 'cream', label: 'Cream', class: 'bg-[#FCFBF8]' },
  sage: { value: 'sage', label: 'Sage', class: 'bg-[#F7F9F5]' },
  peach: { value: 'peach', label: 'Peach', class: 'bg-[#FCF7F5]' },
  sky: { value: 'sky', label: 'Sky', class: 'bg-[#F6F8FB]' },
  lavender: { value: 'lavender', label: 'Lavender', class: 'bg-[#F9F7FB]' },
};

export const IdeaEditor: React.FC<IdeaEditorProps> = ({
  idea,
  onSave,
  onBack,
  onOpenAnalysis,
  onOpenWorkspace,
}) => {
  const [title, setTitle] = useState(idea.title);
  const [problem, setProblem] = useState(idea.problem);
  const [hypothesis, setHypothesis] = useState(idea.hypothesis);
  const [notes, setNotes] = useState(idea.notes);
  const [category, setCategory] = useState<IdeaCategory>(idea.category);
  const [status, setStatus] = useState<IdeaStatus>(idea.status);
  const [colorTheme, setColorTheme] = useState<ColorTheme>(idea.colorTheme);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(idea.tags || []);
  const [decisions, setDecisions] = useState<DecisionItem[]>(idea.decisions || []);
  const [newDecision, setNewDecision] = useState('');
  const [newRationale, setNewRationale] = useState('');
  const [showRevisions, setShowRevisions] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);

  // Sync state if idea changes
  useEffect(() => {
    setTitle(idea.title);
    setProblem(idea.problem);
    setHypothesis(idea.hypothesis);
    setNotes(idea.notes);
    setCategory(idea.category);
    setStatus(idea.status);
    setColorTheme(idea.colorTheme);
    setTags(idea.tags || []);
    setDecisions(idea.decisions || []);
  }, [idea.id]);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const cleanTag = tagInput.trim().replace(/^#/, '');
      if (!tags.includes(cleanTag)) {
        setTags([...tags, cleanTag]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAddDecision = () => {
    if (!newDecision.trim()) return;
    const item: DecisionItem = {
      id: 'dec_' + Date.now(),
      timestamp: new Date().toISOString(),
      decision: newDecision.trim(),
      rationale: newRationale.trim() || 'Pertimbangan intuisi dan keselarasan nilai.',
    };
    const updated = [item, ...decisions];
    setDecisions(updated);
    setNewDecision('');
    setNewRationale('');

    handleDirectSave({
      decisions: updated,
    }, `Mencatat keputusan: "${item.decision.slice(0, 40)}..."`);
  };

  const handleRemoveDecision = (decId: string) => {
    const updated = decisions.filter((d) => d.id !== decId);
    setDecisions(updated);
    handleDirectSave({ decisions: updated }, 'Menghapus satu catatan keputusan.');
  };

  const handleDirectSave = (
    overrides?: Partial<Idea>,
    summary = 'Memperbarui catatan ide'
  ) => {
    const updatedIdea: Idea = {
      ...idea,
      title: overrides?.title !== undefined ? overrides.title : title,
      problem: overrides?.problem !== undefined ? overrides.problem : problem,
      hypothesis: overrides?.hypothesis !== undefined ? overrides.hypothesis : hypothesis,
      notes: overrides?.notes !== undefined ? overrides.notes : notes,
      category: overrides?.category !== undefined ? overrides.category : category,
      status: overrides?.status !== undefined ? overrides.status : status,
      colorTheme: overrides?.colorTheme !== undefined ? overrides.colorTheme : colorTheme,
      tags: overrides?.tags !== undefined ? overrides.tags : tags,
      decisions: overrides?.decisions !== undefined ? overrides.decisions : decisions,
      updatedAt: new Date().toISOString(),
    };

    onSave(updatedIdea, summary);
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  const handleRollback = (rev: any) => {
    if (!rev.previousState) return;
    setTitle(rev.previousState.title);
    setProblem(rev.previousState.problem);
    setHypothesis(rev.previousState.hypothesis);
    setNotes(rev.previousState.notes);
    setStatus(rev.previousState.status);

    handleDirectSave({
      title: rev.previousState.title,
      problem: rev.previousState.problem,
      hypothesis: rev.previousState.hypothesis,
      notes: rev.previousState.notes,
      status: rev.previousState.status,
    }, `Memulihkan draf ke revisi (${rev.timestamp.slice(0, 16)})`);
    setShowRevisions(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Top action bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#686E67] hover:text-[#232724] px-2.5 py-1.5 rounded-lg hover:bg-[#EFECE3] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Papan</span>
        </button>

        <div className="flex items-center gap-2">
          {savedNotification && (
            <span className="text-xs text-[#4F6851] flex items-center gap-1 font-medium transition-opacity">
              <Check className="w-3.5 h-3.5" /> Tersimpan
            </span>
          )}

          <button
            type="button"
            onClick={() => onOpenAnalysis(idea)}
            className="px-3 py-1.5 text-xs font-medium text-[#38463B] bg-[#E7EDE5] hover:bg-[#DCE4DA] border border-[#CCD8CA] rounded-lg transition-colors flex items-center gap-1.5"
            title="Analisis Problem & Ide dengan Gemini AI"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#4E7652]" />
            <span className="hidden sm:inline">Ruang Analisis</span>
            <span className="sm:hidden">Analisis</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenWorkspace(idea)}
            className="px-3 py-1.5 text-xs font-medium text-[#4B524D] bg-[#F2EFE8] hover:bg-[#EAE6DC] border border-[#DDD9CF] rounded-lg transition-colors flex items-center gap-1.5"
            title="Ekspor ke Google Sheets, Calendar, atau Slides"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Workspace</span>
          </button>

          <button
            type="button"
            onClick={() => handleDirectSave(undefined, 'Menyimpan pembaruan catatan')}
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-[#2A2E2B] hover:bg-[#1C1F1D] rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan</span>
          </button>
        </div>
      </div>

      {/* Main Notebook Surface */}
      <div className="bg-[#FAF9F5] border border-[#E5E2D8] rounded-2xl shadow-sm p-6 sm:p-10 relative">
        {/* Subtle Notebook Binding / Top Details */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[#ECE8DC] text-xs text-[#7A8079]">
          <div className="flex items-center gap-3">
            <HankoStamp status={status} size="md" />

            {/* Status selector */}
            <select
              value={status}
              onChange={(e) => {
                const newSt = e.target.value as IdeaStatus;
                setStatus(newSt);
                handleDirectSave({ status: newSt }, `Mengubah status menjadi: ${newSt}`);
              }}
              className="bg-transparent border border-[#DDD9CE] hover:border-[#BBB5A5] text-[#333734] rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#8E9B87]"
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>

            {/* Category selector */}
            <select
              value={category}
              onChange={(e) => {
                const newCat = e.target.value as IdeaCategory;
                setCategory(newCat);
                handleDirectSave({ category: newCat }, `Mengubah kategori ke: ${newCat}`);
              }}
              className="bg-transparent border border-[#DDD9CE] hover:border-[#BBB5A5] text-[#333734] rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#8E9B87]"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            {/* Color tint picker */}
            <div className="flex items-center gap-1.5">
              {(Object.keys(COLORS) as ColorTheme[]).map((themeKey) => (
                <button
                  key={themeKey}
                  type="button"
                  onClick={() => {
                    setColorTheme(themeKey);
                    handleDirectSave({ colorTheme: themeKey }, `Mengganti tema warna`);
                  }}
                  className={`w-4 h-4 rounded-full border ${
                    colorTheme === themeKey
                      ? 'border-[#2A2E2B] scale-110 shadow-xs'
                      : 'border-black/20 hover:scale-105'
                  }`}
                  style={{
                    backgroundColor:
                      themeKey === 'cream'
                        ? '#FCFBF8'
                        : themeKey === 'sage'
                        ? '#EBF1E6'
                        : themeKey === 'peach'
                        ? '#F9EBE6'
                        : themeKey === 'sky'
                        ? '#E7EFF8'
                        : '#F0EAF8',
                  }}
                  title={`Warna ${themeKey}`}
                />
              ))}
            </div>

            {/* Revisions trigger */}
            <button
              type="button"
              onClick={() => setShowRevisions(!showRevisions)}
              className="inline-flex items-center gap-1 text-xs text-[#7A8079] hover:text-[#282B29] transition-colors"
              title="Riwayat revisi ide ini"
            >
              <History className="w-3.5 h-3.5" />
              <span>{idea.revisions?.length || 0} Riwayat</span>
            </button>
          </div>
        </div>

        {/* Revisions Drawer */}
        {showRevisions && (
          <div className="my-4 p-4 bg-[#F2EFE8] border border-[#DDD9CE] rounded-xl text-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-[#2F3330] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#5F655F]" />
                Jejak Revisi Ide Ini
              </span>
              <button
                type="button"
                onClick={() => setShowRevisions(false)}
                className="text-[#888D87] hover:text-[#282B29]"
              >
                Tutup
              </button>
            </div>
            {(!idea.revisions || idea.revisions.length === 0) ? (
              <p className="text-[#80857E] italic">
                Belum ada revisi tersimpan. Setiap perubahan yang kamu simpan akan dicatat di sini.
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {idea.revisions.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-2.5 bg-white/80 rounded-lg border border-[#E2DFD6] flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="font-medium text-[#2F3330]">{rev.summary}</p>
                      <p className="text-[11px] text-[#858A83]">
                        {new Date(rev.timestamp).toLocaleString('id-ID')}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRollback(rev)}
                      className="px-2 py-1 text-[11px] font-medium bg-[#ECE9E0] hover:bg-[#DDD9CE] rounded text-[#353936] transition-colors"
                    >
                      Pulihkan Draf Ini
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Section 1: Title Input */}
        <div className="mt-6 mb-8">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Apa yang lagi kepikiran? (Judul ide)"
            className="w-full text-2xl sm:text-3xl font-semibold text-[#222624] placeholder:text-[#ACB1AA] bg-transparent border-0 focus:outline-none focus:ring-0 leading-tight"
          />
        </div>

        {/* Section 2: Problem Definition */}
        <div className="mb-6 p-4 rounded-xl bg-white border border-[#E8E5DC] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-[#484D47] uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C04A3E]" />
            Problem apa yang mau dipecahkan?
          </label>
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            rows={2}
            placeholder="Tuliskan rasa frustrasi, kendala nyata orang lain, atau kejanggalan yang kamu temukan..."
            className="w-full text-sm text-[#313532] placeholder:text-[#B0B4AE] bg-transparent border-0 focus:outline-none focus:ring-0 resize-y leading-relaxed"
          />
        </div>

        {/* Section 3: Hypothesis */}
        <div className="mb-6 p-4 rounded-xl bg-white border border-[#E8E5DC] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-[#484D47] uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#52796F]" />
            Hipotesis Solusi / Firasat Awal
          </label>
          <textarea
            value={hypothesis}
            onChange={(e) => setHypothesis(e.target.value)}
            rows={2}
            placeholder="Kalau kita lakukan X dengan cara Y, apakah problem di atas bisa terurai? Mengapa?"
            className="w-full text-sm text-[#313532] placeholder:text-[#B0B4AE] bg-transparent border-0 focus:outline-none focus:ring-0 resize-y leading-relaxed"
          />
        </div>

        {/* Section 4: Deep Notes & Brain Dump */}
        <div className="mb-8 p-4 rounded-xl bg-white border border-[#E8E5DC] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-[#484D47] uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6B7F96]" />
            Catatan Mentah & Eksplorasi
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={6}
            placeholder="Catat apa saja tanpa disaring: skenario pemakaian, struktur fitur, referensi, angka kasar, atau analogi..."
            className="w-full text-sm text-[#313532] placeholder:text-[#B0B4AE] bg-transparent border-0 focus:outline-none focus:ring-0 resize-y leading-relaxed font-sans"
          />
        </div>

        {/* Section 5: Decisions & Self-Commitments */}
        <div className="mb-8 p-4 rounded-xl bg-[#F6F5EF] border border-[#E4E0D5]">
          <div className="flex items-center justify-between mb-3">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-[#3E433E] uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#517957]" />
              Keputusan & Kesepakatan Diri ({decisions.length})
            </label>
          </div>

          {/* New Decision Form */}
          <div className="space-y-2 mb-4 bg-white p-3 rounded-lg border border-[#E2DED4]">
            <input
              type="text"
              value={newDecision}
              onChange={(e) => setNewDecision(e.target.value)}
              placeholder="Contoh: Fokus ke fitur core dulu, abaikan fitur X di fase awal."
              className="w-full text-xs text-[#2A2E2B] placeholder:text-[#A8ADA5] bg-transparent border-0 focus:outline-none"
            />
            <input
              type="text"
              value={newRationale}
              onChange={(e) => setNewRationale(e.target.value)}
              placeholder="Alasan / pertimbangan keputusan ini..."
              className="w-full text-xs text-[#60655E] placeholder:text-[#B2B6AF] bg-transparent border-t border-[#F0ECE1] pt-2 focus:outline-none"
            />
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleAddDecision}
                disabled={!newDecision.trim()}
                className="px-2.5 py-1 text-xs font-medium bg-[#333834] text-white hover:bg-[#202321] disabled:opacity-40 rounded transition-colors"
              >
                + Kunci Keputusan Ini
              </button>
            </div>
          </div>

          {/* Decision list */}
          {decisions.length > 0 && (
            <div className="space-y-2">
              {decisions.map((dec) => (
                <div
                  key={dec.id}
                  className="p-3 bg-white/90 border border-[#E0DCD1] rounded-lg flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <p className="font-semibold text-[#252826]">{dec.decision}</p>
                    <p className="text-[#656A63] text-[11px]">{dec.rationale}</p>
                    <p className="text-[10px] text-[#9A9E97]">
                      {new Date(dec.timestamp).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveDecision(dec.id)}
                    className="p-1 text-[#A8ACA5] hover:text-[#B84236] transition-colors"
                    title="Hapus keputusan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 6: Tags */}
        <div className="pt-4 border-t border-[#ECE8DC] flex flex-wrap items-center gap-2 text-xs">
          <Tag className="w-3.5 h-3.5 text-[#858A83]" />
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#EEECE4] text-[#4F544E] rounded text-xs"
            >
              #{tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-[#888D86] hover:text-[#2A2E2B]"
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="+ Tambah tag (Tekan Enter)"
            className="text-xs bg-transparent border-0 focus:outline-none placeholder:text-[#A8ADA6] text-[#454A44] min-w-[140px]"
          />
        </div>
      </div>
    </div>
  );
};
