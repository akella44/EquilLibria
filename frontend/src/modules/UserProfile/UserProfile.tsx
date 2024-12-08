import { FC } from "react";
import s from "./UserProfile.module.css";
import { Profile } from "@assets/icons/Profile";

export const UserProfile: FC = () => {
  return (
    <div className={s.userProfile}>
      <div className={s.avatar}>
        <Profile />
      </div>
      <span className={s.userName}>Имя пользователя</span>
    </div>
  );
};
