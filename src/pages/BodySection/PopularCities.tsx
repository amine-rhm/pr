import Li from "../../components/Li";
const PopularCities = () => {
  return (
    <div className="px-10 max-lg:px-8 max-sm:px-4 max-xl:px-16 my-28">
      <h2 className=" relative w-fit title">Les villes les plus populaires</h2>
      <div className="mt-12 max-sm:pt-2 flex items-center  bg-greyTwo rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-8 max-sm:flex-col  ">
        <img
          src="../../../public/images/CitiesImage.png"
          className=" max-lg:h-52 max-sm:h-40 h-64 ml-24 max-lg:mx-6  max-md:my-4"
          alt="searchMap"
        />
        <div className="ml-24 max-lg:m-0 w-[60vw] max-sm:w-[115%] max-lg:px-4 px-10 py-5 text-base relative flex justify-between  rounded-xl border-grey border-2 border-solid">
          <ul className=" list-none ml-2 ">
            <Li value="Oran" />
            <Li value="Tlemcen" />
            <Li value="Alger" />
            <Li value="Bejaia" />
            <Li value="Constantine" />
            <Li value="Annaba" />
          </ul>
          {/* <div className="w-2 h-[80%] w-[50%] absolute left-[50%] top-[30px] border-solid border-l-greyActive border-y-0 border-r-0 border-blue-900"></div> */}
          <ul className="list-none max-sm:mr-2 max-md:mr-5">
            <Li value="Skikda" />
            <Li value="Setif" />
            <Li value="Mostaganem" />
            <Li value="Tizi Ouzou" />
            <Li value="Gherdaia" />
            <Li value="Batna" />
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PopularCities;
