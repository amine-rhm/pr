import {
  HeartIcon,

  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  DocumentTextIcon,
  HeartIcon as HeartIconActive,
  MapPinIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import Index from "../../components/Carrosel";
import Modal from "../../components/PopUp";
import MobileNav from "../heroSection/MobileNav";
import Navbar from "../heroSection/Navbar";

import { useNavigate, useParams } from "react-router-dom";
import Footer from "../BodySection/Footer";

import useAuthStore from "../../../Zustand/Store";
import AddedCards from "../../components/AddedCard";
import Modify from "../../components/Modify";
import Loading from "../../components/Loading";
type Ads = {
  idann: string;
  images: any[];
  titre: string;
  ville: string;
  description: string;
  surface: number;
  type: string;
  users_details: {
    iduser: string;
    nom: string;
    prenom: string;
    num: string;
    email: string;
  };
  bien_details?: {
    industriel?: {
      capacite?: string;
      puissance?: string;
      taille?: string;
      meuble?: number;
    };
    commercial?: {
      etage?: string;
      meuble?: number;
      garage?: number;
      camera_surveillance?: number;
    };
    terrain?: {
      categorie?: string;
      longueur?: string;
      largeur?: string;
    };
    résidentiel?: {
      etage_villa?: string;
      etage_maison?: string;
      meuble?: number;
      type_residence?: string;
      type_villa?: string;
      type_appartement?: string;
      equipement?: string;
      Ascenseur?: number;
      Wifi?: number;
      Camera?: number;
      Parking?: number;
      Garage?: number;
      Electroménager?: number;
      Climatiseur?: number;
      Citerne?: number;
    };
  };
  date_ajout: string;
  adresse: string;
  prix: number;
};
type OtherAds = {
  idann: string;
  image1: string;
  titre: string;
  ville: string;
  description: string;
  prix: number;
};

function AdDescription() {
  const [more, setMore] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [openModify, setOpenModify] = useState(false);
  const [fav, setFav] = useState(false);
  const { idann } = useParams();
  const { data: ads } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:3000/api/v1/info/pro/annonce/${idann}`
      );
      console.log(data);

      return data as Ads;
    },
    queryKey: ["ads"],
  });
  const Role = useAuthStore((state) => state.Role);
  const userId = useAuthStore((state) => state.userId);
  const token = useAuthStore((state) => state.token);

  const defaultDescription = ads?.description || "";
  const [showMore, setShowMore] = useState(
    defaultDescription.split("\n").length > 3
  );
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const seeInfos = () => {
    if (isAuthenticated) {
      setOpenModal(!openModal);
      // Save fav state to local storage
    } else {
      // Redirect unauthenticated user to authentication page
      navigate("/Auth");
    }
  };

  const deleteWrapper = () => {
    if (Role === "admin") { 
      adminDelete(ads?.idann);

      // deleteAnnonce( ads?.idann,token)
    } else if (userId === ads?.users_details?.iduser) {
      deleteAnnonce(ads?.idann, token);
    }
  };
  const deleteAnnonce = async (idn: any, token: any) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/v1/delete/annonce/${idn}`,
        {
          headers: {
            "x-access-token": `Bearer ${token}`,
          },
        }
      );
      navigate("/");
    } catch (error) {
      console.error("Erreur :", error);
    }
  };
  const date =  ads?.date_ajout?.slice(0, 10);
  const adminDelete = async (idn: any) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/v1/delete/admin/${idn}`
      );

      navigate("/");
    } catch (error) {
      console.error("Erreur :", error);
    }
  };
  const toggleFav = () => {
    if (isAuthenticated) {
      const newFavState = !fav;
      setFav(newFavState);
      {
        !fav
          ? (FavAd(idann, token),
            // Save fav state to local storage
            localStorage.setItem(`fav_${idann}`, JSON.stringify(newFavState)))
          : deleteAd(ads?.idann);
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
  const deleteAd = async (idn: string | undefined) => {
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
  const { data: others, isLoading } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(
        "http://localhost:3000/api/v1/other/annonces"
      );

      return data as OtherAds[];
    },
    queryKey: ["others"],
  });

  if (isLoading) {
    <Loading/>
  }
 
  return (
    <>
      <Navbar />
      <MobileNav />
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        nom={ads?.users_details?.nom}
        prenom={ads?.users_details?.prenom}
        email={ads?.users_details?.email}
        num={ads?.users_details?.num}
      />
      <Modify
        open={openModify}
        onClose={() => setOpenModify(false)}
        idann = {ads?.idann}
        titre={ads?.titre}
        adresse={ads?.adresse}
        description={ads?.description}
        prix={ads?.prix}
        surface={ads?.surface}
      />
      {ads ? (
        <div className="mx-12 max-md:mx-4 font-body">
          <div className="flex justify-between items-center mt-10 ">
            <h2 className=" max-md:text-xl ">
              {ads?.type} à {ads?.ville}
            </h2>

            <div className="flex">
              {userId === ads?.users_details?.iduser && (
                <div
                  className="btn mr-8 bg-blue text-white flex items-start"
                  onClick={(e) => setOpenModify(!openModify)}
                >
                  <p>Modifier l'annonce</p>

                  <img
                    src="../../../public/images/SVG/contract_edit_20dp_FILL0_wght400_GRAD0_opsz20 (1).svg"
                    className="ml-2"
                    alt="MODIFYICON"
                  />
                </div>
              )}
              {(Role === "admin" || 
                userId === ads?.users_details?.iduser) && (
                  <div
                    className="btn mr-8 bg-red text-white flex items-center"
                    onClick={deleteWrapper}
                  >
                    <p>Supprimer l'annonce</p>
                    <TrashIcon className="size-5 ml-2" />
                  </div>
                )}
            </div>
          </div>
          <section className=" my-7 flex max-lg:flex-col">
            {!isLoading && ads && ads.images && (
              <Index images={ads.images} />
            )}
            <div className="ml-8 w-[500px] max-lg:w-full max-lg:mt-8 py-6  px-8 mx-8 max-lg:m-0 max-lg:mb-6 rounded-xl h-fit shadow-[0_8px_30px_rgb(0,0,0,0.12)] max-xl:mr-0">
              <div className="pb-3 flex justify-between items-center border-solid border-greysec  border-x-0 border-t-0">
                <p className="text-lg font-body">
                  <span className="text-2xl font-bold spa font-body title relative">
                    {ads?.prix}ꭰꭺ
                  </span>{" "}
                  par mois
                </p>
                <span onClick={(e) => toggleFav()} className="cursor-pointer">
                  {!fav ? (
                    <HeartIcon className="text-orange h-7" />
                  ) : (
                    <HeartIconActive className="text-orangeActive h-7 " />
                  )}
                </span>
              </div>
              <p className="mb-2 mt-6 font-bold text-xl font-body">
                Informations :{" "}
              </p>
              {ads?.type === "Industriel" && (
                <div className="space-y-1">
                  <p className="font-body ">Type : {ads?.type}</p>
                  <p className="font-body ">
                    Capacité : {ads?.bien_details?.industriel?.capacite}
                  </p>
                  <p className="font-body ">Surface : {ads?.surface}m2</p>
                  <p className="font-body ">
                    Puissance : {ads?.bien_details?.industriel?.puissance}
                  </p>
                  <p className="font-body ">
                    Taille : {ads?.bien_details?.industriel?.taille}
                  </p>
                  {ads?.bien_details?.industriel?.meuble && (
                    <p className="font-body ">
                      Meublé :{" "}
                      {ads?.bien_details?.industriel?.meuble === 1
                        ? "Oui"
                        : "non"}
                    </p>
                  )}
                </div>
              )}
              {ads?.type === "Commercial" && (
                <div className="space-y-1">
                  <p className="font-body ">Type : {ads?.type}</p>
                  <p className="font-body ">
                    Etages : {ads?.bien_details?.commercial?.etage}
                  </p>
                  <p className="font-body ">Surface : {ads?.surface}m2</p>
                  {ads?.bien_details?.commercial?.meuble && (
                    <p className="font-body ">
                      Meublé :{" "}
                      {ads?.bien_details?.commercial?.meuble === 1
                        ? "Oui"
                        : "non"}
                    </p>
                  )}
                </div>
              )}
              {ads?.type === "Terrain" && (
                <div className="space-y-1">
                  <p className="font-body ">Type : {ads?.type}</p>
                  <p className="font-body ">
                    Catégorie : {ads?.bien_details?.terrain?.categorie}
                  </p>
                  <p className="font-body ">
                    Longueur : {ads?.bien_details?.terrain?.longueur}
                  </p>
                  <p className="font-body ">
                    Largeur : {ads?.bien_details?.terrain?.largeur}
                  </p>
                </div>
              )}
              {ads?.type === "Residentiel" && (
                <div className="space-y-1">
                  <p className="font-body ">Type : {ads?.type}</p>
                  <p className="font-body ">Surface : {ads?.surface}m2</p>
                  {ads?.bien_details?.résidentiel?.type_residence && (
                    <p className="font-body ">
                      Type de résidence :{" "}
                      {ads?.bien_details?.résidentiel?.type_residence}
                    </p>
                  )}
                  {ads?.bien_details?.résidentiel?.etage_maison && (
                    <p className="font-body ">
                      Etages : {ads?.bien_details?.résidentiel?.etage_maison}
                    </p>
                  )}
                  {ads?.bien_details?.résidentiel?.etage_villa && (
                    <p className="font-body ">
                      Etages : {ads?.bien_details?.résidentiel?.etage_villa}
                    </p>
                  )}
                  {ads?.bien_details?.résidentiel?.type_appartement && (
                    <p className="font-body ">
                      Type d'appartement :{" "}
                      {ads?.bien_details?.résidentiel?.type_appartement}
                    </p>
                  )}
                  {/* {ads?.bien_details?.résidentiel?.type_villa && (
                    <p className="font-body ">
                      Type de résidence :{" "}
                      {ads?.bien_details?.résidentiel?.type_villa}
                    </p>
                  )} */}
                  {ads?.bien_details?.résidentiel?.meuble && (
                    <p className="font-body ">
                      Meublé :{" "}
                      {ads?.bien_details?.résidentiel?.meuble === 1
                        ? "Oui"
                        : "non"}
                    </p>
                  )}
                </div>
              )}
              <p className="mt-7 mb-2 text-sm font-body">
                L'annnonce vous intéresse ?{" "}
              </p>
              <button
                onClick={seeInfos}
                className="btn rounded-lg bg-orange text-white text-base w-full font-body"
              >
                Contacter le propriétaire
              </button>
              <p className="text-sm mt-5 border-solid border-greysec  border-x-0 border-b-0 pt-3 font-body">
                Annonce ajoutée le : {date}
              </p>
            </div>
          </section>

          <div className="w-[60vw] max-lg:w-full">
            <h2 className="mb-8 font-body">{ads?.titre}</h2>

            <div className="border-solid border-x-0 border-b-0 border-greyActive pt-8 mb-10">
              <p className="flex items-center text-2xl max-sm:text-xl font-bold text-greyLink font-body">
                <MapPinIcon className="size-6 mr-2" /> Adresse
              </p>
              <p className="font-medium text-lg mt-2 font-body">
                {ads?.adresse}
              </p>
              <h4 className=" text-greyLink  mt-1  font-body">
                {ads?.ville}, Algeria
              </h4>
            </div>

            <div className="border-solid border-x-0 border-greyActive border-spacing-4 py-8">
              <p className="mb-2 text-2xl max-sm:text-xl font-bold text-greyLink font-body  flex items-center ">
                <DocumentTextIcon className="size-6 mr-2" />
                Description
              </p>
              <p className={`text-lg ${more ? "" : "line-clamp-3"} font-body`}>
                {ads?.description}
              </p>
              {showMore && (
                <a
                  className="underline text-base font-body font-semibold cursor-pointer text-greyLink"
                  onClick={(e) => setMore(!more)}
                >
                  {more ? "Afficher moin " : "Afficher plus"}
                </a>
              )}
            </div>
            <div className="mt-10 border-solid border-x-0 border-t-0 border-greyActive border-spacing-4 pb-8 mb-10">
              <h3 className="mb-6 text-2xl max-sm:text-xl font-bold text-greyLink font-body flex items-center">
                <PlusCircleIcon className="size-6 max-sm:size-8 mr-2" />
                Ce que vous propose ce bien immobilier :
              </h3>
              <div className="grid grid-cols-2 w-[80%] max-sm:w-full justify-between gap-2">
                {!!ads?.bien_details?.résidentiel?.Parking && (
                  <div className="flex items-center text-lg font-body   max-sm:text-base ">
                    <span className="material-symbols-outlined size-6 mr-7 max-sm:mr-2">
                      local_parking
                    </span>
                    Parking
                  </div>
                )}

                {!!ads?.bien_details?.commercial?.camera_surveillance && (
                  <div className="flex items-center text-lg font-body   max-sm:text-base ">
                    <span className="material-symbols-outlined size-6 mr-7 max-sm:mr-2">
                      videocam
                    </span>
                    Caméra de surveillance
                  </div>
                )}
                {!!ads?.bien_details?.résidentiel?.Wifi && (
                  <div className="flex items-center text-lg font-body   max-sm:text-base ">
                    <span className="material-symbols-outlined size-6 mr-7 max-sm:mr-2">
                      wifi
                    </span>{" "}
                    Wifi
                  </div>
                )}
                {!!ads?.bien_details?.résidentiel?.Ascenseur && (
                  <div className="flex items-center text-lg font-body   max-sm:text-base ">
                    <span className="material-symbols-outlined size-6 mr-7 max-sm:mr-2">
                      Elevator
                    </span>
                    Ascenseur
                  </div>
                )}
                {!!ads?.bien_details?.résidentiel?.Electroménager && (
                  <div className="flex items-center text-lg font-body   max-sm:text-base ">
                    <span className="material-symbols-outlined size-6 mr-7 max-sm:mr-2">
                      home_iot_device
                    </span>{" "}
                    Electroménager
                  </div>
                )}
                {!!ads?.bien_details?.résidentiel?.Camera && (
                  <div className="flex items-center text-lg font-body max-sm:text-base">
                    <span className="material-symbols-outlined size-6 mr-7 max-sm:mr-2">
                      videocam
                    </span>{" "}
                    Caméra de surveillance
                  </div>
                )}
                {!!ads?.bien_details?.résidentiel?.Citerne && (
                  <div className="flex items-center text-lg font-body   max-sm:text-base ">
                    <span className="material-symbols-outlined size-6 mr-7 max-sm:mr-2">
                      waves
                    </span>{" "}
                    Citerne
                  </div>
                )}
                {!!ads?.bien_details?.résidentiel?.Garage && (
                  <div className="flex items-center text-lg font-body   max-sm:text-base ">
                    <span className="material-symbols-outlined size-6 mr-7 max-sm:mr-2">
                      garage_home
                    </span>{" "}
                    Garage
                  </div>
                )}
                {!!ads?.bien_details?.commercial?.garage && (
                  <div className="flex items-center text-lg font-body   max-sm:text-base ">
                    <span className="material-symbols-outlined size-6 mr-7 max-sm:mr-2">
                      garage_home
                    </span>{" "}
                    Garage
                  </div>
                )}
                {!!ads?.bien_details?.résidentiel?.Climatiseur && (
                  <div className="flex items-center text-lg font-body   max-sm:text-base ">
                    <span className="material-symbols-outlined size-6 mr-7 max-sm:mr-2">
                      mode_fan
                    </span>{" "}
                    Climatiseur
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className=" my-14">
            <h3 className="mb-6 text-2xl max-sm:text-xl font-bold text-greyLink font-body flex items-center">
              <PlusCircleIcon className="size-6 max-sm:size-8 mr-2" />
              D'autres annonces :
            </h3> 
            <section
              className="grid max-sm:grid-cols-1 max-md:grid-cols-2 max-xl:grid-cols-3 grid-cols-4 gap-8 justify-items-center"
              
            >
              {others?.map((other) => {
                return (
                  <AddedCards
                    key={other.idann}
                    idann={other.idann}
                    image={other.image1}
                    title={other.titre}
                    ville={other.ville}
                    description={other.description}
                    price={other.prix}
                  />
                );
              })}
            </section>
          </div>
          
        </div>
        
      ) : (
        <div>Is loading</div>
        
      )}

      <Footer />
    </>
  );
}

export default AdDescription;
