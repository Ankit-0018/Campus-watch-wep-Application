import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MapPin, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import toast from "react-hot-toast";
import { addItem } from "@/redux/lostfound/lostFoundSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";


interface LostFoundFormProps {
  
  onCancel: () => void;
  onComplete : () => void;
}

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  location: z.string().min(5, {
    message: "Location must be at least 5 characters.",
  }),
  status : z.enum(['Lost' , 'Found'],{
    message : "Please Choose the Status"
  }),
imageUrls : z
    .custom<FileList>()
    .refine((files) => files?.length > 0, {
      message: "At least one image is required",
    })
    .refine((files) => files?.length <= 3, {
      message: "You can upload a maximum of 3 images",
    })
    .refine((files) =>
      Array?.from(files).every((file) => file?.size < 5 * 1024 * 1024),
      {
        message: "Each image must be smaller than 5MB",
      }
    )
});



export default function LostFoundForm({ onComplete , onCancel }: LostFoundFormProps) {
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch<AppDispatch>()

  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "Lost",
      title: "",
      description: "",
      location: "",
      imageUrls : undefined
    },
  });

const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      
      const newImages = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      
      if (images.length + newImages.length > 3) {
       toast.error("Maximum 3 Images Only!")
        return;
      }
      
      setImages([...images, ...newImages]);
    }
  };

const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

const handleSubmit = async (values: z.infer<typeof formSchema>) => {
  if (!values.imageUrls) {
    toast.error("Images missing!");
    return;
  }

  setIsSubmitting(true);

  const formData = new FormData();
  formData.append("title", values.title);
  formData.append("description", values.description);
  formData.append("location", values.location);
  formData.append("status", values.status);

  Array.from(values.imageUrls).forEach((file) => {
    formData.append("images", file);
  });

  try {
    const resultAction = await dispatch(addItem(formData));

    if (addItem.fulfilled.match(resultAction)) {
      toast.success("Item reported successfully!");
      onComplete();
    } else {
      toast.error(resultAction.payload as string);
    }
  } catch (error) {
    toast.error("Unexpected error occurred!");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Item Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Lost" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Lost Item
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Found" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Found Item
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Title</FormLabel>
              <FormControl>
                <Input placeholder="What's the item?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the item in detail..." 
                  className="min-h-32"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input placeholder="e.g. Library, 2nd Floor" className="pl-10" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
      <FormField
  control={form.control}
  name="imageUrls"
  render={({ field }) => (
    <div>
      <FormLabel>Images</FormLabel>
      <div className="mt-2 flex items-center">
        <label
          htmlFor="image-upload"
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-md border border-dashed border-primary/50 transition-colors hover:bg-muted"
        >
          <Upload className="h-5 w-5" />
          <span className="sr-only">Upload image</span>
        </label>
        <Input
          id="image-upload"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            field.onChange(e.target.files); // update form state
            handleImageChange(e);           // update preview images
          }}
        />

        <div className="ml-4 flex flex-1 flex-wrap gap-2">
          {images.map((src, index) => (
            <div key={index} className="relative h-12 w-12">
              <img
                src={src}
                alt={`Preview ${index + 1}`}
                className="h-full w-full rounded-md object-cover"
              />
              <button
                type="button"
                className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs text-white"
                onClick={() => removeImage(index)}
              >
                ×
              </button>
            </div>
          ))}
          {images.length === 0 && (
            <span className="text-sm text-muted-foreground">
              Upload up to 3 images (optional)
            </span>
          )}
        </div>
      </div>
    </div>
  )}
/>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-[#9B87F5] hover:bg-[#7767BE]">
            {isSubmitting ? "Submitting..." : "Submit Issue"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
