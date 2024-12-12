import { FC } from "react";
import s from "./UserProfile.module.css";
import { Profile } from "@assets/icons/Profile";
import { LeaveButton } from "@/shared/components/LeaveButton";
import { useCurrentUser } from "@/entities/User/useCurrentUser";

export const UserProfile: FC = () => {
  const { data } = useCurrentUser();
  
  return (
    <div className={s.userProfile}>
      <div className={s.avatar}>
        <Profile />
      </div>
      <div className={s.wrapper}>
        <span className={s.userName}>{data?.username}</span>
        <LeaveButton />
      </div>
    </div>
  );
};
