"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon,
  Upload,
  User,
  Users,
  GraduationCap,
  Clock,
  X,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ConfirmationModal from "./ConfirmationModal";

const formSchema = z.object({
  // Personal Information
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  dateOfBirth: z.date({
    message: "Date of birth is required",
  }),
  gender: z.string().min(1, "Please select gender"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),

  // Parents Information
  fatherName: z.string().min(2, "Father's name is required"),
  fatherOccupation: z.string().min(2, "Father's occupation is required"),
  fatherPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  motherName: z.string().min(2, "Mother's name is required"),
  motherOccupation: z.string().min(2, "Mother's occupation is required"),
  motherPhone: z.string().min(10, "Phone number must be at least 10 digits"),

  // Educational Qualifications
  currentClass: z.string().min(1, "Please select current class"),
  previousSchool: z.string().min(2, "Previous school name is required"),
  previousPercentage: z.string().min(1, "Previous percentage is required"),
  mathsMarks: z.string().min(1, "Maths marks are required"),

  // Batch Information
  preferredBatch: z.string().min(1, "Please select preferred batch"),
  courseType: z.string().min(1, "Please select course type"),
  startDate: z.date({
    message: "Start date is required",
  }),

  // Additional
  medicalConditions: z.string().optional(),
  emergencyContact: z.string().min(10, "Emergency contact is required"),
  hearAboutUs: z.string().min(1, "Please tell us how you heard about us"),
});

type FormData = z.infer<typeof formSchema>;

const sections = [
  {
    id: "personal",
    title: "Personal Info",
    icon: User,
    fields: ["fullName", "dateOfBirth", "gender", "email", "phone", "address"],
  },
  {
    id: "parents",
    title: "Parents Info",
    icon: Users,
    fields: [
      "fatherName",
      "fatherOccupation",
      "fatherPhone",
      "motherName",
      "motherOccupation",
      "motherPhone",
    ],
  },
  {
    id: "education",
    title: "Education",
    icon: GraduationCap,
    fields: [
      "currentClass",
      "previousSchool",
      "previousPercentage",
      "mathsMarks",
    ],
  },
  {
    id: "batch",
    title: "Batch & Course",
    icon: Clock,
    fields: [
      "preferredBatch",
      "courseType",
      "startDate",
      "emergencyContact",
      "medicalConditions",
      "hearAboutUs",
    ],
  },
];

