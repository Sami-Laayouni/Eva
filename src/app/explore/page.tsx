"use client";
import SearchBar from "@/components/Client/SearchBar";
import { IoMdTrendingUp } from "react-icons/io";

import { useEffect, useState } from "react";
import Post from "@/components/Client/Post";
import DesoAPI from "@/lib/deso";

const Discover = () => {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const DeSo = new DesoAPI();
  useEffect(() => {
    async function getPosts() {
      const user = localStorage.getItem("deso_user_key");

      const response = await DeSo.getTopFeed(user as string, [""]);
      console.log(response);
      setPosts(response);
      setLoading(false);
    }
    if (localStorage) {
      getPosts();
    }
  }, []);
  return (
    <>
      <h1 className="text-xl font-bold p-6 backdrop-blur z-10 bg-background/10 sticky top-0">
        Explore
      </h1>
      <section className="ml-10 mr-10">
        <SearchBar type="normal" num={3} />
        <div className="w-full h-[15rem] bg-slate-800 mt-4 rounded-xl animate-pulse"></div>
        <span className="inline-block align-bottom ">
          <IoMdTrendingUp size={30} />
        </span>{" "}
        <h1 className="mt-5 text-xl inline-block align-middle ">
          Top Stories of the Day
        </h1>
        {loading && (
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
        )}
        {posts && (
          <>
            {/* Post Feed */}
            <div className="flex flex-col w-full mt-2">
              {posts?.map(function (value: any) {
                return (
                  <Post
                    name={
                      value?.ProfileEntryResponse?.Profile?.ExtraData
                        ?.DisplayName
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
      </section>
    </>
  );
};

export default Discover;
