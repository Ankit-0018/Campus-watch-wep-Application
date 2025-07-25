import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'
import type { UserInfo , UserType} from "@/types/user";
import type { Notification } from "@/types/notification";



interface authSliceInitial {
    user : null | UserType | (UserInfo & {
      notifications : [Notification]
    }),
    loading : boolean,
    error : null | string,
    isAuthenticated : boolean
}


const initialState : authSliceInitial = {
    user : null,
    loading : false,
    error : null,
    isAuthenticated : false
    
}
interface NotificationResponse {
  success: boolean;
  message: string;
  updatedNotificationId?: string;
}

// Type for bulk update response
interface MarkAllResponse {
  success: boolean;
  message: string;
  updatedCount: number;
}

// Mark a single notification as read
export const markNotificationAsRead = createAsyncThunk<
  NotificationResponse,
  string,
  { rejectValue: string }
>("user/markNotificationAsRead", async (id, thunkAPI) => {
  try {
    const res = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/api/notifications/mark-read/${id}`,  {}, {withCredentials : true});
     console.log("Inside markNotificationsAsRead");
    return res.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    return thunkAPI.rejectWithValue(message);
  }
});

// Mark all notifications as read
export const markAllNotificationsAsRead = createAsyncThunk<
  MarkAllResponse,
  void,
  { rejectValue: string }
>("user/markAllNotificationsAsRead", async (_, thunkAPI) => {
  try {
    const res = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/api/notifications/mark-all-read` , {} , {withCredentials : true});
     console.log("Inside markAllNotificationsAsRead thunk");
    return res.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteContent =  createAsyncThunk(
  "deleteContent",
  async ({type , id} : {type : String; id : String}, thunkAPI) => {
try {
  console.log(type)
  const res = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/deleteItem/${type}/${id}` , {withCredentials : true});
  return res.data
} catch (error : any) {
  return thunkAPI.rejectWithValue(error.response.data.message || "Somethink went Wrong!")
}
  }
)

export const loginUser = createAsyncThunk<
  { user: UserType }, 
  { email: string; password: string },                                 
  { rejectValue: string }                                             
>(
    "auth/login",
    async (credential : {email : string , password : string} , thunkAPI) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/signIn` , credential ,{
              withCredentials : true
            })
            console.log(response)
            return response.data
        } catch (error: any) {
       
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
       return thunkAPI.rejectWithValue(message)
    
    }
    }
);

export const logOutUser = createAsyncThunk(
  "auth/logout",
  async (_ , thunkAPI) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/logout` , {withCredentials : true})
      return res.data
    }
    catch (error: any) {
       
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
       return thunkAPI.rejectWithValue(message)
    
    }
  }
)

export const editProfile = createAsyncThunk(
  'edit/me',
  async (formValues : {fullName : string , department : string , gender : string}, thunkApi) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/edit/me`,
        formValues,
        { withCredentials: true }
      );

      return response.data; // return updated user
    } catch (err : any) {
      const error = err.response?.data?.message || err.message;
      return thunkApi.rejectWithValue(error);
    }
  }
);

const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers : {
        logout : (state)=> {
            state.user = null;
            state.loading = false;
            state.error = null;
            state.isAuthenticated = false;
        },
          setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
        setLoading  : (state , action) => {
          state.loading = action.payload;
          state.error = null;
        },
        markNotificationAsReadInUI(state, action) {
    const notifId = action.payload;
    const notif = state.user?.notifications?.find(n => n._id === notifId);
    if (notif) notif.isRead = true;
  },
  markAllNotificationsAsReadInUI(state) {
    state.user?.notifications?.forEach(n => n.isRead = true);
  }
    },
   extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.isAuthenticated = true
       
      })
    .addCase(loginUser.rejected,(state, action) => {
       
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
      const id = action.payload.updatedNotificationId;
      const notif = state.user?.notifications?.find(n => n._id === id);
      if (notif) notif.isRead = true;
    })

   
    .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
      state.user?.notifications?.forEach(n => n.isRead = true);
    })
    .addCase(editProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(editProfile.fulfilled, (state, action) => {
      state.loading = false;
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload, // merge updated fields
        };
      }
    })
    .addCase(editProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
  },
})




export const {logout , setUser , setLoading, markNotificationAsReadInUI , markAllNotificationsAsReadInUI } = authSlice.actions;
export default authSlice.reducer;
