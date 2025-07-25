import type { Notification } from "./notification";

export interface UserType {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  phone: string;
  gender : string;
  createdAt: string;
  updatedAt: string;
  department: string;
  notifications : [Notification];
  avatar : string;
  _v: string;
}


export interface UserInfo {
 email : string;
    fullName : string;
    department : string;
    _id : string;
}