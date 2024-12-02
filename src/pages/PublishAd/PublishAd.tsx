import { useRef, useState } from "react";
import MobileNav from "../heroSection/MobileNav";
import Navbar from "../heroSection/Navbar";
// import PersonalInformations from "../../components/PersonalInformations";
// import AdInformations from "../../components/AdInformations";
import {
  ClipboardDocumentListIcon,
  UserIcon,
  XCircleIcon,
} from "@heroicons/react/16/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import useAuthStore from "../../../Zustand/Store";
import ModalCongrats from "../../components/Congrats";
import data from "../../data/Data";
import wilayas from "../../data/Wilayas";
import Footer from "../BodySection/Footer";

const phoneRegex = new RegExp(/^([0][567])/);
const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const ACCEPTED_IMAGE_TYPES = ["jpeg", "jpg", "png", "webp"];

const schema = z.object({
  nom: z.string().min(2),
  prenom: z.string().min(2),
  email: z.string().email(),
  numTel: z
    .string()
    .regex(phoneRegex, "Numéro de téléphone invalide !")
    .length(10),
  type: z.string().min(1),
  type_residence: z.string().min(0).nullable().optional(),
  type_appartement: z.string().min(0).nullable().optional(),
  etage: z.string().min(0).nullable().optional(),
  etage_maison: z.string().min(0).nullable().optional(),
  etage_villa: z.string().min(0).nullable().optional(),
  categorie: z.string().min(0).nullable().optional(),
  capacite: z.string().min(0).nullable().optional(),
  taille: z.string().min(0).nullable().optional(),
  puissance: z.string().min(0).nullable().optional(),
  materiel: z.string().min(0).nullable().optional(),
  longueur: z.string().min(0).nullable().optional(),
  largeur: z.string().min(0).nullable().optional(),
  surface: z.coerce
    .number({
      required_error: "vous devez entrer une surface",
    })
    .gt(9, "Veuillez entrer une surface superieur à 9m2"),
  prix: z.coerce
    .number({ required_error: "vous devez inscrire le prix de votre bien" })
    .gt(7000, "Veuillez inscrire un prix superieur à 7000da"),
  description: z.string().min(50),
  titre: z.string().min(1),
  adresse: z.string().min(1, "vous devez ajouter l'adresse du bien"),
  meuble: z.enum(["true", "false"], {
    required_error: 'veuillez choisir entre "oui" ou "non"',
  }),
  wifi: z.boolean().optional(),
  Electroménager: z.boolean().optional(),
  Parking: z.boolean().optional(),
  Ascenceur: z.boolean().optional(),
  Espace_Sup: z.boolean().optional(),
  Camera: z.boolean().optional(),
  Citerne: z.boolean().optional(),
  Garage: z.boolean().optional(),
  Climatiseur: z.boolean().optional(),
  wilaya: z.string().min(1, "vous devez choisir une wilaya"),
  ville: z.string().min(1, "vous devez choisir une ville"),
});

type FormFields = z.infer<typeof schema>;

