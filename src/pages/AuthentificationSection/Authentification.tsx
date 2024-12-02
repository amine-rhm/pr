/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Footer from "../BodySection/Footer";
import MobileNav from "../heroSection/MobileNav";
import Navbar from "../heroSection/Navbar";
import LogIn from "./LogIn";
import SignIn from "./SignIn";

const Authentification = () => {

  const [isLoged, setIsLoged] = useState(true);


  return (
    <>
      <Navbar />
      <MobileNav />
      <div className="flex h-screen justify-center items-center max-md:h-full">
        <div className=" flex h-[80vh] bg-gray-100 max-sm:m-0 max-sm:w-full max-md:mb-12 w-[80%] rounded-md max-sm:flex-col max-sm:h-screen max-md:h-[140vh] ">
          <div className=" w-[40%] max-sm:w-full max-sm:h-[30%] rounded-md h-full bg-[url('../../public/images/AuthPageImage.jpg')] bg-cover"></div>
          <section className="flex flex-col justify-center max-sm:mt-9 m-auto w-96 max-lg:w-80 my-4">
            {isLoged ? <LogIn /> : <SignIn />}
            <p className="py-6 self-center text-sm">
              {isLoged
                ? "Vous n'avez pas de compte ?  "
                : "Vous avez déja un compte ?  "}
              <span
                className="cursor-pointer text-orange underline "
                onClick={(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) =>
                  setIsLoged(!isLoged)
                }
              >
                {" "}
                {isLoged ? " S'inscrire" : "Se connecter"}
              </span>
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Authentification;
