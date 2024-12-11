"use client"

import { Container, Flex, Heading, Text, Box, Button } from '@radix-ui/themes';
import { UploadSimple, Sun, Moon } from "phosphor-react";
import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeContext } from './theme-provider';
import * as AlertDialog from '@radix-ui/react-alert-dialog';

export default function Home() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
 
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const file = files[0];
      setSelectedFile(file);
      setIsButtonDisabled(true);
      
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
          setIsButtonDisabled(false);
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        setErrorMessage('Görsel yükleme başarısız oldu. Lütfen tekrar deneyin.');
        setShowError(true);
        setIsButtonDisabled(true);
      }
    }
  };

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    const storedImages = localStorage.getItem('formImages');
    if (storedImages && !isButtonDisabled) {
      console.log('Edit sayfasına yönlendiriliyor...');
      router.push('/edit');
    } else {
      alert('Lütfen önce görsel yükleyin');
    }
  };

  return (
    <Container size="2" height="100vh" className={isDarkMode ? "bg-slate-900" : "bg-gradient-to-b from-blue-50 to-white"}>
      <Flex direction="column" gap="6" align="center" justify="center" height="100%">
        <Box
          className="rounded-full overflow-hidden"
        >
          <button
            onClick={toggleTheme}
            className={`p-3 rounded-full transition-colors ${
              isDarkMode 
                ? 'bg-slate-800 hover:bg-slate-700 text-yellow-500' 
                : 'bg-white hover:bg-slate-100 text-slate-700 shadow-md'
            }`}
          >
            {isDarkMode && <Sun size={24} weight="bold" />}
            {!isDarkMode && <Moon size={24} weight="bold" />}
          </button>
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
                
                {selectedFile && (
                  <Box className={`w-full p-4 rounded-xl ${
                    isDarkMode 
                      ? "bg-slate-700" 
                      : "bg-blue-50/30 border border-blue-100"
                  }`}>
                    <Flex direction="column" gap="2">
                      <Text weight="bold" className={isDarkMode ? "text-white" : "text-blue-800"}>
                        Yüklenen Dosya:
                      </Text>
                      <Text className={`flex items-center gap-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        <UploadSimple size={16} className={isDarkMode ? "text-slate-400" : "text-blue-500"} />
                        {selectedFile.name}
                      </Text>
                    </Flex>
                  </Box>
                )}

                <Button 
                  onClick={handleEditClick}
                  size="3" 
                  variant="solid"
                  className={`w-full ${
                    isButtonDisabled 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-blue-600'
                  }`}
                  disabled={isButtonDisabled}
                >
                  {isButtonDisabled ? 'Lütfen Görsel Yükleyiniz' : 'Düzenlemeye Başla'}
                </Button>
              </Flex>
            </form>
          </Flex>
        </Box>
      </Flex>

      <AlertDialog.Root open={showError} onOpenChange={setShowError}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <AlertDialog.Content className={`
            fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
            p-6 rounded-lg shadow-xl w-[90%] max-w-md
            ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}
            border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}
          `}>
            <AlertDialog.Title className="text-lg font-semibold mb-2">
              Hata
            </AlertDialog.Title>
            <AlertDialog.Description className={`
              mb-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}
            `}>
              {errorMessage}
            </AlertDialog.Description>
            <div className="flex justify-end">
              <AlertDialog.Cancel asChild>
                <button className={`
                  px-4 py-2 rounded-lg font-medium
                  ${isDarkMode 
                    ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}
                `}>
                  Tamam
                </button>
              </AlertDialog.Cancel>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </Container>
  );
}
