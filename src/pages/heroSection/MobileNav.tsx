import { Bars3Icon, HeartIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../../../Zustand/Store";
import DropDown from "../../components/DropDown";

const MobileNav = () => {
  const IsAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [hamburger, setHamburger] = useState<boolean>(false);

  useEffect(() => {
    // Add or remove class to disable scrolling when modal opens or closes
    if (hamburger) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [hamburger]);

  return (
    <div className="bg-white max-lg:px-8 px-16 h-16 flex items-center justify-between shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] lg:hidden relative ">
      <Link to="/">
        <img
          className=" max-lg:h-7"
          src="../../public/images/LOGO.png"
          alt="LOGO"
          onClick={(e: React.MouseEvent<HTMLImageElement, MouseEvent>) =>
            setHamburger(false)
          }
        />
      </Link>
      <nav className="flex items-center">
        {IsAuthenticated && (
          <div className="flex">
            <Link to="/Favoris" className="no-underline text-greyLink">
              <HeartIcon className="h-8 mr-4" />
            </Link>
            <DropDown />
          </div>
        )}
        <div
          className="cursor-pointer ml-4"
          onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
            setHamburger(!hamburger)
          }
        >
          {hamburger ? (
            <XCircleIcon className="h-9 text-greyLink" />
          ) : (
            <Bars3Icon className="h-9 text-greyLink" />
          )}
        </div>

        {hamburger && (
          <>
            <section
              className=" z-20 fixed left-0 top-[60px] w-full h-screen bg-white pt-14 max-md:pt-2 max-sm:pt-14  "
              onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                setHamburger(!hamburger)
              }
            >
              <ul className="list-none  flex flex-col px-12 ">
                <Link to={"/Annonces"} className="no-underline text-greyLink py-5 active:bg-greyActive">
                  {" "}
                  <li>Annonces</li>
                </Link>
                <Link to={"/Abonnements"} className="no-underline  text-greyLink border-solid border-x-0 border-grey  py-5 active:bg-greyActive">
                  {" "}
                  <li>Abonnements</li>
                </Link>
                <Link to={"/Contactez-nous"} className="no-underline  text-greyLink  py-5 active:bg-greyActive">
                  {" "}
                  <li>Contact</li> 
                </Link>
                
              </ul>

              <div className="mt-2 px-12 ">
                {!IsAuthenticated && (
                  <Link to="/Auth">
                    <button className="max-sm:text-sm bg-white  active:bg-orangeActive border-orange border-solid mr-4 btn ">
                      Se connecter
                    </button>
                  </Link>
                )}
                <Link to="/Deposerannonce">
                  <button className=" max-sm:text-sm max-sm:mt-4 text-white bg-orange  active:bg-orangeActive border-orange border-solid btn">
                    Deposer une annonce
                  </button>
                </Link>
              </div>
            </section>
          </>
        )}
      </nav>
    </div>
  );
};

export default MobileNav;
