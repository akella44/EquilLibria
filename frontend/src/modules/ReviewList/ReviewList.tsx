import { FC } from "react";
import { ReviewItem } from "@modules/ReviewItem";
import { ReviewListProps } from "./types";
import s from "./ReviewList.module.css";

export const ReviewList: FC<ReviewListProps> = ({ reviewList }) => {
  return (
    <ul className={s.reviewList}>
      {reviewList.map((item) => (
        <ReviewItem fileName={item.fileName} date={item.date} key={item.id} />
      ))}
    </ul>
  );
};
