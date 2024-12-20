import { Modal } from "@/shared/ui/Modal";
import { Separator } from "@/shared/ui/Separator/Separator";
import { FC } from "react";
import s from "./ExportModal.module.css";
import { latexOrAscii } from "@/shared/lib/latexOrAscii";
import { inputValueStore } from "@/store/inputValue";
import { clearLatex } from "@/shared/lib/clearLatex";
import asciimathToLatex from "asciimath-to-latex";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";

const downloadCanvasAsImage = (canvas, filename) => {
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  });
};

export const ExportModal: FC = ({ blockRef, asciiMathRef }) => {
  const handleDownload = () => {
    const refToUse = blockRef.current || asciiMathRef.current;
    if (refToUse) {
      html2canvas(refToUse).then((canvas) => {
        downloadCanvasAsImage(canvas, "image.png");
      });
    }
  };

  const handleCopyToClipboard = () => {
    const value = inputValueStore.getValue();
    const formattedValue =
      latexOrAscii(value) === "latex"
        ? clearLatex(value)
        : asciimathToLatex(value);

    navigator.clipboard.writeText(formattedValue);
    toast.success("Скопировано в формате LaTeX");
  };

  return (
    <Modal>
      <div className={s.exportModal}>
        <div className={s.item}>
          <span className={s.text} onClick={handleCopyToClipboard}>
            Экспортировать в LaTeX
          </span>
        </div>
        <div className={s.separator}>
          <Separator />
        </div>
        <div className={s.item}>
          <span className={s.text} onClick={handleDownload}>
            Экспортировать в изображение
          </span>
        </div>
      </div>
    </Modal>
  );
};
