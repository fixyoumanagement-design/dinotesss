import React, { useState } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  Calendar, 
  Presentation, 
  ExternalLink, 
  Check, 
  AlertCircle, 
  LogIn, 
  LogOut,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Idea, ActivityLog } from '../types';
import { googleSignIn, logout, getAccessToken } from '../services/firebaseAuth';
import { User } from 'firebase/auth';

interface WorkspaceModalProps {
  ideas: Idea[];
  logs: ActivityLog[];
  activeIdea?: Idea | null;
  user: User | null;
  onUserChange: (user: User | null) => void;
  onClose: () => void;
  onLogAction: (action: any, detail: string, ideaTitle?: string) => void;
}

export const WorkspaceModal: React.FC<WorkspaceModalProps> = ({
  ideas,
  logs,
  activeIdea,
  user,
  onUserChange,
  onClose,
  onLogAction,
}) => {
  const [activeTab, setActiveTab] = useState<'sheets' | 'calendar' | 'slides'>('sheets');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<{ message: string; url?: string } | null>(null);

  // Calendar form
  const [calDateTime, setCalDateTime] = useState<string>(() => {
    const d = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return d.toISOString().slice(0, 16);
  });
  const [selectedIdeaId, setSelectedIdeaId] = useState<string>(
    activeIdea ? activeIdea.id : ideas[0]?.id || ''
  );

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        onUserChange(res.user);
        onLogAction('SYNC_WORKSPACE', `Berhasil login Google Workspace sebagai ${res.user.email}`);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Gagal masuk dengan Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      onUserChange(null);
      setSuccessResult(null);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleExportSheets = async () => {
    const token = await getAccessToken();
    if (!token) {
      setError('Sesi Google telah berakhir. Silakan masuk kembali.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessResult(null);

    try {
      const res = await fetch('/api/workspace/sheets/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ideas, logs }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Gagal mengekspor data ke Google Sheets.');
      }

      setSuccessResult({
        message: 'Google Spreadsheet berhasil dibuat dengan semua data ide dan riwayat log!',
        url: json.spreadsheetUrl,
      });

      onLogAction('EXPORT_SHEETS', `Mengekspor ${ideas.length} ide dan ${logs.length} log ke Google Sheets`);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mengekspor ke Sheets.');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleCalendar = async () => {
    const token = await getAccessToken();
    if (!token) {
      setError('Sesi Google telah berakhir. Silakan masuk kembali.');
      return;
    }

    const targetIdea = ideas.find((i) => i.id === selectedIdeaId) || activeIdea;
    if (!targetIdea) {
      setError('Silakan pilih salah satu ide untuk dijadwalkan.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessResult(null);

    try {
      const res = await fetch('/api/workspace/calendar/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ideaTitle: targetIdea.title,
          problem: targetIdea.problem,
          notes: targetIdea.notes,
          startTime: new Date(calDateTime).toISOString(),
          durationMinutes: 45,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Gagal menambahkan jadwal ke Google Calendar.');
      }

      setSuccessResult({
        message: `Sesi evaluasi "${targetIdea.title}" berhasil dijadwalkan pada Google Calendar!`,
        url: json.htmlLink,
      });

      onLogAction('SCHEDULE_CALENDAR', `Menjadwalkan review untuk "${targetIdea.title}"`, targetIdea.title);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menjadwalkan ke Google Calendar.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportSlides = async () => {
    const token = await getAccessToken();
    if (!token) {
      setError('Sesi Google telah berakhir. Silakan masuk kembali.');
      return;
    }

    const targetIdea = ideas.find((i) => i.id === selectedIdeaId) || activeIdea;
    if (!targetIdea) {
      setError('Silakan pilih salah satu ide untuk dibuatkan deck.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessResult(null);

    try {
      const res = await fetch('/api/workspace/slides/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ idea: targetIdea }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Gagal membuat Google Slides.');
      }

      setSuccessResult({
        message: `Slide deck untuk ide "${targetIdea.title}" berhasil dibuat!`,
        url: json.presentationUrl,
      });

      onLogAction('CREATE_SLIDES', `Membuat presentasi Google Slides untuk "${targetIdea.title}"`, targetIdea.title);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat membuat Google Slides.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/35 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF9F5] border border-[#DDD9CE] rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#ECE8DC] flex items-center justify-between bg-white">
          <div>
            <h2 className="text-base font-semibold text-[#252826] flex items-center gap-2">
              <span>Integrasi Google Workspace</span>
              <span className="text-[11px] font-normal text-[#8A8F88] font-serif">
                連携ツール
              </span>
            </h2>
            <p className="text-xs text-[#71776F]">
              Sinkronisasi ide ke Google Sheets, Calendar, dan Slides secara langsung.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#91968E] hover:text-[#232724] rounded-lg hover:bg-[#F2EFE8] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Auth Banner */}
        <div className="p-4 bg-[#F4F1EA] border-b border-[#E6E2D8] flex items-center justify-between gap-3 text-xs">
          {user ? (
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <div>
                <p className="font-semibold text-[#2A2E2B]">{user.displayName || 'Terhubung'}</p>
                <p className="text-[11px] text-[#696F67]">{user.email}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[#565C54]">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Masuk dengan Google untuk mengaktifkan sinkronisasi dokumen & kalender.</span>
            </div>
          )}

          {user ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="px-2.5 py-1 text-xs font-medium text-[#7C3D34] hover:bg-white rounded border border-[#DDD9CE] transition-colors flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" />
              <span>Keluar</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSignIn}
              disabled={loading}
              className="px-3 py-1.5 text-xs font-medium bg-white text-[#232724] hover:bg-[#FAF9F5] border border-[#DDD9CE] rounded-lg shadow-xs transition-colors flex items-center gap-2 font-sans"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span>Sign in with Google</span>
            </button>
          )}
        </div>

        {/* Feature Tabs */}
        <div className="flex border-b border-[#ECE8DC] bg-white px-5 pt-3 gap-2 text-xs">
          <button
            type="button"
            onClick={() => {
              setActiveTab('sheets');
              setSuccessResult(null);
            }}
            className={`pb-2.5 px-2 font-medium flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'sheets'
                ? 'border-[#2E7D32] text-[#2E7D32]'
                : 'border-transparent text-[#6D726B] hover:text-[#232724]'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span>Google Sheets</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('calendar');
              setSuccessResult(null);
            }}
            className={`pb-2.5 px-2 font-medium flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'calendar'
                ? 'border-[#1565C0] text-[#1565C0]'
                : 'border-transparent text-[#6D726B] hover:text-[#232724]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#1565C0]" />
            <span>Google Calendar</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('slides');
              setSuccessResult(null);
            }}
            className={`pb-2.5 px-2 font-medium flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'slides'
                ? 'border-[#D97706] text-[#D97706]'
                : 'border-transparent text-[#6D726B] hover:text-[#232724]'
            }`}
          >
            <Presentation className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Google Slides</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successResult && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{successResult.message}</span>
              </div>
              {successResult.url && (
                <a
                  href={successResult.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 text-white rounded-lg font-medium hover:bg-emerald-800 transition-colors"
                >
                  <span>Buka Dokumen di Google Workspace</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}

          {/* TAB 1: SHEETS */}
          {activeTab === 'sheets' && (
            <div className="space-y-4">
              <div className="p-4 bg-white border border-[#E4E0D5] rounded-xl space-y-2">
                <p className="font-semibold text-[#292D2A]">
                  Ekspor Lembar Kerja (Spreadsheet)
                </p>
                <p className="text-[#646A62] leading-relaxed">
                  Semua ide yang tercatat ({ideas.length} item) beserta rumusan problem, hipotesis solusi, keputusan kunci, dan riwayat log aktivitas ({logs.length} entri) akan diekspor otomatis ke file Google Spreadsheet baru yang rapi.
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleExportSheets}
                  disabled={loading || !user}
                  className="px-4 py-2 bg-[#232724] text-white hover:bg-[#151715] disabled:opacity-50 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-xs"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#81C784]" />
                  <span>{loading ? 'Sedang Mengekspor...' : 'Ekspor ke Google Sheets'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CALENDAR */}
          {activeTab === 'calendar' && (
            <div className="space-y-4">
              <div className="p-4 bg-white border border-[#E4E0D5] rounded-xl space-y-3">
                <p className="font-semibold text-[#292D2A]">
                  Jadwalkan Sesi Refleksi & Review Ide
                </p>
                <p className="text-[#646A62]">
                  Pilih ide yang ingin kamu luangkan waktu untuk evaluasi mendalam, lalu tetapkan tanggal dan waktu review di kalender Google pribadimu.
                </p>

                <div className="space-y-2 pt-2">
                  <label className="block text-[#434842] font-medium">Pilih Ide:</label>
                  <select
                    value={selectedIdeaId}
                    onChange={(e) => setSelectedIdeaId(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-[#DDD9CE] rounded-lg p-2 text-xs focus:outline-none"
                  >
                    {ideas.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.title || 'Ide tanpa judul'} ({i.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-[#434842] font-medium">Waktu Sesi:</label>
                  <input
                    type="datetime-local"
                    value={calDateTime}
                    onChange={(e) => setCalDateTime(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-[#DDD9CE] rounded-lg p-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleScheduleCalendar}
                  disabled={loading || !user || !selectedIdeaId}
                  className="px-4 py-2 bg-[#232724] text-white hover:bg-[#151715] disabled:opacity-50 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-xs"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#90CAF9]" />
                  <span>{loading ? 'Menjadwalkan...' : 'Pasang di Google Calendar'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: SLIDES */}
          {activeTab === 'slides' && (
            <div className="space-y-4">
              <div className="p-4 bg-white border border-[#E4E0D5] rounded-xl space-y-3">
                <p className="font-semibold text-[#292D2A]">
                  Buat Presentasi Ringkas (Google Slides)
                </p>
                <p className="text-[#646A62]">
                  Buat presentasi slide deck baru dari ide pilihanmu, lengkap dengan slide pembuka, penjabaran masalah, dan hipotesis solusi.
                </p>

                <div className="space-y-2 pt-2">
                  <label className="block text-[#434842] font-medium">Pilih Ide:</label>
                  <select
                    value={selectedIdeaId}
                    onChange={(e) => setSelectedIdeaId(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-[#DDD9CE] rounded-lg p-2 text-xs focus:outline-none"
                  >
                    {ideas.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.title || 'Ide tanpa judul'} ({i.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleExportSlides}
                  disabled={loading || !user || !selectedIdeaId}
                  className="px-4 py-2 bg-[#232724] text-white hover:bg-[#151715] disabled:opacity-50 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-xs"
                >
                  <Presentation className="w-3.5 h-3.5 text-[#FFE082]" />
                  <span>{loading ? 'Membuat Slide...' : 'Buat Slide Deck'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
