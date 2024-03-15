"use client";
import { Dialog, DialogContent } from "../ui/dialog";
import { useContext, useState } from "react";
import ModalContext from "@/context/ModalContext";

// Import icons
import { MdEmail } from "react-icons/md";
import { BsTwitter } from "react-icons/bs";
import { FaRedditAlien, FaFacebookF } from "react-icons/fa";
import { RiWhatsappFill } from "react-icons/ri";
import Link from "next/link";
import { Input } from "../ui/input";

const Share: React.FC = () => {
  const { share, shareURL } = useContext(ModalContext) as any;
  const [isOpen, setIsOpen] = share || [false, () => {}];
  const [url] = shareURL || [false, () => {}];
  const [text, setText] = useState("Check out this post on Eva Social.");
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <div className="mt-6 p-2 border-white border-[1px] rounded-xl max-w-[40vw] overflow-hidden text-ellipsis">
            <span>{url}</span>
          </div>
          <ul className="flex flex-row justify-center align-middle mt-1 gap-5">
            {/* Share by Whatsapp*/}

            <li className="cursor-pointer bg-[#25D366] rounded-full w-[3.5rem] h-[3.5rem] flex items-center justify-center">
              <Link
                href={`https://api.whatsapp.com/send?text=Check%20out%20this%20cool%20link%20on%20WhatsApp:%20https%3A%2F%2Fexample.com`}
                target="_blank"
              >
                <RiWhatsappFill color="white" size={30} />
              </Link>
            </li>

            {/* Share on Twitter/X */}
            <li className="cursor-pointer bg-[#26a7de] rounded-full w-[3.5rem] h-[3.5rem] flex items-center justify-center">
              <Link
                href={`https://x.com/intent/tweet?text=${text} ${url}`}
                target="_blank"
              >
                <BsTwitter color="white" size={30} />
              </Link>
            </li>
            {/* Share on Reddit*/}
            <li className="cursor-pointer bg-[#FF4500] rounded-full w-[3.5rem] h-[3.5rem] flex items-center justify-center">
              <Link
                href={`https://www.reddit.com/submit?title=${text}&url=${url}`}
                target="_blank"
              >
                <FaRedditAlien color="white" size={30} />
              </Link>
            </li>
            {/* Share on Facebook*/}
            <li className="cursor-pointer bg-[#1877F2] rounded-full w-[3.5rem] h-[3.5rem] flex items-center justify-center">
              <Link
                href={`https://www.facebook.com/?text=${text} ${url}`}
                target="_blank"
              >
                <FaFacebookF color="white" size={30} />
              </Link>
            </li>
            {/* Share by Email*/}
            <li className="cursor-pointer bg-[lightgreen] rounded-full w-[3.5rem] h-[3.5rem] flex items-center justify-center">
              <Link
                href={`mailto:?subject=Noteswap Notes&body=${text} ${url}`}
                target="_blank"
              >
                <MdEmail color="white" size={30} />
              </Link>
            </li>
          </ul>
          <Input
            type="input"
            placeholder="Enter the message you want to send"
            className="mt-6 p-2 border-white border-[1px] rounded-xl outline-none"
            onChange={(e) => {
              setText(e.target.value);
            }}
            value={text}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
export default Share;
