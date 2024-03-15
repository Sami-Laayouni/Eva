"use client";
import { Dialog, DialogContent } from "../ui/dialog";
import { useContext } from "react";
import ModalContext from "@/context/ModalContext";
import Post from "../Client/Post";
import ComposePost from "../Client/ComposePost";

const Repost: React.FC = () => {
  const { repost, repostDATA } = useContext(ModalContext) as any;
  const [isOpen, setIsOpen] = repost || [false, () => {}];
  const [data] = repostDATA || [false, () => {}];
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <ComposePost type="repost" postData={data} />
          <div className="max-h-[60vh] overflow-y-scroll overflow-x-hidden">
            <Post
              loading={false}
              postData={data}
              username={""}
              name={""}
              bottom={true}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default Repost;
