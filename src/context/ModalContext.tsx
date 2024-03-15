"use client";
import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  FC,
} from "react";

// Define the type for ModalContext value
interface ModalContextProps {
  onboard: [boolean, Dispatch<SetStateAction<boolean>>];
  unreadNotifications: [any, Dispatch<SetStateAction<any>>];
  share: [boolean, Dispatch<SetStateAction<boolean>>];
  shareURL: [any, Dispatch<SetStateAction<any>>];
  enlargeImage: [boolean, Dispatch<SetStateAction<boolean>>];
  enlargeImageURL: [any, Dispatch<SetStateAction<any>>];
  repost: [boolean, Dispatch<SetStateAction<boolean>>];
  repostDATA: [any, Dispatch<SetStateAction<any>>];
  comment: [boolean, Dispatch<SetStateAction<boolean>>];
  commentDATA: [any, Dispatch<SetStateAction<any>>];
  account: [boolean, Dispatch<SetStateAction<boolean>>];
  createCommunity: [boolean, Dispatch<SetStateAction<boolean>>];
  communityData: [any, Dispatch<SetStateAction<any>>];
}

// Create new context
const ModalContext = createContext<ModalContextProps | undefined>(undefined);

// Define the type for ModalProvider props
interface ModalProviderProps {
  children: ReactNode;
}

// Export the Modal Provider (wraps the entire app)
export const ModalProvider: FC<ModalProviderProps> = ({ children }) => {
  const [onboard, setOnboard] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(null); // Just for optimization sake we store this here
  const [share, setShare] = useState(false);
  const [shareURL, setShareURL] = useState(null);
  const [enlargeImage, setEnlargeImage] = useState(false);
  const [enlargeImageURL, setEnlargeImageURL] = useState(null);
  const [repost, setRepost] = useState(false);
  const [repostDATA, setRepostDATA] = useState(null);
  const [comment, setComment] = useState(false);
  const [commentDATA, setCommentDATA] = useState(null);
  const [account, setAccount] = useState(false);
  const [createCommunity, setCreateCommunity] = useState(false);
  const [communityData, setCommunityData] = useState(null);

  // Return the JSX
  return (
    <ModalContext.Provider
      value={{
        onboard: [onboard, setOnboard],
        unreadNotifications: [unreadNotifications, setUnreadNotifications],
        share: [share, setShare],
        shareURL: [shareURL, setShareURL],
        enlargeImage: [enlargeImage, setEnlargeImage],
        enlargeImageURL: [enlargeImageURL, setEnlargeImageURL],
        repost: [repost, setRepost],
        repostDATA: [repostDATA, setRepostDATA],
        comment: [comment, setComment],
        commentDATA: [commentDATA, setCommentDATA],
        account: [account, setAccount],
        createCommunity: [createCommunity, setCreateCommunity],
        communityData: [communityData, setCommunityData],
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export default ModalContext;
// End of the Modal Context
