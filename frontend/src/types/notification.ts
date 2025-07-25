import type { Item } from "./items";
import type { UserInfo } from "./user";

export interface Notification {
  _id : string;
  fromUser: UserInfo;               
  notificationType: 'found' | 'claim';    
  item: Item;     
  isRead : boolean;    
  createdAt: Date;
}