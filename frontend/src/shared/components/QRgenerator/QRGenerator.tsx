import { FC, useEffect, useRef } from "react";
import QRCode from "qrcode";

interface QRGeneratorProps {
  text: string;
}

export const QRGenerator: FC<QRGeneratorProps> = ({ text }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const canvas = canvasRef.current;
        await QRCode.toCanvas(canvas, text, { errorCorrectionLevel: "H" });
      } catch (error) {
        console.error(error); 
      }
    };

    if (text) {
      generateQRCode();
    }
  }, [text]);

  return <canvas ref={canvasRef} />;
};
