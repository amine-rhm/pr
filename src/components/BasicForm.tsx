/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import data from "../data/Data";

type props = {
  ChangeState: (prop: boolean) => void;
};
type FormFields = {
  ville: string;
  budget: number;
};
const validCities = () => {
  const arr: string[] = [];
  data.map((city) => {
    arr.push(city.nom);
  });
  return arr;
};

const schema = z
  .object({
    ville: z.string().refine((value) => {
      const cities = validCities(); // Your list of cities
      return cities.includes(value);
    }),
    budget: z.coerce.number().nullable(),
  })
  .required();

const BasicForm = ({ ChangeState }: props) => {

  const [value, setValue] = useState<string>("");
  const [budget, setBudget] = useState("0");
  const [focus, setFocus] = useState<boolean>(false);
  const [simple, setSimple] = useState<boolean>(false);
  const myref = useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    trigger,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const handler = (e: MouseEvent) => {
    if (focus && !myref.current?.contains(e.target as Node)) {
      setFocus(false);
    }
  };

  window.addEventListener("mousedown", handler);
  const navigate = useNavigate();

  const processForm: SubmitHandler<FormFields> = async (data) => {
    // Trigger validation before form submission

    const isValid = await trigger();

    // If form data is valid, proceed with form submission
    if (isValid) {
      navigate(`/Villes/${value}/${budget}`);

      reset();
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className=" flex flex-col bg-white p-8 mt-6 w-[600px] max-sm:w-[85vw] max-sm:h-[250px] h-[200px] rounded-lg	">
      <form onSubmit={handleSubmit(processForm)}>
        <section className="flex justify-between max-md:flex-wrap max-md:gap-4 mb-6">
          <div className="relative w-[350px] max-md:w-[350px] " ref={myref}>
            <input
              {...register("ville")}
              className="text-base input w-full max-sm:w-[100%] "
              type="text"
              placeholder="Recherchez une ville"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValue(e.currentTarget.value)
              }
              onClick={() => setFocus((focus) => !focus)}
              value={value}
            />
            {errors.ville && (
              <p className="text-gray-400 text-sm pt-1">
                {"Veuillez choisir une ville parmi celles proposées"}
              </p>
            )}
            {focus && (
              <div className=" absolute z-10 top-[90%] w-[100%]" role="listbox">
                {data
                  .filter((city) => {
                    return value && city.nom.toLowerCase().startsWith(value);
                  })
                  .slice(0, 5)
                  .map((city) => (
                    <div
                      className=" cursor-pointer hover:bg-gray-200 input rounded-none first-of-type:rounded-t-md last-of-type:rounded-b-md "
                      key={city.id}
                      onClick={(value) => {setValue(city.nom); console.log(value)}}
                    >
                      {city.nom}
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="relative max-sm:w-full ">
            <input
              {...register("budget")}
              className="input w-[150px] max-sm:w-full pr-8 text-sm"
              type="tel"
              placeholder="Budget Max"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setBudget(e.currentTarget.value)
              }
            />
            <span className="absolute right-3 top-3 text-xs text-gray-600 font-medium">
              DA
            </span>
          </div>
          {errors.budget && (
            <p className="text-gray-400 text-sm">{errors.budget.message}</p>
          )}
        </section>
        <a
          className="float-end text-greyLink text-sm max-sm:text-xs underline cursor-pointer font-body"
          onClick={() => ChangeState(!simple)}
        >
          {" "}
          Recherche avancée v{" "}
        </a>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn w-fit mt-3 px-10 max-sm:px-6  py-3 border-none  bg-blue active:bg-blueActive text-white font-body"
        >
          {isSubmitting ? "Attendez... " : "Rechercher"}
        </button>
      </form>
    </div>
  );
};

export default BasicForm;
