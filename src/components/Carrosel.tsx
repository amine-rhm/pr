import { ArrowLeftIcon, ArrowRightIcon, CameraIcon } from "@heroicons/react/24/outline";

import { useState } from "react";


type IndexProps = {
  images: any
};

function Index({ images }: IndexProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className="h-[420px] w-full  px-4 relative group bg-gray-100">
      
      <div
        style={{ backgroundImage: `url(http://localhost:3000/uploads/${images[currentIndex]})` }}
        className=" h-full rounded-2xl bg-center bg-contain bg-no-repeat duration-500 "
      ></div>
      {/* Left Arrow */}
      <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
      <ArrowLeftIcon onClick={prevSlide} className="size-7 flex items-center max-sm:size-4"/>
      </div>
      {/* Right Arrow */}
      <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
        <ArrowRightIcon onClick={nextSlide} className="size-7 flex items-center max-sm:size-4"/>
      </div>
      <div className="flex top-4 justify-center py-2">
        { Array.isArray(images) && images.length > 0 &&
          images.map((slide: any, slideIndex: number) => (
            <div
              key={slideIndex}
              onClick={() => goToSlide(slideIndex)}
              className="text-2xl cursor-pointer"
            ></div>
          ))}
      </div>
      <div className="bg-greyTwo flex justify-center items-center w-fit px-3 py-2 rounded-3xl absolute right-[50%]  bottom-6 bt ">
        <CameraIcon className="size-6 mr-2"/>
        <span>{images.length} Photos</span>
      </div>
    </div>
  );
}

export default Index;
