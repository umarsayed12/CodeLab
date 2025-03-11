
import { Header, Footer } from "../components";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col ">
      <Header />
      <main className="flex-grow flex flex-col w-full h-full ">
        <Outlet /> {/* This will render the correct page component based on the route */}
      </main>
      <Footer />


      </div>
  );
}
