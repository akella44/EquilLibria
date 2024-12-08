import { FC } from "react";
import { ReviewItemProps } from "./types";
import s from "./ReviewItem.module.css";
import { Download } from "@ui/Download";

export const ReviewItem: FC<ReviewItemProps> = ({ fileName, date }) => {
  return (
    <li className={s.reviewItem}>
      <div className={s.wrapper}>
        <span className={s.fileName}>{fileName}</span>
        <span className={s.date}>{date}</span>
      </div>
      <button>
        <Download />
      </button>
    </li>
  );
};
