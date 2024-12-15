import { FC, useState } from "react";
import s from "./ImageItem.module.css";
import { Modal } from "@/shared/ui/Modal";
import { getLatexByRectId } from "@/shared/api/FileService/fileControllerApi";
import { toast } from "react-toastify";
import { Loader } from "@/shared/ui/Loader";

interface Rect {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  id: number;
}

interface ImageItemProps {
  img: string;
  rect?: Rect[];
}

export const ImageItem: FC<ImageItemProps> = ({ img, rect = [] }) => {
  const [loadingIds, setLoadingIds] = useState<Set<number>>(new Set());

  const handleClick = (id: number) => {
    setLoadingIds((prev) => new Set(prev).add(id));
    getLatexByRectId(id).then((data) => {
      navigator.clipboard.writeText(data.data.latex);
      toast.success("Скопировано в формате LaTeX");
      setLoadingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    });
  };

  return (
    <div className={s.container}>
      {!rect.length && <div className={s.skeleton}></div>}
      <img src={img} alt="pdf sheet" className={s.image} />
      {rect.length > 0 &&
        rect.map((r) => (
          <div
            key={r.id}
            className={s.rect}
            style={{
              left: r.x1 * 1.39,
              top: r.y1 * 1.365,
              width: (r.x2 - r.x1) * 1.36,
              height: r.y2 - r.y1,
            }}
            onClick={() => handleClick(r.id)}
          >
            {loadingIds.has(r.id) && <div className={s.skeleton}></div>}
          </div>
        ))}
    </div>
  );
};
