import { useEffect, useState } from "react";

import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconActive } from "@heroicons/react/24/solid";
import MiniCarrosel from "../../components/MiniCarrosel";

import { useNavigate } from "react-router-dom";

import axios from "axios";
import useAuthStore from "../../../Zustand/Store";
import AddedCards from "../../components/AddedCard";

type AdProps = {
  idann: string;
  images: any;
  titre: string;
  type: string;
  description: string;
  ville: string;
  prix: number;
  surface: number;
  meuble?: number;
  type_residence?: string;
};

const Ad = ({
  idann,
  images,
  titre,
  type,
  description,
  ville,
  prix,
  surface,
  type_residence,
  meuble,
}: AdProps) => {
  const { isAuthenticated } = useAuthStore();
  const [fav, setFav] = useState(false);

  const verif = !!meuble ? "meublé  •" : " Non meublé  •";

  const navigate = useNavigate();
  const DescriptionedAd = () => {
    navigate(`/Annonces/${idann}`);
    window.scrollTo(0, 0);
  };
  const token = useAuthStore((state) => state.token);
  const toggleFav = () => {
    if (isAuthenticated) {
      const newFavState = !fav;
      setFav(newFavState);
      {
        !fav
          ? (FavAd(idann, token),
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
        { idann: idann },
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
    <div>
      <section className="bg-greyTwo flex  my-8 mx-14 w-[60vw] cursor-pointer rounded-lg max-sm:hidden max-lg:w-[80vw]">
        <div className="w-[45%] h-[250px]">
          <MiniCarrosel slides={images} />
        </div>

        <div className="my-6 mx-6  w-[55%]">
          <div className="flex justify-between">
            <h4
              onClick={DescriptionedAd}
              className=" w-[85%] text-nowrap overflow-hidden overflow-ellipsis"
            >
              {titre}
            </h4>
            <span className=" cursor-pointer" onClick={(e) => toggleFav()}>
              {!fav ? (
                <HeartIcon className="text-orange h-7 " />
              ) : (
                <HeartIconActive className="text-orangeActive h-7 " />
              )}
            </span>
          </div>

          <div onClick={DescriptionedAd}>
            <h4 className="font-medium mb-2"> {type}</h4>

            <p className="font-semibold text-sm mb-2">
              {surface + "m2 •"} {type === "Residentiel" && verif}{" "}
              {type_residence}{" "}
            </p>

            <p className="text-xs text-clip h-11 overflow-hidden break-words w-full line-clamp-3  ">
              {description}
            </p>
            <h4 className=" font-medium text-gray-500 mt-2 mb-2"> {ville}</h4>
            <p className="text-sm mt-3 font-bold float-end">
              {prix} <span className="text-xs font-medium">DA/mois</span>
            </p>
          </div>
        </div>
      </section>
      {/* <div className="sm:hidden w-[80vw] bg-transparent mt-6 rounded-xl m-auto shadow-[0_8px_30px_rgb(0,0,0,0.12)] cursor-pointer cards">
        <img
          className="h-36 rounded-t-md w-full"
          src={images && images.length > 0 ? images[0] : ""}
          alt="cardImage"
          onClick={DescriptionedAd}
        />
        <div className=" px-4">
          <div className="flex justify-between items-center mt-1">
            <h4 className="w-[85%] text-nowrap overflow-hidden overflow-ellipsis">
              {titre}{" "}
            </h4>
            <span onClick={toggleFav}>
              {!fav ? (
                <HeartIcon className="text-orange h-6 " />
              ) : (
                <HeartIconActive className="text-orangeActive h-6 " />
              )}
            </span>
          </div>
          <div onClick={DescriptionedAd} className="">
            <h5 className=" font-medium text-gray-500 mt-1  mb-3"> {ville}</h5>
            <p className="text-xs text-clip h-11 overflow-hidden break-words w-full line-clamp-3 ">
              {description}
            </p>
            <p className="text-sm my-3 pb-3 font-medium ">
              {prix} <span className="text-xs">DA/mois</span>
            </p>
          </div>
        </div>
      </div> */}
      <div className="sm:hidden ">
        <AddedCards
          image={images[0]}
          title={titre}
          ville={ville}
          description={description}
          price={prix}
          idann={idann}
        />
      </div>
    </div>
  );
};

export default Ad;
