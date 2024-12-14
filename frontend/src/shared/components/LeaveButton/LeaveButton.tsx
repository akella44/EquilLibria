import { FC } from "react";
import s from "./LeaveButton.module.css";
import { useNavigate } from "react-router-dom";
import { inputValueStore } from "@/store/inputValue";
import { keyboardStore } from "@/store/keyboard";
import { editFormulaStore } from "@/store/editFormula";

export const LeaveButton: FC = () => {
  const router = useNavigate();
  return (
    <div
      onClick={() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        inputValueStore.clear();
        keyboardStore.clear();
        editFormulaStore.clear();
        router("/signin");
      }}
    >
      <span className={s.text}>Выйти</span>
    </div>
  );
};
