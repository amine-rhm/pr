import {
  EnvelopeIcon,
  EyeSlashIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError, isAxiosError } from "axios";
import { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import useAuthStore from "../../../Zustand/Store";
import { Eye } from "react-feather";
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type dataProps = {
  email: string;
  password: string;
};
type FormFields = z.infer<typeof schema>;
interface ErrorResponse {
  error: string;
}
const LogIn = () => {
  const [email, setEmail] = useState("");
  const [ishidden, setIsHidden] = useState(false);
  const [password, setPassword] = useState("");
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();
 
  const ref = useRef<HTMLInputElement>(null);
  const managePsw = () => {
    setIsHidden(!ishidden);
    setTimeout(() => {
      if (ref.current) {
        ref.current.focus();
      }
    }, 0);
  };
  const onSubmit: SubmitHandler<FormFields> = async (data: dataProps) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/login",
        {
          email: email,
          password: password,
        },
        { withCredentials: true }
      );
      console.log(response);
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

  return (
    <div className="flex flex-col max-sm:gap-6 gap-4 mx-4">
      <h1 className="font-title text-3xl"> Bienvenue</h1>
      <p>C&apos;est toujours un plaisir de vous revoir</p>

      <div>
        <form
          className="flex flex-col gap-3  "
          onSubmit={handleSubmit(onSubmit)}
        >

          <div className="p-0 m-0 relative">
            <input
              {...register("email")}
              type="text"
              className="input w-full bg-white pl-9"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <EnvelopeIcon className="absolute h-4 w-4 top-3 left-3" />
            {errors.email && (
              <p className="text-gray-400 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div className="p-0 m-0 relative">
            <input
              {...register("password")}
              className="input w-full bg-white pl-9 "
              type={!ishidden ? "password" : "text"}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <LockClosedIcon className=" absolute h-4 w-4 top-3 left-3" />
            <span
            
              className="absolute h-4 w-4 top-3 right-5 cursor-pointer"
             
              onClick={e => setIsHidden(!ishidden)}
            >
              {ishidden ? (
                <Eye className="size-4" />
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
            {isSubmitting ? "Loading..." : "Se connecter"}
          </button>
          {errors.root && <p className="text-red-500">{errors.root.message}</p>}
        </form>
      </div>
    </div>
  );
};

export default LogIn;