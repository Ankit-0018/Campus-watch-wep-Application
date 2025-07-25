

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Plus, Search } from "lucide-react";
import LostFoundCard from "@/components/LostFoundCard";
import LostFoundForm from "@/components/LostFoundForm";
import {  useDispatch, useSelector } from "react-redux";
import type {  AppDispatch, RootState } from "@/redux/store";
import { DialogDescription } from "@radix-ui/react-dialog";
import toast from "react-hot-toast";
import { deleteContent } from "@/redux/auth/authSlice";
import { deleteItem } from "@/redux/lostfound/lostFoundSlice";



export default function LostFound({}) {

  const {items} = useSelector((state : RootState) => state.lostFound)
  
  
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>('active');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen , setIsConfirmOpen] = useState(false)
 
  
  const dispatch = useDispatch<AppDispatch>()

  
  const filteredItems = items?.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesType = typeFilter === 'all' || item.status === typeFilter;
      const matchesStatus = statusFilter === "all" || item.isActive === true;
      
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());


    
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lost & Found</h1>
          <p className="mt-1 text-gray-500">
            Report lost items or items you've found
          </p>
        </div>
        
        
          <Button 
            className="bg-campus-purple hover:bg-campus-purple-dark"
            onClick={() => setIsFormOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Report Item
          </Button>
      
      </div>
      
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <RadioGroup 
            defaultValue="all" 
            className="flex items-center space-x-2"
            value={typeFilter}
            onValueChange={setTypeFilter}
          >
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="all" id="all-items" />
              <Label htmlFor="all-items">All</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="lost" id="lost" />
              <Label htmlFor="lost">Lost</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="found" id="found" />
              <Label htmlFor="found">Found</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
      
      <Tabs defaultValue="active" className="mb-6">
        <TabsList>
          <TabsTrigger value="active" onClick={() => setStatusFilter("active")}>
  Active
</TabsTrigger>
         
          <TabsTrigger value="all" onClick={() => setStatusFilter("all")}>
  All Items
</TabsTrigger>
        </TabsList>
      </Tabs>
      
    
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {filteredItems?.map((item) => (
          <>
          <LostFoundCard
            key={item._id}
            item={item}
            status = {item.status}
            setIsConfirmOpen={setIsConfirmOpen}
            
            
          />
          <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to Delete?
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => {
                dispatch(deleteContent({type : "item" , id : item._id }))
                dispatch(deleteItem(item._id))
                toast.success("Reported Item Deleted Sucessfully.")
              }}
              >
              Log out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
              </>
        ))}
        
        {filteredItems?.length === 0 && (
          <div className="col-span-full py-12 text-center">
            <p className="text-gray-500">No items found matching your filters.</p>
          </div>
        )}
      </div>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Report Lost or Found Item</DialogTitle>
          </DialogHeader>
          <LostFoundForm 
            
            onComplete={() => setIsFormOpen(false)}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
        
    </div>
  );
}
