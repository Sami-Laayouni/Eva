"use client";

import SearchBar from "@/components/Client/SearchBar";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import ModalContext from "@/context/ModalContext";
import { useContext, useEffect, useState } from "react";
import CommunityCard from "@/components/Client/CommunityCard";

const Communities = () => {
  const { createCommunity } = useContext(ModalContext) as any;
  const [isOpen, setIsOpen] = createCommunity || [false, () => {}];
  const [communities, setCommunities] = useState<any>(null);
  useEffect(() => {
    async function getCommunities() {
      const SERVER_ENDPOINT =
        process.env.SERVER_ENDPOINT || "http://localhost:3000";
      const response = await fetch(
        `${SERVER_ENDPOINT}/api/community/getCommunities`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      setCommunities(result);
    }
    getCommunities();
  }, []);
  return (
    <>
      <h1 className="text-xl font-bold p-6 backdrop-blur z-10 bg-background/10 sticky top-0 grid grid-cols-2">
        Communities
        <Button
          onClick={() => {
            setIsOpen(true);
          }}
          className="hover:bg-transparent bg-transparent flex  rounded-xl text-white  items-center justify-end"
        >
          <FaPlus size={18} className="mr-2" />
        </Button>
      </h1>
      <section className="relative ml-10 mr-10 mb-10 flex flex-col justify-between">
        <SearchBar type="communities" num={3} />
        <div className="w-full h-[15rem] bg-slate-800 mt-4 rounded-xl animate-pulse"></div>
        <h1 className="mt-4 font-bold text-lg text-gray-200">
          Communities you are in
        </h1>
        {communities ? (
          communities?.map(function (value: any) {
            return (
              <CommunityCard
                joined={true}
                loading={false}
                communityData={value}
                key={value.id}
              />
            );
          })
        ) : (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <CommunityCard
                joined={true}
                loading={true}
                communityData={{}}
                key={i}
              />
            ))}
          </>
        )}
      </section>
    </>
  );
};

export default Communities;
