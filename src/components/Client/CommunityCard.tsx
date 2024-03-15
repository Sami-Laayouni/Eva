import Link from "next/link";

function CommunityCard({ joined, loading, communityData }) {
  if (loading) {
    return (
      <div className="bg-slate-800 animate-pulse w-full rounded-xl overflow-hidden shadow-lg mt-4">
        <div className="w-full h-32 bg-slate-900 animate-pulse" />
        <div className="px-6 py-4">
          <div className="flex -mt-16 mb-4">
            <img className="h-20 w-20 rounded-full bg-slate-600 animate-pulse border-2 border-white shadow-lg" />
          </div>
          <div className="font-bold text-xl mb-2">{communityData.name}</div>
          <p className="text-gray-700 text-base">{communityData.description}</p>
        </div>
      </div>
    );
  }

  return (
    <Link href={`/channels/${communityData.id}`}>
      <div className="bg-neutral-900 cursor-pointer w-full rounded-xl overflow-hidden shadow-lg mt-4">
        <img
          className="w-full h-32 object-cover"
          src={communityData.banner}
          alt="Community Banner"
        />
        <div className="px-6 py-4">
          <div className="flex -mt-16 mb-4">
            <img
              className="h-20 w-20 rounded-full border-2 border-white shadow-lg"
              src={communityData.profile_pic}
              alt="Community Profile"
            />
          </div>
          <div className="font-bold text-xl mb-2">{communityData.name}</div>
          <p className="text-gray-400 text-base">{communityData.description}</p>
        </div>
      </div>
    </Link>
  );
}

export default CommunityCard;
