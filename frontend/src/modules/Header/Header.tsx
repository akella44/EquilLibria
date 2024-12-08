import { FC } from "react";
import s from "./Header.module.css";
import { Logo } from "@shared/ui/Logo";
import { showFormStore } from "@/store/inputValue";
import { useScreenSize } from "@shared/hooks/useScreenSize";
import avatar from "@assets/avatar.png";
import { useNavigate } from "react-router-dom";

export const Header: FC = () => {
  const { isLaptop, isDesktop } = useScreenSize();
  const router = useNavigate();

  return (
    <div className={s.header} onClick={() => showFormStore.showForm()}>
      <div className={s.headerContainer}>
        <div
          className={s.logoWrapper}
          onClick={() => {
            router("/");
            showFormStore.showForm();
          }}
        >
          <Logo />
        </div>
        <div className={s.userInfo}>
          <div className={s.userInfoWrapepr}>
            <p className={s.userName}>Макс</p>
            <p className={s.userPosition}>Software Developer</p>
          </div>
          <div className={s.userAvatar}>
            <img src={avatar} alt="Avatar" />
          </div>
        </div>
      </div>
    </div>
  );
};
