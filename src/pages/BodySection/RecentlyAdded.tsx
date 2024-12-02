import { ArrowLongRightIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import AddedCards from "../../components/AddedCard";
import Loading from "../../components/Loading";

type Cards = {
  idann : string,
  image1: string,
    titre: string,
    ville: string,
    description: string,
    prix: number
};

const RecentlyAdded = () => {
   
  const { data: cards, isLoading } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(
        "http://localhost:3000/api/v1/recemment/annonces"
      );
      return data as Cards[];
    },
    queryKey: ["cards"],
  });

  if (isLoading) {
    <Loading/>
  }
  return (
    <div className=" max-md:px-4 md:px-10 my-14">
      <h2 className="mb-12 relative w-fit title">Ajoutées récemment</h2>
      <section className="grid max-sm:grid-cols-1 max-md:grid-cols-2 max-xl:grid-cols-3 grid-cols-4 sm:gap-8 justify-items-center">
        {cards?.map((card) => {
          return (
            <AddedCards
              key={card.idann}
              idann={card.idann}
              image={card.image1}
              title={card.titre}
              ville={card.ville}
              description={card.description}
              price={card.prix}
            />
          );
        })}
      
      </section>
      <Link to={"/Annonces"}>
        <p className="underline flex items-center float-end text-blue mt-6 mr-3">Voir plus <ArrowLongRightIcon className="ml-1 size-5"/></p>
        </Link>
    </div>
  );
};

export default RecentlyAdded;
