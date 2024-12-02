import axios from "axios";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import Footer from "./BodySection/Footer";
import AdCard from "./ads/AdCard";
import MobileNav from "./heroSection/MobileNav";
import Navbar from "./heroSection/Navbar";
import Loading from "../components/Loading";

type Ads = {
  idann: string;
  images: any;
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
const Simple = () => {
  const { ville, budget } = useParams();
  const { data: ads, isLoading } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:3000/api/v1/basiquee/recherche?ville=${ville}&prix=${budget}`
      );
      console.log(data.listing);
      return data.listing as Ads[];
    },
    queryKey: ["ads"],
  });
  if (isLoading) {
    <Loading />;
  }
  return (
    <div>
      <Navbar />
      <MobileNav />
      <div className="mt-8 mb-7 mx-14 max-sm:mx-6 text-xl font-semibold">
        <span className="font-bold title relative text-2xl max-sm:mb-3">
          {ads?.length} Annonces
        </span>{" "}
        trouvées à {ville}{" "}
      </div>
      {Array.isArray(ads) &&
        ads?.map((ad) => {
          return (
            <AdCard
              key={ad.idann}
              idann={ad.idann}
              images={ad.images}
              titre={ad.titre}
              description={ad.description}
              type={ad.type}
              surface={ad.surface}
              meuble={ad.selected_data?.meuble}
              type_residence={ad.selected_data?.type_residence}
              prix={ad.prix}
              ville={ad.ville}
            />
          );
        })}
      <Footer />
    </div>
  );
};

export default Simple;
