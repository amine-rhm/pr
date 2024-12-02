import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconActive } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import useAuthStore from "../../Zustand/Store";
import axios from "axios";

type information = {
  idann: string;
  image: string;
  title: string;
  description: string;
  ville: string;
  price: number;
};
const AddedCards = ({
  image,
  title,
  ville,
  description,
  price,
  idann,
}: information) => {
  const {isAuthenticated}= useAuthStore()
  const [fav, setFav] = useState(false);
  const navigate = useNavigate();
  const DescriptionedAd = () => {
    navigate(`/Annonces/${idann}`);
    window.scrollTo(0, 0);
    // Reset the isHeartClick state
  };

  const token = useAuthStore((state)=>(state.token))
  const toggleFav = () => {

    if (isAuthenticated) {
      const newFavState = !fav;
      setFav(newFavState);
      {
        !fav
          ? (FavAd(idann,token),
            // Save fav state to local storage
            localStorage.setItem(`fav_${idann}`, JSON.stringify(newFavState)))
          : deleteAd(idann);
      }
    } else {
      // Redirect unauthenticated user to authentication page
      navigate("/Auth");
    }
  };
  useEffect(() => {
    const favState = localStorage.getItem(`fav_${idann}`);
    if (favState) {
      setFav(JSON.parse(favState));
    }
  }, [idann]);

  const FavAd = async (idann: any, token: string | null) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/favoris",
        { idann: idann } ,
        {
          headers: {
            "x-access-token": `Bearer ${token}`,
          },
        }
      );
      // You can handle the response here if needed
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const deleteAd = async (idn: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/v1/favoris/${idn}`,
        {
          headers: {
            "x-access-token": `Bearer ${token}`,
          },
        }
      );
      localStorage.removeItem(`fav_${idn}`);
      console.log(
        "Annonce supprimée avec succès :",
        response.data.deletedannonce
      );
    } catch (error) {
      console.error("Erreur :", error);
    }
  };


  return (
    <div className="w-[260px] max-md:w-[38vw] max-lg:w-[28vw] max-sm:w-[75vw] bg-transparent  rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] cursor-pointer hover:scale-150 cards max-sm:m-auto max-sm:my-4 
    ">
      <img
        className="h-40 max-sm:h-36 rounded-t-md w-full "
        src={`http://localhost:3000/uploads/${image}`}
      
        alt="cardImage"
        onClick={DescriptionedAd}
      />
      <div className=" px-4 ">
        <div className="flex justify-between items-center mt-1">
          <p className="w-[85%] text-nowrap overflow-hidden overflow-ellipsis font-body font-bold text-sm"  onClick={DescriptionedAd}>
            {title}{" "}
          </p>
          <span onClick={toggleFav}>
            {!fav ? (
              <HeartIcon className="text-orange h-6 " />
            ) : (
              <HeartIconActive className="text-orangeActive h-6 " />
            )}
          </span>
        </div>
        <div className="flex flex-col " onClick={DescriptionedAd}>
          <h5 className=" font-medium text-gray-500  font-body mb-2"> {ville}</h5>
          <p className="text-xs text-clip h-12 min-h-13 overflow-hidden break-words w-full line-clamp-3 font-body ">
            {description}
          </p>
          <p className="text-sm my-3 font-medium ">
            {price} <span className="text-xs font-body  ">DA/mois</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddedCards;
