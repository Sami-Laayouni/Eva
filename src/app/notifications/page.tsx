"use client";
import React from "react";
import { useContext, useEffect, useState } from "react";
import ModalContext from "@/context/ModalContext";
import DesoAPI from "@/lib/deso";
import NotificationCard from "@/components/Server/NotificationCard";

const Notifications = () => {
  const { unreadNotifications } = useContext(ModalContext) as any;
  const [notificationCount, setNotificationCount] = unreadNotifications;
  const [notifications, setNotifications] = useState<any>([]);
  const Deso = new DesoAPI();

  async function getNotifications() {
    const key = localStorage.getItem("deso_user_key");

    const notifications = await Deso.getNotifications(key as string, 15, -1);

    notifications?.Notifications?.map(function (value: any) {
      const notification = {
        NotificationPerformer:
          notifications?.ProfilesByPublicKey[
            value?.Metadata?.TransactorPublicKeyBase58Check
          ], // User data of person that performed the transaction
        NotificationType: value?.Metadata?.TxnType, // Type of notifications
        IsUnfollow: value?.Metadata?.FollowTxindexMetadata?.IsUnfollow, // Is unfollow (only used if following type)
        AmountRewarded: value?.Metadata?.TxnOutputs
          ? value?.Metadata?.TxnOutputs[0]?.AmountNanos
          : "", // Amount of coin rewarded
        DiamondsRewarded:
          value?.Metadata?.BasicTransferTxindexMetadata?.DiamondLevel, // Number of diamonds awarded
        PostHasBeingMentioned:
          notifications?.PostsByHash[
            value?.Metadata?.SubmitPostTxindexMetadata?.PostHashBeingModifiedHex
          ], // Post that was mentioned in the notification
        Extradata: value?.Metadata.AffectedPublicKeys[1].Metadata,
      };

      setNotifications((notifications: any) => [
        ...notifications,
        notification,
      ]);
    });
  }

  async function sawNotifications(count: any) {
    const key = localStorage.getItem("deso_user_key");
    await Deso.sawNotifications(key as string, count);
  }

  useEffect(() => {
    if (notificationCount) {
      let newCount = (notificationCount.NotificationsCount = 0);
      setNotificationCount(newCount);
    }
  }, [unreadNotifications]);

  useEffect(() => {
    if (localStorage && notificationCount) {
      sawNotifications(notificationCount.LastUnreadNotificationIndex);
      getNotifications();
    }
  }, [notificationCount]);
  return (
    <>
      <h1 className="text-xl font-bold p-6 backdrop-blur z-10 bg-background/10 sticky top-0">
        Notifications
      </h1>

      <section className="pl-6 pr-6">
        <p className="text-gray-600">
          We automatically filter out notifications we deem as spam.{" "}
        </p>
        {notifications && notifications.length > 0 ? (
          <>
            {notifications?.map((value: any) => {
              return (
                <NotificationCard
                  key={JSON.stringify(value)}
                  loading={false}
                  value={value}
                />
              );
            })}
          </>
        ) : (
          <>
            {Array.from({ length: 5 })?.map((i: any) => (
              <NotificationCard value={{}} key={i} loading={true} />
            ))}
          </>
        )}
      </section>
    </>
  );
};

export default Notifications;
