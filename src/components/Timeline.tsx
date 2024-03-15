"use client";

import { useState, useEffect } from "react";
import ComposePost from "./Client/ComposePost";
import Post from "./Client/Post";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import DesoAPI from "@/lib/deso";

function rankPosts(posts) {
  const rankedPosts = posts.map((post) => {
    let score = 0;
    const commentWeight = 2;
    const repostWeight = 1;
    const diamondWeight = 1.5;
    const likeWeight = 0.5;
    const mediaWeight = 20;

    if (post.CommentCount) score += post.CommentCount * commentWeight;
    if (post.RepostCount) score += post.RepostCount * repostWeight;
    if (post.DiamondCount) score += post.DiamondCount * diamondWeight;
    if (post.LikeCount) score += post.LikeCount * likeWeight;

    if (
      post?.ImageURLs?.length > 0 ||
      post?.VideoURLs?.length > 0 ||
      post?.PostExtraData?.EmbedVideoURL
    ) {
      score += mediaWeight;
    }

    if (post.ProfileEntryResponse.CoinPriceUSD < 100) {
      score -= 50;
    }
    if (!post.isHidden) {
      return { ...post, score };
    }
  });

  // Sort posts based on the assigned scores in descending order
  rankedPosts.sort((a, b) => b.score - a.score);
  console.log(rankedPosts);
  return rankedPosts;
}

const Timeline = () => {
  const [posts, setPosts] = useState<any>(null);
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const router = useRouter();
  const pathname = usePathname();
  const DeSo = new DesoAPI();

  async function getFollowingPosts() {
    const user = localStorage.getItem("deso_user_key");

    const response = await DeSo.getFollowingFeed(user as string, "");
    setPosts(response.PostsFound);
  }

  async function getRecommendedPosts() {
    const user = localStorage.getItem("deso_user_key");
    const SERVER_ENDPOINT =
      process.env.SERVER_ENDPOINT || "http://localhost:3000";
    const response = await fetch(
      `${SERVER_ENDPOINT}/api/discovery/getRecommendedPosts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user,
        }),
      }
    );
    const innerCircle = await DeSo.getFollowingFeed(user as string, "");

    if (response.ok) {
      const data = await response.json();
      console.log(data, innerCircle?.PostsFound);
      const combinedPosts = data.concat(innerCircle?.PostsFound);
      console.log(combinedPosts);
      const posts = rankPosts(combinedPosts);
      setPosts(posts);
    }
  }

  async function getPosts(typex) {
    if (typex) {
      if (typex == "following") {
        getFollowingPosts();
      } else if (typex == "foryou") {
        getRecommendedPosts();
      }
    } else {
      getRecommendedPosts();
    }
  }
  useEffect(() => {
    getPosts(type);
  }, [type]);

  function updateTypes(type: string) {
    setPosts(null);
    router.push(`${pathname}?type=${type}`);
    getPosts(type);
  }

  return (
    <>
      {/* Title of the Page */}
      <h1 className="text-xl font-bold p-6 backdrop-blur z-10 bg-background/10 sticky top-0">
        Home
      </h1>
      {/* Input Form */}
      <ComposePost type="post" postData={null} />

      {/* Posts or Memories */}
      <ul className="w-full grid grid-cols-2 h-9">
        <li
          onClick={() => {
            updateTypes("foryou");
          }}
          className="w-full h-full flex justify-center items-center align-middle    border-b-[0.5px] border-gray-600 cursor-pointer"
        >
          For You
        </li>
        <li
          onClick={() => {
            updateTypes("following");
          }}
          className="w-full h-full flex justify-center items-center align-middle   border-b-[0.5px] border-gray-600 border-l-[0.5px] cursor-pointer"
        >
          Following
        </li>
      </ul>
      {!posts && (
        <>
          {/* Post Feed */}
          <div className="flex flex-col w-full mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Post
                loading={true}
                postData={{}}
                username={""}
                name={""}
                bottom={true}
                key={i}
              />
            ))}
          </div>
        </>
      )}
      {posts && (
        <>
          {/* Post Feed */}
          <div className="flex flex-col w-full mt-2">
            {posts?.map(function (value: any) {
              return (
                <Post
                  name={
                    value?.ProfileEntryResponse?.Profile?.ExtraData?.DisplayName
                      ? value?.ProfileEntryResponse?.Profile?.ExtraData
                          ?.DisplayName
                      : value?.ProfileEntryResponse?.Profile?.Username
                  }
                  username={value?.ProfileEntryResponse?.Profile?.Username}
                  loading={false}
                  postData={value}
                  key={value.PostHashHex}
                  bottom={true}
                />
              );
            })}
          </div>
        </>
      )}
    </>
  );
};

export default Timeline;
