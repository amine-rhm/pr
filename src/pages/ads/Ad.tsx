
import axios from "axios";
import { useQuery } from "react-query";
import MobileNav from "../heroSection/MobileNav";
import Navbar from "../heroSection/Navbar";
import AdCard from "./AdCard";

import ScrollToTop from "../../components/ScrollToTop";
import Footer from "../BodySection/Footer";
import Loading from "../../components/Loading";

type Ads = {
  idann: string;
  images: any;
  titre: string;
  ville: string;
  description: string;
  surface: number;
  type: string;
  selected_data?: {
    meuble?: number;
    type_residence?: string;
  };
  prix: number;
};

const Ad = () => {
  const { data: ads, isLoading } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(
        "http://localhost:3000/api/v1/info/pr/annonce"
      );
      console.log(data);
      return data as Ads[];
    },
    queryKey: ["ads"],
  });

  if (isLoading) {
    <Loading/>
  }
  return (
    <div>
      <Navbar />
      <MobileNav />
      <ScrollToTop />
      <div className="mt-8 mx-14 max-md:mx-8 text-xl font-semibold">
        <span className="font-bold title relative text-2xl">
          {ads?.length} Annonces
        </span>{" "}
        trouvées{" "}
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

export default Ad;
