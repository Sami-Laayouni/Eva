"use client";
import DesoAPI from "@/lib/deso";
import { ChangeEvent } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { useState, useEffect, useContext, useRef } from "react";
import { useRouter } from "next/navigation";
import ModalContext from "@/context/ModalContext";
import { FaImage } from "react-icons/fa6";
import { MdOutlineGifBox } from "react-icons/md";
import { ImEmbed } from "react-icons/im";
import { BsEmojiSmileUpsideDown } from "react-icons/bs";
import { IoCloseOutline } from "react-icons/io5";
import { Input } from "../ui/input";
import dynamic from "next/dynamic";
const Picker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
});

function generateRandomUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

interface DeSoResponse {
  constructedTransactionResponse?: {
    PostHashHex: string;
  };
}

interface ComposePostProps {
  type: string;
  postData?: any; // Assuming postData might not always be required, making it optional
}

const ComposePost: React.FC<ComposePostProps> = ({ type, postData }) => {
  const DeSo = new DesoAPI();
  const [profilePic, setProfilePic] = useState<string>(
    "/assets/fallback/pfp.png"
  );
  const router = useRouter();
  const { comment, repost } = useContext(ModalContext) as any;
  const [isOpen, setIsOpen] = comment || [false, () => {}];
  const [isRepostOpen, setIsRepostOpen] = repost || [false, () => {}];
  const [images, setImages] = useState<any>([]);
  const [link, setLink] = useState("");

  const inputFile = useRef(null) as any;

  /* Used to submit a post to the DeSo blockchain 
  as well as our Supabase database for recommendation 
  systems and content_moderation */

  async function submitPost(formData: FormData) {
    const text = formData.get("postText") as string;
    const deso_key = localStorage.getItem("deso_user_key") as string;
    let url: any;

    if (link) {
      const endUrl = getYoutubeId(link);
      if (endUrl) {
        url = "https://www.youtube.com/embed/" + endUrl;
      } else {
        url = null;
      }
    }

    if (!text && images.length != 0) return;

    if (type == "post") {
      const postPromise = new Promise<unknown>(async (resolve, reject) => {
        try {
          /* Submit a post to the DeSo blockchain */
          const response: unknown = await DeSo.submitPost(
            deso_key,
            text,
            images,
            [],
            url,
            "note",
            "filter",
            "content"
          );

          const desoResponse = response as DeSoResponse;

          /* Submit a post to Supabase */

          const SERVER_ENDPOINT =
            process.env.SERVER_ENDPOINT || "http://localhost:3000";

          const response2 = await fetch(
            `${SERVER_ENDPOINT}/api/post/submitPost`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: generateRandomUUID(),
                text: text,
                deso_uid:
                  desoResponse?.constructedTransactionResponse?.PostHashHex ||
                  null,
                author_id: deso_key,
              }),
            }
          );

          if (response && response2.status === 200) {
            const postTextInput = document.getElementById(
              "postText"
            ) as HTMLInputElement;
            postTextInput.value = "";
            resolve(response);
          } else {
            reject(new Error("Failed to send messages"));
          }
        } catch (error) {
          reject(error);
        }
      });
      // Display loading toast while waiting for the post submission to complete
      toast.promise(postPromise, {
        loading: "Posting...",
        success: (data) => {
          return `Successfully sent post`;
        },
        error: "Error",
      });
    } else if (type == "comment") {
      const postPromise = new Promise<unknown>(async (resolve, reject) => {
        const response = await DeSo.submitComment(
          deso_key,
          text,
          images,
          [],
          url,
          postData?.PostHashHex
        );
        if (response) {
          const postTextInput = document.getElementById(
            "postText"
          ) as HTMLInputElement;
          postTextInput.value = "";
          resolve(response);
          setIsOpen(false);
          router.push(`/post/${postData?.PostHashHex}`);
        } else {
          reject(new Error("Failed to send messages"));
        }
      });

      toast.promise(postPromise, {
        loading: "Posting...",
        success: (data) => {
          return `Successfully sent post`;
        },
        error: "Error",
      });
    } else {
      const postPromise = new Promise<unknown>(async (resolve, reject) => {
        const response = await DeSo.submitRepost(
          deso_key,
          text,
          images,
          [],
          url,
          postData?.PostHashHex
        );
        if (response) {
          const postTextInput = document.getElementById(
            "postText"
          ) as HTMLInputElement;
          postTextInput.value = "";
          resolve(response);
          setIsRepostOpen(false);
          router.push(`/post/${postData?.PostHashHex}`);
        } else {
          reject(new Error("Failed to send messages"));
        }
      });

      toast.promise(postPromise, {
        loading: "Posting...",
        success: (data) => {
          return `Successfully sent post`;
        },
        error: "Error",
      });
    }

    setImages([]);
    setLink("");
    const embedLinkElement = document.getElementById(
      "embedLink"
    ) as HTMLElement | null;
    if (embedLinkElement) {
      embedLinkElement.style.display = "none";
    }

    const pickerElement = document.getElementById(
      "picker"
    ) as HTMLElement | null;
    if (pickerElement) {
      pickerElement.style.display = "none";
    }
  }

  /* Function to increase the height of the textarea when 
  the user types more */

  function auto_grow(element: HTMLTextAreaElement): void {
    element.style.height = "5px";
    element.style.height = `${element.scrollHeight}px`;
  }

  useEffect(() => {
    if (localStorage && localStorage.getItem("profilePic")) {
      setProfilePic(localStorage.getItem("profilePic") as string);
    }
  }, []);

  //On image button click, click on the input field.
  const onImageClick = () => {
    inputFile.current.click();
  };

  //Set the selected file as the image url
  const changeHandler = (event: any) => {
    //Get the selected image
    const img = event.target.files[0];
    getImageUrl(img);
  };

  async function getImageUrl(result: any) {
    const user = localStorage.getItem("deso_user_key");
    const JWT = await DeSo.getJwt();
    const link = (await DeSo.uploadImage(
      user as string,
      JWT as string,
      result
    )) as any;
    setImages((images: any) => [...images, link.ImageURL]);
  }

  // Remove image from URL
  const removeImage = (url: any) => {
    setImages(images.filter((image: any) => image !== url));
  };

  type EmojiObject = {
    emoji: string;
  };

  const onEmojiClick = (emojiObject: EmojiObject): void => {
    const postTextElement = document.getElementById("postText");

    if (
      postTextElement instanceof HTMLInputElement ||
      postTextElement instanceof HTMLTextAreaElement
    ) {
      const text = postTextElement.value;
      const value = text + emojiObject.emoji;

      postTextElement.value = value;
    }
  };

  function showPicker(): void {
    const pickerElement = document.getElementById(
      "picker"
    ) as HTMLElement | null;

    if (pickerElement !== null) {
      pickerElement.style.display =
        pickerElement.style.display !== "block" ? "block" : "none";
    }
  }

  function showEmbed(): void {
    const embedLinkElement = document.getElementById(
      "embedLink"
    ) as HTMLElement | null;

    if (embedLinkElement !== null) {
      embedLinkElement.style.display =
        embedLinkElement.style.display !== "block" ? "block" : "none";
    }
  }


  function getYoutubeId(link: any) {
    if (link) {
      const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = link.match(regExp);

      return match && match[2].length === 11 ? match[2] : null;
    }
  }

  return (
    <div className="border-t-[0.5px] border-b-[0.5px] px-4 flex items-stretch py-4 space-x-2 border-gray-600 relative">
      {/* Profile Picture */}
      <Image
        alt="Profile Picture"
        src={profilePic as string}
        width={45}
        height={45}
        className={`w-10 h-10 rounded-full flex-none`}
      />
      <form action={submitPost} className="flex flex-col w-full h-full">
        <input
          alt="uploadImage"
          type="file"
          accept="image/*"
          name="file"
          ref={inputFile}
          onChange={changeHandler}
          style={{ display: "none" }}
        />
        <textarea
          id="postText"
          name="postText"
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            auto_grow(e.target)
          }
          className="resize-none w-full h-[60px] overflow-hidden mb-1.5 text-lg placeholder:text-gray-600 bg-transparent border-b-[0.5px] border-gray-600 p-2  outline-none border-none"
          placeholder={`${
            type == "post"
              ? "Start something wonderful..."
              : `Respond ${
                  postData?.ProfileEntryResponse?.Username
                    ? `to @${postData?.ProfileEntryResponse?.Username}`
                    : "to yourself"
                } `
          }`}
          maxLength={400}
        />

        {/* Text Area Buttons */}
        <div className="w-full justify-between items-center flex">
          <div className="w-full flex justify-start text-primary">
            <FaImage
              onClick={onImageClick}
              className="align-middle cursor-pointer mt-[0.1rem]"
              size={23}
            />
            <BsEmojiSmileUpsideDown
              onClick={() => showPicker()}
              className="align-middle cursor-pointer ml-4"
              size={22}
            />
            <MdOutlineGifBox
              className="align-middle cursor-pointer ml-4"
              size={27}
            />

            <ImEmbed
              onClick={() => {
                showEmbed();
              }}
              className="align-middle cursor-pointer ml-4"
              size={25}
            />
          </div>

          <div className="w-full max-w-[100px]">
            <button
              type="submit"
              className="rounded-full bg-primary px-3 py-2  w-full text-m text-center hover:bg-opacity-70 transition duration-200  font-bold"
            >
              {type == "post"
                ? "Post"
                : type == "comment"
                ? "Comment"
                : "Repost"}
            </button>
          </div>
        </div>
        {images &&
          images?.map(function (value: any) {
            return (
              <div key={value} className="relative ">
                <img
                  src={value}
                  className="w-[full] rounded-xl max-w-[450px] mt-4"
                  alt="Uploaded images"
                ></img>
                <button
                  id="Remove uploaded image"
                  onClick={() => removeImage(value)}
                  className="w-[30px] h-[30px] border-none outline-none rounded-full bg-black flex pt-1 justify-center align-middle z-10 absolute top-6 left-3 cursor-pointer"
                >
                  <IoCloseOutline size={20} />{" "}
                </button>
              </div>
            );
          })}
        <div id="picker" className="hidden ">
          {" "}
          <Picker theme={"dark" as any} onEmojiClick={onEmojiClick} />
        </div>
        <Input
          id="embedLink"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="mt-4 border-primary hidden"
          placeholder="Embed Youtube video"
        />
      </form>
    </div>
  );
};

export default ComposePost;
