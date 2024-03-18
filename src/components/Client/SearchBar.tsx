"use client";
import { useState } from "react";
import DesoAPI from "@/lib/deso";
import { BsSearch } from "react-icons/bs";
import FollowUser from "./FollowUser";
import Hashtags from "./Hashtags";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  num: number;
  type: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ num, type }) => {
  const [items, setItems] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const Deso = new DesoAPI();

  async function getSearchInfo() {
    const user = localStorage.getItem("deso_user_key");
    const searchBox = document.getElementById("searchBox") as HTMLInputElement;

    const value: string = searchBox.value;
    const SERVER_ENDPOINT =
      process.env.NEXT_PUBLIC_SERVER_ENDPOINT || "http://localhost:3000";
    if (type != "communities") {
      if (value.length > 2) {
        // Get trending usernames
        const response = (await Deso.searchUsername(value, num, user))
          ?.ProfilesFound;

        // Get trending tags
        const tags = await fetch(
          `${SERVER_ENDPOINT}/api/discovery/autoCompleteSearch`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              search: value,
            }),
          }
        );
        const data = await tags.json();

        setItems(response as any);
        setTags(data as any);
        setLoading(false);
      } else {
        setItems([]);
        setTags([]);
      }
    }
  }
  return (
    <div className="relative mt-1">
      <div>
        <div className="sticky w-full h-full group ">
          {/* Search Input Field */}
          <input
            id="searchBox"
            type="text"
            placeholder={`Search Eva ${
              type == "communities" ? "for communities" : ""
            }`}
            maxLength={100}
            onKeyDown={(event: any) => {
              if (event.key === "Enter") {
                router.push(`/explore/${event.target.value}`);
              }
            }}
            onChange={(e) => {
              if (e.target.value.length > 2 && type != "communities") {
                setLoading(true);
              } else {
                setLoading(false);
              }
              setItems([]);
              setTags([]);
              getSearchInfo();
            }}
            className=" peer focus:outline-primary focus:outline bg-neutral-900/90 w-full h-full rounded-xl py-4 pl-14 pr-4"
          />
          <label
            htmlFor="searchBox"
            className="absolute top-0 left-0 h-full flex items-center justify-center p-4 text-gray-500 peer-focus:text-primary"
          >
            {/* Search Icon */}
            <BsSearch className="w-5 h-5" />
          </label>
        </div>
      </div>
      <div className="bg-neutral-900/90 w-full rounded-xl  mt-1  absolute z-20 top-12">
        <ul>
          {/* Loading */}
          {loading && (
            <>
              <h2 className="font-bold pl-6 mt-4 font-xl h-7 bg-slate-700 rounded w-20 animate-pulse ml-4"></h2>
              {Array.from({ length: 3 })?.map(function (i: any) {
                return <Hashtags value={""} key={i} loading={true} />;
              })}
              <h2 className="font-bold pl-6 mt-4 font-xl h-7 bg-slate-700 rounded w-20 animate-pulse ml-4"></h2>
              {Array.from({ length: 3 })?.map(function (i: any) {
                return (
                  <FollowUser
                    id={""}
                    name={""}
                    key={i}
                    username={"value.Username"}
                    loading={true}
                  />
                );
              })}
            </>
          )}

          {tags?.length > 0 && (
            <h2 className="font-bold pl-6 mt-4 font-xl">Tags</h2>
          )}
          {tags?.slice(0, 3).map(function (value: any) {
            return (
              <Hashtags value={value} key={value.clouttag} loading={false} />
            );
          })}

          {items?.length > 0 && (
            <h2 className="font-bold pl-6 mt-4 font-xl">People</h2>
          )}

          {items?.map(function (value: any) {
            return (
              <FollowUser
                id={value.PublicKeyBase58Check}
                name={value.Username}
                key={value.PublicKeyBase58Check}
                username={value.Username}
                loading={false}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SearchBar;
