import { type UserInfo } from "../types/user";


type Priority = 'low' | 'medium' | 'critical'; 


interface Comment {
  id: string;
  text: string;
  user : UserInfo
}

export interface Issue {
  _id: string;
  title: string;
  description: string;
  location: string;
  createdAt: string;
  reportedBy : UserInfo
  priority: Priority;
  upvotes: String;
  upvotedBy: string[];
  status: 'open' | 'in-progress' | 'resolved';
  imageUrls :    [
    {
      url : string,
      public_id : string
      _id : string;

    }
  ]; 
  comments?: Comment[];
}

