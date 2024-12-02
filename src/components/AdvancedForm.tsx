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
type search = {
  ville: string;
  budget: string;
  type: string;
  surface: string;
  meuble: boolean;
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
    surface: z.coerce.number().gte(9).nullable(),
    meuble: z.boolean(),
    type: z.string().min(1),
  })
  .required();
type FormFields = z.infer<typeof schema>;
const AdvancedForm = ({ ChangeState }: props) => {
  const [advanced, setAdvanced] = useState(true);
  const [search, setSearch] = useState<search>({
    ville: "",
    budget: "",
    type: "",
    surface: "",
    meuble: true,
  });
  const [isOn, setIsOn] = useState<boolean>(false);

  const myRefwil = useRef<HTMLDivElement>(null);
  const handlerwil = (e: MouseEvent) => {
    if (isOn && !myRefwil.current?.contains(e.target as Node)) {
      setIsOn(false);
    }
  };
  window.addEventListener("mousedown", handlerwil);
  const navigate = useNavigate();

  const processForm: SubmitHandler<FormFields> = async (data) => {
    // Trigger validation before form submission
    const isValid = await trigger();

    // If form data is valid, proceed with form submission
    if (isValid) {
      console.log(data);
      navigate(
        `/Villes/${search.ville}/${search.budget}/${search.type}/${search.surface}/${search.meuble}`
      );

      reset();
      window.scrollTo(0, 0);
    }
  };
  const {
    register,
    handleSubmit,
    trigger,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema)
    
  });
  return (
    <div className=" flex flex-col bg-white p-8 mt-6 max-lg:w-[85vw] w-[600px] rounded-lg	">
      <form onSubmit={handleSubmit(processForm)}>
        <section className="flex w-[100%] justify-between  flex-wrap max-lg:gap-3 gap-7 mb-6">
          <div
            className="relative w-[350px] max-md:w-[330px] max-lg:w-[420px]"
            ref={myRefwil}
          >
            <input
              {...register("ville")}
              className="text-base input w-full max-md:w-[100%] "
              type="text"
              placeholder="Recherchez une ville"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearch({ ...search, ville: e.currentTarget.value })
              }
              onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                setIsOn(!isOn)
              }
              value={search.ville}
            />
            {errors.ville && (
              <p className="text-gray-400 text-sm pt-1">
                {"Veuillez choisir une ville parmi celles proposées"}
              </p>
            )}

            {isOn && (
              <div className="absolute z-10 top-[85%] w-[100%]">
                {data
                  .filter((city) => {
                    return (
                      search.ville &&
                      city.nom.toLowerCase().startsWith(search.ville)
                    );
                  })
                  .slice(0, 8)
                  .map((city) => (
                    <div
                      className=" cursor-pointer hover:bg-gray-200 input rounded-none first-of-type:rounded-t-md last-of-type:rounded-b-md "
                      key={city.id}
                      onClick={(
                        e: React.MouseEvent<HTMLDivElement, MouseEvent>
                      ) => setSearch({ ...search, ville: city.nom })}
                    >
                      {city.nom}
                    </div>
                  ))}
              </div>
            )}
          </div>
          <div className="relative max-sm:w-[48%] max-md:w-[30%]">
            <input
              {...register("budget")}
              className="input relative max-md:w-[100%] w-[150px]  pr-8 text-sm"
              type="text"
              placeholder="Budget Max"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearch({ ...search, budget: e.currentTarget.value })
              }
            />
            {errors.budget && (
              <p className="text-gray-400 text-sm pt-1">
                {errors.budget.message}
              </p>
            )}
            <span className="absolute right-3 top-3 text-xs text-gray-600 font-medium">
              DA
            </span>
          </div>
          <select
            defaultValue={"Type du bien"}
            className=" max-md:w-[40%] max-sm:w-[45%] w-40 input pr-1"
            {...register("type")}
            onClick={(e: React.MouseEvent<HTMLSelectElement>) =>
              setSearch({ ...search, type: e.currentTarget.value })
            }
          >
            <option value="Type du bien" disabled hidden>
              Type du bien
            </option>
            <option>Residentiel</option>
            <option>Commercial</option>
            <option>Terrain</option>
            <option>Industriel</option>
          </select>
          {errors.type && (
            <p className="text-gray-400 text-sm pt-1">{errors.type.message}</p>
          )}
          <div className="relative max-sm:w-[48%] xl:w-[40%] max-lg:w-[45%] max-md:w-[32%]">
            <input
              {...register("surface")}
              type="text"
              className="input w-[100%]"
              placeholder="Surface"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearch({ ...search, surface: e.currentTarget.value })
              }
            />
            <span className="absolute right-3 top-3 text-xs text-gray-600 font-medium">
              m&sup2;
            </span>
            {errors.surface && (
              <p className="text-gray-400 text-sm pt-1">
                {"La surface minimale est 9m"}
              </p>
            )}
          </div>
          <div className="input flex max-sm:w-[45%] items-center">
          <input
        type="checkbox"
        {...register("meuble")}
        // Set checked based on search.meuble value
        onChange={(e) => setSearch({ ...search, meuble: e.target.checked })}
      />
            <label className="ml-3 text-sm" htmlFor="checkbox">
              {" "}
              meublé
            </label>
          </div>
          {errors.meuble && (
            <p className="text-gray-400 text-sm pt-1">
              {errors.meuble.message}
            </p>
          )}
        </section>
        <a
          className="float-end text-greyLink  text-sm underline cursor-pointer max-sm:text-xs"
          onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) =>
            ChangeState(advanced)
          }
        >
          {" "}
          Recherche simple ^{" "}
        </a>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn w-fit mt-3 px-10 max-sm:px-6  py-3 border-none  bg-blue active:bg-blueActive text-white"
        >
          {isSubmitting ? "Attendez... " : "Rechercher"}
        </button>
      </form>
    </div>
  );
};

export default AdvancedForm;
