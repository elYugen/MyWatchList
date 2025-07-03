import InProgress from "../components/InProgress/InProgress";
import ToSee from "../components/ToSee/ToSee";
import Watched from "../components/Watched/Watched";

function Home() {
  return (
      <>
      <div className="container">
        <InProgress />
        <ToSee />
        <Watched />
      </div>
      </>
  );
};

export default Home;