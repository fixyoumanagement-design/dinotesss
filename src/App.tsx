import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Sparkles, 
  Pin, 
  BookOpen, 
  History, 
  FileSpreadsheet, 
  Share2, 
  SlidersHorizontal,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Home
} from 'lucide-react';
import { Idea, ActivityLog, IdeaCategory, IdeaStatus, ColorTheme } from './types';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { IdeaCard } from './components/IdeaCard';
import { IdeaEditor } from './components/IdeaEditor';
import { AnalysisPanel } from './components/AnalysisPanel';
import { HistoryLogModal } from './components/HistoryLogModal';
import { WorkspaceModal } from './components/WorkspaceModal';
import { DiniNeko } from './components/DiniNeko';
import { HankoStamp } from './components/HankoStamp';
import { initAuth } from './services/firebaseAuth';
import { User } from 'firebase/auth';

const STORAGE_KEY_IDEAS = 'dinicatet_ideas_v1';
const STORAGE_KEY_LOGS = 'dinicatet_logs_v1';

const INITIAL_IDEAS: Idea[] = [
  {
    id: 'idea_1',
    title: 'Kotak Resep Suara Ibu',
    problem: 'Sering lupa takaran bumbu masakan rumah khas ibu, dan teks resep biasa kehilangan rasa kehangatan cerita di baliknya.',
    hypothesis: 'Audio notes pendek berdurasi 30 detik yang disandingkan dengan foto masakan membuat proses masak terasa seperti didampingi langsung.',
    notes: 'Fitur utama:\n- Tombol rekam cepat audio 1-klik untuk ibu.\n- Transkripsi otomatis bahan & takaran.\n- Mode masak hands-free dengan suara (next step).',
    category: 'Produk',
    status: 'analyzing',
    colorTheme: 'sage',
    tags: ['keluarga', 'audio', 'resep'],
    pinned: true,
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    decisions: [
      {
        id: 'dec_1',
        timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        decision: 'Fokus ke format audio micro-snippet, bukan resep panjang formal.',
        rationale: 'Keluarga lebih suka dengar nada bicara asli ketimbang baca teks kaku.',
      },
    ],
    revisions: [],
  },
  {
    id: 'idea_2',
    title: 'Jeda Belajar Tanpa Notifikasi Distraksi',
    problem: 'Buka HP cuma mau cek kamus atau catatan rumus, tapi berakhir scroll media sosial selama 45 menit.',
    hypothesis: 'Tirai digital minimalis yang memblokir visual feed tapi tetap membiarkan pesan darurat keluarga masuk.',
    notes: 'Kebutuhan awal:\n- Bikin prototipe sederhana pakai widget atau shortcut fokus.\n- Jangan terlalu banyak settingan rumit.\n- Kasih feedback lembut ketika tangan refleks mau buka aplikasi sosmed.',
    category: 'Teknologi',
    status: 'draft',
    colorTheme: 'peach',
    tags: ['fokus', 'mindfulness', 'screen-time'],
    pinned: false,
    createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    decisions: [],
    revisions: [],
  },
  {
    id: 'idea_3',
    title: 'Katalog Buku Fisik Pinjaman Teman',
    problem: 'Sering lupa buku mana yang dipinjam siapa, atau sebaliknya kita yang kelupaan mengembalikan buku teman berbulan-bulan.',
    hypothesis: 'Kartu perpustakaan analog gaya Jepang dengan stempel tanggal pinjam yang bisa difoto dan dikirim via pesan.',
    notes: 'Estetika:\n- Desain kartu slip perpustakaan klasik.\n- Notifikasi santai "Buku ini kangen pulang".',
    category: 'Kreatif',
    status: 'validated',
    colorTheme: 'sky',
    tags: ['buku', 'kartu-pos', 'analog'],
    pinned: false,
    createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    decisions: [
      {
        id: 'dec_2',
        timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
        decision: 'Cetak 50 kartu fisik dulu untuk diuji coba ke 5 teman terdekat.',
        rationale: 'Validasi apakah teman senang dengan bentuk stempel fisik atau lebih suka link.',
      },
    ],
    revisions: [],
  },
];

