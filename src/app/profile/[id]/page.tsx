"use client";
import { useState, useEffect, useContext } from "react";
import ModalContext from "@/context/ModalContext";
import DesoAPI from "@/lib/deso";
import { MdVerified } from "react-icons/md";
import { GoClock } from "react-icons/go";
import { Button } from "@/components/ui/button";
import Post from "@/components/Client/Post";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import style from "../../../style/Posts.module.css";
import { IoWarning } from "react-icons/io5";

const ARRAY_TYPE = ["posts", "media", "memories", "exclusive"];

const Profile = () => {
  const DeSo = new DesoAPI();
  const id = usePathname().split("/")[2];

  // User Data
  const [profileData, setProfileData] = useState<any>(null);
  const [following, setFollowing] = useState("");
  const [followed, setFollowed] = useState("");
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isUser, setIsUser] = useState<boolean>(false);
  const [posts, setPosts] = useState<any>();
  const [isExclusive, setIsExclusive] = useState<boolean>(false);
  const [botReal, setBotReal] = useState<any>(null);
  const [fraud, setFraud] = useState<any>(null);

  // URL related fields
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const router = useRouter();
  const pathname = usePathname();

  const [types, setTypes] = useState<any>(type);

  const { account } = useContext(ModalContext) as any;
  const [isOpen, setIsOpen] = account || [false, () => {}];

  // Format number ie 5,000 will be 5K
  function formatNumber(num: number) {
    if (num < 1000) {
      return num.toString();
    } else if (num < 1000000) {
      return (num / 1000).toFixed(1) + "K";
    } else {
      return (num / 1000000).toFixed(1) + "M";
    }
  }

  function renderTags(content: string) {
    //Replace @ with a link to that user's profile page
    let innerText = content?.replace(
      /(@+[a-zA-Z0-9A-Za-zÀ-ÖØ-öø-ʸ(_)]{1,})/g /* Some complicated regex*/,
      (mention) => {
        return `<a href="/profile/${mention.substring(1)}">${mention}</a>`;
      }
    );
    //Replace # with a link to the search post with the hastag
    innerText = innerText?.replace(
      /(#(?:[^\x00-\x7F]|\w)+)/g /* Some complicated regex*/,
      (hashtags) => {
        return `<a href="/explore/${hashtags.substring(1)}"  >${hashtags}</a>`;
      }
    );
    //Replace links with a clickable link
    innerText = innerText?.replace(
      /([\w+]+\:\/\/)?([\w\d-]+\.)*[\w-]+[\.\:]\w+([\/\?\=\&\#\.]?[\w-]+)*\/?/gm /* Some complicated regex*/,
      (links) => {
        if (links.includes("http")) {
          return `<a href="${links}">${links}</a>`;
        } else {
          return `<a href="https://${links}" >${links}</a>`;
        }
      }
    );
    //Return the new content (Must use dangerouslySetInnerHtml)
    return <div dangerouslySetInnerHTML={{ __html: innerText }}></div>;
  }

  function isFraudScam(profileData: any) {
    if (profileData?.Profile?.CoinEntry?.CreatorBasisPoints / 100 > 50) {
      return {
        verdict: true,
        reason:
          "This user may be a risky investment due to a founder reward exceeding 50%.",
      };
    } else {
      return { verdict: false, reason: "" };
    }
  }

  async function getUserNFTs(id: string) {
    const response = await DeSo.getMemories(id);
    extractPostEntryResponses(response.data.NFTsMap);
    setPosts(extractPostEntryResponses(response?.data?.NFTsMap));
  }

  function extractPostEntryResponses(dataObject) {
    // Initialize an array to hold the PostEntryResponses
    const postEntryResponses = [];

    // Iterate over the object's values
    for (const key in dataObject) {
      if (dataObject.hasOwnProperty(key)) {
        // Check if the current value has a PostEntryResponse
        const value = dataObject[key];
        if (value && value.PostEntryResponse) {
          // Add the PostEntryResponse to the array
          postEntryResponses.push(value.PostEntryResponse);
        }
      }
    }

    return postEntryResponses;
  }

  async function getUsersPost(id: string, getMedia: boolean) {
    const user = localStorage.getItem("deso_user_key");

    const response = await DeSo.getPostsForPublicKey(
      id,
      user,
      10,
      getMedia,
      ""
    );
    setPosts(response?.Posts);
  }

  // Get is Following if not your account

  async function getIsFollowing(user: string, id: string) {
    const response = (await DeSo.checkFollowing(user, id)) as any;
    if (response) {
      setIsFollowing(response.data.IsFollowing);
    }
  }

  function isUserRealOrBot(userPosts: any) {
    // Check for unrealistic posting frequency
    const hasUnrealisticPostingFrequency = (posts: any) => {
      const timestamps = posts.map((post) => post.TimestampNanos);
      const timeDifferences = timestamps
        .slice(1)
        .map((time, i) => (time - timestamps[i]) / 1e9);
      const averageTimeDifference =
        timeDifferences.reduce((a, b) => a + b, 0) / timeDifferences.length;

      // Consider unrealistic if posts are too frequent or too evenly spaced
      return (
        Math.abs(averageTimeDifference) < 600 ||
        timeDifferences.every(
          (diff) => Math.abs(diff - averageTimeDifference) < 5
        )
      );
    };

    // Check for generic or nonsensical content
    const hasGenericOrNonsensicalContent = (posts: any) => {
      return posts.every(
        (post) => post.Body.length < 20 || post.Body.includes("lorem ipsum")
      );
    };

    // Check for lack of engagement (likes, comments, reposts)
    const lacksEngagement = (posts: any) => {
      return posts.every(
        (post) =>
          post.LikeCount === 0 &&
          post.CommentCount === 0 &&
          post.RepostCount === 0
      );
    };

    // Check for overly promotional content or links in posts
    const hasPromotionalContent = (posts: any): boolean => {
      return posts.every((post) => /http[s]?:\/\/[^\s]+/.test(post.Body));
    };

    // Check if the profile has diverse content
    function hasDiverseContent(posts: any): boolean {
      const uniqueContents = new Set(
        posts.map((post) => post.Body).filter((body) => body.length > 0)
      );

      return uniqueContents.size >= posts.length * 0.3; // Expect at least 50% unique content
    }

    // Basic heuristic: checks if there's a reasonable balance of likes, comments, and reposts
    function hasRealInteractions(posts: any): boolean {
      const totalInteractions = posts.reduce(
        (acc, post) =>
          acc + post.LikeCount + post.CommentCount + post.RepostCount,
        0
      );
      return totalInteractions > posts.length * 2; // Expect at least 2 interactions (likes, comments, reposts) per post on average
    }

    function hasNaturalTiming(posts: any): boolean {
      if (posts.length < 2) return true; // Not enough data to judge

      const timestamps = posts.map((post) => post.TimestampNanos).sort();
      const intervals = timestamps
        .slice(1)
        .map((time, i) => (time - timestamps[i]) / 1e9 / 60); // Convert to minutes
      const minInterval = Math.min(...intervals);
      const maxInterval = Math.max(...intervals);

      // Expect intervals not to be too regular and have some variability
      return maxInterval / minInterval > 5;
    }

    console.log(hasUnrealisticPostingFrequency(userPosts));
    console.log(hasGenericOrNonsensicalContent(userPosts));
    console.log(lacksEngagement(userPosts));
    console.log(hasPromotionalContent(userPosts));
    console.log(!hasDiverseContent(userPosts));
    console.log(!hasNaturalTiming(userPosts));
    console.log(!hasRealInteractions(userPosts));

    const isBot =
      hasUnrealisticPostingFrequency(userPosts) ||
      hasGenericOrNonsensicalContent(userPosts) ||
      lacksEngagement(userPosts) ||
      hasPromotionalContent(userPosts) ||
      !hasDiverseContent(userPosts) ||
      !hasNaturalTiming(userPosts) ||
      !hasRealInteractions(userPosts);

    return isBot ? "Bot" : "Real";
  }

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (id) {
          const response = await DeSo.getSingleProfile(id as string);
          const data = response as any;
          if (response) {
            setProfileData(data);
            getFollowingFollowers(data);
            if (
              localStorage &&
              localStorage.getItem("deso_user_key") !=
                data?.Profile?.PublicKeyBase58Check
            ) {
              getIsFollowing(
                localStorage.getItem("deso_user_key") as string,
                data?.Profile?.PublicKeyBase58Check
              );
            }
            if (
              JSON.parse(localStorage.getItem("userInfo"))?.Profile?.Username ==
              id
            ) {
              setIsUser(true);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        return null;
      }
    };

    const getFollowingFollowers = async (data: any) => {
      try {
        const followers = await DeSo.getFollowers(data?.Profile?.Username);
        const following = await DeSo.getFollowing(data?.Profile?.Username);
        const dataFollowers = followers as any;
        const dataFollowing = following as any;
        setFollowing(dataFollowing?.NumFollowers);
        setFollowed(dataFollowers?.NumFollowers);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, [id]);

  useEffect(() => {
    if (profileData && posts && followed) {
      if ((followed as number) >= 500) {
        const realOrBot = isUserRealOrBot(posts);
        setBotReal(realOrBot);

        if (realOrBot != "Bot") {
          const fraud = isFraudScam(profileData);
          setFraud(fraud);
        }
      }
    }
  }, [profileData, posts, followed]);

  // Update Types

  function updateTypes(type: string) {
    setTypes(type);
    setPosts(null);
    router.push(`${pathname}?type=${type}`);
    let getMedia = false;
    if (type == "media") {
      getMedia = true;
    }
    if (type != "memories") {
      if (type == "exclusive") {
        setPosts(null);
        setIsExclusive(true);
      } else {
        getUsersPost(profileData?.Profile?.PublicKeyBase58Check, getMedia);
        setIsExclusive(false);
      }
    } else {
      getUserNFTs(profileData?.Profile?.PublicKeyBase58Check);
      setIsExclusive(false);
    }
  }

  useEffect(() => {
    if (profileData) {
      let getMedia = false;
      if (type == "media") {
        getMedia = true;
      }
      if (type != "memories") {
        if (type == "exclusive") {
          setPosts(null);
          setIsExclusive(true);
        } else {
          getUsersPost(profileData?.Profile?.PublicKeyBase58Check, getMedia);
          setIsExclusive(false);
        }
      } else {
        getUserNFTs(profileData?.Profile?.PublicKeyBase58Check);
        setIsExclusive(false);
      }
    }
  }, [profileData]);

  // Loading Version
  if (!profileData) {
    return (
      <section>
        <div className="shadow-shadow-500 shadow-3xl rounded-primary relative mx-auto flex h-full w-full max-w-[600px] flex-col items-left  bg-cover bg-clip-border p-[16px] ">
          <div className="relative mt-1 flex h-32 w-full justify-left rounded-xl bg-cover bg-slate-700 animate-pulse">
            <div className="absolute -bottom-12  ml-4 flex h-[100px] w-[100px] items-center justify-left rounded-full border-[4px] border-white bg-slate-700 " />
          </div>
        </div>
        <div className="mt-16 flex flex-col items-left ml-4">
          <h4 className=" text-xl font-bold h-7 bg-slate-700 rounded w-80 animate-pulse"></h4>
          <p className="text-lightSecondary text-base font-normal h-7 bg-slate-700 rounded w-40 mt-2 animate-pulse"></p>
          <div className="mt-6 mb-3 flex gap-4 md:!gap-14 ml-4">
            <div className="flex flex-col items-center justify-center">
              <h3 className=" text-2xl font-bold h-8 bg-slate-700 rounded w-&0 animate-pulse text-slate-700">
                9.7K
              </h3>
              <p className=" text-sm font-normal h-7 bg-slate-700 rounded w-20 animate-pulse mt-2 text-slate-700">
                Followers
              </p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h3 className=" text-2xl font-bold h-8 bg-slate-700 rounded w-&0 animate-pulse text-slate-700">
                434
              </h3>
              <p className=" text-sm font-normal h-7 bg-slate-700 rounded w-20 animate-pulse mt-2 text-slate-700">
                Following
              </p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h3 className=" text-2xl font-bold h-8 bg-slate-700 rounded w-&0 animate-pulse text-slate-700">
                23
              </h3>
              <p className=" text-sm font-normal h-7 bg-slate-700 rounded w-20 animate-pulse mt-2 text-slate-700">
                Investors
              </p>
            </div>
          </div>
          {Array.from({ length: 3 })?.map((i: any) => (
            <Post
              loading={true}
              postData={{}}
              key={i}
              username={""}
              name={""}
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="shadow-shadow-500 shadow-3xl rounded  relative mx-auto flex h-full w-full max-w-[600px] flex-col items-left  bg-cover bg-clip-border p-[16px] ">
        {/* Banner */}
        <div
          className="relative mt-1 flex h-32 w-full justify-left rounded-xl  bg-cover object-cover "
          style={{
            backgroundImage: profileData?.Profile?.ExtraData?.FeaturedImageURL
              ? `url('${profileData?.Profile?.ExtraData?.FeaturedImageURL}')`
              : "url('/assets/fallback/background.png')",
          }}
        >
          {/* User Profile Picture */}
          <div className="absolute -bottom-12  ml-4 flex h-[100px] w-[100px] items-center justify-left rounded-full border-[4px] border-white bg-slate-800">
            <img
              className="h-full w-full rounded-full "
              src={`https://node.deso.org/api/v0/get-single-profile-picture/${profileData?.Profile?.PublicKeyBase58Check}?fallback=https://diamondapp.com/assets/img/default-profile-pic.png`}
              alt=""
            />
          </div>
        </div>
        {/* Basic Information */}
        <div className="mt-16 flex flex-col items-left ml-4">
          <div className="flex items-center justify-between w-full">
            <h4 className="text-white text-xl font-bold inline align-middle">
              {profileData?.Profile?.ExtraData?.DisplayName
                ? profileData?.Profile?.ExtraData?.DisplayName
                : profileData?.Profile?.Username}
              {profileData?.Profile?.IsVerified && (
                <MdVerified
                  data-info="This user is verified"
                  className="inline ml-1 align-middle cursor-pointer"
                />
              )}
              {profileData?.Profile?.IsReserved && (
                <GoClock
                  data-info="This account is reserved"
                  className="inline ml-1 align-middle cursor-pointer"
                />
              )}
            </h4>

            <div className="flex gap-2">
              {/* Follow Button */}
              {!isUser && (
                <button
                  onClick={async () => {
                    const response = await DeSo.followUser(
                      localStorage.getItem("deso_user_key") as string,
                      profileData?.Profile?.PublicKeyBase58Check,
                      isFollowing
                    );
                    if (response) {
                      setIsFollowing(!isFollowing);
                    }
                  }}
                  className={`rounded-full px-6 py-2 ${
                    isFollowing
                      ? "bg-white text-black"
                      : "bg-primary text-white-950"
                  }`}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              )}

              {/* Subscribe Button */}
              {followed &&
                (followed as number) >= 500 &&
                !isUser &&
                botReal != "Bot" &&
                fraud?.verdict == false && (
                  <button
                    // Add onClick handler for Subscribe action
                    onClick={() => {
                      setTypes("exclusive");
                      updateTypes("exclusive");
                    }}
                    className="rounded-full px-6 py-2 bg-[#000080] text-white "
                  >
                    Invest
                  </button>
                )}

              {isUser && (
                <button
                  className="rounded-full px-6 py-2 bg-primary text-white-950"
                  onClick={() => {
                    setIsOpen(true);
                  }}
                >
                  Edit
                </button>
              )}
            </div>
          </div>

          <p className="text-base font-normal">
            @{profileData?.Profile?.Username}
          </p>
        </div>

        {/* Profile Description */}
        <div className={style.tagsProfile}>
          {renderTags(profileData?.Profile?.Description)}
        </div>
        {/* Following/Followers */}
        <div className="mt-6 mb-3 flex gap-4 md:!gap-14 ml-4">
          {/* Following Information Is Not Loaded Yet*/}
          {!followed && parseInt(followed) != 0 && (
            <div className="mt-6 mb-3 flex gap-4 md:!gap-14 ml-4">
              <div className="flex flex-col items-center justify-center">
                <h3 className="text-bluePrimary text-2xl font-bold h-8 bg-slate-700 rounded w-&0 animate-pulse text-slate-700">
                  9.7K
                </h3>
                <p className="text-lightSecondary text-sm font-normal h-7 bg-slate-700 rounded w-20 animate-pulse mt-2 text-slate-700">
                  Followers
                </p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <h3 className="text-bluePrimary text-2xl font-bold h-8 bg-slate-700 rounded w-&0 animate-pulse text-slate-700">
                  434
                </h3>
                <p className="text-lightSecondary text-sm font-normal h-7 bg-slate-700 rounded w-20 animate-pulse mt-2 text-slate-700">
                  Following
                </p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <h3 className="text-bluePrimary text-2xl font-bold h-8 bg-slate-700 rounded w-&0 animate-pulse text-slate-700">
                  23
                </h3>
                <p className="text-lightSecondary text-sm font-normal h-7 bg-slate-700 rounded w-20 animate-pulse mt-2 text-slate-700">
                  Investors
                </p>
              </div>
            </div>
          )}

          {followed && (
            <>
              <div className="flex flex-col items-center justify-center">
                <h3 className="text-bluePrimary text-2xl font-bold">
                  {followed ? formatNumber(parseInt(followed)) : 0}
                </h3>
                <p className="text-lightSecondary text-sm font-normal">
                  Followers
                </p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <h3 className="text-bluePrimary text-2xl font-bold">
                  {following ? formatNumber(parseInt(following)) : 0}
                </h3>
                <p className="text-lightSecondary text-sm font-normal">
                  Following
                </p>
              </div>

              <div className="flex flex-col items-center justify-center">
                <h3 className="text-bluePrimary text-2xl font-bold">
                  {profileData?.Profile?.CoinEntry?.NumberOfHolders
                    ? formatNumber(
                        parseInt(
                          profileData?.Profile?.CoinEntry?.NumberOfHolders
                        )
                      )
                    : 0}
                </h3>
                <p className="text-lightSecondary text-sm font-normal">
                  Investors
                </p>
              </div>
            </>
          )}
        </div>
        <p className="text-red-300 text-lg mt-2">
          {botReal == "Bot" ? (
            <IoWarning className="inline align-middle mr-2 " size={30} />
          ) : (
            ""
          )}
          {botReal == "Bot"
            ? "This user is likely a bot, investing in this user is disabled."
            : ""}
        </p>
        <p className="text-red-300 text-lg mt-2">
          {botReal != "Bot" && fraud?.verdict ? (
            <IoWarning className="inline align-middle mr-2 " size={30} />
          ) : (
            ""
          )}
          {botReal != "Bot" && fraud?.verdict ? fraud?.reason : ""}
        </p>
      </div>

      {/* Types */}
      <section className="p-[16px] rounded flex items-center justify-around w-full mt-2 max-w-[600px] mx-auto">
        {ARRAY_TYPE?.map(function (value: any, i) {
          return (
            <Button
              onClick={() => {
                updateTypes(value);
              }}
              key={value}
              className={`w-[100%] ${i == 0 && "rounded-l"} ${
                i == ARRAY_TYPE.length - 1 && "rounded-r"
              } text-white hover:bg-secondary ${
                types == value
                  ? "bg-white text-primary"
                  : "bg-primary text-white"
              }`}
            >
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </Button>
          );
        })}
      </section>
      {!isExclusive && (
        <>
          {/* Posts */}

          <section className="p-[16px]  w-full  max-w-[600px] mx-auto">
            {!posts &&
              Array.from({ length: 3 })?.map((i: any) => {
                return (
                  <Post
                    name=""
                    username=""
                    loading={true}
                    postData={{}}
                    key={i}
                    bottom={true}
                  />
                );
              })}
            {posts && posts?.length > 0 && (
              <>
                {posts?.map(function (value: any) {
                  return (
                    <Post
                      name={
                        profileData?.Profile?.ExtraData?.DisplayName
                          ? profileData?.Profile?.ExtraData?.DisplayName
                          : profileData?.Profile?.Username
                      }
                      username={profileData?.Profile?.Username}
                      loading={false}
                      postData={value}
                      key={value.PostHashHex}
                      bottom={true}
                    />
                  );
                })}
              </>
            )}
          </section>
        </>
      )}
      {isExclusive && (
        <>
          <h1 className="ml-6 font-bold text-3xl mt-2">
            Unlock Exclusive Content
          </h1>
          <p className="ml-6 text-sm text-gray-500 mt-2 mb-2 ">
            Investing in @{profileData?.Profile?.Username} will unlock exclusive
            content as well as come with the following premium benefits:{" "}
          </p>
          <ul className="ml-10 mt-4  ">
            <li className="mb-2">
              Percentage ownership of @{profileData?.Profile?.Username}&apos;s
              stock{" "}
            </li>
            <li className="mb-2">
              Access to all premium communities by @
              {profileData?.Profile?.Username}
            </li>
            <li className="mb-2">
              Priority in DMs and other communications on Eva Social
            </li>
          </ul>
        </>
      )}
    </section>
  );
};

export default Profile;
