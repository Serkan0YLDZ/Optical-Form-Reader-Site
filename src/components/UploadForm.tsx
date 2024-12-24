import { Flex, Text, Box, Button } from '@radix-ui/themes';
import { UploadSimple } from "phosphor-react";

interface UploadFormProps {
  isDarkMode: boolean;
  selectedFile: File | null;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleEditClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isButtonDisabled: boolean;
  isLoading: boolean;
}

export default function UploadForm({ 
  isDarkMode, 
  selectedFile, 
  handleFileChange, 
  handleEditClick, 
  isButtonDisabled, 
  isLoading 
}: UploadFormProps) {
  return (
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
          <div className="flex items-center justify-center gap-2">
            {isLoading ? (
              <div className="w-6 h-6 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
            ) : (
              <>
                Düzenlemeye Başla
              </>
            )}
          </div>
        </Button>
      </Flex>
    </form>
  );
}