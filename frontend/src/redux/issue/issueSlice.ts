import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { type Issue } from "@/types/Issue";




interface IssueState {
  issues: Issue[];
  loading: boolean;
  error: string | null;
}

const initialState: IssueState = {
  issues: [],
  loading: false,
  error: null,
};


export const fetchIssues = createAsyncThunk(
  "issues/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/issues`, {
        withCredentials: true,
      });
      return res.data.issues;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch issues"
      );
    }
  }
);

export const upVote = createAsyncThunk(
  "issues/handleupvotes",
  async (issueId : string, { rejectWithValue }) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/issues/${issueId}/upvote`,
        {},
        { withCredentials: true }

      );
      console.log(res)
      return res.data; 
    } catch (error : any) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

const issueSlice = createSlice({
  name: "issues",
  initialState,
  reducers: {
    clearIssues: (state) => {
      state.issues = [];
      state.error = null;
    },
    deleteIssue : (state, action) => {
    
      state.issues = state.issues.filter(iss => iss._id !== action.payload)

    },
    addIssue : (state,action) => {
      state.loading = false;
        if (state.issues) {
          state.issues.unshift(action.payload); 
        } else {
          state.issues = [action.payload];
        }
    },
updateUpvote : (state , action) => {
  const updateIssue = state.issues.find(issue => issue._id == action.payload.issueId)
  if(updateIssue){
    const already = updateIssue.upvotedBy.includes(action.payload.userId)
    if(already){
      updateIssue.upvotedBy = updateIssue.upvotedBy.filter(uid => uid!== action.payload.userId)
    }else {
      updateIssue.upvotedBy.push(action.payload.userId)
    }

  }
 
}

    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIssues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIssues.fulfilled, (state, action) => {
        state.loading = false;
        state.issues = action.payload;
      })
      .addCase(fetchIssues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

   .addCase(upVote.fulfilled, (state, action) => {
  const updatedIssue = action.payload;
  state.issues = state.issues.map(issue =>
    issue._id === updatedIssue._id ? updatedIssue : issue
  );
})
.addCase(upVote.rejected, (state, action) => {
        state.error = action.payload as string;
      });
    
  },
});

export const { clearIssues , updateUpvote , deleteIssue , addIssue } = issueSlice.actions;
export default issueSlice.reducer;
