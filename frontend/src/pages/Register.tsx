
import { useForm } from "react-hook-form";
import { z } from "zod"
import toast from "react-hot-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";


function Register() {


  const navigate = useNavigate()

  const formSchema = z
    .object({
      fullName: z
        .string()
        .min(3, {
          message: "Name is too short!",
        })
        .max(30, {
          message: "Name is too Long.",
        }),
      email: z.string().email({
        message: "Please enter a valid  email.",
      }),
      createPassword: z.string().min(6, {
        message: "Password should be atleast 6 characters!",
      }),
      confirmPassword: z.string(),
      department: z.string(),
      role: z.enum(["student", "faculty"]),
      gender : z.string(),
      phone: z
        .string({
          message : "Please Enter Correct Phone Number."
        })
        .min(10, { message: "Phone number must be at least 10 digits" })
        .max(10, { message: "Phone number must be at most 10 digits" })
        .regex(/^\d{10}$/, {
          message: "Phone number must contain only digits",
        }),
    })
    .refine((data) => data.createPassword === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Passowrd do not match",
    })
    .transform((data) => ({
      fullName: data.fullName,
      email: data.email,
      password: data.createPassword,
      department: data.department,
      role: data.role,
      phone: data.phone,
      gender : data.gender,
    
    }));

      
       type FormInput = z.input<typeof formSchema>;  
    type FormOutput = z.output<typeof formSchema>;
    const form = useForm<FormInput>({
      resolver : zodResolver(formSchema) as any,
      defaultValues : {
      fullName : "",
      email : "",
      createPassword : "",
      confirmPassword : "",
      department : "",
      role : undefined,
      gender : "",
      phone : ""
      
    }
    
 })


const onSubmit = async (data: FormOutput) => {
  try {
  
    

    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/signUp`, data);

    if (!response?.data?.success) {
      return toast.error(response.data.message || "Registration failed!");
    }

    toast.success(response.data.message || "Registered successfully!");
    navigate("/signIn")
  } catch (error: any) {
   if (error instanceof z.ZodError){
    console.log(error.issues)
   }
    if (error.response?.data?.message) {
      return toast.error(error.response.data.message);
    }

    console.error("Register Error:", error);
    toast.error("Registration failed! Please try again.");
  }
  console.log("registered" , data)
};


  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-[#9b87f5]">CampusWatch</h1>
          <p className="mt-2 text-sm text-gray-600">
            Campus Issue Reporting Platform
          </p>
        </div>
        <div className="rounded-lg border bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">
            Register with your University ID
          </h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>FullName</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>University Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@university.edu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="createPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile No.</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="eg. 7689xxxxxx"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex">
<FormField
  control={form.control}
  name="department"
  render={({ field }) => (
    <FormItem className="w-full">
      <FormLabel>Department</FormLabel>
      <Select onValueChange={field.onChange} value={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select your Department" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Department List</SelectLabel>
            <SelectItem value="Btech.">Btech.</SelectItem>
            <SelectItem value="Bca">Bca</SelectItem>
            <SelectItem value="Bba">Bba</SelectItem>
            <SelectItem value="BCom.">BCom.</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
<FormField
  control={form.control}
  name="role"
  render={({ field }) => (
    <FormItem className="w-full">
      <FormLabel>Role</FormLabel>
      <Select onValueChange={field.onChange} value={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select your Role" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Role List</SelectLabel>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="faculty">Faculty</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>

              </div>
                    <FormField
  control={form.control}
  name="gender"
  render={({ field }) => (
    <FormItem className="w-full">
      <FormLabel>Gender</FormLabel>
      <Select onValueChange={field.onChange} value={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select your Gender" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>

              <Button
                type="submit"
                className="w-full bg-[#9b87f5] hover:bg-campus-purple-dark"
                
              >
                Register
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              Already Have an Account? <Link to={"/signIn"}  className="hover:underline hover:text-black">SignIn Here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
