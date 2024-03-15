"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ModifyAlgorithm = () => {
  // State for the first slider
  const [inNetworkSource, setInNetworkSource] = useState<number>(60);
  // State for the second slider
  const [outOfNetworkSource, setOutOfNetworkSource] = useState<number>(40);
  const [commentWeight, setCommentWeight] = useState(2);
  const [repostWeight, setRepostWeight] = useState(1);
  const [diamondWeight, setDiamondWeight] = useState(1.5);
  const [likeWeight, setLikeWeight] = useState(0.5);
  const [mediaWeight, setMediaWeight] = useState(20);
  const [botWeight, setBotWeight] = useState(-40);

  // Handle slider change for the first slider
  const handleInNetworkSliderChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = parseInt(event.target.value, 10);
    setInNetworkSource(newValue);
    setOutOfNetworkSource(100 - newValue);
  };

  // Handle slider change for the second slider
  const handleOutOfNetworkSliderChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = parseInt(event.target.value, 10);
    setOutOfNetworkSource(newValue);
    setInNetworkSource(100 - newValue);
  };

  // Function to create the gradient background string
  const createGradient = (value: number) => {
    return `linear-gradient(to right, #7c3aed 0%, #7c3aed ${value}%, #e5e7eb ${value}%, #e5e7eb 100%)`;
  };
  // Function to update the slider background
  const updateSliderBackground = (id: string, value: number) => {
    if (document) {
      const slider = document.getElementById(id) as HTMLInputElement | null;
      if (slider) {
        slider.style.background = createGradient(value);
      }
    }
  };

  useState(() => {
    updateSliderBackground("in-network-slider", inNetworkSource);
    updateSliderBackground("out-of-network-slider", outOfNetworkSource);
  });

  // Effect to set the initial styles of the sliders
  useEffect(() => {
    if (document) {
      const setSliderBackground = (id: string, value: number) => {
        const slider = document.getElementById(id) as HTMLInputElement;
        slider.style.background = `linear-gradient(to right, #7c3aed ${value}%, #e5e7eb ${value}%)`;
      };

      setSliderBackground("in-network-slider", inNetworkSource);
      setSliderBackground("out-of-network-slider", outOfNetworkSource);
    }
  }, [inNetworkSource, outOfNetworkSource, setOutOfNetworkSource]);

  return (
    <>
      <h1 className="text-xl font-bold p-6 backdrop-blur z-10 bg-background/10 sticky top-0">
        Recommendation Algorithm
      </h1>
      <section className="pl-6 pr-6">
        <p className="text-gray-600">
          Our recommendation algorithm is completely open-source and open for
          you to customize on this page.
        </p>
        <h2 className="font-bold mt-5 text-lg">1. Content Sourcing </h2>
        <p className="text-gray-400 mt-5">
          We begin by sourcing content from{" "}
          <span className="text-primary">In-network sources</span> (accounts you
          follow) and{" "}
          <span className="text-primary">Out-of-network sources</span> (accounts
          you don’t follow). You can modify this percentage below:
        </p>
        {/* In network sources*/}
        <div className="mt-4">
          <>
            <h3>In-Network Sources ({inNetworkSource}%)</h3>
            <label
              htmlFor="in-network-slider"
              className="text-sm text-gray-400 ml-2 inline"
            >
              0%
            </label>
            <input
              id="in-network-slider"
              type="range"
              min={0}
              max={100}
              step={10}
              value={inNetworkSource}
              onChange={handleInNetworkSliderChange}
              className="slider"
            />
            <label
              htmlFor="in-network-slider"
              className="text-lg text-gray-400 mr-2 inline"
            >
              100%
            </label>
          </>
        </div>
        {/* Out network sources*/}
        <div className="mt-4">
          <>
            <h3>Out-Network Sources ({outOfNetworkSource}%)</h3>

            <label
              htmlFor="out-of-network-slider"
              className="text-sm text-gray-400 ml-2"
            >
              0%
            </label>
            <input
              id="out-of-network-slider"
              type="range"
              min={0}
              max={100}
              step={10}
              value={outOfNetworkSource}
              onChange={handleOutOfNetworkSliderChange}
              className="slider"
            />
            <label
              htmlFor="out-of-network-slider"
              className="text-lg text-gray-400 mr-2"
            >
              100%
            </label>
          </>
        </div>
        <h2 className="font-bold mt-5 text-lg">2. Content Ranking </h2>
        <p className="text-gray-400 mt-5">
          We take all of the posts that we have found in the previous step and
          rank them based on how likely a user is to{" "}
          <span className="text-primary">interact</span> with the content.
        </p>

        <div className="mt-4">
          <h3>Weight of Likes</h3>
          <Input
            type="number"
            className="mt-2 border-[#7c3aed]"
            placeholder="Enter the weight of likes"
            value={likeWeight}
            onChange={(e) => {
              setLikeWeight(e.target.value as any);
            }}
          />
          <h3 className="mt-2">Weight of Diamonds</h3>
          <Input
            type="number"
            className="mt-2 border-[#7c3aed]"
            placeholder="Enter the weight of diamonds"
            value={diamondWeight}
            onChange={(e) => {
              setDiamondWeight(e.target.value as any);
            }}
          />
          <h3 className="mt-2">Weight of Comments</h3>
          <Input
            type="number"
            className="mt-2 border-[#7c3aed]"
            placeholder="Enter the weight of comments"
            value={commentWeight}
            onChange={(e) => {
              setCommentWeight(e.target.value as any);
            }}
          />
          <h3 className="mt-2">Weight of Reposts</h3>
          <Input
            type="number"
            className="mt-2 border-[#7c3aed]"
            placeholder="Enter the weight of reposts"
            value={repostWeight}
            onChange={(e) => {
              setRepostWeight(e.target.value as any);
            }}
          />
          <h3 className="mt-2">Weight of Media (Image, Videos)</h3>
          <Input
            type="number"
            className="mt-2 border-[#7c3aed]"
            placeholder="Enter the weight of media"
            value={mediaWeight}
            onChange={(e) => {
              setMediaWeight(e.target.value as any);
            }}
          />
        </div>

        <div>
          <h2 className="font-bold mt-5 text-lg">3. Content Filtering </h2>
          <p className="text-gray-400 mt-5">
            In this final stage, we refine the post selections and{" "}
            <span className="text-primary">filter</span> out certain content.
            This includes Proof of Person, Feedback-based Fatigue, etc...
          </p>
          <h4 className="mt-2 underline font-bold">a) Proof Of Person</h4>
          <p className="mt-2">
            We try to avoid posts that are posted by bots by looking at the
            poster&apos;s coin price and using our bot detection tool.
          </p>
          <h3 className="mt-2">Weight of Likely Being A Bot</h3>

          <Input
            type="number"
            className="mt-2 border-[#7c3aed]"
            placeholder="Enter the weight of likes"
            value={botWeight}
            max={0}
            onChange={(e) => {
              setBotWeight(e.target.value as any);
            }}
          />

          <p className="mt-2">
            Currently NSFW content detection and other filters are enabled until
            we can ensure the security of everybody using the platform.{" "}
          </p>
        </div>
        <div className="flex w-full justify-end ">
          <Button className="mt-4 text-white mb-4">Save Changes</Button>
        </div>
      </section>
      <style jsx>{`
        .slider {
          -webkit-appearance: none;
          width: 80%;
          height: 5px;
          border-radius: 5px;
          background: #e5e7eb;
          outline: none;
          padding: 0;
          display: inline-block;
          margin: 0;
          margin-left: 5px;
          margin-right: 5px;
          vertical-align: middle;
        }
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: #7c3aed;
          cursor: pointer;
          transition: background 0.3s ease-in-out;
        }
        .slider::-moz-range-thumb {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: #7c3aed;
          cursor: pointer;
          transition: background 0.3s ease-in-out;
        }
      `}</style>
    </>
  );
};

export default ModifyAlgorithm;
