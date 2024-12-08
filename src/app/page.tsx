"use client"

import { Container, Flex, Heading, Text, Box, Button } from '@radix-ui/themes';
import { UploadSimple, Sun, Moon } from "phosphor-react";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const file = files[0];
      setSelectedFiles([file]);
      
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        const data = await response.json();
        
        if (data.success) {
          localStorage.setItem('formImages', JSON.stringify([data.image]));
          console.log('Görsel başarıyla yüklendi ve kaydedildi');
        } else {
          throw new Error(data.error);
        }
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
    <Container size="2" height="100vh" className={isDarkMode ? "bg-slate-900" : "bg-gradient-to-b from-blue-50 to-white"}>
      <Flex direction="column" gap="6" align="center" justify="center" height="100%">
        <Box
          className="rounded-full overflow-hidden"
        >
          <Button
            variant="soft"
            onClick={toggleTheme}
            className="w-12 h-12 p-0"
          >
            {isDarkMode ? (
              <Sun size={24} weight="bold" />
            ) : (
              <Moon size={24} weight="bold" />
            )}
          </Button>
        </Box>

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
                <Box className="w-full">
                  <label 
                    htmlFor="file-upload"
                    className={`flex flex-col items-center justify-center w-full h-32 px-4 transition border-2 border-dashed rounded-xl cursor-pointer ${
                      isDarkMode 
                        ? "bg-slate-700 border-slate-600 hover:border-blue-400" 
                        : "bg-blue-50/50 border-blue-200 hover:border-blue-400 hover:bg-blue-50"
                    }`}
                  >
                    <Flex direction="column" align="center" gap="3" className="pt-5 pb-6">
                      <UploadSimple size={32} weight="bold" className={isDarkMode ? "text-slate-400" : "text-blue-500"} />
                      <Text size="2" className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                        PNG dosyalarını yüklemek için tıklayın veya sürükleyin
                      </Text>
                    </Flex>
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
                </Box>
                
                {selectedFiles.length > 0 && (
                  <Box className={`w-full p-4 rounded-xl ${
                    isDarkMode 
                      ? "bg-slate-700" 
                      : "bg-blue-50/30 border border-blue-100"
                  }`}>
                    <Flex direction="column" gap="2">
                      <Text weight="bold" className={isDarkMode ? "text-white" : "text-blue-800"}>
                        Yüklenen Dosya:
                      </Text>
                      {selectedFiles.map((file, index) => (
                        <Text key={index} className={`flex items-center gap-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                          <UploadSimple size={16} className={isDarkMode ? "text-slate-400" : "text-blue-500"} />
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
                  className="w-full"
                >
                  Düzenlemeye Başla
                </Button>
              </Flex>
            </form>
          </Flex>
        </Box>
      </Flex>
    </Container>
  );
}
