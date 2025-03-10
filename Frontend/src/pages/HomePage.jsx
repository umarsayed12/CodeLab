// src/pages/HomePage.jsx
import {Header , Footer , HomeContent , ProfilePanel} from "../components"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <HomeContent />
      <Footer />
    </div>
  );
}