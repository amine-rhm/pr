/* eslint-disable no-unused-vars */
import { useState } from "react";
import AdvancedForm from "../../components/AdvancedForm";
import BasicForm from "../../components/BasicForm";
import MobileNav from "./MobileNav";
import Navbar from "./Navbar";

const Header = () => {
  const [ simple ,setSimple ] = useState(true);
  return (
    <div className='bg-[url("../../public/images/HeaderImage.jpg")] h-[97vh] max-xl:h-[100vh] max-lg:h-[130vh] max-md:h-[195vh] bg-cover bg-fixed bg-no-repeat max-sm:h-[98vh]'>
      <Navbar />
      <MobileNav />
      <div className="flex flex-col items-center  max-xl:mt-16">
        <section className="flex flex-col justify-center max-md:mt-5 mt-12 ">
          <h1 className="font-title  md:text-4xl lg:text-5xl font-bold self-center ">
            Heureux de vous accueillir !
          </h1>
          <p className="w-[80%] mt-5 text-center self-center md:text-lg font-medium font-body">
            Avec nos +80 00 annonces immobilières en Algérie, il y a forcément
            le bien qui correspond à votre besoin.
          </p>
        </section>
        <div>
          {simple ? (
            <BasicForm ChangeState={() => setSimple(!simple)} />
          ) : (
            <AdvancedForm ChangeState={() =>setSimple(!simple)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
