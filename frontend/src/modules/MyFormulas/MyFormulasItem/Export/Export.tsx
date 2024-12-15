import { Modal } from "@/shared/ui/Modal";
import { Separator } from "@/shared/ui/Separator/Separator";
import { FC } from "react";
import s from "./Export.module.css";
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

export const Export: FC = ({ mathRef, latex }) => {
  const handleDownload = () => {
    const refToUse = mathRef.current;
    if (refToUse) {
      html2canvas(refToUse).then((canvas) => {
        downloadCanvasAsImage(canvas, "image.png");
      });
    }
  };

  return (
    <Modal padding="5px">
      <div className={s.exportModal}>
        <div className={s.item}>
          <span
            className={s.text}
            onClick={() => {
              navigator.clipboard.writeText(latex);
              toast.success("Скопировано в формате LaTeX");
            }}
          >
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
