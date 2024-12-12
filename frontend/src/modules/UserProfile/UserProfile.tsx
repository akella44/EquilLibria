import { FC } from "react";
import s from "./UserProfile.module.css";
import { Profile } from "@assets/icons/Profile";
import { userStore } from "@/store/user";
import { LeaveButton } from "@/shared/components/LeaveButton";

export const UserProfile: FC = () => {
  return (
    <div className={s.userProfile}>
      <div className={s.avatar}>
        <Profile />
      </div>
      <div className={s.wrapper}>
        <span className={s.userName}>{userStore.username}</span>
        <LeaveButton />
      </div>
    </div>
  );
};
