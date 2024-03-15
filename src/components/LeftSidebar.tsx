"use client";
import { BiHomeCircle, BiUser } from "react-icons/bi";
import {
  HiOutlineHashtag,
  HiOutlineUsers,
  HiDotsHorizontal,
} from "react-icons/hi";
import { BsBell, BsEnvelope } from "react-icons/bs";
import { PiCurrencyDollar } from "react-icons/pi";
import { IoSettingsOutline } from "react-icons/io5";
import { FiLogOut, FiEdit2 } from "react-icons/fi";

import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";
import ModalContext from "@/context/ModalContext";
import { useState, useEffect } from "react";
import DesoAPI from "@/lib/deso";
import { useRouter } from "next/navigation";

const NAVIGATION_ITEMS = [
  {
    title: "home",
    icon: "logo",
    requireLogin: false,
  },
  {
    title: "Home",
    icon: BiHomeCircle,
    requireLogin: false,
  },
  {
    title: "Explore",
    icon: HiOutlineHashtag,
    requireLogin: false,
  },
  {
    title: "Notifications",
    icon: BsBell,
    requireLogin: true,
  },
  {
    title: "Communities",
    icon: HiOutlineUsers,
    requireLogin: true,
  },
  /*{
    title: "Messages",
    icon: BsEnvelope,
    requireLogin: true,
  },*/
  {
    title: "Profile",
    icon: BiUser,
    requireLogin: true,
  },
  {
    title: "Monetization",
    icon: PiCurrencyDollar,
    requireLogin: true,
  },
  {
    title: "Settings",
    icon: IoSettingsOutline,
    requireLogin: true,
  },
  {
    title: "Advanced",
    icon: HiDotsHorizontal,
    requireLogin: true,
  },
];

const ADVANCED_NAVIGATION_ITEMS = [
  {
    title: "Algorithm",
    icon: FiEdit2,
    requireLogin: true,
  },
  /*{
    title: "Settings",
    icon: IoSettingsOutline,
    requireLogin: true,
  },*/
  {
    title: "Log Out",
    icon: FiLogOut,
    requireLogin: true,
  },
];

const LeftSidebar = () => {
  const [username, setUsername] = useState(null);
  const [loggedIn, setLoggedIn] = useState<boolean>(true);
  const [isHidden, setIsHidden] = useState<boolean>(true);

  const { unreadNotifications } = useContext(ModalContext) as any;
  const [notificationCount] = unreadNotifications;
  const Deso = new DesoAPI();
  const router = useRouter();

  useEffect(() => {
    if (localStorage && localStorage.getItem("userInfo")) {
      setUsername(
        JSON.parse(localStorage.getItem("userInfo") as any)?.Profile?.Username
      );
    }
  }, []);

  useEffect(() => {
    if (localStorage && localStorage.getItem("deso_user_key")) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  });

  return (
    <section className="sticky top-0 w-[23%] lg:flex flex-col items-stretch h-screen pr-5 hidden ">
      <div className="relative">
        {/* Navigation Items */}
        <div className="flex flex-col h-screen space-y-4 my-4">
          {NAVIGATION_ITEMS.map((item) =>
            !item.requireLogin || (item.requireLogin && loggedIn) ? (
              <Link
                className="hover:bg-white/10 text-2xl transition duration-200 flex items-center justify-start w-fit space-x-4 rounded-3xl py-2 px-4"
                href={`/${
                  item.title.toLowerCase() == "home"
                    ? ""
                    : item.title.toLowerCase() === "profile"
                    ? `profile/${username}?type=post`
                    : item.title.toLowerCase()
                }`}
                key={item.title}
                onClick={(e) => {
                  if (item.title == "Advanced") {
                    e.preventDefault();
                    setIsHidden(!isHidden);
                  }
                }}
              >
                <div>
                  {item.title == "Notifications" &&
                  notificationCount?.NotificationsCount > 0 ? (
                    <div className="relative">
                      <item.icon />
                      <div className="w-4 h-4 bg-red-500 rounded-full  text-white flex justify-center z-10 align-top text-xs absolute  top-0 right-0 ">
                        <p>
                          {notificationCount?.NotificationsCount < 10
                            ? notificationCount?.NotificationsCount
                            : "9+"}
                        </p>
                      </div>

                      <div className="w-4 h-4 bg-red-500 rounded-full animate-ping absolute  top-0 right-0 z-0"></div>
                    </div>
                  ) : (
                    <>
                      {item.title != "home" ? (
                        <item.icon />
                      ) : (
                        <Image
                          src={"/assets/icons/logo.png"}
                          alt="Eva Social Logo"
                          width={60}
                          height={60}
                        />
                      )}
                    </>
                  )}
                </div>
                {item.title !== "home" && <div>{item.title}</div>}
              </Link>
            ) : null
          )}
          <section
            className={`${
              isHidden ? "hidden" : ""
            } absolute z-[100]   bg-black shadow-[rgba(0,_0,_0,_0.25)_10px_3px_30px_-12px] pt-8 pb-8   shadow-white right-3 px-2		bottom-[12rem] rounded-xl w-[100%]`}
          >
            {ADVANCED_NAVIGATION_ITEMS.map((item) => (
              <Link
                className="hover:bg-white/10 text-2xl transition duration-200 flex w-fit items-center justify-start  space-x-4 rounded-3xl py-2 px-3"
                href={`/${
                  item.title.includes("&")
                    ? "settings"
                    : item.title.replace(/ /g, "").toLowerCase()
                }`}
                key={item.title}
                onClick={async (e) => {
                  if (item.title == "Log Out") {
                    e.preventDefault();
                    const user = localStorage.getItem("deso_user_key");
                    await Deso.signOut(user as string);
                    const SERVER_ENDPOINT =
                      process.env.SERVER_ENDPOINT || "http://localhost:3000";

                    await fetch(`${SERVER_ENDPOINT}/api/user/logOut`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({}),
                    });
                    router.push("/");
                    window.location.reload();
                  }
                }}
              >
                <item.icon />

                {item.title !== "home" && <div>{item.title}</div>}
              </Link>
            ))}
          </section>
        </div>
      </div>
    </section>
  );
};

export default LeftSidebar;
