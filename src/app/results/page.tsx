"use client"

import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { Sun, Moon } from "phosphor-react";
import { ThemeContext } from '../theme-provider';
import { AnalysisResult } from '@/types';

export default function ResultsPage() {
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    const storedResults = localStorage.getItem('analysisResults');
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'correct':
      case 'doğru':
        return 'bg-green-500';
      case 'incorrect':
      case 'yanlış':
        return 'bg-red-500';
      case 'empty':
      case 'boş':
        return 'bg-yellow-500';
      case 'invalid':
      case 'geçersiz':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className={`min-h-screen ${
      isDarkMode 
        ? 'bg-slate-900 text-white' 
        : 'bg-gradient-to-br from-blue-50 to-slate-50 text-slate-900'
    } p-8 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Analiz Sonuçları</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/edit')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white shadow-md'
              }`}
            >
              Düzenleme Sayfasına Dön
            </button>
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-full transition-colors ${
                isDarkMode 
                  ? 'bg-slate-800 hover:bg-slate-700 text-yellow-500' 
                  : 'bg-white hover:bg-slate-100 text-slate-700 shadow-md'
              }`}
            >
              {isDarkMode ? (
                <Sun size={24} weight="bold" />
              ) : (
                <Moon size={24} weight="bold" />
              )}
            </button>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">Henüz analiz sonucu bulunmuyor.</p>
            <button
              onClick={() => router.push('/edit')}
              className="mt-4 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white"
            >
              Analiz Yapmak İçin Tıklayın
            </button>
          </div>
        ) : (
          <div className="grid gap-8">
            {results.map((result, index) => (
              <div key={index} className={`rounded-xl p-6 shadow-lg ${
                isDarkMode 
                  ? 'bg-slate-800' 
                  : 'bg-white border border-slate-200'
              }`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-blue-400">
                    {result.areaName}
                  </h2>
                  <div className="text-lg font-medium text-blue-300">
                    Başarı Oranı: {(result.summary.accuracy * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                  <div className={`p-4 rounded-lg text-center ${
                    isDarkMode ? 'bg-slate-700' : 'bg-slate-50'
                  }`}>
                    <div className={`text-2xl font-bold ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {result.summary.total_questions}
                    </div>
                    <div className={`text-sm ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-900'
                    }`}>
                      Toplam Soru
                    </div>
                  </div>
                  <div className="bg-green-500/20 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {result.summary.correct}
                    </div>
                    <div className="text-sm text-green-300">Doğru</div>
                  </div>
                  <div className="bg-red-500/20 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-400">
                      {result.summary.incorrect}
                    </div>
                    <div className="text-sm text-red-300">Yanlış</div>
                  </div>
                  <div className="bg-yellow-500/20 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                      {result.summary.empty}
                    </div>
                    <div className="text-sm text-yellow-300">Boş</div>
                  </div>
                  <div className="bg-orange-500/20 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-400">
                      {result.summary.invalid}
                    </div>
                    <div className="text-sm text-orange-300">Geçersiz</div>
                  </div>
                </div>

                {result.processed_image_path && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Görsel</h3>
                    <img 
                      src={result.processed_image_path} 
                      alt={`${result.areaName} işlenmiş görsel`}
                      className="max-w-full h-auto rounded-lg border-2 border-slate-700"
                    />
                  </div>
                )}

                <div>
                  <h3 className={`text-xl font-semibold mb-4 ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Detaylı Sonuçlar
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {result.detailed_results.map((detail, i) => (
                      <div 
                        key={i} 
                        className={`p-4 rounded-lg border ${
                          isDarkMode 
                            ? 'border-slate-700' 
                            : 'border-slate-200'
                        } ${
                          detail.status === 'correct' ? 'bg-green-500/10' :
                          detail.status === 'incorrect' ? 'bg-red-500/10' :
                          detail.status === 'empty' ? 'bg-yellow-500/10' :
                          'bg-orange-500/10'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className={`font-medium ${
                            isDarkMode ? 'text-white' : 'text-slate-900'
                          }`}>
                            Soru {detail.question}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(detail.status)} bg-opacity-20`}>
                            {detail.status.toLowerCase() === 'correct' ? 'DOĞRU' :
                             detail.status.toLowerCase() === 'incorrect' ? 'YANLIŞ' :
                             detail.status.toLowerCase() === 'empty' ? 'BOŞ' :
                             detail.status.toLowerCase() === 'invalid' ? 'GEÇERSİZ' : 
                             detail.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-sm space-y-1">
                          {detail.marked_answer && (
                            <div className="flex justify-between">
                              <span className={isDarkMode ? 'text-slate-300' : 'text-slate-900'}>
                                İşaretlenen:
                              </span>
                              <span className={`font-medium ${
                                isDarkMode ? 'text-white' : 'text-slate-900'
                              }`}>
                                {detail.marked_answer.toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className={isDarkMode ? 'text-slate-300' : 'text-slate-900'}>
                              Doğru Cevap:
                            </span>
                            <span className={`font-medium ${
                              isDarkMode ? 'text-white' : 'text-slate-900'
                            }`}>
                              {detail.correct_answer.toUpperCase()}
                            </span>
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