import { FC, useEffect, useState } from "react";
import s from "./ImportButton.module.css";
import { Arrow } from "@/shared/assets/icons/Arrow";
import { Separator } from "@/shared/ui/Separator/Separator";
import { useUploadFile } from "@/entities/Files/useUploadFile";
import { getImageById } from "@/shared/api/FileService/fileControllerApi";

export const ImportButton: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState([]);

  const { uploadFile, isPending } = useUploadFile();

  useEffect(() => {
    if (file) {
      uploadFile(file).then((data) => {
        data.image_ids.map((id) =>
          getImageById(id).then(({data}) => {
            console.log(data);
            setImages([...images, data]);
          })
        );
      });
      setFile(null);
    }
  }, [file]);

  if (isPending) return <h2>Загрузка</h2>;

  return (
    <div className={s.importButton}>
      <div className={s.header}>
        <h2 className={s.title}>Импорт</h2>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`${s.arrow} ${isOpen ? s.activeArrow : ""}`}
        >
          <Arrow />
        </div>
      </div>
      <div className={`${s.list} ${isOpen ? s.listActive : ""}`}>
        <Separator />
        <div className={s.listItem}>
          <span className={s.listItemText}>
            Имопрт из pdf
            <input
              className={s.input}
              type="file"
              accept=".pdf"
              onChange={(e) => {
                e.target.files && setFile(e.target.files[0]);
              }}
            />
          </span>
        </div>
        <Separator />
        <div className={s.listItem}>
          <span className={s.listItemText}>
            Импорт по изображению
            <input
              className={s.input}
              type="file"
              accept=".jpg, .jpeg, .png"
              onChange={(e) => {
                e.target.files && setFile(e.target.files[0]);
              }}
            />
          </span>
        </div>
      </div>
    </div>
  );
};
