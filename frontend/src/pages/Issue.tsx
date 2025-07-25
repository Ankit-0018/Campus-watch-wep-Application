import { Button} from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus , Search , Filter} from "lucide-react"
import {  useState } from "react"
import IssueForm from "@/components/IssueForm";
import IssueCard from "@/components/IssueCard";
import { Dialog , DialogContent , DialogTitle , DialogHeader, DialogDescription, DialogFooter  } from "@/components/ui/dialog";
import { type Issue } from "@/types/Issue";
import {  useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import toast from "react-hot-toast";
import { deleteContent } from "@/redux/auth/authSlice";
import { deleteIssue } from "@/redux/issue/issueSlice";



function Issue() 

{
const {issues} = useSelector((state : RootState) => state.issue)

const [isFormOpen , setIsFormOpen] = useState(false)
const [searchQuery , setSearchQuery] = useState("")
const [priorityFilter , setPriorityFilter] = useState<string>("all")
 const [statusFilter, setStatusFilter] = useState<string>("all");
const [isConfirmOpen , setIsConfirmOpen] = useState(false)
const dispatch = useDispatch<AppDispatch>()

  const filteredIssues = issues
    .filter(issue => {
      const matchesSearch = 
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.location.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesPriority = priorityFilter === 'all' || issue.priority === priorityFilter;
      const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
      
      return matchesSearch && matchesPriority && matchesStatus;
    })
    .sort((a, b) => Number(b.upvotes) - Number(a.upvotes));
    
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campus Issues</h1>
          <p className="mt-1 text-gray-500">
            View and report campus issues
          </p>
        </div>
        <Button 
            className="bg-[#9B87F5] hover:bg-[#7767be]"
            onClick={() => setIsFormOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Report Issue
          </Button>
        </div>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search issues..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <RadioGroup 
            defaultValue="all" 
            className="flex items-center space-x-2"
            value={priorityFilter}
            onValueChange={setPriorityFilter}
          >
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">All</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="critical" id="critical" />
              <Label htmlFor="critical">Critical</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium">Medium</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="low" id="low" />
              <Label htmlFor="low">Low</Label>
            </div>
          </RadioGroup>
        </div>
        </div>
        <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger 
            value="all" 
            onClick={() => setStatusFilter('all')}
          >
            All Issues
          </TabsTrigger>
          <TabsTrigger 
            value="open" 
            onClick={() => setStatusFilter('open')}
          >
            Open
          </TabsTrigger>
          <TabsTrigger 
            value="in-progress" 
            onClick={() => setStatusFilter('in-progress')}
          >
            In Progress
          </TabsTrigger>
          <TabsTrigger 
            value="resolved" 
            onClick={() => setStatusFilter('resolved')}
          >
            Resolved
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredIssues.map((issue) => (
          <>
          <IssueCard
            key={issue._id}
            issue={issue}
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
                dispatch(deleteContent({type : "issue" , id : issue._id }))
                dispatch(deleteIssue(issue._id))
                toast.success("Issue Deleted Successfully.")
              }}
              >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </>
        ))}
        
        {filteredIssues.length === 0 && (
          <div className="col-span-full py-12 text-center">
            <p className="text-gray-500">No issues found matching your filters.</p>
          </div>
        )}
      </div>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Report a New Issue</DialogTitle>
          </DialogHeader>
          <IssueForm 
             onComplete={() => setIsFormOpen(false)}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
        </div>
  )
}

export default Issue
