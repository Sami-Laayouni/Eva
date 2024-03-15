"use client";
import { Dialog, DialogContent } from "../ui/dialog";
import { useContext, useState, useEffect, useRef } from "react";
import ModalContext from "@/context/ModalContext";
import DesoAPI from "@/lib/deso";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const CreateCommunity: React.FC = () => {
  const { createCommunity } = useContext(ModalContext) as any;
  const [isOpen, setIsOpen] = createCommunity || [false, () => {}];
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [current, setCurrent] = useState(0);
  const [membershipType, setMembershipType] = useState("open");
  const [NFTs, setNFTs] = useState<any>(null);
  const [restrictionType, setRestrictionType] = useState<any>(null);

  const inputFile = useRef(null) as any;
  const inputFile2 = useRef(null) as any;
  const router = useRouter();

  const [profile, setProfile] = useState("");
  const [banner, setBanner] = useState("");

  const DeSo = new DesoAPI();

  useEffect(() => {
    async function getUserNFTs() {
      const key = localStorage.getItem("deso_user_key");
      const response = (await DeSo.getNFTForUser(key as string)) as any;

      setNFTs(response?.data?.NFTsMap);
    }
    if (localStorage) {
      getUserNFTs();
    }
  }, []);

  // Set the selected file as the image url
  const changeHandler = async (event: any) => {
    //Get the selected image
    const img = event.target.files[0];
    const link = (await getImageUrl(img)) as string;
    setProfile(link);
  };

  // Set the selected file as the image url
  const changeHandler2 = async (event: any) => {
    //Get the selected image
    const img = event.target.files[0];

    const link = await getImageUrl(img);

    setBanner(link as any);
  };

  async function getImageUrl(result: any) {
    const user = localStorage.getItem("deso_user_key");
    const JWT = await DeSo.getJwt();
    const link = await DeSo.uploadImage(user as string, JWT as string, result);
    return link?.ImageURL;
  }
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          {current == 0 && (
            <div className="w-[40vw]">
              <h1 className="text-xl font-bold">Create A New Community</h1>
              <p className="mt-2">Tell us a little bit about your community.</p>
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                className="w-full mt-4"
                placeholder="Community Name"
                required
              />
              <textarea
                value={desc}
                onChange={(e) => {
                  setDesc(e.target.value);
                }}
                className="p-2 mt-4 w-full bg-transparent border-[0.5px] border-white resize-none"
                rows={5}
                cols={5}
                placeholder="Community Description"
                required
              ></textarea>
            </div>
          )}
          {current == 1 && (
            <div className="w-[40vw]">
              <h1 className="text-xl font-bold">Community Membership</h1>
              <p className="mt-2">Control who can join your community.</p>
              <label className="flex items-center mt-4">
                <input
                  type="radio"
                  className="h-5 w-5 text-white"
                  name="membership"
                  value="open"
                  checked={membershipType === "open"}
                  onChange={() => setMembershipType("open")}
                />
                <span className="ml-2 text-white">Open</span>
              </label>
              <p className="text-gray-500 block mb-4">
                Anyone with an account can join the Community
              </p>

              <label className="flex items-center">
                <input
                  type="radio"
                  className=" h-5 w-5 text-white"
                  name="membership"
                  value="restricted"
                  checked={membershipType === "restricted"}
                  onChange={() => setMembershipType("restricted")}
                />
                <span className="ml-2 text-white">Restricted</span>
              </label>
              <p className="text-gray-500 block mb-2">
                Restrict access to the community to investors or memory holders.
              </p>
              {membershipType == "restricted" && (
                <>
                  <Input
                    className="w-full border-primary"
                    placeholder="Min amount of USD to join"
                    type="number"
                    min={0}
                    onChange={(e) =>
                      setRestrictionType("invest:" + e.target.value)
                    }
                  />
                  <p className="text-gray-500 block mt-2">
                    Or/And holds one of these memories (optional):
                  </p>
                  <ul className="list-none overflow-y-hidden overflow-x-scroll whitespace-nowrap">
                    {NFTs &&
                      Object.values(NFTs)?.map(function (value: any, index) {
                        if (value.PostEntryResponse.ImageURLs) {
                          return (
                            <li
                              className="inline-block cursor-pointer mt-2 ml-3 w-[75px] h-[75px] align-middle rounded-xl mb-5"
                              key={Object.keys(NFTs)[index]}
                              onClick={() =>
                                setRestrictionType(
                                  "nft:" + Object.keys(NFTs)[index]
                                )
                              }
                              style={
                                restrictionType ==
                                "nft:" + Object.keys(NFTs)[index]
                                  ? { outline: "4px solid purple" }
                                  : {}
                              }
                            >
                              <img
                                src={value?.PostEntryResponse?.ImageURLs[0]}
                                alt="NFT Image"
                                className="w-[75px] h-[75px] align-middle rounded-xl"
                                loading="lazy"
                              ></img>
                            </li>
                          );
                        } else {
                          return (
                            <li
                              className="inline-block justify-center mt-2 cursor-pointer ml-3 w-[75px] h-[75px] align-middle rounded-xl mb-5"
                              key={"nft:" + Object.keys(NFTs)[index]}
                              onClick={() =>
                                setRestrictionType(
                                  "nft:" + Object.keys(NFTs)[index]
                                )
                              }
                              style={
                                restrictionType ==
                                "nft:" + Object.keys(NFTs)[index]
                                  ? { outline: "4px solid purple" }
                                  : {}
                              }
                            >
                              {value?.PostEntryResponse?.Body?.substring(0, 6) +
                                "..."}
                            </li>
                          );
                        }
                      })}
                  </ul>
                </>
              )}
            </div>
          )}

          {current == 2 && (
            <div className="w-[40vw]">
              <input
                alt="uploadImage"
                type="file"
                accept="image/*"
                name="file"
                ref={inputFile}
                id="inputFile"
                onChange={changeHandler}
                style={{ display: "none" }}
              />
              <input
                alt="uploadImage"
                type="file"
                accept="image/*"
                name="file"
                ref={inputFile2}
                onChange={changeHandler2}
                style={{ display: "none" }}
              />

              <div className="w-full flex justify-center align-middle">
                <img
                  src={profile}
                  className={`${
                    profile ? "block" : "hidden"
                  } w-[80px] h-[80px] rounded-full`}
                  alt="Image uploaded"
                  onClick={() => inputFile.current.click()}
                ></img>
              </div>

              <div className="w-full flex justify-center align-middle">
                <div
                  className={`${
                    profile ? "hidden" : "flex"
                  } p-5 w-[100px] h-[100px]  justify-center align-middle  mt-4 border-dashed border-white border-2 rounded-full cursor-pointer`}
                  onClick={() => inputFile.current.click()}
                >
                  <p id="uploadBanner">Upload Profile</p>
                </div>
              </div>

              <div
                className={`${
                  banner ? "hidden" : "flex"
                } mt-4 p-20 flex justify-center align-middle border-dashed border-white border-2 rounded-xl cursor-pointer`}
                onClick={() => inputFile2.current.click()}
              >
                <p id="uploadBanner">Upload Banner</p>
              </div>
              <div className="w-full flex justify-center align-middle">
                <img
                  id="banner"
                  onClick={() => inputFile2.current.click()}
                  className={`${
                    banner ? "block" : "hidden"
                  } rounded-xl w-full max-w-[400px] mt-4`}
                  src={banner}
                  alt="Image uploaded"
                ></img>
              </div>
            </div>
          )}

          <div className="w-full flex justify-end">
            <Button
              onClick={async () => {
                if (current != 2) {
                  let currentPage = current;
                  setCurrent((currentPage += 1));
                } else {
                  const SERVER_ENDPOINT =
                    process.env.SERVER_ENDPOINT || "http://localhost:3000";

                  const communityPromise = new Promise<unknown>(
                    async (resolve, reject) => {
                      const response = await fetch(
                        `${SERVER_ENDPOINT}/api/community/create`,
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            name: name,
                            profilePic: profile,
                            banner: banner,
                            description: desc,
                            requirementsToJoin: restrictionType
                              ? restrictionType
                              : membershipType,
                          }),
                        }
                      );
                      const result = await response.json();

                      if (response) {
                        console.log(result);
                        router.push(`/channels/${result[0].id}`);

                        resolve(result);
                      } else {
                        reject(new Error("Failed to create community"));
                      }
                    }
                  );
                  toast.promise(communityPromise, {
                    loading: "Creating...",
                    success: (data) => {
                      setIsOpen(false);
                      return `Successfully created community`;
                    },
                    error: "Error",
                  });
                }
              }}
              className="text-white hover:bg-primary"
            >
              {current != 2 ? "Next" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default CreateCommunity;
