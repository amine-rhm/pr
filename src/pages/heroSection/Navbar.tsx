import { HeartIcon, PencilSquareIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import useAuthStore from "../../../Zustand/Store";
import DropDown from "../../components/DropDown";

const Navbar = () => {

  const Role = useAuthStore((state) => state.Role);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Assuming userInfo is an object with a 'name' property


  return (
    <div className="  shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] bg-white max-lg:px-8 px-16 h-16 flex justify-between items-center  max-lg:hidden ">
      <Link to="/">
        <img className=" h-8" src="../../public/images/LOGO.png" alt="LOGO" />
      </Link>

      <ul className="list-none max-lg:hidden flex text-greyLink space-x-20">
        <Link className="no-underline text-greyLink" to={"/Annonces"}>
          <li className="font-body">Annonces</li>
        </Link>
        <Link to={"/Abonnements"} className="no-underline text-greyLink">
          <li className="font-body">Abonnement</li>
        </Link>
        <Link className="no-underline text-greyLink " to={"/Contactez-nous"}>
          <li className="font-body">Contact</li>
        </Link>
      </ul>

      <div >
        {!isAuthenticated ? (
          <div className="flex  ">
            <Link to="/Deposerannonce" className="no-underline">
              <div className="flex flex-col text-greyLink mr-8">
                <PencilSquareIcon className="h-6" />
                <p className="text-sm font-body">Deposer une annonce</p>
              </div>
            </Link>
            <Link to="/Auth" className="no-underline text-greyLink">
            <div className="flex flex-col  text-greyLink ">
            <UserCircleIcon className="h-6" />

              
                {" "}
                <p className="text-sm font-body">Connexion</p>{" "}
              
            </div>
            </Link>
          </div>
        ) : (
          <div className="flex  ">
            <Link to="/Favoris" className="no-underline">
              <div className="flex flex-col text-greyLink mr-8">
                <HeartIcon className="h-6" />
                <p className="text-sm font-body">Favoris</p>
              </div>
            </Link>
            <Link to="/Deposerannonce" className="no-underline">
              <div className="flex flex-col text-greyLink mr-8">
                <PencilSquareIcon className="h-6" />
                <p className="text-sm font-body">Deposer une annonce</p>
              </div>
            </Link>
            
            <DropDown/>

            
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
