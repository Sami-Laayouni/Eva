"use client";
import Link from "next/link";
import { useContext } from "react";
import ModalContext from "@/context/ModalContext";

import { FaRegUser } from "react-icons/fa";
import { CiBadgeDollar } from "react-icons/ci";
import { FiPhone } from "react-icons/fi";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { FaRegFileLines } from "react-icons/fa6";

const Settings = () => {
  const { account } = useContext(ModalContext) as any;
  const [isOpen, setIsOpen] = account || [false, () => {}];

  function getStarterDeso() {
    const user = localStorage.getItem("deso_user_key");
    window.open(
      "https://identity.deso.org/verify-phone-number?public_key=" + user
    );
  }

  return (
    <>
      <h1 className="text-xl font-bold p-6 backdrop-blur z-10 bg-background/10 sticky top-0">
        Settings
      </h1>

      <div className="inline-block align-middle">
        <div className="flex flex-col px-4 py-6 w-[100%]  ">
          {" "}
          <div
            onClick={() => {
              setIsOpen(true);
            }}
            className="w-full h-20  bg-gray-800 rounded-xl mt-5 p-4 "
          >
            <FaRegUser className="inline align-middle mr-4" size={32} />
            <div className="inline-block align-middle">
              <h1 className="font-bold">Account</h1>
              <p>Modify your account details</p>
            </div>
          </div>
          <Link target="_blank" href={"https://heroswap.com/Eva2"}>
            <div className="w-full h-20 bg-gray-800 rounded-xl mt-5 p-4 ">
              {" "}
              <CiBadgeDollar className="inline align-middle mr-4" size={35} />
              <div className="inline-block align-middle">
                <h1 className="font-bold">Buy/Withdraw $DeSo</h1>
                <p>Withdraw the money you have earned on Eva Social</p>
              </div>
            </div>
          </Link>
          <div
            onClick={() => {
              getStarterDeso();
            }}
            className="w-full h-20 bg-gray-800 rounded-xl mt-5 p-4 cursor-pointer"
          >
            {" "}
            <FiPhone className="inline align-middle mr-4" size={30} />
            <div className="inline-block align-middle">
              <h1 className="font-bold">Get Starter $DeSo</h1>
              <p>Verify your phone number to get some $DeSo for free</p>
            </div>
          </div>
          <Link href={"/boring/privacy-policy"}>
            <div className="w-full h-20 bg-gray-800 rounded-xl mt-5 p-4 ">
              {" "}
              <MdOutlinePrivacyTip
                className="inline align-middle mr-4"
                size={30}
              />
              <div className="inline-block align-middle">
                <h1 className="font-bold">Privacy Policy</h1>
                <p>Read through our privacy policy</p>
              </div>
            </div>
          </Link>
          <Link href={"/boring/terms-of-service"}>
            <div className="w-full h-20 bg-gray-800 rounded-xl mt-5 p-4 ">
              <FaRegFileLines className="inline align-middle mr-4" size={30} />
              <div className="inline-block align-middle">
                <h1 className="font-bold">Terms of Service</h1>
                <p>Read through our terms of service</p>
              </div>
            </div>
          </Link>
        </div>{" "}
      </div>
    </>
  );
};

export default Settings;
