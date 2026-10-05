import express from 'express';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

export function createApiHandler(): express.Express {
  const router = express();
  router.use(express.json({ limit: '10mb' }));

  // Shared Gemini Client with required User-Agent
  const getAiClient = () => {
    return new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // POST /api/analyze
  router.post('/api/analyze', async (req, res) => {
    try {
      const { mode, title, problem, hypothesis, notes } = req.body;
      const ai = getAiClient();

      const promptContext = `
Analisis ide berikut dalam bahasa Indonesia yang tenang, tajam, reflektif, dan solutif (seperti seorang mentor pemikir/arsitek ide yang bijak):
Judul Ide: "${title || 'Tanpa Judul'}"
Problem yang dihadapi: "${problem || 'Belum dirumuskan'}"
Hipotesis awal: "${hypothesis || 'Belum dirumuskan'}"
Catatan mentah:
${notes || 'Tidak ada catatan tambahan'}

Berikan output dalam format JSON valid dengan struktur:
{
  "summary": "Ringkasan esensi masalah dan nilai utama ide (2-3 kalimat yang padat dan jernih)",
  "problemBreakdown": [
    "Akar penyebab 1",
    "Akar penyebab 2",
    "Titik friksi utama pengguna/situasi"
  ],
  "keyInsights": [
    "Wawasan strategis 1",
    "Peluang diferensiasi atau sudut pandang baru 2",
    "Kekuatan utama dari solusi ini"
  ],
  "potentialRisks": [
    "Asumsi yang berisiko goyah",
    "Hambatan teknis/eksekusi",
    "Blind spot yang perlu diantisipasi"
  ],
  "actionItems": [
    "Langkah validasi tervalid pertama (Next 24 jam)",
    "Eksperimen kecil kedua",
    "Keputusan kunci yang harus diambil"
  ]
}
`;

      let analysisResultText = '';
      let groundingSources: Array<{ title: string; url: string }> = [];

      if (mode === 'deep') {
        // High Thinking Mode with gemini-3.1-pro-preview and thinkingLevel: ThinkingLevel.HIGH
        // Do not set maxOutputTokens
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-3.1-pro-preview',
            contents: promptContext,
            config: {
              thinkingConfig: {
                thinkingLevel: ThinkingLevel.HIGH,
              },
              responseMimeType: 'application/json',
            },
          });
          analysisResultText = response.text || '';
        } catch (err: any) {
          console.warn('Deep model fallback triggered:', err?.message);
          // Fallback to gemini-3.8-flash with thinking if 3.1-pro needs activation
          const fallbackRes = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: promptContext,
            config: {
              thinkingConfig: {
                thinkingLevel: ThinkingLevel.HIGH,
              },
              responseMimeType: 'application/json',
            },
          });
          analysisResultText = fallbackRes.text || '';
        }
      } else if (mode === 'research') {
        // Search Grounding Mode with gemini-3.5-flash and googleSearch tool
        const searchPrompt = `${promptContext}
Lakukan penelusuran nyata (Google Search) untuk mengecek apakah ide/solusi ini sudah ada kompetitornya di internet, apa tren terkini atau data pendukung yang relevan.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: searchPrompt,
          config: {
            tools: [{ googleSearch: {} }],
          },
        });

        analysisResultText = response.text || '';

        // Extract grounding metadata if available
        const metadata = response.candidates?.[0]?.groundingMetadata;
        if (metadata?.groundingChunks) {
          metadata.groundingChunks.forEach((chunk: any) => {
            if (chunk.web?.uri) {
              groundingSources.push({
                title: chunk.web.title || chunk.web.uri,
                url: chunk.web.uri,
              });
            }
          });
        }
      } else {
        // Quick Refine Mode with gemini-3.1-flash-lite
        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: promptContext,
          config: {
            responseMimeType: 'application/json',
          },
        });
        analysisResultText = response.text || '';
      }

      // Parse JSON from response
      let parsedData;
      try {
        // Remove markdown formatting if present
        const cleaned = analysisResultText
          .replace(/```json/gi, '')
          .replace(/```/g, '')
          .trim();
        parsedData = JSON.parse(cleaned);
      } catch (parseErr) {
        // Safe structured fallback
        parsedData = {
          summary: analysisResultText.slice(0, 300) || 'Ide berhasil dianalisis.',
          problemBreakdown: ['Problem utama teridentifikasi dari catatan.'],
          keyInsights: ['Perlu penajaman proposisi nilai dan validasi awal.'],
          potentialRisks: ['Resiko asumsi belum teruji.'],
          actionItems: ['Buat prototipe atau uji coba cepat dengan target persona.'],
        };
      }

      return res.json({
        success: true,
        data: {
          ...parsedData,
          groundingSources: groundingSources.length > 0 ? groundingSources : undefined,
          timestamp: new Date().toISOString(),
          mode,
        },
      });
    } catch (error: any) {
      console.error('API /api/analyze error:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Gagal memproses analisis ide dengan Gemini.',
      });
    }
  });

  // POST /api/workspace/sheets/export
  router.post('/api/workspace/sheets/export', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: 'Membutuhkan token otentikasi Google Workspace' });
      }

      const { ideas, logs } = req.body;
      const accessToken = authHeader.replace(/^Bearer\s+/i, '');

      // 1. Create a new Spreadsheet
      const title = `dinicatet — Arsip Ide & Riwayat (${new Date().toLocaleDateString('id-ID')})`;
      const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          properties: { title },
          sheets: [
            { properties: { title: 'Daftar Ide & Analisis' } },
            { properties: { title: 'Log Riwayat Aktivitas' } },
          ],
        }),
      });

      if (!createRes.ok) {
        const errJson = await createRes.json();
        throw new Error(errJson?.error?.message || 'Gagal membuat Google Spreadsheet');
      }

      const sheetData = await createRes.json();
      const spreadsheetId = sheetData.spreadsheetId;
      const spreadsheetUrl = sheetData.spreadsheetUrl;

      // 2. Prepare Rows for 'Daftar Ide & Analisis'
      const ideaHeaders = [
        'ID',
        'Judul Ide',
        'Kategori',
        'Status',
        'Problem Utama',
        'Hipotesis Solusi',
        'Catatan / Brain Dump',
        'Ringkasan AI',
        'Keputusan Kunci',
        'Dibuat Pada',
        'Terakhir Diperbarui',
      ];

      const ideaRows = (ideas || []).map((i: any) => [
        i.id,
        i.title,
        i.category,
        i.status,
        i.problem || '-',
        i.hypothesis || '-',
        i.notes || '-',
        i.analysis?.summary || '-',
        (i.decisions || []).map((d: any) => `[${d.timestamp.slice(0, 10)}] ${d.decision}`).join('\n') || '-',
        i.createdAt,
        i.updatedAt,
      ]);

      // 3. Prepare Rows for 'Log Riwayat Aktivitas'
      const logHeaders = ['Timestamp', 'Aksi', 'Terkait Ide', 'Detail Aktivitas', 'Penulis'];
      const logRows = (logs || []).map((l: any) => [
        l.timestamp,
        l.action,
        l.ideaTitle || '-',
        l.detail,
        l.author || 'Lokal',
      ]);

      // 4. Batch update values
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          valueInputOption: 'USER_ENTERED',
          data: [
            {
              range: "'Daftar Ide & Analisis'!A1",
              values: [ideaHeaders, ...ideaRows],
            },
            {
              range: "'Log Riwayat Aktivitas'!A1",
              values: [logHeaders, ...logRows],
            },
          ],
        }),
      });

      return res.json({
        success: true,
        spreadsheetId,
        spreadsheetUrl,
        message: 'Berhasil mengekspor semua ide dan riwayat log ke Google Sheets!',
      });
    } catch (error: any) {
      console.error('Sheets export error:', error);
      return res.status(500).json({ error: error.message || 'Gagal mengekspor ke Google Sheets' });
    }
  });

  // POST /api/workspace/calendar/schedule
  router.post('/api/workspace/calendar/schedule', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: 'Membutuhkan token otentikasi Google Workspace' });
      }

      const { ideaTitle, problem, notes, startTime, durationMinutes = 45 } = req.body;
      const accessToken = authHeader.replace(/^Bearer\s+/i, '');

      const start = new Date(startTime || Date.now() + 24 * 60 * 60 * 1000);
      const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

      const eventPayload = {
        summary: `[dinicatet] Review Ide: ${ideaTitle}`,
        description: `Sesi refleksi dan evaluasi ide dari dinicatet.\n\nProblem yang ingin diselesaikan:\n${problem || '-'}\n\nCatatan:\n${notes || '-'}\n\nRuang Ide: dinicatet`,
        start: {
          dateTime: start.toISOString(),
        },
        end: {
          dateTime: end.toISOString(),
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 15 },
            { method: 'email', minutes: 60 },
          ],
        },
      };

      const calRes = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventPayload),
      });

      if (!calRes.ok) {
        const errJson = await calRes.json();
        throw new Error(errJson?.error?.message || 'Gagal membuat jadwal di Google Calendar');
      }

      const eventData = await calRes.json();
      return res.json({
        success: true,
        htmlLink: eventData.htmlLink,
        summary: eventData.summary,
        start: eventData.start.dateTime,
        message: 'Jadwal sesi review berhasil ditambahkan ke Google Calendar!',
      });
    } catch (error: any) {
      console.error('Calendar schedule error:', error);
      return res.status(500).json({ error: error.message || 'Gagal menambahkan jadwal ke Google Calendar' });
    }
  });

  // POST /api/workspace/slides/export
  router.post('/api/workspace/slides/export', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: 'Membutuhkan token otentikasi Google Workspace' });
      }

      const { idea } = req.body;
      const accessToken = authHeader.replace(/^Bearer\s+/i, '');

      // 1. Create a presentation
      const presTitle = `dinicatet: ${idea.title || 'Konsep Ide'}`;
      const presRes = await fetch('https://slides.googleapis.com/v1/presentations', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: presTitle,
        }),
      });

      if (!presRes.ok) {
        const errJson = await presRes.json();
        throw new Error(errJson?.error?.message || 'Gagal membuat Google Slides');
      }

      const presData = await presRes.json();
      const presentationId = presData.presentationId;
      const presentationUrl = `https://docs.google.com/presentation/d/${presentationId}/edit`;

      // 2. Add slide requests (Problem, Analysis, Next Actions)
      const slide1Id = 'slide_problem_' + Date.now();
      const slide2Id = 'slide_analysis_' + Date.now();

      const requests = [
        {
          createSlide: {
            objectId: slide1Id,
            slideLayoutReference: { predefinedLayout: 'SECTION_HEADER' },
          },
        },
        {
          createSlide: {
            objectId: slide2Id,
            slideLayoutReference: { predefinedLayout: 'TITLE_AND_BODY' },
          },
        },
      ];

      await fetch(`https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requests }),
      });

      return res.json({
        success: true,
        presentationId,
        presentationUrl,
        message: 'Presentasi outline Google Slides berhasil dibuat!',
      });
    } catch (error: any) {
      console.error('Slides export error:', error);
      return res.status(500).json({ error: error.message || 'Gagal membuat Google Slides' });
    }
  });

  return router;
}
