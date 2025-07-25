import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Bell, CheckCheck, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { markAllNotificationsAsRead, markAllNotificationsAsReadInUI, markNotificationAsRead, markNotificationAsReadInUI } from "@/redux/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import type { Notification } from "@/types/notification";
import type { AppDispatch, RootState } from "@/redux/store";

export default function Notifications() {

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const dispatch = useDispatch<AppDispatch>()

  const {user} = useSelector((state : RootState) => state.auth)
const notifications = useSelector((state : RootState) => state.auth.user?.notifications)
console.log(notifications)

  const filteredNotifications = notifications?.filter((notification : Notification) => {
      const matchesSearch = 
        notification.item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.fromUser.department.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesFilter = 
        filterType === "all" || 
        (filterType === "unread" && !notification.isRead) ||
        (filterType === "read" && notification.isRead);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const unreadCount = notifications?.filter(n => !n.isRead).length;

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      dispatch(markNotificationAsReadInUI(notification._id))
      dispatch(markNotificationAsRead(notification._id))
    }
  };

  if (!user || notifications!.length < 1) {
  return (
    <div className="text-center py-12 text-gray-500">
      <Bell className="h-10 w-10 mx-auto mb-4" />
      <p>No notifications yet.</p>
    </div>
  );
}
  
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Bell className="h-8 w-8" />
            Notifications
            {unreadCount! > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </h1>
          <p className="mt-1 text-gray-500">
            Stay updated on your lost & found items
          </p>
        </div>
        
        {unreadCount! > 0 && (
          <Button 
            variant="outline"
            onClick={
               () => {
                dispatch(markAllNotificationsAsRead())
                dispatch(markAllNotificationsAsReadInUI())
               } 
            }
            className="flex items-center gap-2"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search notifications..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs value={filterType} onValueChange={setFilterType} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">
            All Notifications
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread ({notifications?.filter(n => !n.isRead).length})
          </TabsTrigger>
          <TabsTrigger value="read">
            Read
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {filteredNotifications?.map((notification) => (
          <Card 
            key={notification._id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              !notification.isRead ? "border-l-4 border-l-blue-500 bg-blue-50/50" : ""
            }`}
            onClick={() => handleNotificationClick(notification)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${
                    notification.notificationType === "claim" 
                      ? "bg-green-100 text-green-600" 
                      : "bg-blue-100 text-blue-600"
                  }`}>
                    {notification.notificationType === "claim" ? (
                      <CheckCheck className="h-4 w-4" />
                    ) : (
                      <Bell className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm">
                        {notification.item.title}
                      </h3>
                      {!notification.isRead && (
                        <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <span className="font-medium">Item:</span> {notification.item.title}
                  </div>
                  <div>
                    <span className="font-medium">Department:</span> {notification.fromUser.department}
                  </div>
                  <div>
                    <span className="font-medium">Claimed by:</span> {notification.fromUser.fullName}
                  </div>
                </div>
                
                <Badge 
                  variant={notification.notificationType === "claim" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {notification.notificationType === "claim" ? "Item Claimed" : "Item Found"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredNotifications?.length === 0 && (
          <div className="col-span-full py-12 text-center">
            <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No notifications found</p>
            <p className="text-gray-400 text-sm">
              {searchQuery 
                ? "Try adjusting your search terms or filters"
                : "You'll see notifications here when someone claims your items"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}