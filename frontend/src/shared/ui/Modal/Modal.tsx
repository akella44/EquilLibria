import { FC, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import s from "./Modal.module.css";
import { exportModalStore } from "@/store/exportModal";

interface ModalProps {
  blur?: boolean;
  children: ReactNode;
  onClickOutSide?: () => void;
  padding?: string;
}

export const Modal: FC<ModalProps> = ({
  blur = false,
  children,
  onClickOutSide,
  padding = "10px",
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (exportModalStore.getIsModalVisible()) {
        if (
          modalRef.current &&
          !modalRef.current.contains(event.target as Node)
        ) {
          exportModalStore.setIsModalVisible(false);
        }
      }
    },
    [exportModalStore.getIsModalVisible()]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <>
      <div className={s.modal} ref={modalRef} style={{ padding: padding }}>
        {children}
      </div>
    </>
  );
};
