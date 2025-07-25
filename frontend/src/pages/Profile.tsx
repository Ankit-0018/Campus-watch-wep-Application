import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import toast from "react-hot-toast";
import { logout, logOutUser } from "@/redux/auth/authSlice";

export default function Profile() {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const dispatch = useDispatch<AppDispatch>();

  // const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  //   const [formState, setFormState] = useState({
  //     fullName : user?.fullName || "",
  //     email: user?.email || "",
  //     department: user?.department || "",
  //     gender: user?.gender || "",
  //   });

  //   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const { name, value } = e.target;
  //     setFormState(prev => ({
  //       ...prev,
  //       [name]: value,
  //     }));
  //   };

  //  const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {

  //     dispatch(editProfile(formState))

  //     toast.success("Profile updated successfully");

  //     setIsEditDialogOpen(false);
  //   } catch (error: any) {
  //     toast.error(error.message || "Something went wrong");
  //   }
  // };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="mt-1 text-gray-500">
          View and manage your account information
        </p>
      </div>

      <Card>
        {/* <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your personal details</CardDescription>
          </div>
          <Button 
            variant="outline"
            onClick={() => setIsEditDialogOpen(true)}
          >
            Edit Profile
          </Button>
        </CardHeader>
         */}
        <CardContent>
          <div className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-8">
            <Avatar className="h-32 w-32">
              <AvatarImage src={user?.avatar} alt={user?.fullName} />
              <AvatarFallback className="text-4xl">
                {user?.fullName.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="mt-4 w-full sm:mt-0">
              <div className="grid gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Full Name
                  </Label>
                  <p className="text-lg font-medium">{user?.fullName}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    University Email
                  </Label>
                  <p className="text-lg">{user?.email}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Department
                    </Label>
                    <p>{user?.department}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Gender
                    </Label>
                    <p>{user?.gender}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t px-6 py-4">
          <p className="text-sm text-muted-foreground">
            Member since April 2025
          </p>
          <Button
            variant="outline"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => setIsLogoutDialogOpen(true)}
          >
            Log out
          </Button>
        </CardFooter>
      </Card>

      {/* Edit Profile Dialog */}
      {/* <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Update your profile information
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleInputChange}
                  className="mt-1"
                  disabled
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  University email cannot be changed
                </p>
              </div>
              
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  name="department"
                  value={formState.department}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
              
                
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Input
                    id="gender"
                    name="gender"
                    value={formState.gender}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-campus-purple hover:bg-campus-purple-dark">
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
       */}
      {/* Logout Confirmation Dialog */}
      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Log out</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out of your account?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsLogoutDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                dispatch(logout());
                dispatch(logOutUser());
                if (!isAuthenticated) toast.success("Logout Successfully!");
              }}
            >
              Log out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
