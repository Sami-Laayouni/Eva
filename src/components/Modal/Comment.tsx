"use client";
import { Dialog, DialogContent } from "../ui/dialog";
import { useContext } from "react";
import ModalContext from "@/context/ModalContext";
import Post from "../Client/Post";
import ComposePost from "../Client/ComposePost";

const Comment: React.FC = () => {
  const { comment, commentDATA } = useContext(ModalContext) as any;
  const [isOpen, setIsOpen] = comment || [false, () => {}];
  const [data] = commentDATA || [false, () => {}];
  console.log(data);
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <div className="h-full max-h-[60vh]  overflow-y-auto overflow-x-hidden">
            <Post
              loading={false}
              postData={data}
              username={""}
              name={""}
              bottom={false}
            />
          </div>
          <ComposePost type="comment" postData={data} />
        </DialogContent>
      </Dialog>
    </>
  );
};
export default Comment;
