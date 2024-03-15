"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import FollowUser from "@/components/Client/FollowUser";
import { toast } from "sonner";
import DesoAPI from "@/lib/deso";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useContext } from "react";
import ModalContext from "@/context/ModalContext";

interface Topic {
  name: string;
  subcategories?: string[];
}
interface UserProfile {
  Profile: {
    Username: string;
    Description: string;
    ExtraData: { [key: string]: string };
    CoinEntry: { [key: string]: string };
  };
}

const topics: Topic[] = [
  {
    name: "Food",
    subcategories: [
      "Deserts",
      "Beverages",
      "Snacks",
      "Keto",
      "Vegan",
      "Appetizers",
    ],
  },
  {
    name: "Technology",
    subcategories: [
      "AI",
      "Web Development",
      "Blockchain",
      "Cybersecurity",
      "Cloud Computing",
      "Programming",
      "Android",
      "Python",
    ],
  },
  {
    name: "Entertainment",
    subcategories: [
      "Actors & Directors",
      "Internet Stars",
      "Comedians",
      "Celebrity News",
      "Concerts & festivals",
    ],
  },
  {
    name: "Gaming",
    subcategories: [
      "PC Gaming",
      "Console Gaming",
      "Mobile Gaming",
      "Esports",
      "Game Reviews",
    ],
  },
  {
    name: "Politics",
    subcategories: [
      "International Politics",
      "Domestic Politics",
      "Political Philosophy",
      "Elections",
    ],
  },
  {
    name: "Science",
    subcategories: [
      "Physics",
      "Biology",
      "Chemistry",
      "Astronomy",
      "Environmental Science",
    ],
  },
  {
    name: "Art",
    subcategories: [
      "Painting",
      "Sculpture",
      "Photography",
      "Digital Art",
      "Illustration",
    ],
  },
  {
    name: "Music",
    subcategories: [
      "K-Pop",
      "Rock",
      "Pop",
      "Hip Hop",
      "Jazz",
      "Classical",
      "Electronic",
    ],
  },
  {
    name: "Sports",
    subcategories: [
      "Football",
      "Basketball",
      "Tennis",
      "Golf",
      "Swimming",
      "Cycling",
    ],
  },
  {
    name: "Travel",
    subcategories: [
      "USA",
      "Canada",
      "South Korea",
      "Germany",
      "France",
      "Japan",
      "Australia",
    ],
  },
];

