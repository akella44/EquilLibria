import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavItem } from "./types";
import { Logo } from "@/shared/ui/Logo";
import s from "./Sidebar.module.css";
import { UserProfile } from "../UserProfile";
import { sidebarItems } from "./constants";
import { Separator } from "@/shared/ui/Separator/Separator";

export const Sidebar = () => {
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState<string>(location.pathname);

  useEffect(() => {
    setActiveIndex(location.pathname);
  }, [location.pathname]);

  const router = useNavigate();

  const handleClick = (item: NavItem) => {
    setActiveIndex(item.id);
    router(item.link);
  };

  return (
    <div className={s.sidebar}>
      <div className={s.logowrapper}>
        <Logo />
      </div>
      <div className={s.userProfileWrapper}>
        <UserProfile />
      </div>
      {sidebarItems.map((item) => (
        <div
          key={item.id}
          className={`${s.sidebarItem} ${
            activeIndex === item.id ? s.active : ""
          }`}
          onClick={() => handleClick(item)}
        >
          {item.title}
        </div>
      ))}
      <div className={s.separator}>
        <Separator />
      </div>
    </div>
  );
};
