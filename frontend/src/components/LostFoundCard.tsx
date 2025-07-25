import { useEffect, useState } from "react";
import type { Item } from "@/types/items";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import axios from "axios";
import type { UserType } from "@/types/user";
import {  toggleClaim, updateClaim } from "@/redux/lostfound/lostFoundSlice";
import toast from "react-hot-toast";

interface LostFoundCardProps {
  item: Item;
  status?: string;
  setIsConfirmOpen? : (value : boolean) => void
}

export default function LostFoundCard({ item, status , setIsConfirmOpen }: LostFoundCardProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [users, setUsers] = useState<UserType[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/users`,
          {
            withCredentials: true,
          }
        );
        setUsers(res.data);
        console.log("Response from API:", res.data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  console.log(item)

 const onClaimHandler = (claimType : string) => {

    const hasAlreadyClaimed = item.claimedBy.some((u) => u.user._id === user!._id);
dispatch(
                  updateClaim({ itemId: item._id, user, claimType })
                );
                dispatch(toggleClaim({ claimType, itemId: item._id }));
             if (!hasAlreadyClaimed) {
    toast.success(
      claimType === "Lost"
        ? "Item Claimed Successfully!"
        : "Thank you for reporting!"
    );
  }
 }
  const reportedById =
  typeof item.reportedBy === "string"
    ? item.reportedBy
    : item.reportedBy._id;

const creator = users?.find((u) => u._id === reportedById);
const isCreator = user?._id === reportedById;
  const hasClaimed = item.claimedBy.find((u) => u.user._id === user?._id);

  if (isLoading) {
    return <p>Loading....</p>;
  }
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2 flex flex-row items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <Badge
              className={
                item.status === "Lost"
                  ? "bg-campus-medium text-white"
                  : "bg-campus-purple text-white"
              }
            >
              {item.status === "Lost" ? "Lost" : "Found"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {item.location} •{" "}
            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
          </p>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <p className="text-sm">{item.description}</p>

        {item.imageUrls && item.imageUrls.length > 0 && (
          <div className="mt-3 grid grid-cols-1 gap-2">
            {item.imageUrls.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={`Item image ${idx + 1}`}
                className="rounded-md h-48 w-full object-cover"
              />
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 border-t flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={creator?.avatar} alt={creator?.fullName} />
            <AvatarFallback>{creator?.fullName.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-xs">{creator?.fullName}</span>
        </div>

        <div className="flex items-center gap-3">
          {isCreator && <Button
              size="sm"
              className="bg-red-500 hover:bg-red-700"
              onClick={() => {
                setIsConfirmOpen!(true)
              }}
             
            >
              Delete
            </Button> }
          {hasClaimed && !isCreator && status === "Lost" && !isCreator && (
            <Button
              size="sm"
              className="bg-red-500 hover:bg-red-700"
              onClick={() => onClaimHandler("Lost")}
            >
              Not Mine
            </Button>
          )}

          {!isCreator && !hasClaimed && status === "Lost" && (
            <Button
              size="sm"
              className="bg-[#9b87f5] hover:bg-[#7264b4]"
              onClick={() => onClaimHandler("Lost")}
            >
              This is Mine
            </Button>
          )}
          {hasClaimed && !isCreator && status === "Found" && !isCreator && (
            <Button
              size="sm"
              className="bg-red-500 hover:bg-red-700"
               onClick={() => onClaimHandler("Found")}
            >
              I did not
            </Button>
          )}

          {!isCreator && !hasClaimed && status === "Found" && (
            <Button
              size="sm"
              className="bg-[#9b87f5] hover:bg-[#7264b4]"
              onClick={() => onClaimHandler("Found")}
            >
              I Found this
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
