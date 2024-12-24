import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { ErrorDialogProps } from '@/types';

export default function ErrorDialog({ 
  isDarkMode, 
  showError, 
  setShowError, 
  errorMessage 
}: ErrorDialogProps) {
  return (
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
  );
} 