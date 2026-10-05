import React, { useState } from 'react';
import { 
  ArrowRight, 
  Check, 
  Calendar, 
  FileSpreadsheet, 
  Presentation, 
  Sparkles, 
  BookOpen, 
  History, 
  BrainCircuit, 
  Search, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Pin
} from 'lucide-react';
import { DiniNeko } from './DiniNeko';
import { HankoStamp } from './HankoStamp';
import { Idea, ActivityLog } from '../types';

interface LandingPageProps {
  onOpenWorkspaceApp: () => void;
  onOpenEditorWithNew: () => void;
  onOpenLogsModal: () => void;
  onOpenGoogleWorkspaceModal: () => void;
  ideas: Idea[];
  logs: ActivityLog[];
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenWorkspaceApp,
  onOpenEditorWithNew,
  onOpenLogsModal,
  onOpenGoogleWorkspaceModal,
  ideas,
  logs,
}) => {
  // Feature 1 tab state
  const [activeFeatureTab, setActiveFeatureTab] = useState<'problem' | 'hypothesis' | 'analysis' | 'decision'>('problem');

  return (
    <div className="bg-[#FAF9F4] text-[#202321] selection:bg-[#E2EAE0]">
      {/* 1. SLIM HEADER */}
      <header className="sticky top-0 z-40 bg-[#FAF9F4]/90 backdrop-blur-md border-b border-[#E8E5DC]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Brand left */}
          <div className="flex items-center gap-2.5">
            <span className="font-bold tracking-tight text-sm text-[#202321]">
              dinicatet
            </span>
            <span className="text-[10px] tracking-wider text-[#777871] uppercase font-mono border-l border-[#DDD9CE] pl-2">
              edisi 2026 · ruang ide
            </span>
          </div>

          {/* Nav buttons right */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenLogsModal}
              className="px-3 py-1 text-xs font-medium text-[#4D524A] bg-transparent border border-[#DDD9CE] hover:border-[#BBB5A5] hover:bg-[#F2EFE8] rounded-md transition-colors whitespace-nowrap"
            >
              Riwayat Log
            </button>
            <button
              type="button"
              onClick={onOpenWorkspaceApp}
              className="px-3.5 py-1 text-xs font-medium text-[#202321] bg-[#EEF0E2] border border-[#D5DCCB] hover:bg-[#E4E8D6] rounded-md transition-colors whitespace-nowrap"
            >
              Buka Meja Tulis
            </button>
          </div>
        </div>
      </header>

      {/* 2. CENTERED HERO */}
      <section className="pt-16 pb-12 px-4 sm:px-6 text-center max-w-4xl mx-auto">
        {/* Spaced Eyebrow */}
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#777871] font-medium mb-3">
          ARSIP PEMIKIRAN & RUANG ANALISIS PRIBADI
        </p>

        {/* Oversized one-line headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#202321] leading-tight mb-4">
          Catat dulu. Pikirkan nanti.
        </h1>

        {/* Compact Edition Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-[#EEF0E2] border border-[#D8DFCE] text-[#4A5E4E] rounded-full text-[11px] font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4E885B]" />
          <span>V1.0 PERSONAL THINKING VAULT</span>
        </div>

        {/* Centered illustration without frame with floating chips */}
        <div className="relative max-w-lg mx-auto my-6 py-4 flex flex-col items-center justify-center">
          {/* Floating Chip Left: Problem */}
          <div className="absolute top-2 -left-2 sm:-left-8 bg-white/95 backdrop-blur-xs border border-[#E0DCD1] rounded-lg p-2.5 text-left shadow-xs text-[11px] max-w-[190px] hidden xs:block z-10">
            <span className="text-[#C04A3E] font-semibold block text-[10px] uppercase">Problem</span>
            <span className="text-[#555A52] line-clamp-1 italic">"Sering lupa akar masalah awal..."</span>
          </div>

          {/* Floating Chip Right: Validated Seal */}
          <div className="absolute top-2 -right-2 sm:-right-8 bg-white/95 backdrop-blur-xs border border-[#E0DCD1] rounded-lg p-2 text-left shadow-xs text-[11px] hidden xs:block z-10">
            <HankoStamp status="validated" size="sm" />
          </div>

          {/* Floating Chip Bottom Left: Decisions */}
          <div className="absolute bottom-4 -left-2 sm:-left-6 bg-white/95 backdrop-blur-xs border border-[#E0DCD1] rounded-lg px-3 py-1.5 text-left shadow-xs text-[10px] text-[#444941] flex items-center gap-1.5 z-10">
            <span className="w-2 h-2 rounded-full bg-[#52796F]" />
            <span>3 Keputusan Terkunci</span>
          </div>

          {/* Floating Chip Bottom Right: Gemini High Thinking */}
          <div className="absolute bottom-4 -right-2 sm:-right-6 bg-[#EEF0E2]/95 backdrop-blur-xs border border-[#D5DCCB] rounded-lg px-3 py-1.5 text-left shadow-xs text-[10px] text-[#3E5242] flex items-center gap-1.5 z-10">
            <Sparkles className="w-3 h-3 text-[#4A7250]" />
            <span>Deep Thinking 3.1</span>
          </div>

          {/* Mascot Center Stage - Completely Free-Floating */}
          <div className="flex flex-col items-center justify-center py-2">
            <DiniNeko size="lg" mood="calm" interactive={true} />
            <p className="text-xs text-[#71766F] font-serif mt-2">
              Dini Meditasi · Penjaga ketenangan berpikirmu
            </p>
          </div>
        </div>

        {/* 3. HERO VALUE STATEMENT & ACTIONS */}
        <div className="max-w-2xl mx-auto space-y-4 pt-4">
          <p className="text-lg sm:text-xl font-medium text-[#202321] leading-snug">
            Tempat tenang untuk menaruh problem, merumuskan hipotesis, dan menyimpan semua jejak keputusan agar tidak menguap.
          </p>
          <p className="text-xs sm:text-sm text-[#777871] leading-relaxed">
            Bukan dashboard produktivitas yang membuat stres. dinicatet adalah ruang pribadi yang dilengkapi audit trail riwayat seperti Firebase, penalaran cerdas Gemini, dan ekspor instan ke Google Workspace.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              type="button"
              onClick={onOpenEditorWithNew}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#202321] hover:bg-[#111311] rounded-lg transition-colors flex items-center gap-2 shadow-xs"
            >
              <span>Mulai Catat Ide Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onOpenWorkspaceApp}
              className="px-4 py-2.5 text-xs font-medium text-[#202321] bg-white border border-[#DDD9CE] hover:bg-[#F4F1E8] rounded-lg transition-colors"
            >
              Buka Papan Ide ({ideas.length})
            </button>

            <button
              type="button"
              onClick={onOpenGoogleWorkspaceModal}
              className="px-4 py-2.5 text-xs font-medium text-[#464D43] bg-[#EEF0E2] border border-[#D5DCCB] hover:bg-[#E3E8D5] rounded-lg transition-colors flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#3F7C4B]" />
              <span>Workspace Sync</span>
            </button>
          </div>

          <p className="text-[11px] text-[#8C9089] pt-2">
            Privat & personal · Tersimpan permanen di peramban · Tanpa pendaftaran rumit
          </p>
        </div>
      </section>

      {/* THIN HORIZONTAL RULE */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <hr className="border-t border-[#E6E3D8]" />
      </div>

      {/* 4. FEATURE SECTION: SHARED CORNER */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Text & Segmented Tabs */}
          <div className="lg:col-span-5 space-y-5 text-left">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#777871] font-mono">
              STRUKTUR PIKIRAN
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202321]">
              Dari keresahan mentah hingga keputusan final.
            </h2>
            <p className="text-xs text-[#777871] leading-relaxed">
              Ide seringkali mati bukan karena jelek, tapi karena kita lupa problem apa yang sebenarnya mau dipecahkan. Di dinicatet, setiap elemen punya ruangnya sendiri.
            </p>

            {/* Segmented control tabs */}
            <div className="space-y-1.5 pt-2">
              {[
                { id: 'problem', title: '01. Urai Problem', desc: 'Identifikasi akar friksi dan rasa gregetan.' },
                { id: 'hypothesis', title: '02. Rumuskan Hipotesis', desc: 'Firasat solusi yang bisa diuji nyata.' },
                { id: 'analysis', title: '03. Analisis Mendalam', desc: 'Uji blind spot dengan Gemini High Thinking.' },
                { id: 'decision', title: '04. Kunci Keputusan', desc: 'Simpan komitmen diri dengan timestamp.' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFeatureTab(tab.id as any)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    activeFeatureTab === tab.id
                      ? 'bg-white border-[#C9C4B7] shadow-xs'
                      : 'bg-transparent border-transparent hover:bg-white/50 text-[#6C716B]'
                  }`}
                >
                  <span className={`block font-semibold text-xs ${activeFeatureTab === tab.id ? 'text-[#202321]' : 'text-[#6C716B]'}`}>
                    {tab.title}
                  </span>
                  <span className="text-[11px] text-[#868B83]">
                    {tab.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Large Rounded Pale Demo Panel */}
          <div className="lg:col-span-7">
            <div className="bg-[#EEF0E2] border border-[#D8DFCE] rounded-2xl p-6 sm:p-8 shadow-xs relative">
              <div className="flex items-center justify-between pb-4 border-b border-[#D8DFCE] text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#29352A]">Pratinjau Meja Tulis</span>
                  <span className="text-[#6D796E]">· Kotak Resep Suara Ibu</span>
                </div>
                <HankoStamp status="analyzing" size="sm" />
              </div>

              {/* Dynamic State Preview */}
              <div className="pt-6 space-y-4 text-xs text-left">
                {activeFeatureTab === 'problem' && (
                  <div className="bg-white p-4 rounded-xl border border-[#D5DCCB] space-y-2 animate-fadeIn">
                    <span className="text-[10px] font-semibold text-[#C04A3E] uppercase tracking-wider block">
                      Problem yang dihadapi:
                    </span>
                    <p className="text-sm italic text-[#333832] font-serif leading-relaxed">
                      "Sering lupa takaran bumbu masakan rumah khas ibu, dan teks resep biasa kehilangan rasa kehangatan cerita di baliknya."
                    </p>
                    <p className="text-[11px] text-[#7A8078]">
                      Akar friksi: Format teks terlalu kaku dan impersonal.
                    </p>
                  </div>
                )}

                {activeFeatureTab === 'hypothesis' && (
                  <div className="bg-white p-4 rounded-xl border border-[#D5DCCB] space-y-2 animate-fadeIn">
                    <span className="text-[10px] font-semibold text-[#4E7652] uppercase tracking-wider block">
                      Hipotesis Solusi:
                    </span>
                    <p className="text-sm text-[#333832] leading-relaxed">
                      Audio notes pendek berdurasi 30 detik yang disandingkan dengan foto masakan membuat proses masak terasa seperti didampingi langsung.
                    </p>
                    <p className="text-[11px] text-[#7A8078]">
                      Uji coba: Rekam 3 audio pertama masakan opor ayam dan sambal goreng.
                    </p>
                  </div>
                )}

                {activeFeatureTab === 'analysis' && (
                  <div className="bg-white p-4 rounded-xl border border-[#D5DCCB] space-y-2.5 animate-fadeIn">
                    <span className="text-[10px] font-semibold text-[#6E4E8A] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-[#6E4E8A]" />
                      Gemini Deep Thinking 3.1 Pro Insights:
                    </span>
                    <p className="text-xs text-[#2A2E2A] leading-relaxed">
                      Wawasan: Pengguna dapur tidak bisa memegang layar saat tangan basah atau berminyak. Format audio mikro sangat relevan.
                    </p>
                    <div className="p-2 bg-[#F6F8F4] rounded border border-[#DFE5D9] text-[11px] text-[#4F594D]">
                      Rekomendasi 24 jam: Uji coba pemutaran via perintah suara sederhana.
                    </div>
                  </div>
                )}

                {activeFeatureTab === 'decision' && (
                  <div className="bg-white p-4 rounded-xl border border-[#D5DCCB] space-y-2 animate-fadeIn">
                    <span className="text-[10px] font-semibold text-[#2E7D32] uppercase tracking-wider block flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                      Keputusan Terkunci:
                    </span>
                    <p className="font-semibold text-xs text-[#292D2A]">
                      "Fokus ke format audio micro-snippet, bukan resep panjang formal."
                    </p>
                    <p className="text-[11px] text-[#696F67]">
                      Alasan: Keluarga lebih suka mendengar nada bicara asli ibu ketimbang teks formal.
                    </p>
                    <p className="text-[10px] text-[#8C9089] font-mono">
                      Timestamp: 2026-10-04T14:32:00Z
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THIN HORIZONTAL RULE */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <hr className="border-t border-[#E6E3D8]" />
      </div>

      {/* 5. THREE-STEP USAGE SECTION */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 text-left">
        <p className="text-[10px] uppercase tracking-[0.22em] text-[#777871] font-mono mb-2">
          ALUR KERJA
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202321] mb-12">
          Tiga langkah menjaga kejernihan pemikiran.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <span className="text-xl font-bold text-[#202321] font-mono">01</span>
            <h3 className="text-sm font-bold text-[#202321]">
              Tangkap Keresahan & Problem
            </h3>
            <p className="text-xs text-[#777871] leading-relaxed">
              Tuliskan problem apa adanya tanpa dihakimi. Bedakan antara rasa frustrasi nyata dengan solusi yang masih berbayang di kepala.
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-xl font-bold text-[#202321] font-mono">02</span>
            <h3 className="text-sm font-bold text-[#202321]">
              Bedah dengan Asisten Analisis
            </h3>
            <p className="text-xs text-[#777871] leading-relaxed">
              Ajak model penalaran mendalam mengurai blind spot, atau gunakan Google Search live grounding untuk memverifikasi apakah solusi serupa sudah ada di internet.
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-xl font-bold text-[#202321] font-mono">03</span>
            <h3 className="text-sm font-bold text-[#202321]">
              Kunci Keputusan & Rekam Riwayat
            </h3>
            <p className="text-xs text-[#777871] leading-relaxed">
              Setiap kali kamu menentukan arah baru atau mengubah draf, dinicatet mencatatnya ke dalam log seperti Firebase. Ide lama tidak pernah lenyap.
            </p>
          </div>
        </div>
      </section>

      {/* THIN HORIZONTAL RULE */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <hr className="border-t border-[#E6E3D8]" />
      </div>

      {/* 6. FEATURE SECTION: RIWAYAT & RANKINGS (TILTED FRAMED LIST UI) */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-4 text-left">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#777871] font-mono">
              AUDIT TRAIL SEPERTI FIREBASE
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202321]">
              Semua jejak perubahan tersimpan aman.
            </h2>
            <p className="text-xs text-[#777871] leading-relaxed">
              Pernahkah kamu kembali ke catatan 3 bulan lalu dan bingung kenapa dulu memilih jalan tersebut? Di dinicatet, setiap keputusan, perubahan status, dan pembaruan draf memiliki timestamp dan alasan.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenLogsModal}
                className="text-xs font-semibold text-[#202321] underline decoration-[#A8A495] underline-offset-4 hover:decoration-[#202321] transition-colors"
              >
                Buka Log Riwayat Lengkap ({logs.length} entri) →
              </button>
            </div>
          </div>

          {/* Right Column: Slightly tilted framed UI */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-md bg-white border border-[#DDD9CE] rounded-2xl p-5 shadow-sm transform rotate-1 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-[#ECE8DC] text-xs">
                <span className="font-semibold text-[#252825] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#5F655E]" />
                  Aktivitas Terakhir
                </span>
                <span className="text-[10px] font-mono text-[#898E86]">LIVE AUDIT</span>
              </div>

              <div className="divide-y divide-[#F0ECE1] text-xs">
                {logs.slice(0, 4).map((l) => (
                  <div key={l.id} className="py-2.5 flex items-start justify-between gap-3 text-left">
                    <div>
                      <p className="font-medium text-[#292D2A] line-clamp-1">{l.detail}</p>
                      <p className="text-[10px] text-[#868B83]">
                        {l.ideaTitle ? `"${l.ideaTitle}" · ` : ''}
                        {new Date(l.timestamp).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#F2EFE8] rounded text-[#4E544C] shrink-0">
                      {l.action.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THIN HORIZONTAL RULE */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <hr className="border-t border-[#E6E3D8]" />
      </div>

      {/* 7. THREE-CARD MOMENTS SECTION */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-[10px] uppercase tracking-[0.22em] text-[#777871] font-mono mb-2">
          MOMEN PENGGUNAAN
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202321] mb-12">
          Dibuat untuk saat-saat pikiranmu penuh.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Card 1 */}
          <div className="bg-[#F3F1E5] border border-[#E3DFD2] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div className="mb-4">
              <div className="w-9 h-9 rounded-lg bg-[#E7E2D3] flex items-center justify-center text-[#4B524A] mb-3">
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#202321] mb-1.5">
                Saat Menemukan Problem Gregetan
              </h3>
              <p className="text-xs text-[#71766E] leading-relaxed">
                Langsung tuang di Meja Tulis sebelum buyar. Tulis kalimat apa adanya, tanpa harus langsung memikirkan solusi sempurna.
              </p>
            </div>
            <span className="text-[11px] font-mono text-[#8C9289]">Fase: Tangkap Spontan</span>
          </div>

          {/* Card 2 */}
          <div className="bg-[#EEF0E2] border border-[#D8DFCE] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div className="mb-4">
              <div className="w-9 h-9 rounded-lg bg-[#DFE6D4] flex items-center justify-center text-[#3B543D] mb-3">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#202321] mb-1.5">
                Saat Butuh Refleksi Mendalam
              </h3>
              <p className="text-xs text-[#71766E] leading-relaxed">
                Buka Ruang Analisis untuk membedah asumsi rapuh, mencari kompetitor di internet, dan merumuskan eksperimen 24 jam ke depan.
              </p>
            </div>
            <span className="text-[11px] font-mono text-[#8C9289]">Fase: Validasi Kritis</span>
          </div>

          {/* Card 3 */}
          <div className="bg-[#FAF2EE] border border-[#EADBD3] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div className="mb-4">
              <div className="w-9 h-9 rounded-lg bg-[#F2E0D6] flex items-center justify-center text-[#824738] mb-3">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#202321] mb-1.5">
                Saat Mau Dibagikan atau Ditindaklanjuti
              </h3>
              <p className="text-xs text-[#71766E] leading-relaxed">
                Sinkronkan ke Google Sheets, pasang pengingat jadwal di Google Calendar, atau generate draf Google Slides dengan 1 klik.
              </p>
            </div>
            <span className="text-[11px] font-mono text-[#8C9289]">Fase: Eksekusi Nyata</span>
          </div>
        </div>

        <p className="text-[11px] text-[#8C9089] mt-6">
          *Semua catatan dan log riwayat tersimpan lokal secara bawaan dengan kontrol cadangan penuh.
        </p>
      </section>

      {/* THIN HORIZONTAL RULE */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <hr className="border-t border-[#E6E3D8]" />
      </div>

      {/* 8. FEATURE SECTION: RESET / CALENDAR NOTIFICATION */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-4 text-left">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#777871] font-mono">
              PENGINGAT & KALENDER
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202321]">
              Jangan biarkan ide mengendap jadi penyesalan.
            </h2>
            <p className="text-xs text-[#777871] leading-relaxed">
              Terkadang ide butuh waktu untuk diendapkan, tapi jangan sampai terlupakan. Pasang jadwal sesi refleksi langsung di Google Calendar kamu dengan waktu dan notifikasi yang telah disiapkan.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenGoogleWorkspaceModal}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#202321] hover:bg-[#111311] rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Atur Jadwal di Google Calendar</span>
              </button>
            </div>
          </div>

          {/* Right Column: Pale green notification demo card */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-md bg-[#EEF0E2] border border-[#D5DCCB] rounded-2xl p-6 shadow-xs text-left space-y-3">
              <div className="flex items-center gap-2 text-xs text-[#4F594D] font-medium">
                <Calendar className="w-3.5 h-3.5 text-[#3F7C4B]" />
                <span>Google Calendar Notification</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-[#D0D9C6] space-y-1">
                <span className="text-[10px] uppercase font-mono text-[#7A8078]">Besok · 09.00 - 09.45 WIB</span>
                <p className="font-semibold text-xs text-[#202321]">
                  [dinicatet] Review Ide: Kotak Resep Suara Ibu
                </p>
                <p className="text-[11px] text-[#696F67]">
                  Evaluasi apakah format rekaman 30 detik sudah sempat diuji coba.
                </p>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#556052] pt-1">
                <span>Notifikasi popup 15 menit sebelumnya</span>
                <span className="font-serif">済 Terjadwal</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THIN HORIZONTAL RULE */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <hr className="border-t border-[#E6E3D8]" />
      </div>

      {/* 9. THREE-STEP SETUP SECTION */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 text-left">
        <p className="text-[10px] uppercase tracking-[0.22em] text-[#777871] font-mono mb-2">
          LANGKAH MUDAH
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202321] mb-12">
          Mulai dalam hitungan detik.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <span className="text-xl font-bold text-[#202321] font-mono">01</span>
            <h3 className="text-sm font-bold text-[#202321]">
              Buka Meja Tulis & Catat Ide
            </h3>
            <p className="text-xs text-[#777871] leading-relaxed">
              Langsung ketik judul dan problem yang ada di kepala. Tidak perlu setup database manual.
            </p>
            <button
              type="button"
              onClick={onOpenEditorWithNew}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#202321] hover:bg-[#111311] rounded-lg transition-colors shadow-xs"
            >
              Buka Meja Tulis
            </button>
          </div>

          <div className="space-y-4">
            <span className="text-xl font-bold text-[#202321] font-mono">02</span>
            <h3 className="text-sm font-bold text-[#202321]">
              Hubungkan Google Workspace
            </h3>
            <p className="text-xs text-[#777871] leading-relaxed">
              Masuk dengan akun Google untuk mengaktifkan ekspor otomatis ke Sheets, jadwal Calendar, dan slide presentasi.
            </p>
            <button
              type="button"
              onClick={onOpenGoogleWorkspaceModal}
              className="px-3.5 py-1.5 text-xs font-medium text-[#202321] bg-[#F2EFE8] border border-[#DDD9CE] hover:bg-[#EAE6DC] rounded-lg transition-colors"
            >
              Koneksi Workspace
            </button>
          </div>

          <div className="space-y-4">
            <span className="text-xl font-bold text-[#202321] font-mono">03</span>
            <h3 className="text-sm font-bold text-[#202321]">
              Bedah Analisis Kapan Saja
            </h3>
            <p className="text-xs text-[#777871] leading-relaxed">
              Gunakan mode Deep Thinking atau Search Grounding saat kamu butuh perspektif kedua yang tajam dan objektif.
            </p>
            <button
              type="button"
              onClick={onOpenWorkspaceApp}
              className="px-3.5 py-1.5 text-xs font-medium text-[#202321] bg-[#EEF0E2] border border-[#D5DCCB] hover:bg-[#E3E8D5] rounded-lg transition-colors"
            >
              Lihat Contoh Analisis
            </button>
          </div>
        </div>
      </section>

      {/* THIN HORIZONTAL RULE */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <hr className="border-t border-[#E6E3D8]" />
      </div>

      {/* 10. BUILDER NOTE SECTION (TAPED NOTE STYLE) */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading & Mascot */}
          <div className="lg:col-span-5 space-y-4 text-left">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#777871] font-mono">
              CATATAN PRIBADI
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202321]">
              Kenapa dinicatet dibangun?
            </h2>
            <div className="py-2">
              <DiniNeko size="md" mood="calm" interactive={true} />
            </div>
            <p className="text-xs text-[#777871] leading-relaxed">
              Sebuah pengingat bahwa tidak semua alat catatan harus penuh tombol AI yang berisik atau grafik produktivitas yang menuntut.
            </p>
          </div>

          {/* Right Column: Taped-note style letter card */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-lg bg-[#FAF9F5] border border-[#E0DCD1] rounded-2xl p-8 relative shadow-sm text-left">
              {/* Washi tape at top */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-4 bg-[#E8E2D2] washi-tape opacity-90" />

              <div className="space-y-3 text-xs text-[#333732] leading-relaxed font-serif">
                <p>
                  "Aku lelah membuka aplikasi notes yang terasa seperti kokpit pesawat tempur. Penuh dengan tombol otomatis, template rumit, dan skor produktivitas yang membuat kita merasa selalu kurang."
                </p>
                <p>
                  "dinicatet dibuat untuk jadi ruang yang adem. Tempat di mana ide mentah yang belum selesai boleh disimpan tanpa rasa bersalah. Tempat di mana kita bisa membedah problem dengan tenang, menguji hipotesis, dan menyimpan keputusan dengan sadar."
                </p>
                <p className="pt-2 font-sans font-semibold text-[#202321]">
                  — Dini & Teman Pemikir
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. CLOSING CTA BAND (FULL WIDTH PALE BACKGROUND) */}
      <section className="py-20 bg-[#EEF0E2] border-y border-[#D8DFCE] text-center px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex justify-center mb-2">
            <DiniNeko size="md" mood="happy" interactive={true} />
          </div>

          <p className="text-[10px] uppercase tracking-[0.2em] text-[#556354] font-mono">
            RUANG PIKIRAN YANG TENANG
          </p>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#202321]">
            Kembalikan ketenangan proses berpikirmmu.
          </h2>

          <p className="text-xs sm:text-sm text-[#5B675A] max-w-xl mx-auto leading-relaxed">
            Mulai dari satu problem kecil yang mengganjal hari ini. Catat sekarang, kembangkan bertahap, dan simpan jejaknya selamanya.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={onOpenEditorWithNew}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#202321] hover:bg-[#111311] rounded-lg transition-colors shadow-xs"
            >
              Catat Ide Baru Sekarang
            </button>
            <button
              type="button"
              onClick={onOpenWorkspaceApp}
              className="px-4 py-2.5 text-xs font-medium text-[#202321] bg-white border border-[#DDD9CE] hover:bg-[#FAF9F5] rounded-lg transition-colors"
            >
              Buka Papan Ide
            </button>
          </div>
        </div>
      </section>

      {/* 12. QUIET MULTI-PART FOOTER */}
      <footer className="py-12 bg-[#FAF9F4] text-xs text-[#777871] border-t border-[#E8E5DC]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center md:text-left">
          {/* Left: Brand/legal */}
          <div>
            <p className="font-bold text-[#202321]">dinicatet</p>
            <p className="text-[11px] text-[#8C9089]">© 2026. Hak cipta milik pemikirnya.</p>
          </div>

          {/* Middle: Attribution */}
          <div className="md:text-center text-[11px] text-[#8C9089]">
            Didesain dengan keheningan estetika Jepang dan kehangatan jurnal pribadi.
          </div>

          {/* Right: Small utility links */}
          <div className="flex items-center justify-center md:justify-end gap-3 text-[11px]">
            <button
              type="button"
              onClick={onOpenWorkspaceApp}
              className="hover:text-[#202321] transition-colors"
            >
              Papan Ide
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={onOpenLogsModal}
              className="hover:text-[#202321] transition-colors"
            >
              Riwayat Log
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={onOpenGoogleWorkspaceModal}
              className="hover:text-[#202321] transition-colors"
            >
              Workspace
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
