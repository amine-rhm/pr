import { ChevronDoubleUpIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

const ScrollToTop = () => {
  const [isUp, setIsUp] = useState<boolean>(false);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY < 1000) {
        setIsUp(false);
      } else {
        setIsUp(true);
      }
    });
  }, []);
  const ScrollUp = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isUp && (
        <div
          className="rounded-full size-16 max-md:size-12 bg-white flex items-center justify-center fixed right-7 bottom-7 shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] cursor-pointer ScrollBtn z-40"
          onClick={ScrollUp}
        >
          <ChevronDoubleUpIcon className="size-6 text-blue" />
        </div>
      )}
    </>
  );
};

export default ScrollToTop;
