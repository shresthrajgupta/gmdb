import './App.css';

import { Outlet, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import MobileNavigation from './components/MobileNavigation';

function App() {
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <main className='pb-14 lg:pb-0'>
      {!isAuthPage && <Header />}
      <div className='min-h-[92vh]'>
        < Outlet />
      </div>
      {!isAuthPage && <Footer />}
      {!isAuthPage && <MobileNavigation />}
    </main >
  );
}

export default App;
