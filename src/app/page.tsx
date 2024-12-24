"use client"

import { Container, Flex, Heading, Text, Box } from '@radix-ui/themes';
import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeContext } from './theme-provider';
import UploadForm from '../components/UploadForm';
import ThemeToggle from '../components/ThemeToggle';
import ErrorDialog from '../components/ErrorDialog';

export default function Home() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [showError, setShowError] = useState(false);
  const [errorMessage] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
 
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setIsLoading(true);
      const file = files[0];
      setSelectedFile(file);
      setIsButtonDisabled(true);
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        const data = await response.json();
        
        if (data.success) {
          localStorage.setItem('formImageId', data.imageId);
          localStorage.setItem('formImageUrl', data.imageUrl);
          setIsButtonDisabled(false);
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        console.error('Yükleme hatası:', error);
        setShowError(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const storedImages = localStorage.getItem('formImages');
    if (storedImages) {
      router.push('/edit');
    } 
  };

  return (
    <Container size="2" height="100vh" className={isDarkMode ? "bg-slate-900" : "bg-gradient-to-b from-blue-50 to-white"}>
      <Flex direction="column" gap="6" align="center" justify="center" height="100%">
        <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

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

            <UploadForm 
              isDarkMode={isDarkMode}
              selectedFile={selectedFile}
              handleFileChange={handleFileChange}
              handleEditClick={handleEditClick}
              isButtonDisabled={isButtonDisabled}
              isLoading={isLoading}
            />
          </Flex>
        </Box>
      </Flex>
      
      <ErrorDialog 
        isDarkMode={isDarkMode}
        showError={showError}
        setShowError={setShowError}
        errorMessage={errorMessage}
      />
    </Container>
  );
}