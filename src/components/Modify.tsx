import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect } from "react";
import { X } from "react-feather";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import useAuthStore from "../../Zustand/Store";
type dataProps = {
  titre: string;
  description: string;
  prix: number;
  surface: number;
  adresse: string;
};
const schema = z.object({
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
});


type ModifyFields = z.infer<typeof schema>;
const Modify = ({
  open,
  onClose,
  idann,
  titre,
  description,
  prix,
  surface,
  adresse,
}: any) => {
  const {
    register,
    handleSubmit,
    trigger,
    reset,
    formState: { errors },
  } = useForm<ModifyFields>({
    resolver: zodResolver(schema),
  });
  const { token } = useAuthStore();
  const navigate = useNavigate();
const onSubmit: SubmitHandler<ModifyFields> = async (data) => {

    try {
      const response = await axios.put(
        `http://localhost:3000/api/v1/modifie/annonce/${idann}`,
        data,
        { 
          headers: {
            'x-access-token': `Bearer ${token}`,
          },
        }
      );
      if(response.status===200){
        alert("Mise à jour réussie")
      }
      navigate("/");
      

    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    // Add or remove class to disable scrolling when modal opens or closes
    if (open) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [open]);
  if (!open) return null;
  

  return (
    <div
      
      className="w-[100vw] h-[330vh] absolute top-0 z-40 backdrop-blur bg-white bg-opacity-60 overflow-hidden "
      style={{ backdropFilter: "blur(3px)  " }}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="modifyContainer w-full px-4"
      >
        <div className="p-5 py-8 ">
          <X className="closeBtn cursor-pointer" onClick={onClose} />

          <div className="flex items-center mb-5">
            <img
              src="../../public/images/SVG/contract_edit_24dp_FILL0_wght400_GRAD0_opsz24.svg"
              className="mr-3"
              alt="MODIFYICON"
            />
            <h3>Modifier les informations de votre annonce : </h3>
          </div>
          <form className="space-y-5 pb-10" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-between">
              <div className=" flex flex-col relative w-[11%]">
                <label htmlFor="prix" className="text-base text-greyLink">
                  {" "}
                  Prix :{" "}
                </label>
                <input
                  {...register("prix")}
                  defaultValue={prix}
                  type="text"
                  className="inputpub w-full "
                />
                <span className="absolute right-3 top-9 text-xs text-gray-600 font-medium">
                  DA
                </span>
                {errors.prix && (
                  <p className="text-gray-400 text-xs">{errors.prix.message}</p>
                )}
              </div>
              <div className=" flex flex-col w-[15%] relative">
                <label htmlFor="surface" className="text-base text-greyLink">
                  {" "}
                  Surface :{" "}
                </label>
                <input
                  {...register("surface")}
                  defaultValue={surface}
                  type="text"
                  className="inputpub w-full"
                />
                <span className="absolute right-3 top-9 text-xs text-gray-600 font-medium">
                  m&sup2;
                </span>
                {errors.surface && (
                  <p className="text-gray-400 text-xs">
                    {errors.surface.message}
                  </p>
                )}
              </div>
              <div className=" flex flex-col w-[40%]">
                <label htmlFor="titre" className="text-base text-greyLink">
                  {" "}
                  Titre :{" "}
                </label>
                <input
                  {...register("titre")}
                  defaultValue={titre}
                  type="text"
                  className="inputpub w-full"
                />
                {errors.titre && (
                  <p className="text-gray-400 text-sm">
                    {"Veuillez ajouter un titre à votre annonce"}
                  </p>
                )}
              </div>
              <div className=" flex flex-col w-[30%]">
                <label htmlFor="adresse" className="text-base text-greyLink">
                  {" "}
                  Adresse :{" "}
                </label>
                <input
                  {...register("adresse")}
                  defaultValue={adresse}
                  type="text"
                  className="inputpub w-full"
                />
                {errors.adresse && (
                  <p className="text-gray-400 text-sm">
                    {"Veuillez saisir l'adresse de votre bien"}
                  </p>
                )}
              </div>
            </div>

            <div className=" flex flex-col">
              <label htmlFor="description" className="text-base text-greyLink">
                {" "}
                Description :{" "}
              </label>
              <textarea
                {...register("description")}
                defaultValue={description}
                className="inputpub w-full resize-none h-[200px]"
              />
              {errors.description && (
                <p className="text-gray-400 text-sm">
                  {"Veuillez ajouter une description pour votre annonce"}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="btn float-end text-base bg-blue text-white "
             
              
            >
              {" "}
              Confirmer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modify;