const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'log_init_1',
    action: 'CREATE_IDEA',
    ideaTitle: 'Kotak Resep Suara Ibu',
    detail: 'Menuliskan ide awal dan mengidentifikasi problem resep keluarga.',
    timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    author: 'Dini (Kamu)',
  },
  {
    id: 'log_init_2',
    action: 'DECISION_LOGGED',
    ideaTitle: 'Kotak Resep Suara Ibu',
    detail: 'Mengunci keputusan: Fokus ke format audio micro-snippet.',
    timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    author: 'Dini (Kamu)',
  },
  {
    id: 'log_init_3',
    action: 'STATUS_CHANGE',
    ideaTitle: 'Katalog Buku Fisik Pinjaman Teman',
    detail: 'Mengubah status ide menjadi Tervalidasi (済).',
    timestamp: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    author: 'Dini (Kamu)',
  },
];

export default function App() {
  const [ideas, setIdeas] = useState<Idea[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_IDEAS);
      return saved ? JSON.parse(saved) : INITIAL_IDEAS;
    } catch {
      return INITIAL_IDEAS;
    }
  });

  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOGS);
      return saved ? JSON.parse(saved) : INITIAL_LOGS;
    } catch {
      return INITIAL_LOGS;
    }
  });

  const [activeIdeaId, setActiveIdeaId] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<'landing' | 'board' | 'write' | 'logs'>('landing');
  const [analyzingIdea, setAnalyzingIdea] = useState<Idea | null>(null);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_IDEAS, JSON.stringify(ideas));
  }, [ideas]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
  }, [logs]);

  // Init Google Workspace auth listener
  useEffect(() => {
    initAuth(
      (authedUser) => setUser(authedUser),
      () => setUser(null)
    );
  }, []);

  const addLog = (
    action: any,
    detail: string,
    ideaTitle?: string,
    ideaId?: string
  ) => {
    const newLog: ActivityLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      ideaId,
      ideaTitle,
      action,
      detail,
      timestamp: new Date().toISOString(),
      author: user?.displayName || user?.email || 'Dini (Kamu)',
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleCreateNewIdea = () => {
    const newIdea: Idea = {
      id: 'idea_' + Date.now(),
      title: '',
      problem: '',
      hypothesis: '',
      notes: '',
      category: 'Produk',
      status: 'draft',
      colorTheme: 'cream',
      tags: [],
      pinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      decisions: [],
      revisions: [],
    };

    setIdeas([newIdea, ...ideas]);
    setActiveIdeaId(newIdea.id);
    setCurrentTab('write');
    addLog('CREATE_IDEA', 'Membuka lembar catatan ide baru.', 'Ide Baru', newIdea.id);
  };

  const handleSaveIdea = (updatedIdea: Idea, summary: string) => {
    const currentIdea = ideas.find((i) => i.id === updatedIdea.id);
    let revisions = updatedIdea.revisions || [];

    if (
      currentIdea &&
      (currentIdea.title !== updatedIdea.title ||
        currentIdea.problem !== updatedIdea.problem ||
        currentIdea.notes !== updatedIdea.notes)
    ) {
      const snap = {
        id: 'rev_' + Date.now(),
        timestamp: new Date().toISOString(),
        summary: summary || 'Pembaruan isi draf',
        previousState: {
          title: currentIdea.title,
          problem: currentIdea.problem,
          hypothesis: currentIdea.hypothesis,
          notes: currentIdea.notes,
          status: currentIdea.status,
        },
      };
      revisions = [snap, ...revisions.slice(0, 15)];
    }

    const finalIdea = { ...updatedIdea, revisions };

    setIdeas(ideas.map((i) => (i.id === finalIdea.id ? finalIdea : i)));
    addLog(
      'UPDATE_CONTENT',
      summary || `Memperbarui ide: "${finalIdea.title || 'Tanpa Judul'}"`,
      finalIdea.title,
      finalIdea.id
    );
  };

  const handleDeleteIdea = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const ideaToDelete = ideas.find((i) => i.id === id);
    const confirmed = window.confirm(
      `Apakah kamu yakin ingin menghapus ide "${ideaToDelete?.title || 'ini'}"? Tindakan ini tidak dapat dibatalkan.`
    );
    if (!confirmed) return;

    setIdeas(ideas.filter((i) => i.id !== id));
    if (activeIdeaId === id) {
      setActiveIdeaId(null);
      setCurrentTab('board');
    }
    addLog('UPDATE_CONTENT', `Menghapus ide: "${ideaToDelete?.title || id}"`);
  };

  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIdeas(
      ideas.map((i) => (i.id === id ? { ...i, pinned: !i.pinned } : i))
    );
  };

  const handleExportJson = () => {
    const data = {
      app: 'dinicatet',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      ideas,
      logs,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dinicatet_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addLog('UPDATE_CONTENT', 'Mengunduh salinan cadangan arsip JSON.');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.ideas && Array.isArray(json.ideas)) {
          setIdeas(json.ideas);
          if (json.logs && Array.isArray(json.logs)) {
            setLogs(json.logs);
          }
          addLog('RESTORE_REVISION', `Memulihkan ${json.ideas.length} ide dari berkas JSON.`);
          alert('Berhasil memulihkan cadangan data dinicatet.');
        } else {
          alert('Format berkas JSON tidak sesuai.');
        }
      } catch (err) {
        alert('Gagal membaca berkas JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearLogs = () => {
    const confirmed = window.confirm(
      'Apakah kamu yakin ingin membersihkan riwayat aktivitas? Log tidak dapat dipulihkan.'
    );
    if (!confirmed) return;
    setLogs([]);
  };

  // Filtered Ideas
  const filteredIdeas = ideas
    .filter((idea) => {
      const matchesSearch =
        (idea.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (idea.problem || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (idea.notes || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (idea.tags || []).some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat =
        selectedCategory === 'Semua' || idea.category === selectedCategory;

      const matchesStatus =
        statusFilter === 'ALL' || idea.status === statusFilter;

      return matchesSearch && matchesCat && matchesStatus;
    })
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  const activeIdea = ideas.find((i) => i.id === activeIdeaId) || ideas[0] || null;

  return (
    <div className="min-h-screen bg-[#FAF9F4] text-[#202321] flex flex-col font-sans selection:bg-[#E2EAE0] relative">
      {/* Paper Grain Subtle Overlay */}
      <div className="paper-grain-overlay" aria-hidden="true" />

      {/* Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'write' && !activeIdeaId && ideas.length > 0) {
            setActiveIdeaId(ideas[0].id);
          }
          if (tab === 'logs') {
            setShowLogsModal(true);
            return;
          }
          setCurrentTab(tab);
        }}
        onNewIdea={handleCreateNewIdea}
        onOpenWorkspace={() => setShowWorkspaceModal(true)}
        user={user}
        ideaCount={ideas.length}
      />

      {/* VIEW 0: FULL 12-SECTION LANDING PAGE */}
      {currentTab === 'landing' && (
        <LandingPage
          onOpenWorkspaceApp={() => setCurrentTab('board')}
          onOpenEditorWithNew={handleCreateNewIdea}
          onOpenLogsModal={() => setShowLogsModal(true)}
          onOpenGoogleWorkspaceModal={() => setShowWorkspaceModal(true)}
          ideas={ideas}
          logs={logs}
        />
      )}

      {/* VIEW 1: BOARD / PAPAN IDE */}
      {currentTab === 'board' && (
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
          <div className="space-y-8 animate-fadeIn">
            {/* Editorial Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#ECE8DC]">
              <div className="space-y-1.5 max-w-2xl text-left">
                <span className="text-xs text-[#7A8078] tracking-widest uppercase font-mono">
                  ARSIP PEMIKIRAN PRIBADI
                </span>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#222623] leading-snug">
                  Catat dulu. Pikirkan nanti.
                </h1>
                <p className="text-xs sm:text-sm text-[#6C726A] leading-relaxed">
                  Semua problem mentah, asumsi awal, analisis mendalam, dan keputusan tersimpan rapi tanpa perlu khawatir terlupakan.
                </p>
              </div>

              {/* Quick status bar */}
              <div className="flex items-center gap-3 text-xs text-[#787E76] bg-[#F2EFE8] px-3.5 py-2 rounded-xl border border-[#E2DED4]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#52796F]" />
                  <span>{ideas.length} Ide</span>
                </div>
                <span aria-hidden="true">·</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#3F8062]" />
                  <span>{logs.length} Jejak Log</span>
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
              {/* Category Segmented Buttons */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {['Semua', 'Produk', 'Kreatif', 'Bisnis', 'Teknologi', 'Kehidupan', 'Riset'].map(
                  (cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                        selectedCategory === cat
                          ? 'bg-[#2E332F] text-white shadow-xs'
                          : 'text-[#646A62] hover:text-[#252926] hover:bg-[#EEECE4]'
                      }`}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>

              {/* Search & Status Filter */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-[#8E938B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari ide, problem, atau tag..."
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#DDD9CE] rounded-lg text-xs text-[#2A2E2B] focus:outline-none focus:ring-1 focus:ring-[#8E9B87]"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-[#DDD9CE] rounded-lg px-2.5 py-1.5 text-xs text-[#454A43] focus:outline-none"
                >
                  <option value="ALL">Semua Status</option>
                  <option value="draft">Draf Mentah</option>
                  <option value="analyzing">Sedang Dianalisis</option>
                  <option value="validated">Tervalidasi</option>
                  <option value="paused">Dijeda</option>
                  <option value="done">Selesai</option>
                </select>
              </div>
            </div>

            {/* Ideas Grid */}
            {filteredIdeas.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-[#DDD9CE] rounded-2xl bg-white/40 space-y-3">
                <DiniNeko size="lg" mood="sleeping" />
                <p className="font-semibold text-sm text-[#383D36]">
                  Belum ada catatan yang cocok
                </p>
                <p className="text-xs text-[#7A8078] max-w-sm mx-auto leading-relaxed">
                  Ide yang belum selesai juga boleh disimpan. Tulis apa saja yang ada di kepalamu sekarang.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleCreateNewIdea}
                    className="px-4 py-2 text-xs font-medium text-white bg-[#2B302C] hover:bg-[#1C201D] rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Mulai Catat Ide Ini</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredIdeas.map((idea) => (
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    onOpen={(selected) => {
                      setActiveIdeaId(selected.id);
                      setCurrentTab('write');
                    }}
                    onAnalyze={(selected) => {
                      setAnalyzingIdea(selected);
                    }}
                    onDelete={handleDeleteIdea}
                    onTogglePin={handleTogglePin}
                    onSchedule={(selected, e) => {
                      e.stopPropagation();
                      setActiveIdeaId(selected.id);
                      setShowWorkspaceModal(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      )}

      {/* VIEW 2: MEJA TULIS / NOTEBOOK EDITOR */}
      {currentTab === 'write' && activeIdea && (
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
          <IdeaEditor
            idea={activeIdea}
            onSave={handleSaveIdea}
            onBack={() => setCurrentTab('board')}
            onOpenAnalysis={(ideaToAnalyze) => setAnalyzingIdea(ideaToAnalyze)}
            onOpenWorkspace={(ideaToShare) => {
              setActiveIdeaId(ideaToShare.id);
              setShowWorkspaceModal(true);
            }}
          />
        </main>
      )}

      {/* Analysis Studio Modal (Deep Thinking & Search Grounding) */}
      {analyzingIdea && (
        <AnalysisPanel
          idea={analyzingIdea}
          onClose={() => setAnalyzingIdea(null)}
          onApplyInsights={(newNotes, newDecisions) => {
            const updated: Idea = {
              ...analyzingIdea,
              notes: newNotes,
              updatedAt: new Date().toISOString(),
            };
            if (newDecisions && newDecisions.length > 0) {
              const addedDecs = newDecisions.map((d) => ({
                id: 'dec_' + Date.now() + Math.random().toString(36).slice(2, 5),
                timestamp: new Date().toISOString(),
                decision: d,
                rationale: 'Diadopsi dari analisis pemikiran cerdas.',
              }));
              updated.decisions = [...(updated.decisions || []), ...addedDecs];
            }
            handleSaveIdea(updated, 'Menyematkan wawasan analisis ke dalam ide.');
            setAnalyzingIdea(updated);
          }}
        />
      )}

      {/* History Log Modal (Firebase-style Activity Timeline) */}
      {showLogsModal && (
        <HistoryLogModal
          logs={logs}
          onClose={() => setShowLogsModal(false)}
          onClearLogs={handleClearLogs}
          onExportJson={handleExportJson}
          onImportJson={handleImportJson}
        />
      )}

      {/* Google Workspace Modal (Sheets, Calendar, Slides) */}
      {showWorkspaceModal && (
        <WorkspaceModal
          ideas={ideas}
          logs={logs}
          activeIdea={activeIdea}
          user={user}
          onUserChange={setUser}
          onClose={() => setShowWorkspaceModal(false)}
          onLogAction={(action, detail, ideaTitle) => {
            addLog(action, detail, ideaTitle);
          }}
        />
      )}
    </div>
  );
}
