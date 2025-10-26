"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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

const formSchema = z
  .object({
    // Personal Information
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    nickname: z.string().optional().or(z.literal("")),
    homeDistrict: z.string().min(2, "Please enter your home district"),
    dateOfBirth: z.date({
      message: "Date of birth is required",
    }),
    gender: z.string().min(1, "Please select gender"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    address: z.string().min(5, "Address must be at least 5 characters"),

    // Parents Information (all mandatory)
    fatherName: z.string().min(2, "Father's name is required"),
    fatherOccupation: z.string().min(2, "Father's occupation is required"),
    fatherPhone: z.string().min(1, "Phone number is required"),
    motherName: z.string().min(2, "Mother's name is required"),
    motherOccupation: z.string().min(2, "Mother's occupation is required"),
    motherPhone: z.string().min(1, "Phone number is required"),
    guardianRelation: z.enum(["father", "mother", "other"], {
      required_error: "Please select guardian relation",
    }),
    guardianContact: z
      .string()
      .min(1, "Guardian contact is required"),

    // Educational Qualifications (optional; if school filled then grade required)
    jscSchool: z.string().optional().or(z.literal("")),
    jscGrade: z.string().optional().or(z.literal("")),
    sscSchool: z.string().optional().or(z.literal("")),
    sscGrade: z.string().optional().or(z.literal("")),

    // Batch Information (mandatory selection)
    classLevel: z.string().min(1, "Please select class"),
    subject: z.string().min(1, "Please select subject"),
    batchTiming: z.string().optional().or(z.literal("")),
    hearAboutUs: z.string().optional().or(z.literal("")),
    prevStudent: z.boolean().optional(),
    agreeTerms: z
      .boolean()
      .refine((value) => value === true, "You must agree to continue"),
  })
  .superRefine((values, ctx) => {
    if (values.jscSchool && values.jscSchool.trim() !== "") {
      if (!values.jscGrade || values.jscGrade.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["jscGrade"],
          message: "Grade is required if school is provided",
        })
      }
    }
    if (values.sscSchool && values.sscSchool.trim() !== "") {
      if (!values.sscGrade || values.sscGrade.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["sscGrade"],
          message: "Grade is required if school is provided",
        })
      }
    }
    // Require batch timing for classes 8-10, allow none for 11-12
    const classesRequireBatch = ["class-8", "class-9", "class-10"]
    if (classesRequireBatch.includes(values.classLevel)) {
      if (!values.batchTiming || values.batchTiming.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["batchTiming"],
          message: "Please select batch timing",
        })
      }
    }
  });

type FormData = z.infer<typeof formSchema>;

const sections = [
  {
    id: "personal",
    title: "Personal Info",
    icon: User,
    fields: [
      "fullName",
      "homeDistrict",
      "dateOfBirth",
      "gender",
      "email",
      "phone",
      "address",
    ],
  },
  {
    id: "parents",
    title: "Parents & Guardian",
    icon: Users,
    fields: [
      "fatherName",
      "fatherOccupation",
      "fatherPhone",
      "motherName",
      "motherOccupation",
      "motherPhone",
      "guardianRelation",
      "guardianContact",
    ],
  },
  {
    id: "education",
    title: "Education",
    icon: GraduationCap,
    fields: ["jscSchool", "jscGrade", "sscSchool", "sscGrade"],
  },
  {
    id: "batch",
    title: "Batch Selection",
    icon: Clock,
    fields: ["classLevel", "subject", "batchTiming", "agreeTerms"],
  },
];

const inputFieldClasses =
  "h-11 border border-brand/30 bg-white/90 focus-visible:ring-brand/40 focus-visible:ring-offset-0";
const selectTriggerClasses =
  "h-11 w-full rounded-md border border-brand/30 bg-white/90 pl-3 text-slate-700 focus-visible:ring-brand/40 focus-visible:ring-offset-0 data-[size=default]:h-11 data-[size=sm]:h-11";
const textareaClasses =
  "min-h-[90px] resize-none border border-brand/30 bg-white/90 focus-visible:ring-brand/40 focus-visible:ring-offset-0";
