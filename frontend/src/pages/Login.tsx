import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser } from "@/redux/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { type RootState, type AppDispatch } from "@/redux/store";
import toast from 'react-hot-toast'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useNavigate , Link } from "react-router-dom";

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()

  const { loading , user , error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
  if (error) {
    toast.error(error); // or setError in RHF
  }
}, [error]);

  const formSchema = z.object({
    email: z.string().email({
      message: "Please enter a valid  email.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {

      await dispatch(loginUser(values));

console.log(error)

   
  };

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-[#9b87f5]">CampusWatch</h1>
          <p className="mt-2 text-sm text-gray-600">
            Campus Issue Reporting Platform
          </p>
        </div>
        <div className="rounded-lg border bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">
            Log in with your University ID
          </h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                name="password"
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

              <Button
                type="submit"
                className="w-full bg-[#9b87f5] hover:bg-campus-purple-dark"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log in"}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              Don't have an Account? <Link to={"/signUp"} className="hover:underline hover:text-black">SignUp Here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
