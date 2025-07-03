import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Header from "../components/Header/Header";

function Layout() {
  return (
      <>
      <Navbar />
      <Header />
      <Outlet />
      </>
  );
};

export default Layout;