import { Modal } from "@/shared/ui/Modal";
import { Separator } from "@/shared/ui/Separator/Separator";
import { FC } from "react";
import s from "./ExportModal.module.css";
import { latexOrAscii } from "@/shared/lib/latexOrAscii";
import { inputValueStore } from "@/store/inputValue";
import { clearLatex } from "@/shared/lib/clearLatex";
import asciimathToLatex from "asciimath-to-latex";
import { toast } from "react-toastify";

export const ExportModal: FC = () => {
  return (
    <Modal>
      <div className={s.exportModal}>
        <div className={s.item}>
          <span
            className={s.text}
            onClick={() => {
              navigator.clipboard.writeText(
                latexOrAscii(inputValueStore.getValue()) === "latex"
                  ? clearLatex(inputValueStore.getValue())
                  : asciimathToLatex(inputValueStore.getValue())
              );
              toast.success('Скопировано в формате LaTeX')
            }}
          >
            Экспортировать .LaTeX
          </span>
        </div>
        <div className={s.separator}>
          <Separator />
        </div>
        <div className={s.item}>
          <span className={s.text}>Экспортировать .png</span>
        </div>
      </div>
    </Modal>
  );
};
