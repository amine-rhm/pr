import { UserCircleIcon, UserIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import useAuthStore, { useUserInfo } from "../../Zustand/Store";
import { Link, useNavigate } from "react-router-dom";

const DropDown = () => {
  const [down, setDown] = useState(false);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const Role = useAuthStore((state) => state.Role);
  const LogOut = () => {
    logout();
    navigate("/");
  };

  const userInfos = useUserInfo();
  const { nom, prenom, email } = userInfos;
  return (
    <div>
      <div className="flex items-center relative md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
        <div
          className="flex flex-col text-sm cursor-pointer  text-greyLink"
          data-dropdown-placement="bottom"
          onClick={(e) => setDown(!down)}
        >
          <UserCircleIcon className="h-8 lg:hidden " />
          <UserIcon className="h-6 max-lg:h-5 max-lg:hidden" />
          {Role === "admin" ? (
            <span className="max-lg:hidden">Admin</span>
          ) : (
            <span className="max-lg:hidden">Mon profil</span>
          )}
        </div>

        <div
          className={`z-50 ${down ? "" : "hidden"} my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 absolute top-[87%] left-[-100px] border-solid border-grey`}
        >
          <div className="px-4 pt-2 pb-1 border-solid border-5 border-x-0 border-t-0 border-grey">
            <span className="block text-sm text-gray-900 dark:text-white">
              {nom} {prenom}
            </span>
            <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">
              {email}
            </span>
          </div>
          <ul className="py-1 list-none " aria-labelledby="user-menu-button">
            {Role === "client" && <Link className="no-underline text-greytext" to={"/Mes-annonces"}>
              <li className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white no-underline cursor-pointer">
                Mes annonces
              </li>
            </Link>}
            <Link className="no-underline text-greytext" to={"/Paramètres"}>
              <li className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white no-underline cursor-pointer">
                Paramètres
              </li>
            </Link>
            <li
              onClick={(e) => LogOut()}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white no-underline cursor-pointer"
            >
              Déconnexion
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DropDown;
