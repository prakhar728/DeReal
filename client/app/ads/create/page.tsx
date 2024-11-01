"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import UploadPhotoModal from "@/components/UploadModal/UploadModal";
import { uploadJSONToIPFS } from "@/lib/ipfs";
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { AD_CONTRACT, AD_CONTRACT_ABI } from "@/lib/contract";

const formSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  adDomain: z.string({
    message: "Please enter a valid string.",
  }),
  description: z.string({
    message: "Please enter a valid string.",
  }),
  hashtags: z.string().refine((value) => value.split(",").length <= 5, {
    message: "Please enter up to 5 hashtags, separated by commas.",
  }),
  websiteLink: z.string().url({
    message: "Please enter a valid URL for your website.",
  }),
  bannerImage: z.instanceof(File).refine((file) => file.size <= 5000000, {
    message: "The file should be less than 5MB.",
  }),
  paymentMode: z.enum(["pay-once", "subscription", "combo"]),
});

export default function CreateAdPage() {
  const [mounted, setMounted] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [hasTimer, sethasTimer] = useState(false);
  const [eventId, seteventId] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageFile, setimageFile] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      adDomain: "",
      hashtags: "",
      websiteLink: "",
      description: "",
      paymentMode: "pay-once",
    },
  });

  const { writeContract, data: hash, error } = useWriteContract();

  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const { data: adAmount } = useReadContract({
    abi: AD_CONTRACT_ABI,
    address: AD_CONTRACT,
    functionName: "adCost",
    args: [],
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {

    const data = {
      companyName: values["companyName"],
      adDomain: values["adDomain"],
      hashtags: values["hashtags"].split(","),
      websiteLink: values["websiteLink"],
      description: values["description"],
      bannerImage: imageFile,
      paymentMode: values["paymentMode"],
    }
    
    const cid = await uploadJSONToIPFS(data);
    writeContract({
      abi: AD_CONTRACT_ABI,
      functionName: "submitAd",
      address: AD_CONTRACT,
      args: [cid.IpfsHash],
      value: BigInt(adAmount as bigint),
    });
  }

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Ad Created Successfully!",
        description: "Your ad has been submitted and payment processed.",
      });
    }

    if (error) {
      toast({
        title: "Error",
        description: "There was an error creating your ad. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    }
  }, [isSuccess, error]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <div className="min-h-screen pb-16">
      <Header />

      <UploadPhotoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        hasTimer={hasTimer}
        eventId={eventId}
      />
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create Your Ad</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="adDomain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ad Domain</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Healthcare or Technology"
                        {...field}
                      />
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
                    <FormLabel>Ad Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief description of your ad (max 100 characters)" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide a short, catchy description for your ad.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hashtags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relevant Hashtags</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="#tech, #innovation, #web3"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter up to 5 hashtags, separated by commas.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="websiteLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website Link</FormLabel>
                    <FormControl>
                      <Input placeholder="https://yourwebsite.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bannerImage"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Banner Image or GIF</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];

                          if (file) {
                            onChange(file);
                            const reader = new FileReader();
                            reader.onloadend = async () => {
                              const [, imageContent] = (
                                reader.result as string
                              ).split(",");
                              const cid = await uploadJSONToIPFS(imageContent);
                              setimageFile(cid.IpfsHash);

                              setPreviewImage(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        {...rest}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload a banner image or GIF (max 5MB).
                    </FormDescription>
                    <FormMessage />
                    {previewImage && (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="mt-2 max-w-full h-auto"
                      />
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentMode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Mode</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a payment mode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pay-once">Pay Once</SelectItem>
                        <SelectItem value="subscription" disabled>
                          Subscription (Coming Soon)
                        </SelectItem>
                        <SelectItem value="combo" disabled>
                          Combo (Coming Soon)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full text-black">
                Create Ad (0.0000000001 ETH)
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Coming soon: Subscription and Combo payment options!
          </p>
        </CardFooter>
      </Card>

      <Footer
        setIsModalOpen={setIsModalOpen}
        sethasTimer={sethasTimer}
        setEventId={seteventId}
      />
    </div>
  );
}
