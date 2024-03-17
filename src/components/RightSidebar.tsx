"use client";
import DesoAPI from "@/lib/deso";
import { useEffect, useState, cache } from "react";
import FollowUser from "./Client/FollowUser";
import Image from "next/image";
import SearchBar from "./Client/SearchBar";
import { usePathname } from "next/navigation";
import Hashtags from "./Client/Hashtags";
import { useContext } from "react";
import ModalContext from "@/context/ModalContext";
import Link from "next/link";
import { HiOutlineHashtag } from "react-icons/hi2";

interface UserProfile {
  Profile: {
    Username: string;
    DESOBalanceNanos: number;
    ExtraData: { [key: string]: string };
  };
}

const RightSidebar: React.FC = () => {
  const Deso = new DesoAPI();
  const [user, setUser] = useState<UserProfile>();
  const [desoValue, setDesoValue] = useState<any>();
  const [profilePic, setProfilePic] = useState<string>();
  const [trendingTags, setTrendingTags] = useState<any>();
  const [recommendedUsers, setRecommendedUsers] = useState<any>();
  const [loggedIn, setLoggedIn] = useState<boolean>(true);
  const { unreadNotifications, communityData } = useContext(
    ModalContext
  ) as any;
  const [notificationCount, setNotificationCount] = unreadNotifications;
  const [communData] = communityData;

  const pathName = usePathname();

  async function getUserInfo(userKey: string): Promise<void> {
    try {
      const response = await Deso.getSingleProfileFK(userKey);
      const profile = (await Deso.getSingleProfilePicture(userKey)) as string;
      const desoPrice = await Deso.getDesoValue();
      if (profile) {
        setProfilePic(profile);
        localStorage.setItem("profilePic", profile);
      }
      if (desoPrice) {
        setDesoValue(desoPrice);
        localStorage.setItem("desoValue", JSON.stringify(desoPrice));
      }
      if (response) {
        const userData: string =
          typeof response === "string" ? response : JSON.stringify(response);
        localStorage.setItem("userInfo", userData);

        setUser({
          Profile: (response.Profile as any) || {
            Username: "",
            DESOBalanceNanos: 0,
            ExtraData: { DisplayName: "" },
          },
        });
      }
    } catch (error) {
      // Handle errors if necessary
      console.error("Error fetching user info:", error);
    }
  }

  // Get Recommended Creators For A User

  const getRecommendedCreators = cache(async () => {
    try {
      const SERVER_ENDPOINT =
        process.env.SERVER_ENDPOINT || "http://localhost:3000";

      const response = await fetch(
        `${SERVER_ENDPOINT}/api/discovery/getRecommendedFollowings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            number: 3,
            interests: "",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  });

  // Get Trending hashtags on the DeSo Blockchain

  const getTrendingTags = cache(async () => {
    try {
      const SERVER_ENDPOINT =
        process.env.SERVER_ENDPOINT || "http://localhost:3000";

      const response = await fetch(
        `${SERVER_ENDPOINT}/api/discovery/trendingTags`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  });

  async function getDiscovery() {
    setTrendingTags(await getTrendingTags());
    setRecommendedUsers(await getRecommendedCreators());
  }

  // Get unread notification counts (pretty-self-explanatory)
  async function getUnreadNotifications(id: string) {
    const response = (await Deso.getUnreadNotifications(id)) as any;
    setNotificationCount(response.data);
  }

  useEffect(() => {
    if (localStorage && localStorage.getItem("deso_user_key")) {
      setLoggedIn(true);
      const activePublicKey = localStorage.getItem("deso_user_key");
      const storedUserInfo = localStorage.getItem("userInfo") || "";
      const storedProfilePicture = localStorage.getItem("profilePic");

      if (storedUserInfo) {
        const parsedUserInfo: UserProfile = JSON.parse(storedUserInfo);
        setUser(parsedUserInfo);
      }
      if (storedProfilePicture) {
        setProfilePic(profilePic);
      }
      if (activePublicKey) {
        getUserInfo(activePublicKey);
        getUnreadNotifications(activePublicKey as string);
      }
    } else {
      setLoggedIn(false);
    }
    getDiscovery();
  }, []);

  if (!pathName.includes("message")) {
    return (
      <section className="w-full no-scrollbar sticky hidden top-2 overflow-y-scroll mt-2 xl:flex flex-col items-stretch h-[100vh] overflow-x-hidden  px-6">
        {/* Search Container */}
        {!pathName.includes("explore") &&
          !pathName.includes("communities") &&
          !pathName.includes("channels") &&
          loggedIn && <SearchBar type="normal" num={3} />}

        {/* User Profile */}
        {loggedIn && (
          <div className="flex flex-col rounded-xl bg-neutral-900 my-4">
            <div>
              <div className="hover:bg-background/10 p-4 flex justify-between items-center last:rounded-b-xl transition duration-200">
                {profilePic ? (
                  <>
                    {/* Profile Data is loaded*/}

                    <div className="flex items-center space-x-2">
                      <Image
                        alt="Profile Picture"
                        src={profilePic as string}
                        width={45}
                        height={45}
                        className={`w-10 h-10 rounded-full flex-none`}
                      />
                      <div className="flex flex-col">
                        <div className="font-bold text-primaryText">
                          {user?.Profile?.ExtraData?.DisplayName}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {user ? "@" : ""}
                          {user?.Profile?.Username}
                        </div>
                      </div>
                    </div>
                    {/* Add the "Balance" line here */}
                    <div className="text-gray-500 text-xs">
                      {desoValue &&
                        `Balance: $${Number(
                          (((user?.Profile?.DESOBalanceNanos as number) /
                            1000000000) *
                            desoValue?.USDCentsPerDeSoExchangeRate) /
                            100
                        ).toFixed(1)}
`}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Profile Data is loading*/}
                    <div className="flex items-center space-x-2">
                      {/* Profile Picture */}
                      <div
                        className={`rounded-full bg-slate-700 h-10 w-10 animate-pulse`}
                      ></div>

                      {/* User Information */}
                      <div className="flex flex-col">
                        {/* Display Name */}
                        <div className="font-bold text-primaryText h-2 bg-slate-700 rounded w-20 animate-pulse"></div>

                        {/* Username */}
                        <div className="text-gray-500 text-xs h-2 bg-slate-700 rounded w-16 mt-3 animate-pulse"></div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Trending */}
        {loggedIn && !pathName.includes("channels") && (
          <div className="flex flex-col rounded-xl bg-neutral-900  mb-1">
            <h3 className="font-bold text-xl my-4 px-4 text-primaryText">
              Trending Hashtags
            </h3>
            <div>
              {trendingTags ? (
                <>
                  {/* The Trending Hashtags are loaded*/}

                  {trendingTags?.map((value: any) => (
                    <Hashtags key={value} loading={false} value={value} />
                  ))}
                </>
              ) : (
                <>
                  {/* The Trending Hashtags are loading*/}

                  {Array.from({ length: 5 })?.map((i: any) => (
                    <Hashtags key={i} loading={true} value={""} />
                  ))}
                </>
              )}
            </div>
          </div>
        )}

        {/* Creators For You*/}
        {loggedIn && !pathName.includes("channels") && (
          <>
            {/* Creators For You*/}
            <div className="flex flex-col rounded-xl bg-neutral-900 my-2">
              <h3 className="font-bold text-primaryText text-xl my-4 px-4">
                Creators For You
              </h3>
              <div>
                {recommendedUsers ? (
                  <>
                    {/* The Creators For You are loaded*/}

                    {recommendedUsers?.map((value: any) => (
                      <FollowUser
                        id={value.PublicKeyBase58Check}
                        name={value.Username}
                        username={value.Username}
                        key={value.PublickeyBase58Check}
                        loading={false}
                      />
                    ))}
                  </>
                ) : (
                  <>
                    {/* The Creators For You are loading*/}

                    {Array.from({ length: 3 })?.map((i: any) => (
                      <FollowUser
                        id=""
                        name=""
                        username=""
                        key={i}
                        loading={true}
                      />
                    ))}
                  </>
                )}
              </div>
            </div>
          </>
        )}

        {/* Community Channels */}
        {false && (
          <div className="flex flex-col rounded-xl bg-neutral-900 my-2">
            <ul className="p-4">
              {communData?.channels?.map(function (value: any) {
                return (
                  <li
                    key={value.name}
                    className="mb-1 cursor-pointer hover:bg-neutral-800 rounded-xl p-2"
                  >
                    <HiOutlineHashtag className="inline-block align-middle mr-2  " />
                    <span>{value.name}</span>
                  </li>
                );
              })}
              {!communData && (
                <>
                  {" "}
                  {Array.from({ length: 2 })?.map((i: any) => (
                    <div
                      key={i}
                      className="w-full h-5 bg-neutral-900 animate-pulse"
                    ></div>
                  ))}
                </>
              )}
            </ul>
          </div>
        )}
        {false && (
          <>
            {/* Members of community */}
            <div className="flex flex-col rounded-xl bg-neutral-900 my-2">
              <h3 className="font-bold text-primaryText text-xl my-4 px-4">
                Community Admins
              </h3>
              {Array.from({ length: 1 })?.map((i: any) => (
                <FollowUser id="" name="" username="" key={i} loading={true} />
              ))}
              <h3 className="font-bold text-primaryText text-xl my-4 px-4">
                Community Members
              </h3>
              <section className="h-full max-h-[60vh] overflow-x-hidden overflow-y-auto">
                {Array.from({ length: 4 })?.map((i: any) => (
                  <FollowUser
                    id=""
                    name=""
                    username=""
                    key={i}
                    loading={true}
                  />
                ))}
              </section>
            </div>
          </>
        )}
        {/* Advanced   */}
        {loggedIn && !pathName.includes("discover") && (
          <>
            <div className="flex flex-col rounded-xl bg-neutral-900 mt-1 mb-3">
              <div className="hover:bg-background/10 p-4 flex justify-between items-center last:rounded-b-xl transition duration-200">
                <h3 className="font-bold text-xl my-4 px-4 text-primaryText">
                  Advanced
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="flex flex-col">
                    <div className="font-bold text-primaryText">
                      Your DeSo:{" "}
                      {(
                        (user?.Profile?.DESOBalanceNanos as number) / 1000000000
                      ).toFixed(1)}
                    </div>
                    <div className="text-gray-500 text-xs">
                      DeSo Price: $
                      {(desoValue?.USDCentsPerDeSoExchangeRate / 100).toFixed(
                        2
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Copyright + Other Boring Information  */}
        {loggedIn && (
          <>
            <div className="mt-2 pb-5 text-xs ml-2 ">
              <Link
                href="/boring/terms-of-service"
                className="inline underline"
              >
                {" "}
                Terms Of Service
              </Link>
              <Link href="/boring/privacy-policy" className="inline underline">
                <p className="inline underline ml-3"> Privacy Policy</p>{" "}
              </Link>

              <p className="inline ml-3">
                {" "}
                © {new Date().getFullYear()} Eva Social
              </p>
            </div>
          </>
        )}
      </section>
    );
  }
};

export default RightSidebar;
