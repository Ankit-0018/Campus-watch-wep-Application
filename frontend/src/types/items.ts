import { type UserInfo } from "../types/user";

export interface Item {
  _id: string;
  title: string;
  description: string;
  location : string;
  status: "Lost" | "Found";
  reportedBy: UserInfo & { phone: string };
  isActive: boolean;
  claimedBy: Array<{
    user: UserInfo & { phone: string }; 
    claimedType: string;
  }>;
  createdAt: string;
  updatedAt: string;
  imageUrls: [
    {
      url : string,
      public_id : string

    }
  ]; 
}
