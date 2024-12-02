import { ArrowLeftIcon, ArrowRightIcon, CameraIcon } from "@heroicons/react/24/outline";

import { useState } from "react";


type IndexProps = {
  slides: any
};

function MiniIndex({ slides }: IndexProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className="h-full w-full px-4 relative group bg-gray-100">
      <div
        style={{ backgroundImage: `url(http://localhost:3000/uploads/${slides[currentIndex]})` }}
        className=" h-full rounded-2xl bg-center bg-contain bg-no-repeat duration-500 "
      ></div>
      {/* Left Arrow */}
      <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
      <ArrowLeftIcon onClick={prevSlide} className="size-5 flex items-center"/>
      </div>
      {/* Right Arrow */}
      <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
        <ArrowRightIcon onClick={nextSlide} className="size-5 flex items-center"/>
      </div>
      <div className="flex top-4 justify-center py-2">
        {Array.isArray(slides) && slides.length > 0 &&
          slides.map((slide: any, slideIndex: number) => (
            <div
              key={slideIndex}
              onClick={() => goToSlide(slideIndex)}
              className="text-2xl cursor-pointer"
            ></div>
          ))}
      </div>
      <div className="bg-greyTwo flex justify-center items-center w-fit px-2 py-1 rounded-3xl absolute right-[50%] bt bottom-3">
        <CameraIcon className="size-5 mr-2"/>
        <span className="text-sm">{slides.length} Photos</span>
      </div>
    </div>
  );
}

export default MiniIndex;
