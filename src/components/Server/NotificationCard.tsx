import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IoDiamond } from "react-icons/io5";
import { BsFillReplyFill } from "react-icons/bs";
import { GoMention } from "react-icons/go";
import { MdOutlineAttachMoney } from "react-icons/md";
import { FaUser, FaHeart, FaCloud } from "react-icons/fa";
import Post from "../Client/Post";

const ALLOWED_SOURCES = [
  "node.deso.org",
  "images.bitclout.com",
  "images.deso.org",
  "nftz.mypinata.cloud",
];

interface NotificationCardProps {
  loading: any; // Consider using 'boolean' for better type safety if 'loading' is indeed a boolean
  value: any; // Specify a more specific type instead of 'any' if possible
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  loading,
  value,
}) => {
  if (loading) {
    return (
      <div className="w-full h-20 bg-gray-800 rounded-xl mt-5 animate-pulse"></div>
    );
  }

  if (value?.NotificationType == "DAO_COIN_LIMIT_ORDER") {
    return null;
  }
  const includesImages = ALLOWED_SOURCES.some((value: any) =>
    value?.NotificationPerformer?.ExtraData?.NFTProfilePictureUrl?.includes(
      value
    )
  );

  return (
    <section className="border-b-[0.5px] border-gray-600 p-2  w-full">
      {/* Notification Image */}
      {value?.Extradata == "MentionedPublicKeyBase58Check" ? (
        <GoMention className="inline-block align-middle" size={30} />
      ) : value?.DiamondsRewarded > 0 ? (
        <IoDiamond className="inline-block align-middle" size={30} />
      ) : value?.NotificationType == "BASIC_TRANSFER" ? (
        <MdOutlineAttachMoney className="inline-block align-middle" size={30} />
      ) : value?.NotificationType == "FOLLOW" ? (
        <FaUser className="inline-block align-middle" size={30} />
      ) : value?.NotificationType == "SUBMIT_POST" ? (
        <BsFillReplyFill className="inline-block align-middle" size={30} />
      ) : value?.NotificationType == "CREATOR_COIN" ? (
        <MdOutlineAttachMoney className="inline-block align-middle" size={30} />
      ) : value?.NotificationType == "LIKE" ? (
        <FaHeart className="inline-block align-middle" size={30} />
      ) : value?.NotificationType == "NFT_TRANSFER" ? (
        <FaCloud className="inline-block align-middle" size={30} />
      ) : value?.NotificationType == "UPDATE_NFT" ? (
        <FaCloud className="inline-block align-middle" size={30} />
      ) : (
        <GoMention className="inline-block align-middle" size={30} />
      )}
      <div className="inline-block align-middle">
        <div className="flex items-middle px-4 py-6 w-20  ">
          {/* Avatar */}
          <Link
            href={`/profile/${value?.NotificationPerformer?.Username}?type=post`}
          >
            <Image
              src={
                value?.NotificationPerformer?.ExtraData?.NFTProfilePictureUrl
                  ? includesImages
                    ? value?.NotificationPerformer?.ExtraData
                        .NFTProfilePictureUrl
                    : `https://node.deso.org/api/v0/get-single-profile-picture/${
                        value?.NotificationPerformer?.PosterPublicKeyBase58Check
                          ? value?.NotificationPerformer
                              ?.PosterPublicKeyBase58Check
                          : value?.NotificationPerformer?.PublicKeyBase58Check
                      }?fallback=https://diamondapp.com/assets/img/default-profile-pic.png`
                  : `https://node.deso.org/api/v0/get-single-profile-picture/${
                      value?.NotificationPerformer?.PosterPublicKeyBase58Check
                        ? value?.NotificationPerformer
                            ?.PosterPublicKeyBase58Check
                        : value?.NotificationPerformer?.PublicKeyBase58Check
                    }?fallback=https://diamondapp.com/assets/img/default-profile-pic.png`
              }
              className="w-11 h-10 bg-slate-700 rounded-full object-cover"
              alt="Profile Picture"
              width={45}
              height={45}
            />
          </Link>
        </div>
      </div>
      {/* Content Container */}
      <div className="font-bold inline">
        {value?.NotificationPerformer?.ExtraData?.DisplayName
          ? value?.NotificationPerformer?.ExtraData?.DisplayName.slice(0, 21)
          : value?.NotificationPerformer?.Username}
      </div>
      <div className="inline">
        {" "}
        {value?.Extradata == "MentionedPublicKeyBase58Check"
          ? "mentioned you in a post"
          : value?.DiamondsRewarded > 0
          ? `gave your post ${value?.DiamondsRewarded} diamond${
              value?.DiamondsRewarded == 1 ? "" : "s"
            }`
          : value?.NotificationType == "BASIC_TRANSFER"
          ? `transferred $${(
              (value?.AmountRewarded / 10000000000) *
              JSON.parse(localStorage.getItem("desoValue") as any)
                .USDCentsPerDeSoExchangeRate
            ).toFixed(1)} to you`
          : value?.NotificationType == "FOLLOW"
          ? "started following you"
          : value?.NotificationType == "SUBMIT_POST"
          ? "replied to your post"
          : value?.NotificationType == "CREATOR_COIN"
          ? `invested $${(
              (value?.AmountRewarded / 10000000000) *
              JSON.parse(localStorage.getItem("desoValue") as any)
                .USDCentsPerDeSoExchangeRate
            ).toFixed(1)} in you`
          : value?.NotificationType == "LIKE"
          ? "liked your post"
          : value?.NotificationType == "NFT_TRANSFER"
          ? "shared a memory with you"
          : value?.NotificationType == "UPDATE_NFT"
          ? "put your memory up for sale"
          : value?.NotificationType == "DAO_COIN_TRANSFER"
          ? `sent you some coins`
          : value?.NotificationType}
      </div>{" "}
      {value?.PostHasBeingMentioned && value?.DiamondsRewarded == 0 ? (
        <section className="border-[0.5px] border-primary rounded-xl p-4 flex w-full mt-2 ">
          <Post
            name={""}
            username={""}
            loading={false}
            postData={value?.PostHasBeingMentioned}
            key={value?.PostHasBeingMentioned}
            bottom={false}
          />
        </section>
      ) : (
        <></>
      )}
    </section>
  );
};

export default NotificationCard;
