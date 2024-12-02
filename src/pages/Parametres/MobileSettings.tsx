import {
    ArrowLeftCircleIcon,
    ArrowLongRightIcon,
    ArrowRightEndOnRectangleIcon,
    UserCircleIcon,
  } from "@heroicons/react/24/outline";
  import { zodResolver } from "@hookform/resolvers/zod";
  import axios from "axios";
  import { useState } from "react";
  import { SubmitHandler, useForm } from "react-hook-form";
  import { useNavigate } from "react-router-dom";
  import { z } from "zod";
  import useAuthStore, { useUserInfo } from "../../../Zustand/Store";
  import Footer from "../BodySection/Footer";
  import MobileNav from "../heroSection/MobileNav";
  import Navbar from "../heroSection/Navbar";
  type dataProps = {
    nom: string;
    prenom: string;
    email: string;
    num: string;
  };
  
  const MobileSettings = () => {
    const navigate = useNavigate();
    const phoneRegex = new RegExp(/^([0][567])/);
    const schema = z.object({
      nom: z.string().min(3),
      prenom: z.string().min(3),
  
      email: z.string().email(),
      num: z
        .string()
        .regex(phoneRegex, "Numéro de téléphone invalide !")
        .length(10),
    });
    type FormFields = z.infer<typeof schema>;
  
    const userInfos = useUserInfo();
    const logout = useAuthStore((state) => state.logout);
    const LogOut = () => {
      logout();
      navigate("/");
    };
  
    const { nom, prenom, email, num } = userInfos;
    const [données, setDonnées] = useState({
      nom: nom,
      prenom: prenom,
      email: email,
      num: num,
    });
    const [step, setStep] = useState("0");
  
    const {
      register,
      handleSubmit,
      setError,
      formState: { errors, isSubmitting },
    } = useForm<FormFields>({
      resolver: zodResolver(schema),
    });
    const { token } = useAuthStore();
    const onSubmitWrapper = (token: string | null) => {
      const onSubmit: SubmitHandler<FormFields> = async (data: dataProps) => {
        console.log(données);
        try {
          const response = await axios.put(
            "http://localhost:3000/api/v1/gere/compte",
            données,
            {
              headers: {
                "x-access-token": `Bearer ${token}`,
              },
            }
          );
          if (response.status === 200) {
            const nom = données.nom;
            const prenom = données.prenom;
            const email = données.email;
            useAuthStore.getState().setUserInfo(nom, prenom, email, num);
            navigate("/");
          }
  
          // Handle response
        } catch (error) {
          console.error("Error:", error);
          // Handle error
        }
      };
      return onSubmit;
    };
  
    const deleteWrapper = () => {
      deleteAcc(token);
      useAuthStore.getState().logout();
    };
  
    const deleteAcc = async (token: any) => {
      try {
        const response = await axios.delete(
          `http://localhost:3000/api/v1/supp/compte`,
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
  
    return (
      <>
        <section className=" m-auto mt-6 mb-16 rounded-md flex flex-col  w-[90%] shadow-[0_3px_10px_rgb(0,0,0,0.2)] sm:hidden">
            
          {step === "0" && <div className={`border-solid border-y-0  border-l-0 border-greyActive w-full bg-greyThree ${step === "0" ? "w-full" : ""}`}>
            <div className="flex items-center py-5 pl-5  border-solid border-x-0  border-t-0 border-greyActive bg-white">
              <UserCircleIcon className="size-10 mr-4" />
              <div className="flex-col" onClick={e => setStep("0")}>
                <h4> Bienvenue,</h4>
                <h4>
                  {" "}
                  {nom} {prenom}
                </h4>
              </div>
            </div>
             <div className="flex flex-col gap-4 py-3 bg-white">
              <div className="flex items-center" onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                      setStep("1")
                    }>
                  <h4
                    
                    className={`cursor-pointer pl-5 py-3 bg-white   `}
                  >
                    Informations personnelles
                  </h4>
                  <ArrowLongRightIcon className="size-6 ml-20"/>
              </div>
  
              <div onClick={(e: React.MouseEvent<HTMLHeadingElement, MouseEvent>) =>
                      setStep("2")
                    } className="flex items-center  bg-white border-solid border-x-0 border-greyActive " >
                  <h4
                    
                    className={`cursor-pointer pl-5 py-6 font-body`}
                  >
                    Supprimer votre compte
                  </h4>
                  <ArrowLongRightIcon className="size-6 ml-24"/>
              </div>
              <div
                className={`cursor-pointer pl-5 py-3 flex bg-white`}
                onClick={(e: React.MouseEvent<HTMLHeadingElement, MouseEvent>) =>
                  setStep("3")
                }
              >
                <h4>Deconnexion</h4>
                <ArrowRightEndOnRectangleIcon className="size-5 ml-2" />
              </div>
            </div>
          </div>}
          {step !== "0" && (
            <div className=" pt-7 w-full  ">
              {step === "1" ? (
                <div className="flex items-center mb-6">
                  <ArrowLeftCircleIcon className="size-7 mx-2" onClick={e => setStep("0")}/>
                  <h2 className=" ml-2 relative w-fit text-base">
                    Modifier vos informations personnelles
                  </h2>
                </div>
              ) : step === "2" ? (
                <div className="flex  items-center mb-6">
                  <ArrowLeftCircleIcon className="size-7 mx-2" onClick={e => setStep("0")}/>
                  <h2 className="  ml-2 relative sm:title w-fit text-lg">
                    Supprimer votre compte
                  </h2>
                </div>
              ) : step === "3" ? (
                <div className="flex items-center mb-6 ">
                  <ArrowLeftCircleIcon className="size-7 mx-2" onClick={e => setStep("0")}/>
                  <h2 className=" ml-2 relative sm:title w-fit text-lg">
                    Se deconnecter
                  </h2>
                </div>
              ) : (
                ""
              )}
              <div className="bg-greyThree">
                {step === "1" && (
                  <form
                    className="flex flex-col gap-3 w-full px-4  py-12 space-y-3 "
                    onSubmit={handleSubmit(onSubmitWrapper(token))}
                  >
                    <div className="flex justify-between">
                      <div className="p-0 m-0 relative w-[50%]">
                        <label className=" text-sm text-greytext">Nom</label>
                        <input
                          {...register("nom")}
                          type="text"
                          className="input w-full  mt-1 bg-white "
                          defaultValue={nom}
                          onChange={(e) =>
                            setDonnées({ ...données, nom: e.target.value })
                          }
                        />
  
                        {errors.nom && (
                          <p className="text-gray-400 text-sm pt-1 px-1">
                            {"Inserez votre nom"}
                          </p>
                        )}
                      </div>
                      <div className="p-0 m-0 relative w-[45%]">
                        <label className=" text-sm text-greytext">Prenom</label>
                        <input
                          {...register("prenom")}
                          type="text"
                          className="input w-full mt-1 bg-white "
                          defaultValue={prenom}
                          onChange={(e) =>
                            setDonnées({ ...données, prenom: e.target.value })
                          }
                        />
  
                        {errors.prenom && (
                          <p className="text-gray-400 text-sm pt-1 px-1">
                            {"Inserez votre prenom"}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex w-full justify-between items-center">
                      <div className="p-0 m-0 relative flex flex-col w-[50%]">
                        <label className=" text-sm text-greytext">Email</label>
                        <input
                          {...register("email")}
                          type="text"
                          className="input w-full mt-1 px-1 bg-white "
                          defaultValue={email}
                          onChange={(e) =>
                            setDonnées({ ...données, email: e.target.value })
                          }
                        />
  
                        {errors.email && (
                          <p className="text-gray-400 text-sm pt-1 px-1">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                      <div className="p-0 m-0 relative flex flex-col w-[45%] ">
                        <label className=" text-sm text-greytext ">
                          Téléphone
                        </label>
                        <input
                          {...register("num")}
                          type="text"
                          className="input w-full mt-1 px-1 bg-white"
                          defaultValue={"0" + num}
                          onChange={(e) =>
                            setDonnées({ ...données, num: e.target.value })
                          }
                        />
  
                        {errors.num && (
                          <p className="text-gray-400 text-sm pt-1 px-1">
                            {errors.num.message}
                          </p>
                        )}
                      </div>
                    </div>
  
                    <div className="self-end">
                      {" "}
                      <button
                        onClick={(e) => {
                          navigate("/");
                        }}
                        className="btn text-sm w-fit bg-white active:bg-greyTwo mr-4 border-solid border-grey "
                        type="submit"
                      >
                        Annuler
                      </button>
                      <button
                        disabled={isSubmitting}
                        className="btn text-sm w-fit bg-blue active:bg-blueActive text-white "
                        type="submit"
                      >
                        Enregistrer
                      </button>
                      {errors.root && (
                        <p className="text-red-500">{errors.root.message}</p>
                      )}
                    </div>
                  </form>
                )}
                {step === "2" && (
                  <div className=" py-12 flex flex-col px-4  ">
                    <h2 className="mb-4">Votre attention !</h2>
                    <p className="text-base ">
                      Nous sommes désolés de vous voir partir. La suppression de
                      votre compte est définitive et vous perdrez toutes vos
                      données. Si vous avez des soucis ou des questions, nous
                      sommes là pour vous aider. Êtes-vous certain de vouloir
                      supprimer votre compte ?
                    </p>
                    <div className="self-end mt-12">
                      {" "}
                      <button
                        onClick={(e) => {
                          navigate("/");
                        }}
                        className="btn text-sm w-fit bg-white active:bg-greyTwo mr-4 border-solid border-grey "
                        type="submit"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={deleteWrapper}
                        className="btn text-sm w-fit bg-red text-white "
                        type="submit"
                      >
                        Supprimer
                      </button>
                      {errors.root && (
                        <p className="text-red-500">{errors.root.message}</p>
                      )}
                    </div>
                  </div>
                )}
                {step === "3" && (
                  <div className="  py-12 flex flex-col px-4  ">
                    <p className="text-base">
                      Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous
                      reconnecter pour accéder à nouveau à votre compte et à vos
                      informations de location.
                    </p>
  
                    <div className="self-end mt-5">
                      {" "}
                      <button
                        onClick={(e) => {
                          navigate("/");
                        }}
                        className="btn text-sm w-fit bg-white active:bg-greyTwo mr-4 border-solid border-grey "
                        type="submit"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={(e) => LogOut()}
                        className="btn text-sm w-fit bg-blue active:bg-blueActive text-white "
                        type="submit"
                      >
                        Se deconnecter
                      </button>
                      {errors.root && (
                        <p className="text-red-500">{errors.root.message}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
        <Footer />
      </>
    );
  };
  export default MobileSettings;
  