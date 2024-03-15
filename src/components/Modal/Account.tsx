"use client";
import { Dialog, DialogContent } from "../ui/dialog";
import { useContext, useState, useEffect, useRef } from "react";
import ModalContext from "@/context/ModalContext";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { Button } from "../ui/button";
import DesoAPI from "@/lib/deso";

const Account: React.FC = () => {
  const { account } = useContext(ModalContext) as any;
  const [isOpen, setIsOpen] = account || [false, () => {}];
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [username, setUsername] = useState("");
  const [food, setFood] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [bio, setBio] = useState("");
  const [profile, setProfile] = useState<string | ArrayBuffer | null>(null);
  const [fr, setFr] = useState<number>(0);
  const inputFile = useRef(null);

  const Deso = new DesoAPI();

  useEffect(() => {
    if (localStorage && localStorage.getItem("userInfo")) {
      const userData = JSON.parse(
        localStorage.getItem("userInfo") as string
      ).Profile;
      if (userData?.Description) {
        setBio(userData?.Description);
      }
      if (userData?.ExtraData?.Food) {
        setFood(userData?.ExtraData?.Food);
      }
      if (userData?.ExtraData?.Location) {
        setLocation(userData?.ExtraData?.Location);
      }
      if (userData?.ExtraData?.Website) {
        setWebsite(userData?.ExtraData?.Website);
      }
      if (userData?.Username) {
        setUsername(userData?.Username);
      }
      if (userData?.CoinEntry?.CreatorBasisPoints) {
        setFr(Math.round(userData?.CoinEntry?.CreatorBasisPoints / 100));
      }
      if (userData?.ExtraData?.DisplayName) {
        setFirst(userData?.ExtraData?.DisplayName.split(" ")[0]);
        setLast(userData?.ExtraData?.DisplayName.split(" ")[1]);
      }
    }
  }, []);

  async function saveInformation() {
    const user = localStorage.getItem("deso_user_key");
    const saveChanges = document.getElementById("saveChanges");
    if (saveChanges) {
      saveChanges.innerText = "Saving...";
    }

    const response = await Deso.updateInfo(
      user as string,
      username,
      bio,
      fr * 100,
      profile as any,
      food,
      location,
      website,
      `${first} ${last}`
    );
    if (response) {
      toast.success("Successfully saved");
      setIsOpen(false);
      if (saveChanges) {
        saveChanges.innerText = "Save Changes";
      }
    }
  }

  const changeProfile = (event: any) => {
    //Get the selected image
    const img = event.target.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
      setProfile(reader.result);
    };
    reader.readAsDataURL(img);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <div className="max-w-lg">
            <h1 className="text-2xl font-semibold mb-4 text-white ">
              Modify Your Profile
            </h1>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveInformation();
              }}
            >
              <Input
                className="w-full xl:w-[49%] inline-block"
                placeholder="First Name  👤"
                value={first}
                onChange={(e) => {
                  setFirst(e.target.value);
                }}
                required
              />
              <Input
                className="w-full xl:w-[49%] inline-block xl:ml-2 mt-4 xl:mt-0"
                placeholder="Last Name  👤"
                value={last}
                onChange={(e) => {
                  setLast(e.target.value);
                }}
                required
              />
              <Input
                className=" w-full xl:w-[49%] inline-block mt-4 "
                placeholder="Username ✨"
                value={username}
                pattern="[a-zA-Z0-9_]+"
                title="Username must only use letters, numbers, or underscores."
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (!/^[a-zA-Z0-9_]+$/.test(e.target.value) && username) {
                    toast.error(
                      "Username must only use letters, numbers, or underscores."
                    );
                  }
                }}
                required
              />
              <Input
                placeholder="Favorite Food 🍕 (optional)"
                value={food}
                onChange={(e) => {
                  setFood(e.target.value);
                }}
                className="w-full xl:w-[49%] inline-block  xl:ml-2 mt-4"
              />
              <Input
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                }}
                className=" w-full xl:w-[49%] inline-block mt-4 "
                placeholder="Location 🌍 (optional)"
              />
              <Input
                value={website}
                onChange={(e) => {
                  setWebsite(e.target.value);
                }}
                className="w-full xl:w-[49%] inline-block  xl:ml-2 mt-4"
                type="url"
                placeholder="Website 🌐 (optional)"
              />
              <div className="flex flex-col xl:flex-row gap-4 mt-4">
                <Input
                  value={fr}
                  onChange={(e) => {
                    setFr(Number(e.target.value));
                  }}
                  min={0}
                  max={100}
                  className="w-full xl:w-[49%]"
                  type="number"
                  placeholder="Founder Reward"
                />
                <div className="w-full xl:w-[49%] relative cursor-pointer ">
                  <input
                    className="opacity-0 absolute inset-0 w-full h-full"
                    type="file"
                    accept="image/*"
                    id="fileInput"
                    ref={inputFile}
                    onChange={changeProfile}
                  />
                  <label
                    htmlFor="fileInput"
                    className="flex justify-center items-center border-2 border-dashed border-primary text-white h-full"
                    style={{ minHeight: "44px" }} // Adjust minHeight to match the height of your Input field if necessary
                  >
                    Click here to upload pfp
                  </label>
                </div>
              </div>

              <textarea
                value={bio}
                className="text-white bg-transparent outline-none resize-none border-white h-[20vh] w-full wl:w-[30vw] mt-4"
                placeholder="Start something wonderful..."
                rows={10}
                onChange={(e) => {
                  setBio(e.target.value);
                }}
              ></textarea>
              <div className="w-full flex justify-end">
                {" "}
                <Button
                  type="submit"
                  className="hover:bg-primary mt-4 text-white"
                  id="saveChanges"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Account;