const PublishAd = () => {
  const [openModal, setOpenModal] = useState(true);
  const [steps, setSteps] = useState<string>("1");
  const [commune, setCommune] = useState<string>("");
  const [wil, setWil] = useState<string>("");
  let [isOpen, setIsOpen] = useState(false);
  let [isOn, setIsOn] = useState(false);
  const [selectedOption, setSelectedOption] = useState("DEFAULT");
  const [selectedType, setSelectedType] = useState("DEFAULT");

  const {
    register,
    handleSubmit,
    trigger,
    reset,

    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const myRef = useRef<HTMLDivElement>(null);
  const myRefwil = useRef<HTMLDivElement>(null);

  const handler = (e: MouseEvent) => {
    if (isOpen && !myRef.current?.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };
  const handlerwil = (e: MouseEvent) => {
    if (isOn && !myRefwil.current?.contains(e.target as Node)) {
      setIsOn(false);
    }
  };

  window.addEventListener("mousedown", handler);
  window.addEventListener("mousedown", handlerwil);

  const navigate = useNavigate();
  const token = useAuthStore.getState().token;
  const [images, setImages] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);

      if (filesArray.length + images.length > 5) {
        alert("You can only upload up to 5 images.");
        return;
      }

      setImages((prevImages) => [...prevImages, ...filesArray]);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const newAd = async (data: any, token: string | null) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data)); // Append the serialized form data

    images.forEach((image) => {
      formData.append(`file`, image); // Append each image file
    });

    // Log the FormData content
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/new/annonce",
        formData,
        {
          headers: {
            "x-access-token": `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setSteps("3");
      }
      // You can handle the response here if needed
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const onSubmit: SubmitHandler<FormFields> = (data) => {
    console.log(data);
    newAd(data, token);
    reset();
    setImages([]);
  };
  const next = async () => {
    // ... your validation logic
    const isPage1Valid = await trigger(["nom", "prenom", "email", "numTel"]);
    if (isPage1Valid) {
      setSteps("2");
    }

    if (steps === "2") {
      //   // ... your validation logic
      const isPage2Valid = await trigger([
        "type",
        "type_residence",
        "type_appartement",
        "categorie",
        "etage",
        "etage_maison",
        "etage_villa",
        "capacite",
        "taille",
        "puissance",
        "materiel",
        "longueur",
        "largeur",
        "surface",
        "prix",
        "description",
        "titre",
        "adresse",
        "meuble",
        "wifi",
        "Electroménager",
        "Parking",
        "Ascenceur",
        "Espace_Sup",
        "Camera",
        "Citerne",
        "Garage",
        "Climatiseur",
        "wilaya",
        "ville",
        // "images"
      ]);

      if (!isPage2Valid) {
        console.log("Validation errors on second page:", errors);
        return;
      }

      console.log("submmmmi");

      // Ensure you await the promise returned by handleSubmit
      await handleSubmit(onSubmit)();

      console.log("submjksdbjkfdbjkfmmmi");
    }
  };
  return (
    <>
      {steps === "3" && (
        <ModalCongrats open={openModal} onClose={() => setOpenModal(false)} />
      )}
      <div>
        <Navbar />
        <MobileNav />

        <div className="px-24 max-lg:px-4 my-10">
          <h2>Publier votre annonce immobilière</h2>
          <div className="flex max-lg:flex-col my-5 ">
            <div className="bg-grey max-md:px-4 max-lg:px-8 max-md:py-2 px-10 ">
              <img
                src="../../../public/images/LOGO.png"
                alt="logo"
                className="h-10  max-md:h-8 2xl:mb-12 my-7"
              />

              <h4>{steps == "1" ? "Etape 1" : "Etape 2"}</h4>
              <p className="text-greytext mt-3 lg:w-56 max-md:mb-6 md:mb-7 mb-12">
                {steps == "1"
                  ? "Saisissez vos informations personnelles pour aider les clients à vous contacter."
                  : "Saisissez les informations de votre bien pour viser le publique concerné "}
              </p>
              <div className="lg:space-y-12 max-lg:flex max-md:mb-3 md:mb-7 ">
                <div
                  className={`flex items-center w-44 text-sm ${steps == "1" ? " text-black" : " text-greytext"} `}
                >
                  <p className="max-lg:hidden">
                    Les informations du propriétaire
                  </p>
                  <div
                    className={`h-10 w-10 flex items-center justify-center border-none ${steps == "1" ? "bg-blue  text-white" : " bg-greysec text-black"} border-solid rounded-full p-5 link relative `}
                  >
                    <span> 1 </span>
                  </div>
                </div>
                <div
                  className={`flex items-center w-44 text-sm ${steps == "2" ? " text-black" : " text-greytext"} `}
                >
                  <p className="max-lg:hidden">Les informations sur le bien</p>
                  <div
                    className={`h-10 w-10 flex items-center justify-center border-none ${steps == "2" ? "bg-blue  text-white" : " bg-greysec text-black"} rounded-full p-5  `}
                  >
                    <span> 2 </span>
                  </div>
                </div>
              </div>
            </div>
            <section className="px-8 max-md:px-4 max-lg:px-8 py-12 max-md:py-7 md:pt-3  bg-greyTwo space-y-3">
              <form
                className=" w-[50vw] max-lg:w-full m-auto flex flex-col pt-6"
                action=""
                onSubmit={handleSubmit(onSubmit)}
              >
                {steps === "1" && (
                  <div>
                    <UserIcon className="h-10 w-fit border-grey bg-greyLink border-solid rounded-full p-1 text-white" />
                    <h3>Vos informations personnelles.</h3>
                    <p className="text-greytext text-sm">
                      Champs obligatoires *
                    </p>

                    <div className="grid grid-cols-2 max-sm:grid-cols-1 grid-rows-2 gap-6 mt-6">
                      <div>
                        <input
                          {...register("nom")}
                          type="text"
                          className="inputpub w-full"
                          placeholder="Nom *"
                        />
                        {errors.nom && (
                          <p className="text-gray-400 text-sm">
                            {"Le nom doit au moin contenir 2 caractéres"}
                          </p>
                        )}
                      </div>
                      <div>
                        <input
                          {...register("prenom")}
                          type="text"
                          className="inputpub w-full"
                          placeholder="Prenom *"
                        />
                        {errors.prenom && (
                          <p className="text-gray-400 text-sm">
                            {"Le prenom doit au moin contenir 2 caractéres"}
                          </p>
                        )}
                      </div>
                      <div>
                        <input
                          {...register("email")}
                          type="email"
                          className="inputpub w-full"
                          placeholder="Email *"
                        />
                        {errors.email && (
                          <p className="text-gray-400 text-sm">
                            {"Email invalide !"}
                          </p>
                        )}
                      </div>
                      <div>
                        <input
                          {...register("numTel")}
                          type="tel"
                          className="inputpub w-full"
                          placeholder="Numéro de téléphone *"
                        />
                        {errors.numTel && (
                          <p className="text-gray-400 text-sm">
                            {errors.numTel.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {steps === "2" && (
                  <div>
                    <ClipboardDocumentListIcon className="h-10 w-fit border-grey bg-greyLink border-solid rounded-full p-1 text-white" />
                    <h3>Les informations de votre bien.</h3>
                    <p className="text-greytext text-sm">
                      Champs obligatoires *
                    </p>
                    <div className=" w-[50vw] max-lg:w-[80vw]  flex flex-col pt-6  space-y-7">
                      <div className=" flex max-sm:flex-col max-sm:space-y-6 justify-between items-start">
                        <select
                          defaultValue={"DEFAULT"}
                          className="input w-full"
                          {...register("type")}
                          onChange={(e) =>
                            setSelectedOption(e.currentTarget.value)
                          }
                        >
                          <option value="DEFAULT" disabled>
                            Type du bien *
                          </option>
                          <option>Residentiel</option>
                          <option>Commercial</option>
                          <option>Terrain</option>
                          <option>Industriel</option>
                        </select>
                      </div>
                      {selectedOption === "Industriel" && (
                        <div className="flex flex-col gap-7">
                          <div className="flex justify-between">
                            <input
                              {...register("capacite")}
                              required
                              type="number"
                              className="input w-[30%] text-base"
                              placeholder="Capacité"
                            />
                            <input
                              {...register("taille")}
                              required
                              type="number"
                              className="input w-[30%] text-base"
                              placeholder="Taille"
                            />
                            <input
                              {...register("puissance")}
                              required
                              type="number"
                              className="input w-[30%] text-base"
                              placeholder="Puissance"
                            />
                          </div>
                          <input
                            {...register("materiel")}
                            required
                            type="text"
                            className="input w-full text-base"
                            placeholder="Materiel disponible"
                          />
                        </div>
                      )}
                      {selectedOption === "Terrain" && (
                        <div className="flex justify-between">
                          <select
                            {...register("categorie")}
                            className="input w-[30%]"
                            defaultValue={"DEFAULT"}
                            required
                            onChange={(e) =>
                              setSelectedType(e.currentTarget.value)
                            }
                          >
                            <option value="DEFAULT" disabled>
                              Type de Terrain
                            </option>
                            <option>En difus</option>
                            <option>Agricole</option>
                          </select>
                          <input
                            {...register("longueur")}
                            required
                            type="number"
                            className="input w-[30%] text-base"
                            placeholder="Longueur"
                          />
                          <input
                            {...register("largeur")}
                            required
                            type="number"
                            className="input w-[30%] text-base"
                            placeholder="Largeur"
                          />
                        </div>
                      )}
                      {selectedOption === "Commercial" && (
                        <input
                          {...register("etage")}
                          required
                          type="number"
                          className="input w-full text-base"
                          placeholder="Etage"
                        />
                      )}
                      {selectedOption === "Residentiel" && (
                        <select
                          {...register("type_residence")}
                          required
                          className="input w-full"
                          defaultValue={"DEFAULT"}
                          onChange={(e) =>
                            setSelectedType(e.currentTarget.value)
                          }
                        >
                          <option value="DEFAULT" disabled>
                            Type de Residence
                          </option>
                          <option>Appartement</option>
                          <option>Maison</option>
                          <option>Villa</option>
                          <option>Studio</option>
                        </select>
                      )}
                      {selectedType === "Appartement" &&
                        selectedOption === "Residentiel" && (
                          <select
                            {...register("type_appartement")}
                            required
                            className="input w-full"
                            defaultValue={"DEFAULT"}
                          >
                            <option value="DEFAULT" disabled>
                              Type d'appartement
                            </option>
                            <option>F2</option>
                            <option>F3</option>
                            <option>F4</option>
                            <option>F5</option>
                          </select>
                        )}
                      {selectedType === "Maison" &&
                        selectedOption === "Residentiel" && (
                          <input
                            {...register("etage_maison")}
                            required
                            type="number"
                            className="input w-full text-base"
                            placeholder="Etage"
                          />
                        )}
                      {selectedType === "Villa" &&
                        selectedOption === "Residentiel" && (
                          <input
                            {...register("etage_villa")}
                            required
                            type="number"
                            className="input w-full text-base"
                            placeholder="Etage"
                          />
                        )}
                      <div className="w-full flex items-start justify-between">
                        <div className="relative w-[45%] max-ms:w-[30%] max-sm:w-[45%]">
                          <input
                            {...register("surface")}
                            type="text"
                            className="inputpub w-full"
                            placeholder="Surface *"
                          />

                          <span className="absolute right-3 top-3 text-xs text-gray-600 font-medium">
                            m&sup2;
                          </span>
                          {errors.surface && (
                            <p className="text-gray-400 text-xs">
                              {errors.surface.message}
                            </p>
                          )}
                        </div>
                        <div className="relative w-[45%] max-md:w-[50%] max-sm:w-[50%]">
                          <input
                            {...register("prix")}
                            className="inputpub relative max-md:w-[100%] w-full  pr-8 text-sm"
                            type="text"
                            placeholder="Prix *"
                          />
                          <span className="absolute right-3 top-3 text-xs text-gray-600 font-medium">
                            DA
                          </span>
                          {errors.prix && (
                            <p className="text-gray-400 text-xs">
                              {errors.prix.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex space-x-3 max-sm:flex-col ">
                        <div className=" flex">
                          <label htmlFor="meuble" className="mr-3">
                            Meublé *
                          </label>
                          <div>
                            <input
                              type="radio"
                              value={"true"}
                              {...register("meuble", { required: true })}
                              name="meuble"
                            />
                            <label className="px-2">Oui</label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              value={"false"}
                              {...register("meuble", { required: true })}
                              name="meuble"
                            />
                            <label className="px-2">Non</label>
                          </div>
                        </div>
                        {errors.meuble && (
                          <p className="text-gray-400 text-sm">
                            {"Veuillez choisir entre 'oui' ou 'non'"}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-8 gap-y-4">
                        <div className="flex items-center space-x-2 rounded-2xl bg-grey px-4 py-1 ">
                          <label className="text-base " htmlFor="Wifi">
                            Wifi
                          </label>
                          <input
                            type="checkbox"
                            className="size-3 "
                            id="Wifi"
                            {...register("surface")}
                          />
                        </div>
                        <div className="flex items-center space-x-2 rounded-2xl bg-grey px-4 py-1 ">
                          <label
                            className="text-base "
                            htmlFor="Electroménager"
                          >
                            Electroménager
                          </label>
                          <input
                            type="checkbox"
                            className="size-3 cursor-pointer"
                            id="Electroménager"
                            {...register("Electroménager")}
                          />
                        </div>
                        <div className="flex items-center space-x-2 rounded-2xl bg-grey px-4 py-1 ">
                          <label className="text-base " htmlFor="Parking">
                            Parking
                          </label>
                          <input
                            type="checkbox"
                            className="size-3 cursor-pointer"
                            id="Parking"
                            {...register("Parking")}
                          />
                        </div>
                        <div className="flex items-center space-x-2 rounded-2xl bg-grey px-4 py-1 ">
                          <label htmlFor="Ascenceur" className="text-base ">
                            Ascenceur
                          </label>
                          <input
                            type="checkbox"
                            className="size-3 cursor-pointer"
                            id="Ascenceur"
                            {...register("Ascenceur")}
                          />
                        </div>
                        <div className="flex items-center space-x-2 rounded-2xl bg-grey px-4 py-1 ">
                          <label htmlFor="Ascenceur" className="text-base ">
                            Espace_Sup
                          </label>
                          <input
                            type="checkbox"
                            className="size-3 cursor-pointer"
                            id="Espace_Sup"
                            {...register("Espace_Sup")}
                          />
                        </div>
                        <div className="flex items-center space-x-2 rounded-2xl bg-grey px-4 py-1 ">
                          <label className="text-base " htmlFor="Caméra">
                            Caméra de surveillance
                          </label>
                          <input
                            type="checkbox"
                            className="size-3 cursor-pointer"
                            id="Caméra"
                            {...register("Camera")}
                          />
                        </div>
                        <div className="flex items-center space-x-2 rounded-2xl bg-grey px-4 py-1 ">
                          <label className="text-base " htmlFor="Citerne">
                            Citerne
                          </label>
                          <input
                            type="checkbox"
                            className="size-3 cursor-pointer"
                            id="Citerne"
                            {...register("Citerne")}
                          />
                        </div>
                        <div className="flex items-center space-x-2 rounded-2xl bg-grey px-4 py-1 ">
                          <label className="text-base " htmlFor="Garage">
                            Garage
                          </label>
                          <input
                            type="checkbox"
                            className="size-3 cursor-pointer"
                            id="Garage"
                            {...register("Garage")}
                          />
                        </div>
                        <div className="flex items-center space-x-2 rounded-2xl bg-grey px-4 py-1 ">
                          <label className="text-base " htmlFor="Climatiseur">
                            Climatiseur
                          </label>
                          <input
                            type="checkbox"
                            className="size-3 cursor-pointer"
                            id="Garage"
                            {...register("Climatiseur")}
                          />
                        </div>
                      </div>
                      <div>
                        <textarea
                          {...register("description")}
                          className="inputpub resize-none w-full h-[175px]"
                          placeholder="Description de votre bien *"
                        />
                        {errors.description && (
                          <p className="text-gray-400 text-sm">
                            {
                              "Veuillez ajouter une description pour votre annonce"
                            }
                          </p>
                        )}
                      </div>

                      <div>
                        <input
                          {...register("titre")}
                          className="inputpub w-full"
                          type="text"
                          placeholder="Titre pour votre annonce *"
                        />
                        {errors.titre && (
                          <p className="text-gray-400 text-sm">
                            {"Veuillez ajouter un titre à votre annonce"}
                          </p>
                        )}
                      </div>
                      <div>
                        <input
                          {...register("adresse")}
                          className="inputpub w-full"
                          type="text"
                          placeholder="Adresse *"
                        />
                        {errors.adresse && (
                          <p className="text-gray-400 text-sm">
                            {"Veuillez saisir l'adresse de votre bien"}
                          </p>
                        )}
                      </div>
                      <div className="flex max-xl:flex-col max-xl:space-y-6 justify-between ">
                        <div className="relative" ref={myRefwil}>
                          <input
                            {...register("ville", { required: true })}
                            className="text-base input w-[300px] max-xl:w-[100%] "
                            type="text"
                            placeholder="Ville*"
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => setCommune(e.currentTarget.value)}
                            onClick={() => setIsOn((isOn) => !isOn)}
                            value={commune}
                          />
                          {errors.ville && (
                            <p className="text-gray-400 text-sm">
                              {
                                "Veuillez saisir la ville où se trouve votre bien"
                              }
                            </p>
                          )}
                          {isOn && (
                            <div
                              className=" absolute z-10 top-[85%] w-[300px]"
                              role="listbox"
                            >
                              {data
                                .filter((city) => {
                                  return (
                                    commune &&
                                    city.nom.toLowerCase().startsWith(commune)
                                  );
                                })
                                .slice(0, 8)
                                .map((city) => (
                                  <div
                                    className=" cursor-pointer hover:bg-gray-200 input rounded-none first-of-type:rounded-t-md last-of-type:rounded-b-md "
                                    key={city.id}
                                    onClick={() => setCommune(city.nom)}
                                  >
                                    {city.nom}
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                        <div className="relative" ref={myRef}>
                          <input
                            {...register("wilaya", { required: true })}
                            className="text-base input w-[300px] max-xl:w-[100%] "
                            type="text"
                            placeholder="Wilaya*"
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => setWil(e.currentTarget.value)}
                            onClick={() => setIsOpen((isOpen) => !isOpen)}
                            value={wil}
                          />
                          {errors.ville && (
                            <p className="text-gray-400 text-sm">
                              {
                                "Veuillez saisir la wilaya où se trouve votre bien"
                              }
                            </p>
                          )}
                          {isOpen && (
                            <div
                              className=" absolute z-10 top-[85%] w-[300px]"
                              role="listbox"
                            >
                              {wilayas
                                .filter((wilaya) => {
                                  return (
                                    wil &&
                                    wilaya.nom.toLowerCase().startsWith(wil)
                                  );
                                })
                                .slice(0, 8)
                                .map((wilaya) => (
                                  <div
                                    className=" cursor-pointer hover:bg-gray-200 input rounded-none first-of-type:rounded-t-md last-of-type:rounded-b-md "
                                    key={wilaya.id}
                                    onClick={() => setWil(wilaya.nom)}
                                  >
                                    {wilaya.nom}
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center border-solid border-grey rounded-lg">
                          <label
                            htmlFor="images"
                            className="bg-blue hover:bg-blueActive active:bg-blueActive text-white btn rounded-e-none rounded-s-lg"
                          >
                            {" "}
                            Ajouter des images{" "}
                          </label>
                          <div className="bg-white w-[72%] py-2 px-4 rounded-e-lg">
                            {images.length === 0
                              ? "Aucune image ajoutée"
                              : images.length + " image(s) ajoutées"}
                          </div>
                          <input
                            id="images"
                            name="images"
                            hidden
                            type="file"
                            accept="image/*"
                            className="bg-white py-3"
                            required
                            multiple
                            onChange={handleFileChange}
                            disabled={images.length >= 5}
                          />
                        </div>

                        <p className="text-gray-400 text-sm pt-2">
                          Vous devez insérer au moin 1 image, et au maximum 5 !
                        </p>

                        <div>
                          {images.map((image, index) => (
                            <div
                              key={index}
                              style={{
                                display: "inline-block",
                                margin: "10px",
                                position: "relative",
                              }}
                            >
                              <img
                                src={URL.createObjectURL(image)}
                                alt={`Upload Preview ${index}`}
                                width="100"
                                height="100"
                              />
                              <XCircleIcon
                                onClick={() => handleRemoveImage(index)}
                                className="size-7 absolute top-[-7px] right-[-10px] text-grey cursor-pointer"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="">

                  {steps === "1" && (
                    <button
                      className="btn px-10 py-2 mr-5"
                      onClick={(
                        _e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                      ) => navigate("/")}
                    >
                      Annuler
                    </button>
                  )}
                  {steps === "2" && (
                    <button
                      className="btn px-10 py-2 mr-5"
                      onClick={(
                        _e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                      ) => setSteps("1")}
                    >
                      Retour
                    </button>
                  )}

                  <button
                    className="btn mt-10 self-end px-10 py-2 bg-orange text-white"
                    onClick={next}
                    type="submit"
                  >
                    {steps === "1" ? "Suivant" : "Envoyer"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
        {steps !== "3" && <Footer />}
      </div>
    </>
  );
};

export default PublishAd;