const OnboardModal: React.FC = () => {
  const [current, setCurrent] = useState(0);
  // Basic information
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [username, setUsername] = useState("");
  const [food, setFood] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [bio, setBio] = useState("");
  const [profile, setProfile] = useState<string | ArrayBuffer | null>(
    "/assets/fallback/pfp.png"
  );
  const router = useRouter();
  const [fr, setFr] = useState<number>(0);
  const [creators, setCreators] = useState<any>();
  // Recommendation Algorithm
  const [selectedMainTopics, setSelectedMainTopics] = useState<string[]>([]);
  const [selectedSubtopics, setSelectedSubtopics] = useState<string[]>([]);
  const [nsfwModeration, setNsfwModeration] = useState(true);
  // Modal Information
  const { onboard } = useContext(ModalContext) as any;
  const [isOpen, setIsOpen] = onboard || [false, () => {}];

  const Deso = new DesoAPI();

  // Get Recommended Creators For A User

  const getRecommendedCreators = async () => {
    try {
      const SERVER_ENDPOINT =
        process.env.SERVER_ENDPOINT || "http://localhost:3000";

      const response = await fetch(
        `${SERVER_ENDPOINT}/api/discovery/getRecommendedFollowings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            number: 5,
            interests: selectedSubtopics[0],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }

      const data = await response.json();

      setCreators(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  /* Handle a change in preferred main topic */

  const handleMainTopicChange = (mainTopic: string) => {
    const isSelected = selectedMainTopics.includes(mainTopic);

    if (isSelected) {
      setSelectedMainTopics(
        selectedMainTopics.filter((item) => item !== mainTopic)
      );
    } else {
      setSelectedMainTopics([...selectedMainTopics, mainTopic]);
    }
  };

  /* Handle a change in preferred sub topic */

  const handleSubtopicChange = (subtopic: string) => {
    if (selectedSubtopics.includes(subtopic)) {
      setSelectedSubtopics(
        selectedSubtopics.filter((item) => item !== subtopic)
      );
    } else {
      setSelectedSubtopics([...selectedSubtopics, subtopic]);
    }
  };

  const handleNsfwModerationToggle = () => {
    setNsfwModeration((prevValue) => !prevValue);
  };

  // Check if the next button is disabled

  const isNextButtonDisabled =
    current == 0
      ? !first || !last || !username || !/^[a-zA-Z0-9_]+$/.test(username)
      : current == 1
      ? !bio
      : selectedMainTopics.length === 0 || selectedSubtopics.length === 0;

  // Check if the user already has a username, profile, and bio

  useEffect(() => {
    if (localStorage && localStorage.getItem("userInfo")) {
      const storedUserInfo = localStorage.getItem("userInfo") || ""; // Provide a default value
      const storedUserProfile =
        localStorage.getItem("profilePic") || "/assets/fallback/pfp.png";

      if (storedUserInfo) {
        const parsedUserInfo: UserProfile = JSON.parse(storedUserInfo);
        setUsername(
          parsedUserInfo?.Profile?.Username
            ? parsedUserInfo?.Profile?.Username
            : ""
        );
        setBio(
          parsedUserInfo?.Profile?.Description
            ? parsedUserInfo?.Profile?.Description
            : ""
        );
        setFirst(
          parsedUserInfo?.Profile?.ExtraData?.DisplayName.split(" ")[0]
            ? parsedUserInfo?.Profile?.ExtraData?.DisplayName.split(" ")[0]
            : ""
        );
        setLast(
          parsedUserInfo?.Profile?.ExtraData?.DisplayName.split(" ")[1]
            ? parsedUserInfo?.Profile?.ExtraData?.DisplayName.split(" ")[1]
            : ""
        );
        setFood(
          parsedUserInfo?.Profile?.ExtraData?.Food
            ? parsedUserInfo?.Profile?.ExtraData?.Food
            : ""
        );
        setLocation(
          parsedUserInfo?.Profile?.ExtraData?.Location
            ? parsedUserInfo?.Profile?.ExtraData?.Location
            : ""
        );

        setWebsite(
          parsedUserInfo?.Profile?.ExtraData?.Website
            ? parsedUserInfo?.Profile?.ExtraData?.Website
            : ""
        );

        const CreatorPoints: number | undefined = parsedUserInfo?.Profile
          ?.CoinEntry?.CreatorBasisPoints
          ? parseInt(
              parsedUserInfo.Profile.CoinEntry.CreatorBasisPoints as string
            )
          : undefined;

        setFr(CreatorPoints || 0);

        getBase64FromUrl(storedUserProfile);
      }
    }
  }, []);

  useEffect(() => {
    if (current == 3) {
      getRecommendedCreators();
    }
  }, [current]);

  // Convert link to base64 for storing on DeSo

  const getBase64FromUrl = async (url: string) => {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;

        setProfile(base64data);
      };
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        {current == 0 && (
          <div className="max-w-lg">
            <h1 className="text-2xl font-semibold mb-2 text-white">
              Basic Information
            </h1>
            <p className="text-white mb-2">
              This information is visible on your public profile page and can be
              modified later. Make this information unique and personal to you.
            </p>
            <form>
              <Input
                className=" w-full xl:w-[49%] inline-block"
                placeholder="First Name  👤"
                value={first}
                onChange={(e) => {
                  setFirst(e.target.value);
                }}
                required
              />
              <Input
                className="w-full xl:w-[49%] inline-block xl:ml-2 mt-4 xl:mt-0"
                placeholder="Last Name  👤"
                value={last}
                onChange={(e) => {
                  setLast(e.target.value);
                }}
                required
              />
              <Input
                className="w-full inline-block  mt-4 "
                placeholder="Username ✨"
                value={username}
                pattern="[a-zA-Z0-9_]+"
                title="Username must only use letters, numbers, or underscores."
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (!/^[a-zA-Z0-9_]+$/.test(e.target.value) && username) {
                    toast.error(
                      "Username must only use letters, numbers, or underscores."
                    );
                  }
                }}
                required
              />
              <Input
                placeholder="Favorite Food 🍕 (optional)"
                value={food}
                onChange={(e) => {
                  setFood(e.target.value);
                }}
                className="mt-4"
              />
              <Input
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                }}
                className="mt-4"
                placeholder="Location 🌍 (optional)"
              />
              <Input
                value={website}
                onChange={(e) => {
                  setWebsite(e.target.value);
                }}
                className="mt-4"
                type="url"
                placeholder="Website 🌐 (optional)"
              />
            </form>
          </div>
        )}
        {current == 1 && (
          <>
            <h1 className="text-2xl font-semibold mb-2 text-white">
              Tell Us A Little About Yourself
            </h1>
            <textarea
              value={bio}
              className="text-white bg-transparent outline-none resize-none border-red-100 w-[30vw]"
              placeholder="Start something wonderful..."
              rows={10}
              onChange={(e) => {
                setBio(e.target.value);
              }}
            ></textarea>
          </>
        )}
        {current == 2 && (
          <div className="w-[40vw]">
            <div className="flex">
              <div className="w-1/2 pr-2">
                <h1 className="text-2xl font-semibold mb-2 text-white ">
                  What are you interested in?
                </h1>
                <div className="grid grid-cols-2 gap-4">
                  {topics.map((topic) => (
                    <div
                      key={topic.name}
                      onClick={() => handleMainTopicChange(topic.name)}
                      className={`cursor-pointer p-4 rounded-md ${
                        selectedMainTopics.includes(topic.name)
                          ? "bg-primary text-white"
                          : "bg-white"
                      }`}
                    >
                      <span
                        className={`${
                          selectedMainTopics.includes(topic.name)
                            ? "text-white"
                            : "text-primary"
                        }`}
                      >
                        {topic.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-1/2 pl-2 h-full overflow-y-auto max-h-[55vh]">
                {selectedMainTopics.map((selectedMainTopic) => (
                  <div key={selectedMainTopic} className="mb-4">
                    <h2 className="text-lg font-semibold mb-2 text-white">
                      {selectedMainTopic}
                    </h2>
                    <div className="flex flex-wrap">
                      {topics
                        .find((topic) => topic.name === selectedMainTopic)
                        ?.subcategories?.map((subtopic) => (
                          <div
                            key={subtopic}
                            onClick={() => handleSubtopicChange(subtopic)}
                            className={`cursor-pointer p-2 m-1 rounded-md ${
                              selectedSubtopics.includes(subtopic)
                                ? "bg-secondary text-primary"
                                : "bg-gray-100"
                            }`}
                          >
                            <span className="text-primary">{subtopic}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={nsfwModeration}
                  onChange={handleNsfwModerationToggle}
                  className="form-checkbox accent-primary text-purple-500 focus:outline-none focus:border-purple-300 focus:ring focus:ring-purple-200"
                />
                <span className="ml-2 text-white">
                  Turn on NSFW content moderation (Recommended)
                </span>
              </label>
            </div>
          </div>
        )}
        {current == 3 && (
          <div className="w-[35vw]">
            <h1 className="text-2xl font-semibold mb-2 text-white ">
              Start off by following some accounts
            </h1>
            <p className="text-white mb-2">
              These recommendations are based off the interests you picked.
            </p>
            {creators && (
              <div className="flex flex-col rounded-xl bg-neutral-900 my-4">
                {creators?.map((value: any) => (
                  <FollowUser
                    id={value.PublicKeyBase58Check}
                    name={value.Username}
                    username={value.Username}
                    key={value.PublickeyBase58Check}
                    loading={false}
                  />
                ))}
              </div>
            )}
            {!creators && (
              <>
                {Array.from({ length: 5 })?.map((i: any) => (
                  <FollowUser
                    id=""
                    name=""
                    username=""
                    key={i}
                    loading={true}
                  />
                ))}
              </>
            )}
          </div>
        )}
        <div className="flex">
          {current != 0 && (
            <button
              onClick={() => {
                setCurrent(current - 1);
              }}
              className={`mt-4 p-2 
               bg-primary text-white
            rounded-md cursor-pointer w-[49%] mr-2  inline  focus:outline-none focus:ring`}
            >
              Back
            </button>
          )}
          <button
            disabled={isNextButtonDisabled}
            onClick={async () => {
              if (current != 3) {
                setCurrent(current + 1);
              }
              if (current == 3) {
                const deso_key = localStorage.getItem(
                  "deso_user_key"
                ) as string;
                const profilePromise = new Promise<unknown>(
                  async (resolve, reject) => {
                    try {
                      /* Save user data to the blockchain */
                      const response = await Deso.updateInfo(
                        deso_key,
                        username,
                        bio,
                        fr,
                        profile as string,
                        food,
                        location,
                        website,
                        `${first} ${last}`
                      );

                      const SERVER_ENDPOINT =
                        process.env.SERVER_ENDPOINT || "http://localhost:3000";

                      const response2 = await fetch(
                        `${SERVER_ENDPOINT}/api/user/updateUserPrefences`,
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            content_moderation: nsfwModeration,
                            interests: {
                              main: selectedMainTopics,
                              sub: selectedSubtopics,
                            },
                          }),
                        }
                      );
                      if (response2.status === 200) {
                        resolve(response);
                        setIsOpen(false);
                        router.push("/");
                      } else {
                        reject(new Error("Failed to send messages"));
                      }
                    } catch (error) {
                      reject(error);
                    }
                  }
                );
                toast.promise(profilePromise, {
                  loading: "Updating Information...",
                  success: (data) => {
                    return `Successfully updated information`;
                  },
                  error: "Error",
                });
              }
            }}
            className={`mt-4 p-2 ${
              isNextButtonDisabled
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-primary text-white"
            }  rounded-md cursor-pointer ${
              current == 0 ? "w-full" : "w-[49%] inline"
            }  focus:outline-none focus:ring`}
          >
            {current != 3 ? "Next" : "Finish"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardModal;
