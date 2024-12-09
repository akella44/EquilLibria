import { FC } from "react";
import s from './Plus.module.css'

export const Plus: FC = () => {
  return (
    <div className={s.plus}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.5 14H14M14 14H26.5M14 14V1.5M14 14V26.5"
          stroke="#B9B5CB"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  );
};