const outlineButtonClasses =
  "h-11 border-brand/30 bg-white/90 text-slate-700 hover:bg-brand/5";

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
      nickname: "",
      homeDistrict: "",
      email: "",
      phone: "",
      address: "",
      fatherName: "",
      fatherOccupation: "",
      fatherPhone: "",
      motherName: "",
      motherOccupation: "",
      motherPhone: "",
      guardianRelation: undefined,
      guardianContact: "",
      jscSchool: "",
      jscGrade: "",
      sscSchool: "",
      sscGrade: "",
      classLevel: undefined,
      subject: undefined,
      batchTiming: undefined,
      hearAboutUs: undefined,
      prevStudent: false,
      agreeTerms: false,
    },
  });

  const watchedFields = form.watch();
  const hasAgreedToTerms = form.watch("agreeTerms");
  const guardianRelation = form.watch("guardianRelation");
  const fatherPhone = form.watch("fatherPhone");
  const motherPhone = form.watch("motherPhone");
  const selectedClass = form.watch("classLevel");
  const isGuardianAutoFill =
    guardianRelation === "father" || guardianRelation === "mother";

  // Dynamic options for subjects and batches based on class
  const subjectOptions: Record<string, { value: string; label: string }[]> = {
    "class-8": [
      { value: "math", label: "Math" },
      { value: "science", label: "Science" },
    ],
    "class-9": [
      { value: "general-math", label: "General Math" },
      { value: "higher-math", label: "Higher Math" },
    ],
    "class-10": [
      { value: "general-math", label: "General Math" },
      { value: "higher-math", label: "Higher Math" },
    ],
    "class-11": [
      { value: "math-1st", label: "Math 1st Paper" },
      { value: "math-2nd", label: "Math 2nd Paper" },
    ],
    "class-12": [
      { value: "math-1st", label: "Math 1st Paper" },
      { value: "math-2nd", label: "Math 2nd Paper" },
    ],
  };

  const batchOptions: Record<string, { value: string; label: string }[]> = {
    "class-8": [
      { value: "c8-b1-sun-tue-thu-8am", label: "Batch 1: Sun, Tue, Thu (8am)" },
      { value: "c8-b2-sun-tue-thu-3pm", label: "Batch 2: Sun, Tue, Thu (3pm)" },
      { value: "c8-special-sat-mon-wed-10am", label: "Special: Sat, Mon, Wed (10am)" },
    ],
    "class-9": [
      { value: "c9-b1-sun-tue-thu-9am", label: "Batch 1: Sun, Tue, Thu (9am)" },
      { value: "c9-b2-sun-tue-thu-11am", label: "Batch 2: Sun, Tue, Thu (11am)" },
      { value: "c9-b3-sun-tue-thu-4pm", label: "Batch 3: Sun, Tue, Thu (4pm)" },
      { value: "c9-b4-sun-tue-thu-6pm", label: "Batch 4: Sun, Tue, Thu (6pm)" },
      { value: "c9-special-sat-mon-wed-1230pm", label: "Special: Sat, Mon, Wed (12.30pm)" },
    ],
    "class-10": [
      { value: "c10-b1-sun-tue-thu-7am", label: "Batch 1: Sun, Tue, Thu (7am)" },
      { value: "c10-b2-sun-tue-thu-10am", label: "Batch 2: Sun, Tue, Thu (10am)" },
      { value: "c10-b3-sun-tue-thu-1230pm", label: "Batch 3: Sun, Tue, Thu (12.30pm)" },
      { value: "c10-b4-sun-tue-thu-5pm", label: "Batch 4: Sun, Tue, Thu (5pm)" },
      { value: "c10-special-sat-mon-wed-11pm", label: "Special: Sat, Mon, Wed (11pm)" },
      { value: "c10-commerce-arts-sat-mon-wed-6pm", label: "Commerce/Arts: Sat, Mon, Wed (6pm)" },
    ],
    "class-11": [],
    "class-12": [],
  };

  useEffect(() => {
    // Reset dependent fields when class changes
    form.setValue("subject", undefined as any, {
      shouldValidate: true,
      shouldDirty: false,
    });
    form.setValue("batchTiming", undefined as any, {
      shouldValidate: true,
      shouldDirty: false,
    });
  }, [selectedClass, form]);

  const getSectionCompletion = (sectionFields: string[]) => {
    const filledFields = sectionFields.filter((field) => {
      if (
        field === "batchTiming" &&
        (batchOptions[selectedClass as string]?.length ?? 0) === 0
      ) {
        return true;
      }
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

  useEffect(() => {
    if (guardianRelation === "father") {
      form.setValue("guardianContact", fatherPhone || "", {
        shouldValidate: true,
        shouldDirty: false,
      });
    } else if (guardianRelation === "mother") {
      form.setValue("guardianContact", motherPhone || "", {
        shouldValidate: true,
        shouldDirty: false,
      });
    }
  }, [guardianRelation, fatherPhone, motherPhone, form]);

  useEffect(() => {
    if (guardianRelation === "other") {
      form.setValue("guardianContact", "", {
        shouldValidate: true,
        shouldDirty: false,
      });
    }
  }, [guardianRelation, form]);

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
      <div className="mx-auto w-full max-w-6xl  px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="rounded-lg border border-brand/20 bg-gradient-to-br from-brand/5 via-white to-white p-4 shadow-sm">
                <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide text-brand">
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
                            ? "border border-brand/40 bg-brand/10 shadow-sm"
                            : "hover:bg-brand/5"
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Icon
                              className={cn(
                                "w-4 h-4",
                                isActive ? "text-brand" : "text-slate-400"
                              )}
                            />
                            <span
                              className={cn(
                                "text-sm font-medium",
                                isActive ? "text-brand" : "text-slate-500"
                              )}
                            >
                              {section.title}
                            </span>
                          </div>
                          {completion === 100 ? (
                            <CheckCircle2 className="w-4 h-4 text-brand" />
                          ) : (
                            <span className="text-xs text-brand">
                              {completion}%
                            </span>
                          )}
                        </div>
                        <div className="w-full h-1.5 overflow-hidden rounded-full bg-brand/10">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-500",
                              completion === 100 ? "bg-brand" : "bg-brand/60"
                            )}
                            style={{ width: `${completion}%` }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="hidden rounded-lg border border-brand/20 bg-brand/5 p-4 space-y-2 shadow-sm lg:block">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-brand">
                  Quick Tips
                </p>
                <div className="space-y-2 text-xs text-slate-600">
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
                className="admission-form space-y-12"
              >
                {/* Personal Information */}
                <section id="personal" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6 border-b border-brand/20 pb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10">
                      <User className="h-5 w-5 text-brand" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-brand">
                        Personal Information
                      </h2>
                      <p className="text-sm text-slate-600">
                        Tell us about yourself
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Photo Upload */}
                    <div className="rounded-lg border-2 border-dashed border-brand/30 bg-brand/5 p-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-brand/30 group flex-shrink-0">
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
                            <div className="flex h-full w-full items-center justify-center bg-brand/10">
                              <Upload className="h-6 w-6 text-brand" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <Label
                            htmlFor="photo"
                            className="mb-1 block text-sm font-medium text-brand"
                          >
                            Student Photo
                          </Label>
                          <p className="mb-3 text-xs text-slate-600">
                            Upload a recent passport-size photograph (JPG, PNG -
                            Max 2MB)
                          </p>
                          <Label
                            htmlFor="photo"
                            className="inline-block cursor-pointer"
                          >
                            <div className="inline-flex items-center gap-2 rounded-lg border border-brand/30 bg-gradient-to-r from-brand to-brand-emphasis px-4 py-2 text-sm font-medium text-brand-foreground transition-colors hover:from-brand-emphasis hover:to-brand">
                              <Upload className="h-4 w-4" />
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
                            <FormLabel className="text-brand">Full Name *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Rahul Sharma"
                                className={inputFieldClasses}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="nickname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-brand">Nickname</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Rahi"
                                className={inputFieldClasses}
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
                            <FormLabel className="text-brand">Date of Birth *</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      outlineButtonClasses,
                                      !field.value && "text-slate-500"
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
                            <FormLabel className="text-brand">Gender *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className={selectTriggerClasses}>
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
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-brand">Contact Number *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="9876543210"
                                className={inputFieldClasses}
                                {...field}
                              />
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
                            <FormLabel className="text-brand">Email Address *</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="student@example.com"
                                className={inputFieldClasses}
                                {...field}
                              />
                            </FormControl>
                            
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="homeDistrict"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-brand">Home District *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Dhaka"
                                className={inputFieldClasses}
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
                          <FormLabel className="text-brand">Present Address *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Street, Area, City, State - PIN Code"
                              className={textareaClasses}
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
                  <div className="flex items-center gap-3 mb-6 border-b border-brand/20 pb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10">
                      <Users className="h-5 w-5 text-brand" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-brand">
                        Parents &amp; Guardian Information
                      </h2>
                      <p className="text-sm text-slate-600">
                        Help us reach the right guardian quickly
                      </p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* Father's Information */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-px flex-1 bg-brand/20" />
                        <span className="text-sm font-medium text-brand px-3">
                          Father&apos;s Details
                        </span>
                        <div className="h-px flex-1 bg-brand/20" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="fatherName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-brand">Father&apos;s Name *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. Rajesh Sharma"
                                  className={inputFieldClasses}
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
                              <FormLabel className="text-brand">Occupation *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. Business, Service"
                                  className={inputFieldClasses}
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
                            <FormItem>
                              <FormLabel className="text-brand">Contact Number *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="9876543210"
                                  className={inputFieldClasses}
                                  {...field}
                                />
                              </FormControl>
                              
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Mother's Information */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-px flex-1 bg-brand/20" />
                        <span className="text-sm font-medium text-brand px-3">
                          Mother&apos;s Details
                        </span>
                        <div className="h-px flex-1 bg-brand/20" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="motherName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-brand">Mother&apos;s Name *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. Priya Sharma"
                                  className={inputFieldClasses}
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
                              <FormLabel className="text-brand">Occupation *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. Homemaker, Teacher"
                                  className={inputFieldClasses}
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
                            <FormItem>
                              <FormLabel className="text-brand">Contact Number *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="9876543210"
                                  className={inputFieldClasses}
                                  {...field}
                                />
                              </FormControl>
                              
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Guardian Information */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-px flex-1 bg-brand/20" />
                        <span className="text-sm font-medium text-brand px-3">
                          Guardian Details
                        </span>
                        <div className="h-px flex-1 bg-brand/20" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="guardianRelation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-brand">Guardian Relation *</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className={selectTriggerClasses}>
                                    <SelectValue placeholder="Select relation" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="father">Father</SelectItem>
                                  <SelectItem value="mother">Mother</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="guardianContact"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-brand">Guardian Contact Number *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter contact number"
                                  readOnly={isGuardianAutoFill}
                                  className={cn(
                                    inputFieldClasses,
                                    isGuardianAutoFill &&
                                      "bg-slate-50 text-slate-600"
                                  )}
                                  {...field}
                                />
                              </FormControl>
                              {/* <p className="text-xs text-slate-500">
                                {isGuardianAutoFill
                                  ? "This number is synced with the selected parent."
                                  : "Please enter the contact number for the guardian."}
                              </p> */}
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
                  <div className="flex items-center gap-3 mb-6 border-b border-brand/20 pb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10">
                      <GraduationCap className="h-5 w-5 text-brand" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-brand">
                        Educational Background
                      </h2>
                      <p className="text-sm text-slate-600">
                        Share your JSC and SSC achievements to help us guide you better
                      </p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-px flex-1 bg-brand/20" />
                        <span className="text-sm font-medium text-brand px-3">
                          JSC Exam Details
                        </span>
                        <div className="h-px flex-1 bg-brand/20" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="jscSchool"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-brand">School</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. Sunny High School"
                                  className={inputFieldClasses}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="jscGrade"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-brand">Grade</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. GPA 4.89 / A"
                                  className={inputFieldClasses}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-px flex-1 bg-brand/20" />
                        <span className="text-sm font-medium text-brand px-3">
                          SSC Exam Details
                        </span>
                        <div className="h-px flex-1 bg-brand/20" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="sscSchool"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-brand">School</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. National Model School"
                                  className={inputFieldClasses}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="sscGrade"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-brand">Grade</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. GPA 5.00 / A+"
                                  className={inputFieldClasses}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Batch Information */}
                <section id="batch" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6 border-b border-brand/20 pb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10">
                      <Clock className="h-5 w-5 text-brand" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-brand">
                        Batch Selection
                      </h2>
                      <p className="text-sm text-slate-600">
                        Choose your preferred class, subject, timing, and tell us how you heard about us
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="classLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-brand">Class *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className={selectTriggerClasses}>
                                  <SelectValue placeholder="Select class" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
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
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-brand">Subject *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={!selectedClass}
                            >
                              <FormControl>
                                <SelectTrigger className={selectTriggerClasses}>
                                  <SelectValue placeholder="Select subject" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {(subjectOptions[selectedClass as string] || []).map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="batchTiming"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="text-brand">Batch Timing</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={!selectedClass || (batchOptions[selectedClass as string]?.length ?? 0) === 0}
                            >
                              <FormControl>
                                <SelectTrigger className={selectTriggerClasses}>
                                  <SelectValue placeholder={(batchOptions[selectedClass as string]?.length ?? 0) === 0 ? "No batch available currently" : "Select schedule"} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {(batchOptions[selectedClass as string] || []).map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {(batchOptions[selectedClass as string]?.length ?? 0) === 0 && selectedClass && (
                              <p className="text-xs text-slate-600 mt-1">
                                No batch available currently for the selected class.
                              </p>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="hearAboutUs"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-brand">How did you hear about us?</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className={selectTriggerClasses}>
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
                          
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Previous student checkbox (optional) */}
                    <FormField
                      control={form.control}
                      name="prevStudent"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-start gap-3 rounded-lg border border-brand/20 bg-white/80 p-4 shadow-sm">
                            <FormControl>
                              <Checkbox
                                checked={!!field.value}
                                onCheckedChange={(checked) =>
                                  field.onChange(checked === true)
                                }
                                className="mt-1 border-brand/50"
                              />
                            </FormControl>
                            <div className="space-y-1 text-sm">
                              <FormLabel className="text-base text-brand">
                                Previous student of Sunny's Math World
                              </FormLabel>
                              <p className="text-slate-600">
                                Check if you studied here previously.
                              </p>
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </section>

                {/* Submit Section */}
                <div className="pt-6 border-t border-brand/20 space-y-6">
                  <FormField
                    control={form.control}
                    name="agreeTerms"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-start gap-3 rounded-lg border border-brand/20 bg-white/80 p-4 shadow-sm">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) =>
                                field.onChange(checked === true)
                              }
                              className="mt-1 border-brand/50"
                            />
                          </FormControl>
                          <div className="space-y-1 text-sm">
                            <FormLabel className="text-base text-brand">
                              I agree to the terms &amp; conditions *
                            </FormLabel>
                            <p className="text-slate-600">
                              I confirm that the information shared is accurate and I consent to continue to the payment step.
                            </p>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="rounded-lg border border-brand/20 bg-brand/5 p-6 text-slate-700 shadow-sm">
                    <p className="text-center text-sm text-slate-600">
                      Once we receive your form, our admissions team will reach out within 24-48 hours with payment instructions and the next onboarding steps.
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      disabled={isSubmitting || !hasAgreedToTerms}
                      size="lg"
                      className="min-w-[240px] h-12 text-base font-semibold bg-gradient-to-r from-brand to-brand-emphasis text-brand-foreground shadow-lg transition-colors hover:from-brand-emphasis hover:to-brand disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full border-2 border-brand-foreground border-t-transparent animate-spin" />
                          Processing...
                        </div>
                      ) : (
                        "Proceed to Payment"
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
