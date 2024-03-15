import { HiOutlineHashtag } from "react-icons/hi2";
import Link from "next/link";

const Hashtags = ({ value, loading }) => {
  if (loading) {
    return (
      <div className="hover:bg-background/20 p-4 last:rounded-b-xl transition duration-200 cursor-pointer">
        <div className="flex items-center space-x-2">
          <HiOutlineHashtag className="w-8 h-8 mr-2" />
          <div className="flex flex-col">
            <div className="font-bold text-lg h-4 bg-slate-700 rounded w-40 animate-pulse"></div>
            <div className="text-xs text-neutral-400 h-4 bg-slate-700 rounded w-20 mt-3 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link href={`/explore/${value?.clouttag}`}>
      <div
        key={value?.clouttag}
        className="hover:bg-background/20 p-4 last:rounded-b-xl transition duration-200 cursor-pointer"
      >
        <div className="flex items-center space-x-2">
          <HiOutlineHashtag className="w-8 h-8 mr-2" />
          <div className="flex flex-col">
            <div className="font-bold text-lg ">#{value?.clouttag}</div>
            <div className="text-xs text-neutral-400">
              {value?.count} post{value?.count == 1 ? "" : "s"}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Hashtags;
