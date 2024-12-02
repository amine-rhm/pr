import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import {
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import useAuthStore from "../../../Zustand/Store";
type dataProps = {
  nom: string;
  prenom: string;
  num: string;
  email: string;
  password: string;
};

const schema = z.object({
  nom: z.string().min(3),
  prenom: z.string().min(3),
  num: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});
type FormFields = z.infer<typeof schema>;
interface ErrorResponse {
  error: string;
}
const SignIn = () => {
  const [data, setData] = useState({
    nom: "",
    prenom: "",
    email: "",
    num: "",
    password: "",
  });
  const [ishidden, setIsHidden] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormFields> = async (data: dataProps) => {
    try {
      console.log(data);
      const response = await axios.post(
        "http://localhost:3000/api/v1/register",
        data
      );

      const token = response.data.token;
      if (response.status === 200) {
        Login(data);
      }

      navigate("/"); // You can handle the response here if needed
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const Login = async (data: dataProps) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/login",
        {
          email: data.email,
          password: data.password,
        },
        { withCredentials: true }
      );
      console.log("atay token", response.data.token);
      localStorage.setItem("token", JSON.stringify(response.data.token));
      console.log(response.data.status);
      localStorage.setItem("Role", response.data.status);
      useAuthStore.getState().setRole(response.data.status);
      if (response.status === 200) {
        await verifyApi(response.data.token);
      }
      console.log(useAuthStore.getState().Role);
      console.log(useAuthStore.getState().isAuthenticated);
      setTimeout(() => {
        useAuthStore.getState().logout();
        navigate("/");
        window.location.reload();
        alert("Votre session est expirée, Veuillez vous reconnecter");
      }, 3600000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response) {
          const responseData = axiosError.response.data;
          alert(responseData.error); // Output: Actual error message from server
        }
      } else {
        // Handle other types of errors if necessary
        alert(error);
      }
    }
  };

  const verifyApi = async (token: string) => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/verif", {
        headers: {
          "x-access-token": `Bearer ${token}`,
        },
      });

      useAuthStore.getState().login(token);
      console.log(useAuthStore.getState().isAuthenticated);
      console.log(response.data);
      const userId = response.data.infos?.userId;
      const nom = response.data.infos?.nom;
      const prenom = response.data.infos?.prenom;
      const email = response.data.infos?.email;
      const num = response.data.infos?.num;
      localStorage.setItem("Id", userId);
      useAuthStore.getState().setId(userId);
      useAuthStore.getState().setUserInfo(nom, prenom, email, num);
      console.log(useAuthStore.getState().userId);

      navigate("/");
    } catch (error) {
      alert(error);
      throw error;
    }
  };
  return (
    <div className="flex flex-col max-sm:gap-6 gap-4 mx-4">
      <h1 className="font-title text-3xl mt-5 ">Bienvenue </h1>
      <p>Nous sommes heureux de vous accueillir parmi nous</p>
      <div>
        <form
          className="flex flex-col gap-3 "
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex justify-between">
            <div className="p-0 m-0 relative w-[50%]">
              <input
                {...register("nom")}
                type="text"
                className="input w-full bg-white"
                placeholder="Nom  "
                onChange={(e) => setData({ ...data, nom: e.target.value })}
              />

              {errors.nom && (
                <p className="text-gray-400 text-xs">{"Inserez votre nom"}</p>
              )}
            </div>
            <div className="p-0 m-0 relative w-[45%]">
              <input
                {...register("prenom")}
                type="text"
                className="input w-full bg-white"
                placeholder="Prenom"
                onChange={(e) => setData({ ...data, prenom: e.target.value })}
              />

              {errors.prenom && (
                <p className="text-gray-400 text-xs">
                  {"Inserez votre prenom"}
                </p>
              )}
            </div>
          </div>
          <div className="p-0 m-0 relative">
            <input
              {...register("email")}
              type="text"
              className="input w-full bg-white pl-9"
              placeholder="Email"
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
            <EnvelopeIcon className="absolute h-4 w-4 top-3 left-3" />
            {errors.email && (
              <p className="text-gray-400 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div className="p-0 m-0 relative ">
            <input
              {...register("num")}
              type="text"
              className="input w-full bg-white pl-9"
              placeholder="Phone"
              onChange={(e) => setData({ ...data, num: e.target.value })}
            />
            <PhoneIcon className="size-4 absolute left-3 top-3" />
            {errors.num && (
              <p className="text-gray-400 text-sm">{errors.num.message}</p>
            )}
          </div>
          <div className="p-0 m-0 relative">
            <input
              {...register("password")}
              className="input w-full bg-white pl-9 "
              type={!ishidden ? "password" : "text"}
              placeholder="Password"
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />

            <LockClosedIcon className=" absolute h-4 w-4 top-3 left-3" />
            <span
              className="absolute h-4 w-4 top-3 right-5 cursor-pointer"
              onClick={(e) => setIsHidden(!ishidden)}
            >
              {ishidden ? (
                <EyeIcon className="size-4" />
              ) : (
                <EyeSlashIcon className="size-4" />
              )}
            </span>
            {errors.password && (
              <p className="text-gray-400 text-sm ">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            disabled={isSubmitting}
            className="btn text-base bg-blue active:bg-blueActive text-white"
            type="submit"
          >
            {isSubmitting ? "Loading..." : "S'inscrire"}
          </button>
          {errors.root && <p className="text-red-500">{errors.root.message}</p>}
        </form>
      </div>
    </div>
  );
};

export default SignIn;
