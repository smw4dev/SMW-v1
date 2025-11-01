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

/* --- keep your schema/type and sections unchanged --- */
const formSchema = z
  .object({
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
    fatherName: z.string().min(2, "Father's name is required"),
    fatherOccupation: z.string().min(2, "Father's occupation is required"),
    fatherPhone: z.string().min(1, "Phone number is required"),
    motherName: z.string().min(2, "Mother's name is required"),
    motherOccupation: z.string().min(2, "Mother's occupation is required"),
    motherPhone: z.string().min(1, "Phone number is required"),
    guardianRelation: z.enum(["father", "mother", "other"]),
    guardianContact: z.string().min(1, "Guardian contact is required"),
    jscSchool: z.string().optional().or(z.literal("")),
    jscGrade: z.string().optional().or(z.literal("")),
    sscSchool: z.string().optional().or(z.literal("")),
    sscGrade: z.string().optional().or(z.literal("")),
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
        });
      }
    }
    if (values.sscSchool && values.sscSchool.trim() !== "") {
      if (!values.sscGrade || values.sscGrade.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["sscGrade"],
          message: "Grade is required if school is provided",
        });
      }
    }
    const classesRequireBatch = ["class-8", "class-9", "class-10"];
    if (classesRequireBatch.includes(values.classLevel)) {
      if (!values.batchTiming || values.batchTiming.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["batchTiming"],
          message: "Please select batch timing",
        });
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

/* ----------------- THEME / VISUAL CONSTANTS (polished) ----------------- */
/* Keep structure intact; only refine tokens and classes for a crisper feel. */
const inputFieldClasses = [
  // size + radius
  "h-11 rounded-lg",
  // neutral surface with subtle depth
  "border border-slate-300 bg-white shadow-sm",
  // text + placeholder
  "text-slate-800 placeholder-slate-400",
  // focused state
  "focus-visible:border-brand focus-visible:ring-0 focus:outline-none",
].join(" ");

const selectTriggerClasses = [
  "h-11 w-full rounded-lg pl-3",
  "border border-slate-300 bg-white text-slate-800",
  "focus-visible:border-brand focus-visible:ring-0",
  // make sure size variants still look consistent
  "data-[size=default]:h-11 data-[size=sm]:h-11",
].join(" ");

const textareaClasses = [
  "min-h-[96px] rounded-lg resize-none",
  "border border-slate-300 bg-white shadow-sm",
  "text-slate-800 placeholder-slate-400",
  "focus-visible:border-brand focus-visible:ring-0 focus:outline-none",
].join(" ");

const outlineButtonClasses = [
  "h-11 rounded-lg",
  "border border-slate-300 bg-white text-slate-800",
  "hover:bg-brand/5 focus-visible:ring-0 focus-visible:border-brand",
].join(" ");

