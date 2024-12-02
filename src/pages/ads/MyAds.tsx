import axios from "axios";
import { useQuery } from "react-query";
import useAuthStore from "../../../Zustand/Store";
import Footer from "../BodySection/Footer";
import AdCard from "../ads/AdCard";
import MobileNav from "../heroSection/MobileNav";
import Navbar from "../heroSection/Navbar";
import Loading from "../../components/Loading";
type myAds = {
  idann: string;
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
  const token = useAuthStore.getState().token;
  const { data: mines, isLoading } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:3000/api/v1/info/my/annonce`,
        {
          headers: {
            "x-access-token": `Bearer ${token}`,
          },
        }
      );
      console.log(data);
      return data as myAds[]; // Assuming `data` is an array of mineorites
    },
    queryKey: ["mine"],
  });

  if (isLoading) {
    <Loading />;
  }

  return (
    <div>
      <Navbar />
      <MobileNav />
      <div className="mt-8 mx-14 text-xl font-semibold">
        <span className="font-bold title relative text-2xl">Mes annonces</span>{" "}
      </div>
      {Array.isArray(mines) &&
        mines?.map((mine) => {
          return (
            <AdCard
              key={mine.idann}
              idann={mine.idann}
              images={mine.images}
              titre={mine.titre}
              description={mine.description}
              type={mine.type}
              surface={mine.surface}
              meuble={mine.selected_data?.meuble}
              type_residence={mine.selected_data?.type_residence}
              prix={mine.prix}
              ville={mine.ville}
            />
          );
        })}
      <Footer />
    </div>
  );
};

export default Favories;