export default function AdmissionForm() {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);
  const [activeSection, setActiveSection] = useState("personal");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      fatherName: "",
      fatherOccupation: "",
      fatherPhone: "",
      motherName: "",
      motherOccupation: "",
      motherPhone: "",
      previousSchool: "",
      previousPercentage: "",
      mathsMarks: "",
      medicalConditions: "",
      emergencyContact: "",
      hearAboutUs: "",
    },
  });

  const watchedFields = form.watch();

  const getSectionCompletion = (sectionFields: string[]) => {
    const filledFields = sectionFields.filter((field) => {
      const value = watchedFields[field as keyof FormData];
      return value && value !== "";
    }).length;
    return Math.round((filledFields / sectionFields.length) * 100);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map((section) => ({
        id: section.id,
        element: document.getElementById(section.id),
      }));

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const section = sectionElements[i];
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSubmittedData(data);
    setIsSubmitting(false);
    setShowConfirmation(true);
  };

  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="bg-card border rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">
                  Form Progress
                </h3>
                <div className="space-y-3">
                  {sections.map((section) => {
                    const completion = getSectionCompletion(section.fields);
                    const isActive = activeSection === section.id;
                    const Icon = section.icon;

                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={cn(
                          "w-full text-left p-3 rounded-lg transition-all group",
                          isActive
                            ? "bg-primary/10 border border-primary/20"
                            : "hover:bg-muted/50"
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Icon
                              className={cn(
                                "w-4 h-4",
                                isActive
                                  ? "text-primary"
                                  : "text-muted-foreground"
                              )}
                            />
                            <span
                              className={cn(
                                "text-sm font-medium",
                                isActive
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              )}
                            >
                              {section.title}
                            </span>
                          </div>
                          {completion === 100 ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              {completion}%
                            </span>
                          )}
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-500",
                              completion === 100 ? "bg-green-600" : "bg-primary"
                            )}
                            style={{ width: `${completion}%` }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-muted/30 border rounded-lg p-4 space-y-2 hidden lg:block">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Quick Tips
                </p>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p>• All fields marked with * are required</p>
                  <p>• Upload a clear passport-size photo</p>
                  <p>• Provide accurate parent contact details</p>
                  <p>• Review before submitting</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Form */}
          <div className="lg:col-span-9">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-12"
              >
                {/* Personal Information */}
                <section id="personal" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6 pb-3 border-b">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold">
                        Personal Information
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Tell us about yourself
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Photo Upload */}
                    <div className="bg-muted/20 rounded-lg p-6 border-2 border-dashed">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-border group flex-shrink-0">
                          {photoPreview ? (
                            <>
                              <img
                                src={photoPreview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => setPhotoPreview(null)}
                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                              >
                                <X className="w-5 h-5 text-white" />
                              </button>
                            </>
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <Upload className="w-6 h-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <Label
                            htmlFor="photo"
                            className="text-sm font-medium mb-1 block"
                          >
                            Student Photo *
                          </Label>
                          <p className="text-xs text-muted-foreground mb-3">
                            Upload a recent passport-size photograph (JPG, PNG -
                            Max 2MB)
                          </p>
                          <Label
                            htmlFor="photo"
                            className="cursor-pointer inline-block"
                          >
                            <div className="px-4 py-2 bg-background border rounded-lg text-sm font-medium hover:bg-muted transition-colors inline-flex items-center gap-2">
                              <Upload className="w-4 h-4" />
                              Choose Photo
                            </div>
                            <Input
                              id="photo"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handlePhotoUpload}
                            />
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Rahul Sharma"
                                className="h-11"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth *</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full h-11 pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() ||
                                    date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11">
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address *</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="student@example.com"
                                className="h-11"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription className="text-xs">
                              We&apos;ll send admission updates here
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="9876543210"
                                className="h-11"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Complete Address *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Street, Area, City, State - PIN Code"
                              className="resize-none min-h-[90px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>

                {/* Parents Information */}
                <section id="parents" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6 pb-3 border-b">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold">
                        Parents Information
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Guardian contact details for communication
                      </p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* Father's Information */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-px flex-1 bg-border" />
                        <span className="text-sm font-medium text-muted-foreground px-3">
                          Father&apos;s Details
                        </span>
                        <div className="h-px flex-1 bg-border" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="fatherName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Father&apos;s Name *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. Rajesh Sharma"
                                  className="h-11"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="fatherOccupation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Occupation *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. Business, Service"
                                  className="h-11"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="fatherPhone"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Contact Number *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="9876543210"
                                  className="h-11"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription className="text-xs">
                                Primary contact for admission updates
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Mother's Information */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-px flex-1 bg-border" />
                        <span className="text-sm font-medium text-muted-foreground px-3">
                          Mother&apos;s Details
                        </span>
                        <div className="h-px flex-1 bg-border" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="motherName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mother&apos;s Name *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. Priya Sharma"
                                  className="h-11"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="motherOccupation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Occupation *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. Homemaker, Teacher"
                                  className="h-11"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="motherPhone"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Contact Number *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="9876543210"
                                  className="h-11"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription className="text-xs">
                                Alternative contact number
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Educational Qualifications */}
                <section id="education" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6 pb-3 border-b">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold">
                        Educational Background
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Your academic history helps us place you in the right
                        batch
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="currentClass"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current/Target Class *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Select class" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="class-6">Class 6</SelectItem>
                              <SelectItem value="class-7">Class 7</SelectItem>
                              <SelectItem value="class-8">Class 8</SelectItem>
                              <SelectItem value="class-9">Class 9</SelectItem>
                              <SelectItem value="class-10">Class 10</SelectItem>
                              <SelectItem value="class-11">Class 11</SelectItem>
                              <SelectItem value="class-12">Class 12</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="previousSchool"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Previous/Current School *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Delhi Public School"
                              className="h-11"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="previousPercentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Year Overall % *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. 85%"
                              className="h-11"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Your overall percentage in the previous class
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mathsMarks"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mathematics Score *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. 95/100 or 95%"
                              className="h-11"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Your mathematics marks from last year
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>

                {/* Batch Information */}
                <section id="batch" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6 pb-3 border-b">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold">
                        Batch & Course Selection
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Choose your preferred timing and course type
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="preferredBatch"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Batch Timing *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11">
                                  <SelectValue placeholder="Select timing" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="morning-6-8">
                                  Morning Batch (6:00 - 8:00 AM)
                                </SelectItem>
                                <SelectItem value="morning-8-10">
                                  Morning Batch (8:00 - 10:00 AM)
                                </SelectItem>
                                <SelectItem value="afternoon-2-4">
                                  Afternoon Batch (2:00 - 4:00 PM)
                                </SelectItem>
                                <SelectItem value="evening-4-6">
                                  Evening Batch (4:00 - 6:00 PM)
                                </SelectItem>
                                <SelectItem value="evening-6-8">
                                  Evening Batch (6:00 - 8:00 PM)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription className="text-xs">
                              Choose a time that works best with your schedule
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="courseType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Course Type *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11">
                                  <SelectValue placeholder="Select course" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="foundation">
                                  Foundation Course
                                </SelectItem>
                                <SelectItem value="regular">
                                  Regular Course
                                </SelectItem>
                                <SelectItem value="advanced">
                                  Advanced Course
                                </SelectItem>
                                <SelectItem value="crash">
                                  Crash Course
                                </SelectItem>
                                <SelectItem value="competitive">
                                  Competitive Exam Prep
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription className="text-xs">
                              Based on your current skill level
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>When do you want to start? *</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full h-11 pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date()}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="emergencyContact"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Emergency Contact *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Alternative contact number"
                                className="h-11"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription className="text-xs">
                              A number we can reach in case of emergency
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="medicalConditions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Any Medical Conditions? (Optional)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Please mention if there are any health conditions we should be aware of..."
                              className="resize-none min-h-[90px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            This helps us provide better support (kept
                            confidential)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hearAboutUs"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>How did you hear about us? *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Select an option" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="friends">
                                Friends or Family Recommendation
                              </SelectItem>
                              <SelectItem value="social-media">
                                Social Media (Facebook, Instagram)
                              </SelectItem>
                              <SelectItem value="newspaper">
                                Newspaper Advertisement
                              </SelectItem>
                              <SelectItem value="website">
                                Website / Google Search
                              </SelectItem>
                              <SelectItem value="student">
                                Current Student Reference
                              </SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-xs">
                            Helps us understand what&apos;s working
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>

                {/* Submit Section */}
                <div className="pt-6 border-t">
                  <div className="bg-muted/30 rounded-lg p-6 mb-6">
                    <p className="text-sm text-muted-foreground text-center">
                      By submitting this form, you agree to our terms and
                      conditions. We&apos;ll contact you within 24-48 hours to
                      confirm your admission and payment details.
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      size="lg"
                      className="min-w-[240px] h-12 text-base font-semibold"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                          Submitting Application...
                        </div>
                      ) : (
                        "Submit Admission Form"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>

      {submittedData && (
        <ConfirmationModal
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          data={submittedData}
          photoPreview={photoPreview}
        />
      )}
    </>
  );
}