/* ----------------- COMPONENT ----------------- */
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
      classLevel: "",
      subject: "",
      batchTiming: "",
      hearAboutUs: "",
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
      {
        value: "c8-special-sat-mon-wed-10am",
        label: "Special: Sat, Mon, Wed (10am)",
      },
    ],
    "class-9": [
      { value: "c9-b1-sun-tue-thu-9am", label: "Batch 1: Sun, Tue, Thu (9am)" },
      {
        value: "c9-b2-sun-tue-thu-11am",
        label: "Batch 2: Sun, Tue, Thu (11am)",
      },
      { value: "c9-b3-sun-tue-thu-4pm", label: "Batch 3: Sun, Tue, Thu (4pm)" },
      { value: "c9-b4-sun-tue-thu-6pm", label: "Batch 4: Sun, Tue, Thu (6pm)" },
      {
        value: "c9-special-sat-mon-wed-1230pm",
        label: "Special: Sat, Mon, Wed (12.30pm)",
      },
    ],
    "class-10": [
      {
        value: "c10-b1-sun-tue-thu-7am",
        label: "Batch 1: Sun, Tue, Thu (7am)",
      },
      {
        value: "c10-b2-sun-tue-thu-10am",
        label: "Batch 2: Sun, Tue, Thu (10am)",
      },
      {
        value: "c10-b3-sun-tue-thu-1230pm",
        label: "Batch 3: Sun, Tue, Thu (12.30pm)",
      },
      {
        value: "c10-b4-sun-tue-thu-5pm",
        label: "Batch 4: Sun, Tue, Thu (5pm)",
      },
      {
        value: "c10-special-sat-mon-wed-11pm",
        label: "Special: Sat, Mon, Wed (11pm)",
      },
      {
        value: "c10-commerce-arts-sat-mon-wed-6pm",
        label: "Commerce/Arts: Sat, Mon, Wed (6pm)",
      },
    ],
    "class-11": [],
    "class-12": [],
  };

  useEffect(() => {
    // Reset dependent fields when class changes, without triggering early validation
    form.setValue("subject", "", {
      shouldValidate: false,
      shouldDirty: false,
    });
    form.setValue("batchTiming", "", {
      shouldValidate: false,
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
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="rounded-2xl border border-slate-100 bg-white/95 p-5 shadow-[0_6px_24px_rgba(2,6,23,.06)] backdrop-blur">
                <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide text-slate-700">
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
                          "w-full text-left p-3 rounded-xl transition-all group",
                          isActive
                            ? "border border-brand/30 bg-gray-50 shadow"
                            : "hover:bg-gray-50"
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
                                isActive ? "text-slate-800" : "text-slate-600"
                              )}
                            >
                              {section.title}
                            </span>
                          </div>
                          {completion === 100 ? (
                            <CheckCircle2 className="w-4 h-4 text-brand" />
                          ) : (
                            <span className="text-xs text-slate-600">
                              {completion}%
                            </span>
                          )}
                        </div>
                        <div className="w-full h-1.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-500",
                              completion === 100 ? "bg-brand" : "bg-brand/70"
                            )}
                            style={{ width: `${completion}%` }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="hidden rounded-2xl border border-slate-100 bg-white/95 p-5 space-y-2 shadow-[0_6px_24px_rgba(2,6,23,.06)] backdrop-blur lg:block">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-700">
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
                  <div className="flex items-center gap-3 mb-6 pb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-slate-100 shadow-sm">
                      <User className="h-5 w-5 text-brand" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-800">
                        <span className="text-brand">Personal Information</span>
                      </h2>
                      <p className="text-sm text-slate-600">
                        Tell us about yourself
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-white/95 p-6 space-y-6 shadow-[0_6px_24px_rgba(2,6,23,.06)] backdrop-blur">
                    {/* Photo Upload */}
                    <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white p-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-300 group flex-shrink-0 bg-gray-50">
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
                            <div className="flex h-full w-full items-center justify-center">
                              <Upload className="h-6 w-6 text-slate-500" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <Label
                            htmlFor="photo"
                            className="mb-1 block text-sm font-medium text-slate-800"
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
                            <div className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 transition-colors hover:bg-gray-50">
                              <Upload className="h-4 w-4 text-slate-600" />
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
                            <FormLabel className="text-slate-800">
                              Full Name *
                            </FormLabel>
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
                            <FormLabel className="text-slate-800">
                              Nickname
                            </FormLabel>
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
                            <FormLabel className="text-slate-800">
                              Date of Birth *
                            </FormLabel>
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
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-60" />
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
                            <FormLabel className="text-slate-800">
                              Gender *
                            </FormLabel>
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
                            <FormLabel className="text-slate-800">
                              Contact Number *
                            </FormLabel>
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
                            <FormLabel className="text-slate-800">
                              Email Address *
                            </FormLabel>
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
                            <FormLabel className="text-slate-800">
                              Home District *
                            </FormLabel>
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
                          <FormLabel className="text-slate-800">
                            Present Address *
                          </FormLabel>
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
                  <div className="flex items-center gap-3 mb-6 pb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-gray-100 shadow-sm">
                      <Users className="h-5 w-5 text-brand" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-800">
                        <span className="text-brand">
                          Parents &amp; Guardian Information
                        </span>
                      </h2>
                      <p className="text-sm text-slate-600">
                        Help us reach the right guardian quickly
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-6">
                    {/* Father's Information */}
                    <div className="rounded-xl border border-slate-100 bg-white p-4">
                      <div className="mb-3">
                        <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-slate-700">
                          Father&apos;s Details
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="fatherName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-800">
                                Father&apos;s Name *
                              </FormLabel>
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
                              <FormLabel className="text-slate-800">
                                Occupation *
                              </FormLabel>
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
                              <FormLabel className="text-slate-800">
                                Contact Number *
                              </FormLabel>
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
                    <div className="rounded-xl border border-slate-100 bg-white p-4">
                      <div className="mb-3">
                        <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-slate-700">
                          Mother&apos;s Details
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="motherName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-800">
                                Mother&apos;s Name *
                              </FormLabel>
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
                              <FormLabel className="text-slate-800">
                                Occupation *
                              </FormLabel>
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
                              <FormLabel className="text-slate-800">
                                Contact Number *
                              </FormLabel>
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
                    <div className="rounded-xl border border-slate-100 bg-white p-4">
                      <div className="mb-3">
                        <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-slate-700">
                          Guardian Details
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="guardianRelation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-800">
                                Guardian Relation *
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger
                                    className={selectTriggerClasses}
                                  >
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
                              <FormLabel className="text-slate-800">
                                Guardian Contact Number *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter contact number"
                                  readOnly={isGuardianAutoFill}
                                  className={cn(
                                    inputFieldClasses,
                                    isGuardianAutoFill &&
                                      "bg-gray-50 text-slate-600"
                                  )}
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

                {/* Educational Qualifications */}
                <section id="education" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6 pb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-gray-100 shadow-sm">
                      <GraduationCap className="h-5 w-5 text-brand" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-800">
                        <span className="text-brand">
                          Educational Background
                        </span>
                      </h2>
                      <p className="text-sm text-slate-600">
                        Share your JSC and SSC achievements to help us guide you
                        better
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-white/95 p-6 space-y-6 shadow-[0_6px_24px_rgba(2,6,23,.06)] backdrop-blur">
                    <div className="rounded-xl border border-slate-100 bg-white p-4">
                      <div className="mb-3">
                        <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-slate-700">
                          JSC Exam Details
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="jscSchool"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-800">
                                School
                              </FormLabel>
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
                              <FormLabel className="text-slate-800">
                                Grade
                              </FormLabel>
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

                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                      <div className="mb-3">
                        <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-slate-700">
                          SSC Exam Details
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="sscSchool"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-800">
                                School
                              </FormLabel>
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
                              <FormLabel className="text-slate-800">
                                Grade
                              </FormLabel>
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
                  <div className="flex items-center gap-3 mb-6 pb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-gray-100 shadow-sm">
                      <Clock className="h-5 w-5 text-brand" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-800">
                        <span className="text-brand">Batch Selection</span>
                      </h2>
                      <p className="text-sm text-slate-600">
                        Choose your preferred class, subject, timing, and tell
                        us how you heard about us
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-white/95 p-6 space-y-6 shadow-[0_6px_24px_rgba(2,6,23,.06)] backdrop-blur">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="classLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-800">
                              Class *
                            </FormLabel>
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
                                <SelectItem value="class-10">
                                  Class 10
                                </SelectItem>
                                <SelectItem value="class-11">
                                  Class 11
                                </SelectItem>
                                <SelectItem value="class-12">
                                  Class 12
                                </SelectItem>
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
                            <FormLabel className="text-slate-800">
                              Subject *
                            </FormLabel>
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
                                {(
                                  subjectOptions[selectedClass as string] || []
                                ).map((opt) => (
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
                            <FormLabel className="text-slate-800">
                              Batch Timing
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={
                                !selectedClass ||
                                (batchOptions[selectedClass as string]
                                  ?.length ?? 0) === 0
                              }
                            >
                              <FormControl>
                                <SelectTrigger className={selectTriggerClasses}>
                                  <SelectValue
                                    placeholder={
                                      (batchOptions[selectedClass as string]
                                        ?.length ?? 0) === 0
                                        ? "No batch available currently"
                                        : "Select schedule"
                                    }
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {(
                                  batchOptions[selectedClass as string] || []
                                ).map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {(batchOptions[selectedClass as string]?.length ??
                              0) === 0 &&
                              selectedClass && (
                                <p className="text-xs text-slate-600 mt-1">
                                  No batch available currently for the selected
                                  class.
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
                          <FormLabel className="text-slate-800">
                            How did you hear about us?
                          </FormLabel>
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
                          <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                            <FormControl>
                              <Checkbox
                                checked={!!field.value}
                                onCheckedChange={(checked) =>
                                  field.onChange(checked === true)
                                }
                                className="mt-1"
                              />
                            </FormControl>
                            <div className="space-y-1 text-sm">
                              <FormLabel className="text-base text-slate-800">
                                Previous student of Sunny&apos;s Math World
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
                <div className="pt-6 border-t border-slate-200 space-y-6">
                  <FormField
                    control={form.control}
                    name="agreeTerms"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) =>
                                field.onChange(checked === true)
                              }
                              className="mt-1"
                            />
                          </FormControl>
                          <div className="space-y-1 text-sm">
                            <FormLabel className="text-base text-slate-800">
                              I agree to the terms &amp; conditions *
                            </FormLabel>
                            <p className="text-slate-600">
                              I confirm that the information shared is accurate
                              and I consent to continue to the payment step.
                            </p>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="rounded-2xl border border-slate-100 bg-gray-50 p-6 text-slate-700 shadow-sm">
                    <p className="text-center text-sm text-slate-600">
                      Once we receive your form, our admissions team will reach
                      out within 24-48 hours with payment instructions and the
                      next onboarding steps.
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      disabled={isSubmitting || !hasAgreedToTerms}
                      size="lg"
                      className="min-w-[240px] h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-brand to-brand-emphasis text-brand-foreground shadow-lg transition-colors hover:from-brand-emphasis hover:to-brand disabled:opacity-60"
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
          data={{
            ...submittedData,
            nickname: submittedData.nickname ?? "",
            jscSchool: submittedData.jscSchool ?? "",
            jscGrade: submittedData.jscGrade ?? "",
            sscSchool: submittedData.sscSchool ?? "",
            sscGrade: submittedData.sscGrade ?? "",
            batchTiming: submittedData.batchTiming ?? "",
            hearAboutUs: submittedData.hearAboutUs ?? "",
          }}
          photoPreview={photoPreview}
        />
      )}
    </>
  );
}
