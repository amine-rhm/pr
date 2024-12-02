import { ArrowLongRightIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

type props = {
  value : string;
}

const Li = ({ value } : props) => {
 const navigate = useNavigate();

const SearchCity = () => {
  // Trigger validation before form submission
    navigate(`/Villes/${value}`);
    window.scrollTo(0, 0);
}; 
return (
    <div className="w-full flex items-center justify-between pt-7 pb-3 cursor-pointer border-solid border-b-grey hover:border-b-greyActive border-x-0 border-t-0 "
    onClick={SearchCity}>
      <li className="max-md:text-lg font-body ">{value}</li>
      <ArrowLongRightIcon className="max-md:hidden h-6 ml-36 max-sm:ml-2 md:ml-12 lg:ml-8 xl:ml-36" />
    </div>
  );
};

export default Li;
