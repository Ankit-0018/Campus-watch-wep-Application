import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (


    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex-1 p-4 overflow-y-auto">
        <Outlet />
      </div>
    </div>

  );
}

export default Layout;
