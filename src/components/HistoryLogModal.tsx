import React, { useState } from 'react';
import { 
  X, 
  History, 
  Download, 
  Upload, 
  Trash2, 
  Search, 
  Filter, 
  CheckCircle, 
  FileSpreadsheet,
  Clock,
  Sparkles,
  GitCommit
} from 'lucide-react';
import { ActivityLog, ActionType } from '../types';

interface HistoryLogModalProps {
  logs: ActivityLog[];
  onClose: () => void;
  onClearLogs: () => void;
  onExportJson: () => void;
  onImportJson: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ACTION_LABELS: Record<ActionType, { label: string; dotColor: string }> = {
  CREATE_IDEA: { label: 'Ide Baru', dotColor: 'bg-[#52796F]' },
  UPDATE_CONTENT: { label: 'Catatan Diperbarui', dotColor: 'bg-[#6B7F96]' },
  AI_DEEP_THINKING: { label: 'Deep Thinking', dotColor: 'bg-[#7E57C2]' },
  AI_SEARCH_RESEARCH: { label: 'Riset Pasar AI', dotColor: 'bg-[#3F8062]' },
  AI_QUICK_REFINE: { label: 'Ringkas Cepat', dotColor: 'bg-[#D48B38]' },
  STATUS_CHANGE: { label: 'Ganti Status', dotColor: 'bg-[#C04A3E]' },
  DECISION_LOGGED: { label: 'Kunci Keputusan', dotColor: 'bg-[#2E7D32]' },
  EXPORT_SHEETS: { label: 'Google Sheets', dotColor: 'bg-[#0F9D58]' },
  SCHEDULE_CALENDAR: { label: 'Google Calendar', dotColor: 'bg-[#4285F4]' },
  CREATE_SLIDES: { label: 'Google Slides', dotColor: 'bg-[#F4B400]' },
  RESTORE_REVISION: { label: 'Pulihkan Revisi', dotColor: 'bg-[#8D6E63]' },
};

export const HistoryLogModal: React.FC<HistoryLogModalProps> = ({
  logs,
  onClose,
  onClearLogs,
  onExportJson,
  onImportJson,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState<string>('ALL');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      (log.detail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.ideaTitle || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = filterAction === 'ALL' || log.action === filterAction;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/35 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF9F5] border border-[#DDD9CE] rounded-2xl w-full max-w-4xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#ECE8DC] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#F2EFE8] rounded-lg text-[#3D423D]">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#252826] flex items-center gap-2">
                <span>Riwayat & Log Jejak Pemikiran</span>
                <span className="text-[11px] font-normal text-[#8A8F88] font-serif">
                  履歴ログ
                </span>
              </h2>
              <p className="text-xs text-[#71776F]">
                Semua rekam jejak ide, keputusan, revisi, dan sinkronisasi tersimpan permanen.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onExportJson}
              className="px-2.5 py-1.5 text-xs font-medium text-[#4A5049] bg-[#F2EFE8] hover:bg-[#E7E4DC] border border-[#DDD9CE] rounded-lg transition-colors flex items-center gap-1.5"
              title="Unduh cadangan data JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Backup JSON</span>
            </button>

            <label className="px-2.5 py-1.5 text-xs font-medium text-[#4A5049] bg-[#F2EFE8] hover:bg-[#E7E4DC] border border-[#DDD9CE] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Pulihkan</span>
              <input
                type="file"
                accept=".json"
                onChange={onImportJson}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#91968E] hover:text-[#232724] rounded-lg hover:bg-[#F2EFE8] transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 bg-[#F5F3EC] border-b border-[#E8E4DA] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-[#8F948C] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari aktivitas atau judul ide..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#DDD9CE] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8E9B87] text-xs text-[#2A2E2B]"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="bg-white border border-[#DDD9CE] rounded-lg px-2.5 py-1.5 text-xs text-[#353935] focus:outline-none"
            >
              <option value="ALL">Semua Jenis Aksi</option>
              <option value="CREATE_IDEA">Ide Baru</option>
              <option value="UPDATE_CONTENT">Catatan Diperbarui</option>
              <option value="DECISION_LOGGED">Kunci Keputusan</option>
              <option value="AI_DEEP_THINKING">Deep Thinking</option>
              <option value="AI_SEARCH_RESEARCH">Riset Pasar AI</option>
              <option value="STATUS_CHANGE">Perubahan Status</option>
              <option value="EXPORT_SHEETS">Google Sheets</option>
              <option value="SCHEDULE_CALENDAR">Google Calendar</option>
            </select>

            {logs.length > 0 && (
              <button
                type="button"
                onClick={onClearLogs}
                className="p-1.5 text-[#9A9E96] hover:text-[#B84236] hover:bg-red-50 rounded-lg transition-colors"
                title="Bersihkan riwayat log"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Timeline Log List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3 text-xs">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-[#858A83] italic border border-dashed border-[#DDD9CE] rounded-xl bg-white/40">
              Belum ada riwayat aktivitas yang sesuai kriteria.
            </div>
          ) : (
            <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-[#DDD9CE]">
              {filteredLogs.map((log) => {
                const actionInfo = ACTION_LABELS[log.action] || {
                  label: log.action,
                  dotColor: 'bg-[#7A8078]',
                };
                const formattedTime = new Date(log.timestamp).toLocaleString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div key={log.id} className="relative group">
                    {/* Node Dot */}
                    <div
                      className={`absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full ${actionInfo.dotColor} ring-4 ring-[#FAF9F5] shadow-xs`}
                    />

                    {/* Card */}
                    <div className="p-3 bg-white border border-[#E6E2D8] rounded-xl shadow-xs hover:border-[#BBB6A9] transition-colors">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1 text-[11px] text-[#7A8079]">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-[#303531]">
                            {actionInfo.label}
                          </span>
                          {log.ideaTitle && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-[#4E564F] font-medium">
                                "{log.ideaTitle}"
                              </span>
                            </>
                          )}
                        </div>
                        <span className="font-mono tabular-nums text-[#8D928B]">
                          {formattedTime}
                        </span>
                      </div>

                      <p className="text-xs text-[#383C39] leading-relaxed">
                        {log.detail}
                      </p>

                      <div className="mt-2 pt-1.5 border-t border-black/[0.04] flex items-center justify-between text-[10px] text-[#939891]">
                        <span>Oleh: {log.author}</span>
                        <span className="font-mono">{log.id.slice(0, 10)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
