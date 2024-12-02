import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useEffect } from "react";
import { X } from "react-feather";
import { Link } from "react-router-dom";

const ModalCongrats = ({ open, onClose }: any) => {
  useEffect(() => {
    // Add or remove class to disable scrolling when modal opens or closes
    if (open) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [open]);
  if (!open) return null;
  return (
    <div
      className="w-[100vw] h-[100vh] absolute top-0 z-40 backdrop-blur  bg-white bg-opacity-60"
      style={{ backdropFilter: "blur(3px)" }}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="modalContainer"
      >
        <div className="">
        <Link to={"/"}>
          <X className="closeBtn cursor-pointer" />
          </Link>

          <div className="p-5">
            <div className="flex items-center mb-5">
              <CheckCircleIcon className="size-8 mr-2" />
              <h3>Annonce Déposée</h3>
            </div>
            <p>
              Votre annonce a été soumise avec succès ! Merci de votre
              contribution.
            </p>
            <Link to={"/"}>
              <button className="btn mt-8">Retour à la Homepage</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalCongrats;
