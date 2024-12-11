import { HandPointing, SelectionPlus } from "phosphor-react";
import { Button, Flex, Box } from "@radix-ui/themes";

interface ModeToggleProps {
  currentMode: 'slider' | 'selector';
  onModeChange: (mode: 'slider' | 'selector') => void;
  isDarkMode?: boolean;
}

export default function ModeToggle({ currentMode, onModeChange, isDarkMode = true }: ModeToggleProps) {
  return (
    <Box position="fixed" top="6" left="6" style={{ zIndex: 50 }}>
      <Box 
        className={`
          ${isDarkMode 
            ? 'bg-slate-800/90 border-slate-700' 
            : 'bg-white/90 border-slate-200'
          } 
          backdrop-blur-xl p-3 rounded-2xl shadow-2xl border
        `}
      >
        <Flex gap="3">
          <Button
            onClick={() => onModeChange('slider')}
            variant={currentMode === 'slider' ? 'solid' : 'surface'}
            radius="large"
            className={`
              min-w-[120px] h-[100px]
              flex-col
              transition-all duration-300 !important
              ${isDarkMode
                ? currentMode === 'slider'
                  ? '!bg-gradient-to-br !from-blue-500 !to-blue-600 hover:!from-blue-400 hover:!to-blue-500 !text-white'
                  : '!bg-slate-600/80 hover:!bg-slate-700/80 !text-white'
                : currentMode === 'slider'
                  ? '!bg-gradient-to-br !from-blue-500 !to-blue-600 !text-white'
                  : '!bg-slate-400 hover:!bg-slate-100 !text-white'
              }
              ${currentMode === 'slider' ? 'shadow-lg shadow-blue-500/20' : ''}
            `}
            style={{ height: '100px' }}
          >
            <Flex 
              direction="column" 
              align="center" 
              gap="4"
              className="relative"
            >
              <HandPointing size={32} weight="bold" />
              <span 
                style={{ 
                  fontSize: '14px', 
                  fontWeight: 600,
                }}
              >
                Kaydır
              </span>
            </Flex>
          </Button>

          <Button
            onClick={() => onModeChange('selector')}
            variant={currentMode === 'selector' ? 'solid' : 'surface'}
            radius="large"
            highContrast
            className={`
              min-w-[120px] h-[100px]
              flex-col
              transition-all duration-300 !important
              ${isDarkMode
                ? currentMode === 'selector'
                  ? '!bg-gradient-to-br !from-blue-500 !to-blue-600 hover:!from-blue-400 hover:!to-blue-500 !text-white'
                  : '!bg-slate-600/80 hover:!bg-slate-700/80 !text-white'
                : currentMode === 'selector'
                  ? '!bg-gradient-to-br !from-blue-500 !to-blue-600 !text-white'
                  : '!bg-slate-400 hover:!bg-slate-100 !text-white'
              }
              ${currentMode === 'selector' ? '!shadow-lg !shadow-blue-500/20' : ''}
            `}
            style={{ height: '100px' }}
          >
            <Flex 
              direction="column" 
              align="center" 
              gap="4"
              className="relative"
            >
              <SelectionPlus size={32} weight="bold" />
              <span 
                style={{ 
                  fontSize: '14px', 
                  fontWeight: 600,
                }}
              >
                Seç
              </span>
            </Flex>
          </Button>
        </Flex>
      </Box>
    </Box>
  );
} 