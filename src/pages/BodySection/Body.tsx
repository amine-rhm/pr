import ScrollToTop from "../../components/ScrollToTop";
import PopularCities from "./PopularCities";
import RecentlyAdded from "./RecentlyAdded";
import Type from "./Type";
const Body = () => {

  return (
    <div>
      <Type />
      <RecentlyAdded />
      <PopularCities />
      <ScrollToTop/>
    </div>
  );
};

export default Body;
