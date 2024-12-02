import TypeCard from "../../components/TypeCard";

const Type = () => {
  return (
    <div className="bg-greyTwo ">
      <div className="md:px-10 max-md:px-6 max-sm:px-4 py-14 ">
        <h2 className="mb-12 relative w-fit title">
          Le type qui vous intéresse
        </h2>
        <section className="flex justify-between max-sm:justify-around max-sm:items-center max-sm:flex-wrap max-sm:gap-5   ">
          <TypeCard image="CardApp.jpg" title="Résidentiel" />
          <TypeCard image="CardComm.jpg" title="Commercial" />
          <TypeCard image="CardTerr.jpg" title="Terrain" />
          <TypeCard image="CardSto.jpg" title="Industriel" />
        </section>
      </div>
    </div>
  );
};

export default Type;
