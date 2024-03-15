"use client";
import { Dialog, DialogContent } from "../ui/dialog";
import { useContext } from "react";
import ModalContext from "@/context/ModalContext";

const Share: React.FC = () => {
  const { enlargeImage, enlargeImageURL } = useContext(ModalContext) as any;
  const [isOpen, setIsOpen] = enlargeImage || [false, () => {}];
  const [url] = enlargeImageURL || [false, () => {}];

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <img
            src={url}
            className=" h-full w-full max-w-[80vw] min-w-[40vw] max-h-[80vh] rounded-xl mt-2 object-contain cursor-pointer mx-auto"
            style={{ display: "block" }}
            alt="Your Image Description"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Share;
