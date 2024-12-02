import axios from "axios";
import { useQuery } from "react-query";
import useAuthStore from "../../../Zustand/Store";
import Footer from "../BodySection/Footer";
import AdCard from "../ads/AdCard";
import MobileNav from "../heroSection/MobileNav";
import Navbar from "../heroSection/Navbar";
import Loading from "../../components/Loading";
type favs = {
  idn: string;
  images: string[];
  titre: string;
  ville: string;
  description: string;
  surface: number;
  type: string;
  selected_data?:
    | {
        meuble?: number;
        type_residence?: string;
      }
    | undefined;
  prix: number;
};
const Favories = () => {
  const token = useAuthStore((state)=>(state.token))
  const { data: favs, isLoading } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:3000/api/v1/favoris`,
      {
        headers: {
          "x-access-token": `Bearer ${token}`,
        },
      }
      );
      console.log(data.favoris);
      return data.favoris as favs[]; // Assuming `data` is an array of favorites
    },
    queryKey: ["favs"],
  });

  if (isLoading) {
    <Loading/>
  }

  return (
    <div>
      <Navbar />
      <MobileNav />
      <div className="mt-8 mx-14 text-2xl font-semibold relative title w-fit">
        Vos favoris
      </div>
      {Array.isArray(favs) &&
        favs?.map((fav) => {
          return (
            <AdCard
              key={fav.idn}
              idann={fav.idn}
              images={fav.images}
              titre={fav.titre}
              description={fav.description}
              type={fav.type}
              surface={fav.surface}
              meuble={fav.selected_data?.meuble}
              type_residence={fav.selected_data?.type_residence}
              prix={fav.prix}
              ville={fav.ville}
            />
          );
        })}
      <Footer />
    </div>
  );
};

export default Favories;
