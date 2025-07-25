import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { Item } from "@/types/items";

interface itemsState {
  loading: boolean;
  items: Item[] | null;
  error: string | null;
}

const initialState: itemsState = {
  loading: false,
  items: [],
  error: null,
};


export const fetchLostFound = createAsyncThunk(
  "lostFound/fetch",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/items`,
        { withCredentials: true }
      );
      console.log("The responese" , res.data)
      return res.data.reportedItems;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);


export const addItem = createAsyncThunk(
  "lostFound/addItem",
  async (itemData: FormData, thunkAPI) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/items`,
        itemData,
        { withCredentials: true }
      );
      return res.data.item;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add item"
      );
    }
  }
);

export const toggleClaim = createAsyncThunk(
  "toggle/item",
  async ({ claimType, itemId }: { claimType: string; itemId: string }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/items/claimItem/${itemId}/${claimType}`,{} , {withCredentials: true}
      );
      return response.data; 
    } catch (error: any) {
  
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong while claiming the item"
      );
    }
  }
);
const lostFoundSlice = createSlice({
  name: "lostFound",
  initialState,
  reducers: {
updateClaim: (state, action) => {
  const { itemId, user, claimedType } = action.payload;

  const updateItem = state.items?.find(item => item._id === itemId);

  if (updateItem) {
    const userIndex = updateItem.claimedBy.findIndex(c => c.user._id === user._id);

    if (userIndex !== -1) {
      
      updateItem.claimedBy.splice(userIndex, 1);
    } else {

      updateItem.claimedBy.push({ user, claimedType });
    }
  }
},
deleteItem : (state ,action ) => {
  if(state.items){

    state.items = state.items?.filter(it => it._id !== action.payload)
  }
}

  },
  extraReducers: (builder) => {
    builder
     
      .addCase(fetchLostFound.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLostFound.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchLostFound.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      
      .addCase(addItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.loading = false;
        if (state.items) {
          state.items.unshift(action.payload); 
        } else {
          state.items = [action.payload];
        }
      })
      .addCase(addItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(toggleClaim.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleClaim.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(toggleClaim.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
  },
});

export default lostFoundSlice.reducer;
export const {updateClaim , deleteItem} = lostFoundSlice.actions;
