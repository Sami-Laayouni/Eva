"use client";
import { BsChat, BsDot, BsThreeDots } from "react-icons/bs";
import { AiOutlineRetweet } from "react-icons/ai";
import { IoDiamondOutline, IoShareSocial } from "react-icons/io5";
import {
  MdDeleteOutline,
  MdContentCopy,
  MdReportGmailerrorred,
  MdLocationSearching,
} from "react-icons/md";

import { FaRegStar } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import style from "../../style/Posts.module.css";
import ModalContext from "@/context/ModalContext";
import DesoAPI from "@/lib/deso";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { toast } from "sonner";

const ALLOWED_SOURCES = [
  "node.deso.org",
  "images.bitclout.com",
  "images.deso.org",
  "nftz.mypinata.cloud",
];

const Post = ({ loading, postData, username, name, bottom }) => {
  // Format the time the post was posted

  const [readMore, setReadMore] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (localStorage) {
      const user = localStorage.getItem("deso_user_key");
      if (user == postData?.PosterPublicKeyBase58Check) {
        setIsUser(true);
      } else {
        setIsUser(false);
      }
    }
  }, []);

  const {
    enlargeImage,
    enlargeImageURL,
    share,
    shareURL,
    repost,
    repostDATA,
    comment,
    commentDATA,
  } = useContext(ModalContext) as any;
  const [isOpen, setIsOpen] = enlargeImage || [false, () => {}];
  const [url, setURL] = enlargeImageURL || [false, () => {}];
  const [shareOpen, setShareOpen] = share || [false, () => {}];
  const [sharURL, setShareURL] = shareURL || [false, () => {}];
  const [isRepostOpen, setIsRepostOpen] = repost || [false, () => {}];
  const [repostData, setRepostData] = repostDATA || [false, () => {}];
  const [isCommentOpen, setIsCommentOpen] = comment || [false, () => {}];
  const [commentData, setCommentData] = commentDATA || [false, () => {}];

  const DeSo = new DesoAPI();

  function formatTimeAgo(timestampNanos: any) {
    const now = new Date().getTime() * 1e6; // Current time in nanoseconds
    const timestamp = parseInt(timestampNanos);

    const elapsed = now - timestamp;
    const seconds = Math.floor(elapsed / 1e9);

    if (seconds < 60) {
      return seconds + "s ago";
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return minutes + "m ago";
    } else if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      return hours + "h ago";
    } else {
      const date = new Date(timestamp / 1e6);
      const options = { month: "short", day: "numeric" };
      return date.toLocaleDateString("en-US", options);
    }
  }

  // If loading return loading post

  if (loading) {
    return (
      <div
        key={""}
        className="border-b-[0.5px] border-gray-600 py-4 px-6 flex space-x-4"
      >
        {/* Avatar Container */}
        <div>
          {/* Avatar */}
          <div className="w-10 h-10 bg-slate-700 rounded-full animate-pulse"></div>
        </div>
        {/* Content Container */}
        <div className="flex flex-col space-y-2">
          {/* User Identification (Name + Email + Time Posted) */}
          <div className="flex items-center w-full justify-between  mb-5">
            <div className="flex items-center space-x-1 w-full">
              <div className="font-bold h-7 bg-slate-700 rounded w-80 animate-pulse"></div>{" "}
              {/* Name */}
              <div className="text-slate-700 animate-pulse">
                <BsDot />
              </div>
              <div className="text-gray-500 h-7 bg-slate-700 rounded w-20 animate-pulse "></div>{" "}
              {/* Time */}
            </div>
          </div>
          {/* Post Content (Text) */}
          <div className="font-bold h-7 bg-slate-700 rounded w-150 animate-pulse "></div>
          <div className="font-bold h-7 bg-slate-700 rounded w-[90%] animate-pulse"></div>

          {/* Post Content (Media) */}
          <div className="bg-slate-700 aspect-square w-full h-80 rounded-xl mt-2 animate-pulse"></div>
          {/* Interaction Bar (Comment + React + Repost + Diamond + Share) */}
          <div className="flex items-center justify-around w-full mt-2">
            {/* Comment */}
            <div className="rounded hover:bg-white/10 p-3 cursor-pointer h-7 bg-slate-700 w-10 animate-pulse"></div>
            {/* Repost */}
            <div className="rounded hover:bg-white/10 p-3 cursor-pointer h-7 bg-slate-700 w-10 animate-pulse"></div>

            {/* Like */}
            <div className="rounded hover:bg-white/10 p-3 cursor-pointer h-7 bg-slate-700 w-10 animate-pulse"></div>

            {/* Diamond */}
            <div className="rounded hover:bg-white/10 p-3 cursor-pointer h-7 bg-slate-700 w-10 animate-pulse"></div>

            {/* Share */}
            <div className="rounded hover:bg-white/10 p-3 cursor-pointer h-7 bg-slate-700 w-10 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  const includesImages = ALLOWED_SOURCES.some((value) =>
    postData?.ProfileEntryResponse?.ExtraData?.NFTProfilePictureUrl?.includes(
      value
    )
  );

  function RenderTags(content: string) {
    const router = useRouter();

    let innerText = content
      ?.replace(
        /(@+[a-zA-Z0-9A-Za-zÀ-ÖØ-öø-ʸ(_)]{1,})/g,
        (mention) =>
          `<a href="/profile/${mention.substring(
            1
          )}" class="custom-link">${mention}</a>`
      )
      .replace(
        /(#(?:[^\x00-\x7F]|\w)+)/g,
        (hashtags) =>
          `<a href="/explore/${hashtags.substring(
            1
          )}" class="custom-link">${hashtags}</a>`
      )
      .replace(
        /([\w+]+\:\/\/)?([\w\d-]+\.)*[\w-]+[\.\:]\w+([\/\?\=\&\#\.]?[\w-]+)*\/?/gm,
        (links) => {
          const url = links.includes("http") ? links : `https://${links}`;
          return `<a href="${url}" class="custom-link">${links}</a>`;
        }
      );

    const handleClick = (e) => {
      e.preventDefault(); // Prevent the default link action
      const target = e.target as HTMLElement;

      if (target.tagName === "A" && target.classList.contains("custom-link")) {
        const href = target.getAttribute("href");
        if (href) {
          router.push(href);
        }
      }
    };

    return (
      <div
        onClick={handleClick}
        dangerouslySetInnerHTML={{ __html: innerText }}
      ></div>
    );
  }

  async function like() {
    const user = localStorage.getItem("deso_user_key");
    const response = await DeSo.likeMessage(
      user as string,
      postData?.PostHashHex,
      postData?.PostEntryReaderState
        ? postData?.PostEntryReaderState.LikedByReader
        : false
    );
    let isUnlike;

    if (response) {
      const likePost = document.getElementById(
        `likepost${postData?.PostHashHex}`
      );
      let valueLike = Number(likePost?.innerText);
      if (likePost?.color == "white") {
        valueLike += 1;
      } else {
        valueLike -= 1;
      }
      if (likePost != null) {
        likePost.innerText = String(valueLike);
        likePost.style.color = postData?.PostEntryReaderState.LikedByReader
          ? "primary"
          : "white";
      }
    }
  }

  if (!postData?.IsHidden) {
    return (
      <Link
        href={`/post/${postData?.PostHashHex}`}
        id={postData?.PostHashHex}
        className={`${
          bottom ? "border-b-[0.5px]" : ""
        }  border-gray-600 p-2 cursor-pointer flex w-full`}
      >
        {/* Avatar Container */}
        <div className="flex items-start px-4 py-6 w-20 ">
          {/* Avatar */}
          <Link
            href={`/profile/${postData?.ProfileEntryResponse?.Username}?type=post`}
          >
            <Image
              src={
                postData?.ProfileEntryResponse?.ExtraData?.NFTProfilePictureUrl
                  ? includesImages
                    ? postData?.ProfileEntryResponse?.ExtraData
                        .NFTProfilePictureUrl
                    : `https://node.deso.org/api/v0/get-single-profile-picture/${
                        postData?.PosterPublicKeyBase58Check
                          ? postData?.PosterPublicKeyBase58Check
                          : postData?.ProfileEntryResponse?.PublicKeyBase58Check
                      }?fallback=https://diamondapp.com/assets/img/default-profile-pic.png`
                  : `https://node.deso.org/api/v0/get-single-profile-picture/${
                      postData?.PosterPublicKeyBase58Check
                        ? postData?.PosterPublicKeyBase58Check
                        : postData?.ProfileEntryResponse?.PublicKeyBase58Check
                    }?fallback=https://diamondapp.com/assets/img/default-profile-pic.png`
              }
              className="w-11 h-10 bg-slate-700 rounded-full object-cover"
              alt="Profile Picture"
              width={45}
              height={45}
            />
          </Link>
        </div>
        {/* Content Container */}
        <div className="flex flex-col w-full">
          {/* User Identification (Name + Email + Time Posted) */}
          <div className="flex items-center w-full justify-between ">
            <div className="flex items-center space-x-1 w-full  ">
              <div className="font-bold">
                {name
                  ? name
                  : username
                  ? username
                  : postData?.ProfileEntryResponse?.ExtraData?.DisplayName
                  ? postData?.ProfileEntryResponse?.ExtraData?.DisplayName
                  : postData?.ProfileEntryResponse?.Username}
              </div>{" "}
              {/* Name */}
              <div className="text-gray-500">
                @
                {username
                  ? username.slice(0, 10)
                  : postData?.ProfileEntryResponse?.Username.slice(0, 10)}
              </div>{" "}
              {/* Username */}
              <div className="text-gray-500">
                <BsDot />
              </div>
              <div className="text-gray-500">
                {formatTimeAgo(postData?.TimestampNanos)}
              </div>{" "}
              {/* Time */}
            </div>
            <div className="cursor-pointer">
              <BsThreeDots
                onClick={(e) => {
                  e.preventDefault();
                  const extraData = document.getElementById(
                    `postExtraOption${postData?.PostHashHex}`
                  );
                  if (extraData) {
                    if (extraData.style.display != "block") {
                      extraData.style.display = "block";
                    } else {
                      extraData.style.display = "none";
                    }
                  }
                }}
              />
              <div
                style={{
                  boxShadow: "white 0px 2px 10px 0px",
                }}
                id={`postExtraOption${postData?.PostHashHex}`}
                className="hidden absolute right-2 w-[210px] rounded-xl  bg-neutral-900 "
              >
                <ul>
                  {isUser && (
                    <li
                      onClick={async (e) => {
                        e.preventDefault();
                        const user = localStorage.getItem("deso_user_key");
                        const postPromise = new Promise<unknown>(
                          async (resolve, reject) => {
                            try {
                              const response = await DeSo.hidePost(
                                postData?.PostHashHex,
                                user
                              );
                              document
                                .getElementById(postData?.PostHashHex)
                                ?.remove();
                              resolve(response);
                            } catch {
                              reject(new Error("Failed to hide post"));
                            }
                          }
                        );

                        toast.promise(postPromise, {
                          loading: "Hiding...",
                          success: (data) => {
                            return `Successfully hid post`;
                          },
                          error: "Error",
                        });
                      }}
                      className="p-3 text-red-400 hover:font-bold"
                    >
                      <MdDeleteOutline
                        size={20}
                        className="inline align-middle mr-1"
                      />
                      Hide Post
                    </li>
                  )}
                  <li className="p-3 text-blue-400 hover:font-bold">
                    <MdLocationSearching
                      size={20}
                      className="inline align-middle mr-1"
                    />
                    Analyze Post
                  </li>
                  <li
                    onClick={(e) => {
                      e.preventDefault();
                      navigator.clipboard
                        .writeText(
                          `${process.env.NEXT_PUBLIC_URL}/post/${postData?.PostHashHex}`
                        )
                        .then(() => {
                          const extraDataLink = document.getElementById(
                            `postExtraOptionCopyLink${postData?.PostHashHex}`
                          );
                          if (extraDataLink) {
                            extraDataLink.innerText = "Copied Successfully";
                          }
                        })
                        .catch((err) => {
                          const extraDataLink = document.getElementById(
                            `postExtraOptionCopyLink${postData?.PostHashHex}`
                          );
                          if (extraDataLink) {
                            (extraDataLink.innerText =
                              "Failed to copy text to clipboard"),
                              err;
                          }
                        });
                    }}
                    className="p-3 hover:font-bold"
                    id={`postExtraOptionCopyLink${postData?.PostHashHex}`}
                  >
                    <MdContentCopy
                      size={15}
                      className="inline align-middle mr-1"
                    />
                    Copy Link
                  </li>
                  <li
                    onClick={(e) => {
                      e.preventDefault();
                      setShareOpen(true);
                      setShareURL(
                        `${process.env.NEXT_PUBLIC_URL}/post/${postData?.PostHashHex}`
                      );
                    }}
                    className="p-3 hover:font-bold"
                  >
                    <IoShareSocial
                      size={15}
                      className="inline align-middle mr-1"
                    />
                    Share Post
                  </li>
                  <Link
                    target="_blank"
                    href="https://forms.gle/qYG9tiEWqBMnzYR97"
                  >
                    {" "}
                    <li className="p-3 hover:font-bold">
                      <MdReportGmailerrorred
                        size={20}
                        className="inline align-middle mr-1"
                      />
                      Report Content
                    </li>
                  </Link>
                </ul>
              </div>
            </div>
          </div>

          {/* Repost title */}
          {postData?.RecloutedPostEntryResponse && (
            <h2>
              {" "}
              <AiOutlineRetweet className="inline align-middle" />
              <span className="inline align-middle ml-1 underline">
                Reposted
              </span>
            </h2>
          )}

          {/* Post Content (Text) */}
          <div className={style.tags}>
            {readMore
              ? RenderTags(postData?.Body)
              : RenderTags(postData?.Body?.slice(0, 1000))}{" "}
            {postData?.Body?.length > 999 && (
              <>
                <br></br>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    setReadMore(!readMore);
                  }}
                  className="underline cursor-pointer text-primary"
                >
                  {readMore ? "Show Less" : "Show More"}
                </a>
              </>
            )}
          </div>

          {/* Post Content (Image) */}
          {postData?.ImageURLs && (
            <img
              src={postData?.ImageURLs[0]}
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(true);
                setURL(postData?.ImageURLs[0]);
              }}
              className="bg-slate-400  h-full w-full max-h-[70vh]  max-w-[90%] rounded-xl mt-2 object-cover cursor-pointer"
            ></img>
          )}

          {/* Post Content (Embed)*/}
          {postData?.PostExtraData?.EmbedVideoURL &&
            postData?.PostExtraData?.EmbedVideoURL.includes("youtube") && (
              <iframe
                width="420"
                height="315"
                src={postData?.PostExtraData?.EmbedVideoURL}
              ></iframe>
            )}

          {/* Repost */}

          {postData?.RecloutedPostEntryResponse && (
            <>
              {/* Reposted Post (Modify if you modify post)*/}

              <Link
                href={`/post/${postData?.RecloutedPostEntryResponse?.PostHashHex}`}
                className="cursor-pointer"
              >
                <div
                  id={postData?.RecloutedPostEntryResponse?.PostHashHex}
                  className="border-[0.5px] border-primary rounded-xl p-4 flex w-full mt-2 "
                >
                  {/* Avatar Container */}
                  <div className="flex items-start px-4 py-6 w-20 ">
                    {/* Avatar */}
                    <Link
                      href={`/profile/${postData?.RecloutedPostEntryResponse?.ProfileEntryResponse?.Username}?type=post`}
                    >
                      <Image
                        src={`https://node.deso.org/api/v0/get-single-profile-picture/${postData?.RecloutedPostEntryResponse?.PosterPublicKeyBase58Check}?fallback=https://diamondapp.com/assets/img/default-profile-pic.png`}
                        className="w-11 h-10 bg-slate-700 rounded-full object-cover"
                        alt="Profile Picture"
                        width={45}
                        height={45}
                      />
                    </Link>
                  </div>
                  {/* Content Container */}
                  <div className="flex flex-col w-full">
                    {/* User Identification (Name + Email + Time Posted) */}
                    <div className="flex items-center w-full justify-between ">
                      <div className="flex items-center space-x-1 w-full  ">
                        <div className="font-bold">
                          {postData?.RecloutedPostEntryResponse
                            ?.ProfileEntryResponse?.ExtraData?.DisplayName
                            ? postData?.RecloutedPostEntryResponse
                                ?.ProfileEntryResponse?.ExtraData?.DisplayName
                            : postData?.RecloutedPostEntryResponse
                                ?.ProfileEntryResponse?.Username}
                        </div>{" "}
                        {/* Name */}
                        <div className="text-gray-500">
                          @
                          {
                            postData?.RecloutedPostEntryResponse
                              ?.ProfileEntryResponse?.Username
                          }
                        </div>{" "}
                        {/* Username */}
                        <div className="text-gray-500">
                          <BsDot />
                        </div>
                        <div className="text-gray-500">
                          {formatTimeAgo(
                            postData?.RecloutedPostEntryResponse?.TimestampNanos
                          )}
                        </div>{" "}
                        {/* Time */}
                      </div>
                    </div>
                    {/* Post Content (Text) */}
                    <div className={style.tagsR}>
                      {readMore
                        ? RenderTags(postData?.RecloutedPostEntryResponse?.Body)
                        : RenderTags(
                            postData?.RecloutedPostEntryResponse?.Body?.slice(
                              0,
                              1000
                            )
                          )}{" "}
                      {postData?.RecloutedPostEntryResponse?.Body?.length >
                        999 && (
                        <>
                          <br></br>
                          <a
                            onClick={(e) => {
                              e.preventDefault();
                              setReadMore(!readMore);
                            }}
                            className="underline cursor-pointer text-primary"
                          >
                            {readMore ? "Show Less" : "Show More"}
                          </a>
                        </>
                      )}
                    </div>

                    {/* Post Content (Image) */}
                    {postData?.RecloutedPostEntryResponse?.ImageURLs && (
                      <img
                        src={postData?.RecloutedPostEntryResponse?.ImageURLs[0]}
                        onClick={(e) => {
                          e.preventDefault();
                          setIsOpen(true);
                          setURL(
                            postData?.RecloutedPostEntryResponse?.ImageURLs[0]
                          );
                        }}
                        className="bg-slate-400  h-full w-full max-w-[90%] rounded-xl mt-2 object-cover cursor-pointer"
                      ></img>
                    )}

                    {/* Post Content (Embed)*/}
                    {postData?.RecloutedPostEntryResponse?.PostExtraData
                      ?.EmbedVideoURL && (
                      <iframe
                        width="300"
                        height="215"
                        src={
                          postData?.RecloutedPostEntryResponse?.PostExtraData
                            ?.EmbedVideoURL
                        }
                      ></iframe>
                    )}
                  </div>
                </div>
              </Link>
            </>
          )}

          {postData?.IsNFT && (
            <>
              <span className="inline mt-4">
                <BsFillLightningChargeFill
                  size={20}
                  className="inline align-middle mr-2"
                />
                Limited Edition{" "}
                <span className="text-primary">
                  {postData?.NumNFTCopiesForSale}
                </span>{" "}
                out of{" "}
                <span className="text-primary">{postData?.NumNFTCopies}</span>{" "}
                copies still available
              </span>
            </>
          )}

          {/* Interaction Bar (Comment + React + Repost + Diamond + Share) */}
          <div className="flex items-center justify-around w-full mt-2 ">
            {/* Like */}
            <div
              onClick={async (e) => {
                e.preventDefault();
                like();
              }}
              className="rounded-full hover:bg-white/10 transition duration-200 p-3 cursor-pointer"
            >
              <FaRegStar
                color={`${
                  postData?.PostEntryReaderState
                    ? postData?.PostEntryReaderState?.LikedByReader
                      ? "hsl(276.9, 87.4%, 53.3%)"
                      : "white"
                    : "white"
                } `}
                className="inline align-middle"
              />
              <span
                id={`likepost${postData?.PostHashHex}`}
                className={`inline ml-2 align-middle text-${
                  postData?.PostEntryReaderState
                    ? postData?.PostEntryReaderState?.LikedByReader
                      ? "primary"
                      : "white"
                    : "white"
                }`}
              >
                {postData?.LikeCount}
              </span>
            </div>

            {/* Diamond */}
            <div className="rounded-full hover:bg-white/10 transition duration-200 p-3 cursor-pointer">
              <IoDiamondOutline className="inline align-middle" />
              <span className="inline ml-2 align-middle">
                {postData?.DiamondCount}
              </span>
            </div>
            {/* Repost */}
            <div
              onClick={(e) => {
                e.preventDefault();
                setIsRepostOpen(true);
                setRepostData(postData);
              }}
              className="rounded-full hover:bg-white/10 transition duration-200 p-3 cursor-pointer"
            >
              <AiOutlineRetweet className="inline align-middle" />
              <span className="inline ml-2 align-middle">
                {postData?.RepostCount}
              </span>
            </div>
            {/* Comment */}

            <div
              onClick={(e) => {
                e.preventDefault();
                setIsCommentOpen(true);
                setCommentData(postData);
              }}
              className="rounded-full hover:bg-white/10 transition duration-200 p-3 cursor-pointer"
            >
              <BsChat className="inline align-middle" />
              <span className="inline ml-2 align-middle">
                {postData?.CommentCount}
              </span>
            </div>

            {/* Share */}
            <div
              onClick={(e) => {
                e.preventDefault();
                setShareOpen(true);
                setShareURL(
                  `${process.env.NEXT_PUBLIC_URL}/post/${postData?.PostHashHex}`
                );
              }}
              className="rounded-full hover:bg-white/10 transition duration-200 p-3 cursor-pointer"
            >
              <IoShareSocial />
            </div>
          </div>
        </div>
      </Link>
    );
  }
};

export default Post;
