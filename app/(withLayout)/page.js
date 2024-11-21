import Banner from "../components/layout/Home/Banner/Banner";
import Category from "../components/layout/Home/Category/Category";
import NewArrivals from "../components/layout/Home/NewArrivals/NewArrivals";
import Trending from "../components/layout/Home/Trending/Trending";

const Homepage = () => {
  return (
    <main className="[&_img]:pointer-events-none">
      <Banner />
      <Category />
      <Trending />
      <NewArrivals />
    </main>
  );
};

export default Homepage;
