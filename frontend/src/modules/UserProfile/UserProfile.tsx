import { FC } from "react";
import s from "./UserProfile.module.css";
import { Profile } from "@assets/icons/Profile";
import { LeaveButton } from "@/shared/components/LeaveButton";
import { useCurrentUser } from "@/entities/User/useCurrentUser";
import { avatars } from "@/shared/assets/avatars/avatars";

export const UserProfile: FC = () => {
  const { data } = useCurrentUser();
  console.log(data)

  return (
    <div className={s.userProfile}>
      <div className={s.avatar}>
        {data?.photo_id ? (
          <img src={avatars[data?.photo_id - 1]}></img>
        ) : (
          <Profile />
        )}
      </div>
      <div className={s.wrapper}>
        <span className={s.userName}>{data?.username}</span>
        <LeaveButton />
      </div>
    </div>
  );
};
