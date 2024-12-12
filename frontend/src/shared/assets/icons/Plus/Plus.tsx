import { FC } from "react";
import s from "./Plus.module.css";

export const Plus: FC = () => {
  return (
    <div className={s.plus}>
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1 11H11M11 11H21M11 11V1M11 11V21"
          stroke="#B9B5CB"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
