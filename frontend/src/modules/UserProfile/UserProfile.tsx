import { FC } from "react";
import s from "./UserProfile.module.css";
import { Profile } from "@assets/icons/Profile";
import { userStore } from "@/store/user";

export const UserProfile: FC = () => {
  return (
    <div className={s.userProfile}>
      <div className={s.avatar}>
        <Profile />
      </div>
      <span className={s.userName}>{userStore.username}</span>
    </div>
  );
};
