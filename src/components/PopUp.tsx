import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useEffect } from "react";
import { X } from "react-feather";

const Modal = ({ open, onClose,nom, prenom, email,num }: any) => {
    useEffect(() => {
        // Add or remove class to disable scrolling when modal opens or closes
        if (open) {
          document.body.classList.add('overflow-hidden');
        } else {
          document.body.classList.remove('overflow-hidden');
        }
        // Cleanup function to remove class when component unmounts
        return () => {
          document.body.classList.remove('overflow-hidden');
        };
      }, [open]);
  if (!open) return null;
  return (
    
      <div className="w-[100vw] h-[100vh] fixed top-0 z-40 backdrop-blur  bg-white bg-opacity-60" style={{ backdropFilter: 'blur(3px)' }}>
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="modalContainer"
          >
            <div className="">
              <X className="closeBtn cursor-pointer" onClick={onClose} />
    
              <div className="p-5">
                <div className="flex items-center mb-5">
                  <UserCircleIcon className="size-8 mr-2" />
                  <h3>Les informations du propriétaire :</h3>
                </div>
                <div className="space-y-5">
                    <p>Nom: {nom} </p>
                    <p>Prenom: {prenom}</p>
                    <p>Email: {email}</p>
                    <p>Numéro de téléphone : {num}</p>
                </div>
              </div>
            </div>
          </div>
      </div>
    
  );
};

export default Modal;
