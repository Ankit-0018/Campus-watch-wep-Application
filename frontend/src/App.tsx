import { RouterProvider} from "react-router-dom";
import AppRoutes from "./components/routes/AppRoutes";
import { useEffect, useState  } from "react";
import axios from "axios";
import { useDispatch} from "react-redux";
import { setUser } from "./redux/auth/authSlice";
import { logout } from "./redux/auth/authSlice";
import { type AppDispatch} from "./redux/store";
import { fetchIssues } from "./redux/issue/issueSlice";
import { fetchLostFound } from "./redux/lostfound/lostFoundSlice";


const App: React.FC = () => {

const [loading , setLoading] = useState<boolean>(true)

  const dispatch = useDispatch<AppDispatch>();
 useEffect(() => {

  const fetchDetails = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
        withCredentials: true,
      });
    dispatch(setUser(res.data.user));
    await dispatch(fetchIssues())
    await dispatch(fetchLostFound())
    } catch (err) {
      dispatch(logout());
    } finally {
      
      setLoading(false)
    }
  };

  fetchDetails();
}, []);

if(loading) return <p>Loading....</p>

  return <RouterProvider router={AppRoutes} />;
};

export default App;
