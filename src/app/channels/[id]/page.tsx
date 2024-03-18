"use client";
import { IoArrowBack } from "react-icons/io5";
import { useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useContext } from "react";
import ModalContext from "@/context/ModalContext";
function Channels() {
  const router = useRouter();
  const [data, setCommunityData] = useState<any>(null);
  const id = usePathname().split("/")[2];
  const { communityData } = useContext(ModalContext) as any;
  const [community, setCommunity] = communityData;

  useEffect(() => {
    async function getCommunity() {
      console.log(id);
      const SERVER_ENDPOINT =
        process.env.NEXT_PUBLIC_SERVER_ENDPOINT || "http://localhost:3000";
      const response = await fetch(
        `${SERVER_ENDPOINT}/api/community/getSingleCommunity`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            communityId: id,
          }),
        }
      );
      const result = await response.json();
      setCommunity(result);
      setCommunityData(result);
    }
    getCommunity();
  }, []);

  return (
    <section className="fixed w-full max-w-[40%]">
      <div className="flex items-center w-full h-16 pl-5 bg-neutral-900 border-b-[0.5px] border-b-gray-800">
        <IoArrowBack
          onClick={() => {
            router.back();
          }}
          size={22}
          className="mr-2 cursor-pointer"
        />
        {data?.channels[0]?.name}
      </div>
      <div className="w-full h-[80vh] bg-slate-800"></div>
      <div className="flex justify-center  bg-slate-800 w-full h-[22rem]">
        <Input className="w-[90%] mt-4" />
      </div>
    </section>
  );
}

export default Channels;
