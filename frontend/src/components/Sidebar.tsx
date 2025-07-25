import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { Bell, Home, User, Flag, Package, Menu, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import type { AppDispatch, RootState } from "@/redux/store";
import { logout, logOutUser } from "@/redux/auth/authSlice";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";


export default function Sidebar() {
  const { user  , isAuthenticated} = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);


useEffect(() => {
  setOpen(false);
}, [location.pathname]);

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Issues", path: "/issues", icon: Flag },
    { name: "Lost & Found", path: "/lost-found", icon: Package },
    { name: "My Issues", path: "/my-issues", icon: Book },
    { name: "Notifications", path: "/notifications", icon: Bell },
    { name: "Profile", path: "/my-profile", icon: User },
   
  ];



  
  return (
    <>
   
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="absolute top-2 left-2 z-50 p-1  bg-[#9b87f5] text-white rounded-md shadow-md  "
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Sidebar */}
      {open && (
        <aside className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border shadow-sm fixed md:relative z-40">
          <div className="px-6 py-6 mt-2">
            <h1 className="text-2xl font-bold text-[#9b87f5]">CampusWatch</h1>
            <p className="text-sm text-sidebar-foreground mt-1">Campus Issue Reporting</p>
          </div>

          <nav className="mt-6 px-3">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium group transition-colors ${
                        isActive
                          ? "bg-[#9b87f5] text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {user && (
            <div className="hidden md:absolute md:bottom-0 md:w-64 md:border-t md:border-sidebar-border md:p-4 ">
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatar} alt={user.fullName} />
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm font-medium text-sidebar-foreground">{user.fullName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto"
                  onClick={() => {
                    dispatch(logout())
                    dispatch(logOutUser())
                    if(!isAuthenticated) toast.success("Logout Successfully!")
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </Button>
              </div>
            </div>
          )}
        </aside>
      )}
    </>
  );
}
