import Link from "next/link";
const Monetization = () => {
  return (
    <>
      <h1 className="text-xl font-bold p-6 backdrop-blur z-10 bg-background/10 sticky top-0">
        Monetization
      </h1>

      <section className="p-6">
        <div className="w-full h-10 bg-primary rounded-xl grid grid-cols-2">
          <Link
            href={"/monetization"}
            className="flex justify-center align-middle text-center bg-white text-primary rounded-tl-xl rounded-bl-xl"
          >
            <button>Programs</button>
          </Link>
          <Link
            href={"/monetization/earnings"}
            className="flex justify-center align-middle"
          >
            <button>Earnings</button>
          </Link>
        </div>
        <br></br>
        <p>
          Eva Social offers unique ways to monetize your content including
          decentralized advertisements, tipping diamonds, and investing.{" "}
        </p>
        <br></br>
        <h2 className="font-bold text-xl">Available Programs</h2>
        <ul>
          <li className="mt-3 mb-3 w-full bg-slate-800 h-fit rounded-xl p-3 cursor-pointer">
            <div>
              <p className="bg-green-800 w-fit pl-1 pr-1 pb-0.5 pt-0.5 rounded-l rounded-r mb-2">
                Enabled
              </p>
            </div>
            <h1 className="font-bold">Diamonds</h1>
            <p>
              Earn passive income by enabling users to express their
              appreciation for your content through micro-tips in the form of
              diamonds.
            </p>
          </li>
          <li className="mt-3 mb-3 w-full bg-slate-800  h-fit rounded-xl p-3 cursor-pointer">
            <div>
              <p className="bg-green-800 w-fit pl-1 pr-1 pb-0.5 pt-0.5 rounded-l rounded-r mb-2">
                Enabled
              </p>
            </div>
            <h1 className="font-bold">Sell Memories</h1>
            <p>
              Convert your best memories into ever-lasting images or videos that
              are stored forever and can be made purchasable by others.
            </p>
          </li>
        </ul>
        <h2 className="font-bold text-xl">Locked Programs</h2>
        <br></br>
        <p>
          In order to unlock these programs you must meet the requirements
          below.
        </p>
        <br></br>
        <span>✅ Followers (100/500)</span>
        <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700 mt-3 mb-3">
          <div
            className="bg-primary h-3 rounded-full"
            style={{ width: "25%" }}
          ></div>
        </div>
        <span>✅ Account Age (100/500) days</span>
        <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700 mt-3 mb-3">
          <div
            className="bg-primary h-3 rounded-full"
            style={{ width: "65%" }}
          ></div>
        </div>

        <span>❌ Own at least $1 worth of DeSo or $5 worth of $Eva</span>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-3 mb-3">
          <div
            className="bg-primary h-2.5 rounded-full"
            style={{ width: "45%" }}
          ></div>
        </div>

        <ul>
          <li className="mt-3 mb-3 w-full bg-slate-800  h-fit rounded-xl p-3">
            <div>
              <p className="bg-red-700 w-fit pl-1 pr-1 pb-0.5 pt-0.5 rounded-l rounded-r mb-2">
                Not Eligible Yet
              </p>
            </div>
            <h1 className="font-bold mt-1">Create Gated Communities</h1>
            <p>Create gated communities that people can join.</p>
          </li>
          <li className="mt-3 mb-3 w-full bg-slate-800  h-fit rounded-xl p-3">
            <div>
              <p className="bg-red-700 w-fit pl-1 pr-1 pb-0.5 pt-0.5 rounded-l rounded-r mb-2">
                Not Eligible Yet
              </p>
              <span>
                ❌ You can not own more than half of your total creator coins{" "}
              </span>{" "}
            </div>

            <h1 className="font-bold mt-1">Investments</h1>
            <p>
              Earn passive income by allowing anybody to invest into your
              content. Investors also get access to special monthly content.
            </p>
          </li>
          <li className="mt-3 mb-3 w-full bg-slate-800  h-fit rounded-xl p-3">
            <div>
              <p className="bg-red-700 w-fit pl-1 pr-1 pb-0.5 pt-0.5 rounded-l rounded-r mb-2">
                Not Eligible Yet
              </p>
              <span>❌ Must be active in the last 30 days</span>
            </div>
            <h1 className="font-bold mt-1">Ad Revenue</h1>
            <p>
              Through a collaboration with Adshare you can earn passive income
              by decentralized ads served on your profile, posts and more.
            </p>
          </li>
        </ul>
      </section>
    </>
  );
};

export default Monetization;
