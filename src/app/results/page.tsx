"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface DetailedResult {
  question: number;
  marked_answer: string | null;
  correct_answer: string;
  status: string;
}

interface AnalysisResult {
  areaName: string;
  summary: {
    total_questions: number;
    correct: number;
    incorrect: number;
    empty: number;
    invalid: number;
    accuracy: number;
  };
  detailed_results: DetailedResult[];
  processed_image_path: string;
}

export default function ResultsPage() {
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedResults = localStorage.getItem('analysisResults');
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'correct':
        return 'bg-green-500';
      case 'incorrect':
        return 'bg-red-500';
      case 'empty':
        return 'bg-yellow-500';
      case 'invalid':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Analiz Sonuçları</h1>
          <button
            onClick={() => router.push('/edit')}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          >
            Düzenleme Sayfasına Dön
          </button>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">Henüz analiz sonucu bulunmuyor.</p>
            <button
              onClick={() => router.push('/edit')}
              className="mt-4 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg"
            >
              Analiz Yapmak İçin Tıklayın
            </button>
          </div>
        ) : (
          <div className="grid gap-8">
            {results.map((result, index) => (
              <div key={index} className="bg-slate-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-blue-400">
                    {result.areaName}
                  </h2>
                  <div className="text-lg font-medium text-blue-300">
                    Başarı Oranı: {(result.summary.accuracy * 100).toFixed(1)}%
                  </div>
                </div>

                {/* Özet Kartları */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                  <div className="bg-slate-700 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold">{result.summary.total_questions}</div>
                    <div className="text-sm text-slate-300">Toplam Soru</div>
                  </div>
                  <div className="bg-green-500/20 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-400">{result.summary.correct}</div>
                    <div className="text-sm text-green-300">Doğru</div>
                  </div>
                  <div className="bg-red-500/20 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-400">{result.summary.incorrect}</div>
                    <div className="text-sm text-red-300">Yanlış</div>
                  </div>
                  <div className="bg-yellow-500/20 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-400">{result.summary.empty}</div>
                    <div className="text-sm text-yellow-300">Boş</div>
                  </div>
                  <div className="bg-orange-500/20 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-400">{result.summary.invalid}</div>
                    <div className="text-sm text-orange-300">Geçersiz</div>
                  </div>
                </div>

                {/* İşlenmiş Görsel */}
                {result.processed_image_path && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">İşlenmiş Görsel</h3>
                    <img 
                      src={result.processed_image_path} 
                      alt={`${result.areaName} işlenmiş görsel`}
                      className="max-w-full h-auto rounded-lg border-2 border-slate-700"
                    />
                  </div>
                )}

                {/* Detaylı Sonuçlar */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Detaylı Sonuçlar</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {result.detailed_results.map((detail, i) => (
                      <div 
                        key={i} 
                        className={`p-4 rounded-lg border border-slate-700 ${
                          detail.status === 'correct' ? 'bg-green-500/10' :
                          detail.status === 'incorrect' ? 'bg-red-500/10' :
                          detail.status === 'empty' ? 'bg-yellow-500/10' :
                          'bg-orange-500/10'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Soru {detail.question}</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(detail.status)} bg-opacity-20`}>
                            {detail.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-sm space-y-1">
                          {detail.marked_answer && (
                            <div className="flex justify-between">
                              <span className="text-slate-300">İşaretlenen:</span>
                              <span className="font-medium">{detail.marked_answer.toUpperCase()}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-slate-300">Doğru Cevap:</span>
                            <span className="font-medium">{detail.correct_answer.toUpperCase()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}