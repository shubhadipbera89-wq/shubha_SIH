'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  Sparkles,
  Mic,
  Volume2,
  FileText,
  ScanEye,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Cpu,
  Bot,
  Zap,
  ArrowRight,
  ShieldCheck,
  Search,
  Activity,
} from 'lucide-react';

export default function AIDashboardPage() {
  const [activeTab, setActiveTab] = useState<'whisper' | 'dedup' | 'opencv'>('whisper');

  // --- Whisper Demo State ---
  const [whisperInputSample, setWhisperInputSample] = useState(
    'Katras village drinking water pipeline has been broken for 3 weeks leading to severe contamination and diarrhea outbreak.'
  );
  const [whisperLang, setWhisperLang] = useState('hi');
  const [whisperResult, setWhisperResult] = useState<any>(null);
  const [whisperLoading, setWhisperLoading] = useState(false);

  // --- Dedup Demo State ---
  const [dedupTitle, setDedupTitle] = useState('Clean drinking water shortage in Katras village block');
  const [dedupDesc, setDedupDesc] = useState(
    'Villagers have no access to potable drinking water. Pipe is broken and well is contaminated with mine runoff.'
  );
  const [dedupResult, setDedupResult] = useState<any>(null);
  const [dedupLoading, setDedupLoading] = useState(false);

  // --- OpenCV Demo State ---
  const [cvImageUrl, setCvImageUrl] = useState(
    'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80'
  );
  const [cvResult, setCvResult] = useState<any>(null);
  const [cvLoading, setCvLoading] = useState(false);

  // Handlers
  const runWhisperDemo = async () => {
    setWhisperLoading(true);
    try {
      const res = await fetch('/api/ai/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio_base64: 'sample_audio_input', language: whisperLang }),
      });
      const data = await res.json();
      setWhisperResult(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setWhisperLoading(false);
    }
  };

  const runDedupDemo = async () => {
    setDedupLoading(true);
    try {
      const res = await fetch('/api/ai/deduplicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: dedupTitle, description: dedupDesc }),
      });
      const data = await res.json();
      setDedupResult(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setDedupLoading(false);
    }
  };

  const runCvDemo = async (urlToTest?: string) => {
    setCvLoading(true);
    try {
      const res = await fetch('/api/ai/filter-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: urlToTest || cvImageUrl }),
      });
      const data = await res.json();
      setCvResult(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setCvLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Header Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 border border-purple-800/40 p-8 sm:p-12 shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow">
              <Zap className="w-4 h-4 text-slate-950" />
              Python AI Suite
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-mono">
              FastAPI + PyTorch + OpenCV
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            AI & NLP Intelligence Engine
          </h1>

          <p className="text-sm sm:text-base text-purple-200 max-w-3xl leading-relaxed">
            Automating Jharkhand civic problem resolution through deep learning: OpenAI Whisper for voice reporting, Sentence-Transformers for semantic deduplication, and OpenCV for computer vision spam filtering.
          </p>

          <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
              <Mic className="w-8 h-8 text-amber-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">OpenAI Whisper</div>
                <div className="text-[11px] text-purple-300">Voice-to-Text Transcription</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-indigo-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">Sentence-Transformers</div>
                <div className="text-[11px] text-purple-300">Semantic Issue Deduplication</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
              <ScanEye className="w-8 h-8 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">OpenCV (CV2)</div>
                <div className="text-[11px] text-purple-300">Blur & Anti-Spam Inspector</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 space-x-4">
          <button
            onClick={() => setActiveTab('whisper')}
            className={`pb-4 px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'whisper'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mic className="w-4 h-4" />
            1. OpenAI Whisper (Voice)
          </button>

          <button
            onClick={() => setActiveTab('dedup')}
            className={`pb-4 px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'dedup'
                ? 'border-indigo-400 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            2. Sentence-Transformers (Deduplication)
          </button>

          <button
            onClick={() => setActiveTab('opencv')}
            className={`pb-4 px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'opencv'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ScanEye className="w-4 h-4" />
            3. OpenCV Anti-Spam (Vision)
          </button>
        </div>

        {/* Tab 1: Whisper Voice-to-Text Demo */}
        {activeTab === 'whisper' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Volume2 className="w-5 h-5" />
                <span>OpenAI Whisper Voice Audio Test Studio</span>
              </div>
              <p className="text-xs text-slate-400">
                Simulate citizen voice recordings in regional languages (Hindi, Khortha, Santali, English) and view automatic Speech-to-Text transcription output.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Sample Audio File Script
                </label>
                <textarea
                  rows={4}
                  value={whisperInputSample}
                  onChange={(e) => setWhisperInputSample(e.target.value)}
                  className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 font-mono"
                />
              </div>

              <div className="flex items-center justify-between">
                <select
                  value={whisperLang}
                  onChange={(e) => setWhisperLang(e.target.value)}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-bold"
                >
                  <option value="hi">Language: Hindi (hi)</option>
                  <option value="en">Language: English (en)</option>
                </select>

                <button
                  onClick={runWhisperDemo}
                  disabled={whisperLoading}
                  className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2"
                >
                  <Mic className="w-4 h-4" />
                  {whisperLoading ? 'Running Whisper AI...' : 'Run Whisper Speech-to-Text'}
                </button>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Model Output & Inference Payload
              </h3>

              {whisperResult ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="text-xs text-amber-400 font-mono font-bold">Transcribed Text Result:</div>
                    <p className="text-sm font-semibold text-white leading-relaxed">"{whisperResult.text}"</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-500">Engine:</span>
                      <div className="text-purple-300 font-bold">{whisperResult.engine}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-500">Language:</span>
                      <div className="text-amber-400 font-bold">{whisperResult.language.toUpperCase()}</div>
                    </div>
                  </div>

                  <pre className="p-4 rounded-2xl bg-slate-950 text-[10px] text-emerald-400 font-mono overflow-x-auto border border-slate-800">
                    {JSON.stringify(whisperResult, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-2xl text-slate-500 text-xs gap-2">
                  <Bot className="w-8 h-8 text-slate-600" />
                  <span>Click "Run Whisper Speech-to-Text" to test transcription</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Sentence-Transformers Deduplication Demo */}
        {activeTab === 'dedup' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                <Sparkles className="w-5 h-5" />
                <span>Sentence-Transformers Semantic Vector Studio</span>
              </div>
              <p className="text-xs text-slate-400">
                Encodes input text into 384-dimensional dense vectors using <code className="text-indigo-300">all-MiniLM-L6-v2</code> and computes cosine similarity against existing database challenges.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  New Challenge Title
                </label>
                <input
                  type="text"
                  value={dedupTitle}
                  onChange={(e) => setDedupTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  New Challenge Description
                </label>
                <textarea
                  rows={4}
                  value={dedupDesc}
                  onChange={(e) => setDedupDesc(e.target.value)}
                  className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                />
              </div>

              <button
                onClick={runDedupDemo}
                disabled={dedupLoading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {dedupLoading ? 'Embedding & Comparing Vectors...' : 'Compute Semantic Vector Similarity'}
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Vector Search Results & Similarity Matrix
              </h3>

              {dedupResult ? (
                <div className="space-y-4">
                  <div
                    className={`p-4 rounded-2xl border text-xs space-y-2 ${
                      dedupResult.is_duplicate
                        ? 'bg-amber-950/40 border-amber-800 text-amber-200'
                        : 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Verdict: {dedupResult.is_duplicate ? 'DUPLICATE DETECTED' : 'UNIQUE ISSUE'}
                      </span>
                      <span className="font-mono text-sm font-black">
                        {dedupResult.max_similarity_percentage}% Similarity
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{dedupResult.recommendation}</p>
                  </div>

                  <pre className="p-4 rounded-2xl bg-slate-950 text-[10px] text-indigo-300 font-mono overflow-x-auto border border-slate-800">
                    {JSON.stringify(dedupResult, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-2xl text-slate-500 text-xs gap-2">
                  <Layers className="w-8 h-8 text-slate-600" />
                  <span>Click "Compute Semantic Vector Similarity" to test deduplication</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: OpenCV Spam & Quality Filtering Demo */}
        {activeTab === 'opencv' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <ScanEye className="w-5 h-5" />
                <span>OpenCV (CV2) Computer Vision Studio</span>
              </div>
              <p className="text-xs text-slate-400">
                Runs Laplacian variance edge metrics, color std-dev analysis, and exposure limits to reject blurry photos, blank spam, or corrupt media.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Image URL to Audit
                </label>
                <input
                  type="url"
                  value={cvImageUrl}
                  onChange={(e) => setCvImageUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    const u = 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80';
                    setCvImageUrl(u);
                    runCvDemo(u);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-300 text-[11px] font-bold border border-emerald-800"
                >
                  Clear Photo (Pass)
                </button>
                <button
                  onClick={() => {
                    const u = 'https://via.placeholder.com/150/000000/000000';
                    setCvImageUrl(u);
                    runCvDemo(u);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-950 text-rose-300 text-[11px] font-bold border border-rose-800"
                >
                  Solid Black Spam (Reject)
                </button>
              </div>

              <button
                onClick={() => runCvDemo()}
                disabled={cvLoading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                <ScanEye className="w-4 h-4" />
                {cvLoading ? 'Running OpenCV Inspection...' : 'Inspect Image with OpenCV'}
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                OpenCV Image Metrics & Audit Verdict
              </h3>

              {cvResult ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Status</div>
                      <div className={`text-base font-black ${cvResult.status === 'PASS' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {cvResult.status}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Quality Score</div>
                      <div className="text-base font-black text-amber-400">
                        {cvResult.quality_score}/100 ({cvResult.quality_grade})
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Laplacian Blur</div>
                      <div className="text-base font-black text-indigo-400">
                        {cvResult.laplacian_blur_score}
                      </div>
                    </div>
                  </div>

                  <pre className="p-4 rounded-2xl bg-slate-950 text-[10px] text-emerald-400 font-mono overflow-x-auto border border-slate-800">
                    {JSON.stringify(cvResult, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-2xl text-slate-500 text-xs gap-2">
                  <ShieldCheck className="w-8 h-8 text-slate-600" />
                  <span>Click "Inspect Image with OpenCV" to test computer vision audit</span>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
