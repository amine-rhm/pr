import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

type card = {
  image: string;
  title: string;
};

const TypeCard = ({ image, title } : card) => {
  const navigate = useNavigate();
  const SearchType = () => {
    
    // Trigger validation before form submission
      navigate(`/Annonces/Type/${title}`);
      window.scrollTo(0, 0);
  }; 
  return (
    <div className="w-[18vw] max-lg:w-[21vw]  max-sm:w-[70vw]  bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] cursor-pointer overflow-clip cards card" onClick={SearchType}>
      <img
        className="h-28 rounded-t-md w-full"
        src={`../../public/images/CardImages/${image}`}
        alt="cardImage"
      />
      <div className="flex justify-between items-center px-4 py-2 ">
        <h4 className="font-medium font-body">{title}</h4>
        <ArrowRightIcon className="h-4" />
      </div>
    </div>
  );
};

export default TypeCard;
