"use client";

import React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import DesoAPI from "@/lib/deso";
import Link from "next/link";

interface FollowUserProps {
  id: string;
  name: string;
  username: string;
  loading: boolean;
}

const FollowUser: React.FC<FollowUserProps> = ({
  id,
  name,
  username,
  loading,
}) => {
  const [followingLoading, setFollowingLoading] = useState<boolean>(true);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const Deso = new DesoAPI();

  async function getIsFollowing(user: string, id: string) {
    const response = (await Deso.checkFollowing(user, id)) as any;
    if (response) {
      setIsFollowing(response.data.IsFollowing);
      setFollowingLoading(false);
    }
  }

  useEffect(() => {
    if (localStorage && id) {
      getIsFollowing(localStorage.getItem("deso_user_key") as string, id);
    }
  }, [id]);
  // Return if we just have to return a dummy loading container
  if (loading) {
    return (
      <div
        key={id}
        className="hover:bg-background/20 cursor-pointer p-4 flex justify-between bg-background/10 items-center last:rounded-b-xl transition duration-200"
      >
        <div className="flex items-center space-x-2">
          <div
            className={`rounded-full bg-slate-700 h-10 w-10 animate-pulse`}
          ></div>
          <div className="flex flex-col">
            <div className="font-bold text-primaryText h-2 bg-slate-700 rounded w-20 animate-pulse"></div>
            <div className="text-gray-500 text-xs h-2 bg-slate-700 rounded w-16 mt-3 animate-pulse"></div>
          </div>
        </div>

        <button
          disabled={true}
          className="rounded-full px-6 py-2 bg-primary text-white-950 bg-slate-700 text-slate-700 animate-pulse"
        >
          Follow
        </button>
      </div>
    );
  }

  return (
    <Link href={`/profile/${username}?type=post`}>
      <div
        key={id}
        className="hover:bg-background/20 cursor-pointer p-4 flex justify-between bg-background/10 items-center last:rounded-b-xl transition duration-200"
      >
        <div className="flex items-center space-x-2">
          {" "}
          <Image
            width={45}
            height={45}
            className="w-10 h-10 bg-neutral-600 rounded-full flex-none"
            alt={`${name}'s Profile Picture`}
            src={`https://node.deso.org/api/v0/get-single-profile-picture/${id}?fallback=https://diamondapp.com/assets/img/default-profile-pic.png`}
          />
          <div className="flex flex-col">
            <div className="font-bold text-primaryText">
              {name.slice(0, 13)}
              {name.length > 13 ? "..." : ""}
            </div>
            <div className="text-gray-500 text-xs">@{username}</div>
          </div>
        </div>
        {/* True if we are determining if the user is following the other user */}
        {followingLoading ? (
          <button
            disabled={true}
            className="rounded-full px-6 py-2 bg-primary text-white-950 bg-slate-700 text-slate-700 animate-pulse"
          >
            Follow
          </button>
        ) : (
          <button
            onClick={async (e) => {
              e.preventDefault();
              const response = await Deso.followUser(
                localStorage.getItem("deso_user_key") as string,
                id,
                isFollowing
              );
              if (response) {
                setIsFollowing(!isFollowing);
              }
            }}
            className={`rounded-full px-6 py-2 ${
              isFollowing ? "bg-white text-black" : "bg-primary text-white-950"
            }  `}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>
    </Link>
  );
};

export default FollowUser;
