"use client";
import SearchBar from "@/components/Client/SearchBar";
import { useParams } from "next/navigation";
import FollowUser from "@/components/Client/FollowUser";
import { useState, useEffect } from "react";
import DesoAPI from "@/lib/deso";
import Post from "@/components/Client/Post";
const Explore = () => {
  const param = useParams();
  const id = param.id as string;
  const Deso = new DesoAPI();
  const [people, setPeople] = useState<any>(null);
  const [posts, setPosts] = useState<any>(null);

  // Get people related to the topic

  async function getPeople() {
    const user = localStorage.getItem("deso_user_key");
    const response = await Deso.searchUsername(id, 3, user);
    const SERVER_ENDPOINT =
      process.env.SERVER_ENDPOINT || "http://localhost:3000";
    const posts = await fetch(`${SERVER_ENDPOINT}/api/discovery/searchPosts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        search: id,
      }),
    });
    if (response) {
      setPeople(response.ProfilesFound);
    }
    if (posts) {
      const postData = await posts.json();
      setPosts(postData.data);
    }
  }

  useEffect(() => {
    if (localStorage) {
      getPeople();
    }
  }, []);

  return (
    <>
      <h1 className="text-xl font-bold p-6 backdrop-blur z-10 bg-background/10 sticky top-0">
        Explore &quot;{id.charAt(0).toUpperCase() + id.slice(1)}&quot;
      </h1>
      <section className="ml-10 mr-10 mt-4">
        <SearchBar type="normal" num={3} />
        <h2 className="mt-6 text-xl mb-2">Creators For You</h2>
        {people &&
          people?.map(function (value) {
            return (
              <FollowUser
                id={value.PublicKeyBase58Check}
                name={value.Username}
                username={value.Username}
                key={value.PublickeyBase58Check}
                loading={false}
              />
            );
          })}
        {!people &&
          Array.from({ length: 3 })?.map((i: any) => {
            return (
              <FollowUser id="" name="" username="" key={i} loading={true} />
            );
          })}
        <h2 className="mt-6 text-xl mb-2">Posts For You</h2>

        <div className="w-full h-[1px] bg-gray-800 mt-5"></div>

        {!posts &&
          Array.from({ length: 5 }).map((_, i) => (
            <Post
              loading={true}
              postData={{}}
              username={""}
              name={""}
              bottom={true}
              key={i}
            />
          ))}
        {posts &&
          posts?.map(function (value: any) {
            return (
              <Post
                loading={false}
                postData={value}
                username={""}
                name={""}
                bottom={true}
                key={value.PostHashHex}
              />
            );
          })}
      </section>
    </>
  );
};

export default Explore;
