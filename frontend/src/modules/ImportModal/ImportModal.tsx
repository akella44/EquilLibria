import { Modal } from "@/shared/ui/Modal";
import { FC, useEffect, useState } from "react";
import s from "./ImportModal.module.css";
import { Cross } from "@/shared/assets/icons/Cross";
import { importModalStore } from "@/store/importModal";
import { ImagesList } from "./ImagesList";
import { useUploadFile } from "@/entities/Files/useUploadFile";
import { observer } from "mobx-react-lite";
import { Loader } from "@/shared/ui/Loader";

export const ImportModal: FC = observer(() => {
  const { uploadFile, isPending, isSuccess } = useUploadFile();
  const file = importModalStore.getFile();
  const [ids, setIds] = useState([]);

  useEffect(() => {
    if (file) {
      uploadFile(file).then((data) => {
        console.log(data.image_ids);
        setIds(data.image_ids);
      });
    }
    importModalStore.setFile(null);
  }, [file]);

  const type = importModalStore.getType();

  return (
    <div className={s.wrapper}>
      <div className={s.modal}>
        <Modal>
          <div className={s.content}>
            <div className={s.header}>
              <h1 className={s.title}>
                {type === "pdf" ? "Импорт из pdf" : "Импорт по изображению"}
              </h1>
              <div
                className={s.iconWrapper}
                onClick={() => {
                  importModalStore.setIsModalVisible(false);
                  importModalStore.setIsRequest(false);
                }}
              >
                <Cross />
              </div>
            </div>
            {isPending && (
              <div className={s.loader}>
                <Loader />
                <p className={s.text}>Пожалуйста, подождите, ваши формулы обрабатываются</p>
              </div>
            )}
            {isSuccess && ids.length > 0 && <ImagesList ids={ids} />}
          </div>
        </Modal>
      </div>
    </div>
  );
});
