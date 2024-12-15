import { FC, useEffect, useRef, useState } from "react";
import s from "./ImportButton.module.css";
import { Arrow } from "@/shared/assets/icons/Arrow";
import { Separator } from "@/shared/ui/Separator/Separator";
import { importModalStore } from "@/store/importModal";
import { observer } from "mobx-react-lite";

export const ImportButton: FC = observer(() => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  const pdfInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (file) {
      importModalStore.setFile(file);
    }
  }, [file]);

  return (
    <div className={s.importButton} onClick={() => setIsOpen(!isOpen)}>
      <div className={s.header}>
        <h2 className={s.title}>Импорт</h2>
        <div className={`${s.arrow} ${isOpen ? s.activeArrow : ""}`}>
          <Arrow />
        </div>
      </div>
      <div className={`${s.list} ${isOpen ? s.listActive : ""}`}>
        <Separator />
        <div className={s.listItem} onClick={(e) => e.stopPropagation()}>
          <span className={s.listItemText}>
            Импорт из pdf
            <input
              ref={pdfInputRef}
              className={s.input}
              type="file"
              accept=".pdf"
              onChange={(e) => {
                importModalStore.setIsModalVisible(true);
                importModalStore.setType("pdf");
                e.target.files && setFile(e.target.files[0]);
                if (pdfInputRef.current) {
                  pdfInputRef.current.value = "";
                }
                importModalStore.setIsRequest(true);
              }}
            />
          </span>
        </div>
        <Separator />
        <div className={s.listItem} onClick={(e) => e.stopPropagation()}>
          <span className={s.listItemText}>
            Импорт по изображению
            <input
              ref={imageInputRef}
              className={s.input}
              type="file"
              accept=".jpg, .jpeg, .png"
              onChange={(e) => {
                importModalStore.setIsModalVisible(true);
                importModalStore.setType("img");
                e.target.files && setFile(e.target.files[0]);
                if (imageInputRef.current) {
                  imageInputRef.current.value = "";
                }
                importModalStore.setIsRequest(true);
              }}
            />
          </span>
        </div>
      </div>
    </div>
  );
});
