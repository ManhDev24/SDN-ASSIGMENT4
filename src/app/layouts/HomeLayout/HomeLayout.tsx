import { Outlet } from "react-router-dom";
import Footer from "../../pages/Homepage/Footer/Footer";
import Header from "../../pages/Homepage/Header/Header";

const Homelayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default Homelayout;
