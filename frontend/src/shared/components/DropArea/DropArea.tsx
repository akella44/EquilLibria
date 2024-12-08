import { FC, PropsWithChildren, useState } from "react";
import s from "./DropArea.module.css";

export const DropArea: FC<PropsWithChildren> = ({ children }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = () => {
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = () => {
    setIsDragging(false);
  };

  return (
    <div
      className={`${s.dropArea} ${isDragging ? s.highlight : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}
    </div>
  );
};