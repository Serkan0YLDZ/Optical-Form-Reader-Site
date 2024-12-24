import { ImageControlsProps } from '@/types';
import { MagnifyingGlassPlus, MagnifyingGlassMinus, ArrowsClockwise } from "phosphor-react";
import { Button, Flex } from "@radix-ui/themes";

export const ImageControls: React.FC<ImageControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onReset,
  disabled,
  isDarkMode
}) => {
  return (
    <Flex gap="3">
      <Button
        onClick={onZoomIn}
        disabled={disabled}
        variant={isDarkMode ? "surface" : "classic"}
        radius="large"
        size="3"
        title={disabled ? "Daha fazla yakınlaşılamaz" : "Yakınlaş"}
      >
        <Flex align="center" gap="2">
          <MagnifyingGlassPlus size={20} />
          <span style={{ fontSize: '14px' }}>Yakınlaş</span>
        </Flex>
      </Button>

      <Button
        onClick={onZoomOut}
        disabled={disabled}
        variant={isDarkMode ? "surface" : "classic"}
        radius="large"
        size="3"
        title={disabled ? "Daha fazla uzaklaşılamaz" : "Uzaklaş"}
      >
        <Flex align="center" gap="2">
          <MagnifyingGlassMinus size={20} />
          <span style={{ fontSize: '14px' }}>Uzaklaş</span>
        </Flex>
      </Button>

      <Button
        onClick={onReset}
        disabled={disabled}
        variant={isDarkMode ? "surface" : "classic"}
        radius="large"
        size="3"
        title={disabled ? "Sıfırlama işlemi yapılamaz" : "Sıfırla"}
      >
        <Flex align="center" gap="2">
          <ArrowsClockwise size={20} />
          <span style={{ fontSize: '14px' }}>Sıfırla</span>
        </Flex>
      </Button>
    </Flex>
  );
}; 