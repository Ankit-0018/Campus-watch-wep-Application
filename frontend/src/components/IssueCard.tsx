
import { useState,useEffect } from "react";
import { type Issue } from "../types/Issue";
import { formatDistanceToNow } from "date-fns";
import { ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import type { RootState , AppDispatch } from "@/redux/store";
import {  updateUpvote } from "@/redux/issue/issueSlice";
import axios from "axios";
import { type UserType } from "@/types/user";
import { upVote } from "@/redux/issue/issueSlice";



interface IssueCardProps {
  issue: Issue;
  setIsConfirmOpen? : (value : boolean) => void
 
}

export default function IssueCard({ issue , setIsConfirmOpen}: IssueCardProps) {
  
  const {user} = useSelector((state : RootState) => state.auth)
  const dispatch = useDispatch<AppDispatch>()
  const [expanded, setExpanded] = useState(false);
  const [loading , setIsLoading] = useState<boolean>(true)
const [users  ,setUsers] = useState<UserType[]>([]);

useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users`, {
        withCredentials: true,
      });
      setUsers(res.data);
     
    } catch (error) {
      
    } finally {
      setIsLoading(false);
    }
  };

  fetchUsers();
}, []);
    const reportedById =
  typeof issue.reportedBy === "string"
    ? issue.reportedBy
    : issue.reportedBy._id;

const creator = users?.find((u) => u._id === reportedById);
const isCreator = user?._id === reportedById;
  const isUpvoted = user ? issue.upvotedBy.includes(user._id) : false;
  console.log(issue)
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-campus-critical text-white";
      case "medium":
        return "bg-campus-medium text-white";
      case "low":
        return "bg-blue-400 text-white";
      default:
        return "bg-muted";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-muted";
    }
  };

  {loading && <p>Loading....</p>}
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2 flex flex-row items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{issue.title}</h3>
            <Badge className={getPriorityColor(issue.priority)}>
              {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}
            </Badge>
            <Badge variant="outline" className={getStatusColor(issue.status)}>
              {issue.status.replace("-", " ")}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {issue.location} • {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
          </p>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className={expanded ? "" : "line-clamp-2"}>
          <p className="text-sm">{issue.description}</p>
        </div>
        
        {issue?.imageUrls && issue?.imageUrls.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {issue?.imageUrls?.map((img, idx) => (
              
              <img 
                key={idx} 
                src={img.url} 
                alt={`Issue image ${idx + 1}`} 
                className="rounded-md h-32 w-full object-cover" 
              />
            ))}
          </div>
        )}
        
        {issue.description.length > 120 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-1 p-0 h-auto text-xs text-muted-foreground"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Show less" : "Show more"}
            {expanded ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />}
          </Button>
        )}
      </CardContent>

      <CardFooter className="pt-1 border-t flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={creator?.avatar || "https://www.kindpng.com/picc/m/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png"} alt={creator?.fullName} />
            <AvatarFallback>{creator?.fullName.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-xs">{creator?.fullName}</span>
        </div>
        
        <div className="flex gap-3">
          {isCreator && <Button
                        size="sm"
                        className="bg-red-500 hover:bg-red-700"
                        onClick={() => {
                         setIsConfirmOpen!(true)

          
                        }}
                       
                      >
                        Delete
                      </Button> }
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center text-xs gap-1"
            disabled={!user}
          >
            <MessageCircle className="h-4 w-4" />
            {issue.comments?.length || 0}
          </Button>
          
          <Button 
            variant={isUpvoted ? "default" : "outline"}
            size="sm" 
            className={`flex items-center text-xs gap-1 ${isUpvoted ? "bg-[#9B87F5] text-white" : ""}`}
            onClick={() => {
  dispatch(updateUpvote({ issueId: issue._id, userId: user?._id })); // local
  dispatch(upVote(issue._id)); // sync to DB
}}
            disabled={!user}
          >
            <ChevronUp className="h-4 w-4" />
            {issue.upvotedBy.length}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
