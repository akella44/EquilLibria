import { FC } from "react";
import s from "./LeaveButton.module.css";
import { useNavigate } from "react-router-dom";

export const LeaveButton: FC = () => {
  const router = useNavigate();
  return (
    <div
      onClick={() => {
        localStorage.removeItem("accessToken");
        router("/signin");
      }}
    >
      <span className={s.text}>Выйти</span>
    </div>
  );
};
