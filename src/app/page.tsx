"use client"

import { Container, Flex, Heading, Text, Box, Theme, Button } from '@radix-ui/themes';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const filesArray = Array.from(files);
      setSelectedFiles(filesArray);
      
      try {
        const base64Images = await Promise.all(
          filesArray.map(file => {
            return new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                resolve(reader.result as string);
              };
              reader.onerror = reject;
              reader.readAsDataURL(file);
            });
          })
        );
        
        console.log('Görsel sayısı:', base64Images.length);
        localStorage.setItem('formImages', JSON.stringify(base64Images));
        console.log('Görseller localStorage\'a kaydedildi');
      } catch (error) {
        console.error('Görsel yükleme hatası:', error);
      }
    }
  };

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    const storedImages = localStorage.getItem('formImages');
    if (storedImages) {
      console.log('Edit sayfasına yönlendiriliyor...');
      router.push('/edit');
    } else {
      alert('Lütfen önce görsel yükleyin');
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Theme appearance={isDarkMode ? "dark" : "light"} accentColor="blue" grayColor="slate">
      <Container size="2" height="100vh" className={isDarkMode ? "bg-slate-900" : "bg-gradient-to-b from-blue-50 to-white"}>
        <Flex direction="column" gap="6" align="center" justify="center" height="100%">
          <button
            onClick={toggleTheme}
            className={`
              p-3 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110
              ${isDarkMode 
                ? "bg-slate-800 hover:bg-slate-700" 
                : "bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl"
              }
            `}
            style={{
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: 'none',
              outline: 'none'
            }}
          >
            {isDarkMode ? (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-6 h-6 text-gray-300"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" 
                />
              </svg>
            ) : (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-6 h-6 text-gray-700"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" 
                />
              </svg>
            )}
          </button>
          <Box className={`w-full max-w-3xl p-8 rounded-2xl shadow-2xl ${
            isDarkMode 
              ? "bg-slate-800" 
              : "bg-white/70 backdrop-blur-sm border border-white/50"
          }`}>
            <Flex direction="column" gap="6" align="center">
              <Heading size="8" align="center" className={`${
                isDarkMode 
                  ? "bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
                  : "bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
              }`}>
                Optik Form Okuyucu
              </Heading>
              
              <Text size="2" className={isDarkMode ? "text-gray-400" : "text-gray-600"} align="center">
                PNG formatında optik formlarınızı yükleyin ve düzenlemeye başlayın
              </Text>

              <form style={{ width: '100%', maxWidth: '400px' }}>
                <Flex direction="column" gap="4" align="center">
                  <div className="w-full">
                    <label 
                      htmlFor="file-upload"
                      className={`flex flex-col items-center justify-center w-full h-32 px-4 transition border-2 border-dashed rounded-xl cursor-pointer ${
                        isDarkMode 
                          ? "bg-slate-700 border-slate-600 hover:border-blue-400" 
                          : "bg-blue-50/50 border-blue-200 hover:border-blue-400 hover:bg-blue-50"
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className={`w-8 h-8 mb-4 ${isDarkMode ? "text-slate-400" : "text-blue-500"}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <Text size="2" className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                          PNG dosyalarını yüklemek için tıklayın veya sürükleyin
                        </Text>
                      </div>
                      <input 
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        required
                      />
                    </label>
                  </div>
                  
                  {selectedFiles.length > 0 && (
                    <Box className={`w-full p-4 rounded-xl ${
                      isDarkMode 
                        ? "bg-slate-700" 
                        : "bg-blue-50/30 border border-blue-100"
                    }`}>
                      <Flex direction="column" gap="2">
                        <Text size="2" weight="bold" className={isDarkMode ? "text-white" : "text-blue-800"}>
                          Yüklenen Dosya:
                        </Text>
                        {selectedFiles.map((file, index) => (
                          <Text key={index} size="2" className={`flex items-center gap-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                            <svg className={`w-4 h-4 ${isDarkMode ? "text-slate-400" : "text-blue-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {file.name}
                          </Text>
                        ))}
                      </Flex>
                    </Box>
                  )}

                  <Button 
                    onClick={handleEditClick}
                    size="3" 
                    variant="solid"
                    type="button"
                  >
                    Düzenlemeye Başla
                  </Button>
                </Flex>
              </form>
            </Flex>
          </Box>
        </Flex>
      </Container>
    </Theme>
  );
}
