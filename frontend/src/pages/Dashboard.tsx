import type { RootState } from "@/redux/store"
import { useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useEffect, useState } from "react";
import type { Issue } from "@/types/Issue";

function Dashboard() {

  const {user } = useSelector((state : RootState) => state.auth)
  const {issues , loading} = useSelector((state : RootState) => state.issue)

  const [recentIssues , setRecentIssues] = useState<Issue[]>([]);
const criticalCount = issues.filter(
  (issue) => issue.priority === "critical" 
).length;
const inProgressCount = issues.filter(
  (issue) => issue.status === "in-progress" 
).length;
const resolvedCount = issues.filter(
  (issue) => issue.status === "resolved" 
).length;

  useEffect(() => {
    const recent = issues.slice(0,5);
    setRecentIssues(recent)
  },[user,issues])

  return (

    <>
   <div>
    {loading&& <p>Loading....</p>}

      <div className="mb-8 mt-4">
        <h1 className="text-3xl font-bold">  Welcome back{user?.fullName ? `, ${user.fullName}` : ''}</h1>
        <p className="mt-1 text-gray-500">Here's an overview of campus issues</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedCount}</div>
          </CardContent>
        </Card>
      </div>
       <Card>
        <CardHeader>
          <CardTitle>Recent Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentIssues.map((issue) => (
                <TableRow key={issue._id}>
                  <TableCell className="font-medium">{issue.title}</TableCell>
                  <TableCell>{issue.location}</TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      issue.priority === 'critical' ? 'bg-red-100 text-red-800' :
                      issue.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {issue.priority}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      issue.status === 'open' ? 'bg-blue-100 text-blue-800' :
                      issue.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {issue.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

   </div>
    </>
  )
}

export default Dashboard
Dashboard