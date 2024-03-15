"use client";
import { useState, useEffect } from "react";
import Post from "@/components/Client/Post";
import { usePathname } from "next/navigation";
import DesoAPI from "@/lib/deso";
import ComposePost from "@/components/Client/ComposePost";
const SinglePost = () => {
  const id = usePathname().split("/")[2];
  const DeSo = new DesoAPI();

  const [data, setData] = useState<any>(null);

  async function getSinglePost(id: string) {
    const user = localStorage.getItem("deso_user_key");
    const response = await DeSo.getSinglePost(id, user as string);
    setData(response?.PostFound);
  }

  useEffect(() => {
    if (localStorage) {
      getSinglePost(id);
    }
  }, []);
  return (
    <>
      <h1 className="text-xl font-bold p-6 backdrop-blur z-10 bg-background/10 sticky top-0">
        Post
      </h1>
      {!data && (
        <>
          <Post
            postData={""}
            username={""}
            name={""}
            loading={true}
            bottom={true}
          />
        </>
      )}
      {data && (
        <>
          <Post
            postData={data}
            username={""}
            name={""}
            loading={false}
            bottom={true}
          />
          <ComposePost postData={data} type="comment" />
          {data?.Comments?.map(function (value: any) {
            return (
              <Post
                loading={false}
                username={""}
                name={""}
                bottom={true}
                postData={value}
                key={value.PostHashHex}
              />
            );
          })}
        </>
      )}
    </>
  );
};

export default SinglePost;
