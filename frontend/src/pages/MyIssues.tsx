
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import IssueCard from "@/components/IssueCard";
import LostFoundCard from "@/components/LostFoundCard";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

export default function MyIssues() {
  const {user} = useSelector((state : RootState) => state.auth)
  const {issues} =  useSelector((state : RootState) => state.issue)
  const {items} =  useSelector((state : RootState) => state.lostFound)
  
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("issues");
  
  
  
  // Filter items created by the current user
  const myIssues = issues?.filter(issue => issue.reportedBy._id === user!._id);
  const myLostFoundItems = items?.filter(item => item.reportedBy._id === user!._id);
const claimedItems = items?.filter(item =>
  item.claimedBy?.some(claim => claim.user._id === user?._id)
);

  
  
  


  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Reports</h1>
          <p className="mt-1 text-gray-500">
            Manage your reported issues and items
          </p>
        </div>
        
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="issues">My Issues</TabsTrigger>
          <TabsTrigger value="lostfound">My Lost & Found</TabsTrigger>
          <TabsTrigger value="claimed">Claimed Items</TabsTrigger>
        </TabsList>
        
        <TabsContent value="issues" className="mt-6">
          {myIssues.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {myIssues.map((issue) => (
                <IssueCard
                  key={issue._id}
                  issue={issue}
                  
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="mb-4 text-gray-500">You haven't reported any issues yet.</p>
              <Button 
                className="bg-campus-purple hover:bg-campus-purple-dark"
                onClick={() => navigate("/")}
              >
                <Plus className="mr-2 h-4 w-4" />
                Report an Issue
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="lostfound" className="mt-6">
          {myLostFoundItems!.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {myLostFoundItems?.map((item) => (
                <LostFoundCard
                  key={item._id}
                  item={item}
                  
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="mb-4 text-gray-500">You haven't reported any lost or found items yet.</p>
              <Button 
                className="bg-campus-purple hover:bg-campus-purple-dark"
                onClick={() => navigate("/lost-found")}
              >
                <Plus className="mr-2 h-4 w-4" />
                Report an Item
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="claimed" className="mt-6">
          {claimedItems!.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {claimedItems?.map((item) => (
                <LostFoundCard
                  key={item._id}
                  item={item}
                 
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="mb-4 text-gray-500">You haven't claimed any items yet.</p>
              <Button 
                variant="outline"
                onClick={() => navigate("/lost-found")}
              >
                Browse Found Items
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
