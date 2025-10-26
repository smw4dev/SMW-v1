"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ArrowRight,
  CalendarRange,
  ChevronDown,
  Lock,
  Mail,
  Phone,
  UploadCloud,
} from "lucide-react";

type AdmissionFormState = {
  studentFullName: string;
  nickName: string;
  dateOfBirth: string;
  sex: "Male" | "Female" | "Other" | "";
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  presentAddress: string;
  homeDistrict: string;
  studentMobile: string;
  guardianMobile: string;
  jscSchool: string;
  jscGpa: string;
  sscSchool: string;
  sscGpa: string;
  classLevel: string;
  subject: string;
  batchSlot: string;
  email: string;
  password: string;
  hearAbout: string;
  hearAboutOther: string;
  declaration: boolean;
};

const initialFormState: AdmissionFormState = {
  studentFullName: "",
  nickName: "",
  dateOfBirth: "",
  sex: "",
  fatherName: "",
  fatherOccupation: "",
  motherName: "",
  motherOccupation: "",
  presentAddress: "",
  homeDistrict: "",
  studentMobile: "",
  guardianMobile: "",
  jscSchool: "",
  jscGpa: "",
  sscSchool: "",
  sscGpa: "",
  classLevel: "",
  subject: "",
  batchSlot: "",
  email: "",
  password: "",
  hearAbout: "",
  hearAboutOther: "",
  declaration: false,
};

const subjectOptions = [
  "General Math",
  "Higher Math",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
];

const batchOptions = [
  "Morning Shift · 8:00 AM - 10:00 AM",
  "Day Shift · 11:00 AM - 1:00 PM",
  "Afternoon Shift · 3:00 PM - 5:00 PM",
  "Evening Shift · 6:30 PM - 8:30 PM",
  "Weekend Accelerator",
];

const hearAboutOptions = [
  "Leaflet",
  "Teacher",
  "Friends",
  "Relatives",
  "Social Media",
  "Others",
];

const photoPlaceholder =
  "https://images.unsplash.com/photo-1615198581261-9bdb8be03c81?auto=format&fit=crop&w=256&q=80";

const inputClasses =
  "w-full rounded-lg border border-brand/25 bg-white px-4 py-3 text-sm text-gray-800 shadow-inner outline-none transition placeholder:text-gray-400 focus:border-brand focus:ring-2 focus:ring-brand/20";

const sectionClasses =
  "space-y-6 rounded-lg border border-brand/15 bg-brand/5 p-6 shadow-sm";

const AdmissionFormSection = () => {
  const [formState, setFormState] = useState<AdmissionFormState>(() => ({
    ...initialFormState,
  }));
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const applicationDate = useMemo(() => {
    return new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }, []);

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const handleInputChange =
    (field: keyof AdmissionFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value =
        event.target.type === "checkbox"
          ? (event.target as HTMLInputElement).checked
          : event.target.value;
      setFormState((previous) => ({
        ...previous,
        [field]: value,
      }));
      setError(null);
      setFeedback(null);
    };

  const handleSelectChange =
    (field: keyof AdmissionFormState) =>
    (event: ChangeEvent<HTMLSelectElement>) => {
      setFormState((previous) => ({
        ...previous,
        [field]: event.target.value,
      }));
      setError(null);
      setFeedback(null);
    };

  const handlePhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file for the photograph.");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setError("Photograph must be smaller than 3MB.");
      return;
    }

    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
    setPhotoFileName(file.name);
    setError(null);
    setFeedback(null);
  };

  const resetForm = (formElement: HTMLFormElement) => {
    formElement.reset();
    setFormState(() => ({ ...initialFormState }));
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview(null);
    setPhotoFileName(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.declaration) {
      setError("Please confirm the declaration before submitting.");
      return;
    }

    setFeedback("Application received! Our team will reach out shortly.");
    setError(null);
    resetForm(event.currentTarget);
  };

  return (
    <section className="bg-brand/5 pb-16 pt-0 sm:pb-24">
      {/* Top primary banner */}
      <div className="w-full bg-brand">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-semibold text-brand-foreground sm:text-3xl">
            ভর্তি ফরম
          </h2>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-xl border border-brand/20 bg-white shadow-2xl">
          <div className="flex flex-col gap-6 border-b border-brand/15 bg-brand/10 px-6 py-8 sm:px-10 sm:py-10 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold text-gray-900 sm:text-[34px]">
                ভর্তি ফরম · Admission Form
              </h1>
              <div className="h-1 w-16 rounded-full bg-brand" />
              <p className="max-w-xl text-sm text-gray-600 sm:text-base">
                Fill in the required information carefully to secure your seat
                at Sunny&apos;s Math World. 
              </p>
            </div>
            <div className="flex flex-col gap-3">
              
              <span className="inline-flex items-center gap-2 self-start rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand sm:self-end">
                <CalendarRange className="h-4 w-4" />
                {applicationDate}
              </span>
            </div>
          </div>

          <form
            className="grid gap-8 px-6 py-10 sm:px-10"
            onSubmit={handleSubmit}
          >
            <fieldset className={sectionClasses}>
              <legend className="text-base font-semibold text-gray-800 sm:text-lg">
                Personal Information
              </legend>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label
                    htmlFor="studentFullName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Student full name <span className="text-brand">*</span>
                  </label>
                  <input
                    id="studentFullName"
                    name="studentFullName"
                    type="text"
                    value={formState.studentFullName}
                    onChange={handleInputChange("studentFullName")}
                    required
                    placeholder="e.g. John Doe"
                    className={inputClasses}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="nickName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Nick name
                  </label>
                  <input
                    id="nickName"
                    name="nickName"
                    type="text"
                    value={formState.nickName}
                    onChange={handleInputChange("nickName")}
                    placeholder="Preferred short name"
                    className={inputClasses}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="dateOfBirth"
                    className="text-sm font-medium text-gray-700"
                  >
                    Birthdate <span className="text-brand">*</span>
                  </label>
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formState.dateOfBirth}
                    onChange={handleInputChange("dateOfBirth")}
                    required
                    className={inputClasses}
                  />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <span className="text-sm font-medium text-gray-700">
                    Sex <span className="text-brand">*</span>
                  </span>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {["Male", "Female", "Other"].map((option) => (
                      <label
                        key={option}
                        className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition ${
                          formState.sex === option
                            ? "border-brand bg-white text-brand shadow"
                            : "border-brand/20 bg-white/80 text-gray-600 hover:border-brand/60"
                        }`}
                      >
                        <input
                          type="radio"
                          name="sex"
                          value={option}
                          checked={formState.sex === option}
                          onChange={handleInputChange("sex")}
                          className="hidden"
                          required
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
                <label
                  htmlFor="photo"
                  className="group flex flex-col gap-3 rounded-lg border border-dashed border-brand/30 bg-white/70 p-4 text-sm text-gray-600 shadow-inner transition hover:border-brand/60 md:col-span-2 md:flex-row md:items-center"
                >
                  <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg border border-brand/20 bg-white shadow">
                    <img
                      src={photoPreview ?? photoPlaceholder}
                      alt="Photograph preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <span className="text-sm font-semibold text-gray-800">
                      Upload passport size photo <span className="text-brand">*</span>
                    </span>
                    <span>JPG or PNG, up to 3 MB</span>
                    <span className="inline-flex items-center gap-2 text-xs font-semibold text-brand">
                      <UploadCloud className="h-4 w-4" />
                      Click to choose
                    </span>
                    {photoFileName ? (
                      <span className="text-xs font-medium text-gray-600">
                        Selected: <span className="text-brand">{photoFileName}</span>
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Drag & drop or browse files</span>
                    )}
                  </div>
                  <input
                    id="photo"
                    name="photo"
                    type="file"
                    accept="image/*"
                    required
                    onChange={handlePhotoUpload}
                    className="sr-only"
                  />
                </label>
              </div>
            </fieldset>

            <fieldset className={sectionClasses}>
              <legend className="text-base font-semibold text-gray-800 sm:text-lg">
                Guardian Information
              </legend>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="fatherName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Father&apos;s name
                  </label>
                  <input
                    id="fatherName"
                    name="fatherName"
                    type="text"
                    value={formState.fatherName}
                    onChange={handleInputChange("fatherName")}
                    placeholder="Father's full name"
                    className={inputClasses}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="fatherOccupation"
                    className="text-sm font-medium text-gray-700"
                  >
                    Father&apos;s occupation
                  </label>
                  <input
                    id="fatherOccupation"
                    name="fatherOccupation"
                    type="text"
                    value={formState.fatherOccupation}
                    onChange={handleInputChange("fatherOccupation")}
                    placeholder="Profession"
                    className={inputClasses}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="motherName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Mother&apos;s name
                  </label>
                  <input
                    id="motherName"
                    name="motherName"
                    type="text"
                    value={formState.motherName}
                    onChange={handleInputChange("motherName")}
                    placeholder="Mother's full name"
                    className={inputClasses}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="motherOccupation"
                    className="text-sm font-medium text-gray-700"
                  >
                    Mother&apos;s occupation
                  </label>
                  <input
                    id="motherOccupation"
                    name="motherOccupation"
                    type="text"
                    value={formState.motherOccupation}
                    onChange={handleInputChange("motherOccupation")}
                    placeholder="Profession"
                    className={inputClasses}
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className={sectionClasses}>
              <legend className="text-base font-semibold text-gray-800 sm:text-lg">
                Educational Qualification
              </legend>
              <div className="space-y-6">
                <div className="grid gap-4 rounded-lg border border-brand/15 bg-white/80 p-4 md:grid-cols-2">
                  <div className="md:col-span-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                    JSC
                  </div>
                  <input
                    id="jscSchool"
                    name="jscSchool"
                    type="text"
                    value={formState.jscSchool}
                    onChange={handleInputChange("jscSchool")}
                    placeholder="School name"
                    className={inputClasses}
                  />
                  <input
                    id="jscGpa"
                    name="jscGpa"
                    type="text"
                    value={formState.jscGpa}
                    onChange={handleInputChange("jscGpa")}
                    placeholder="GPA"
                    className={inputClasses}
                  />
                </div>
                <div className="grid gap-4 rounded-lg border border-brand/15 bg-white/80 p-4 md:grid-cols-2">
                  <div className="md:col-span-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                    SSC
                  </div>
                  <input
                    id="sscSchool"
                    name="sscSchool"
                    type="text"
                    value={formState.sscSchool}
                    onChange={handleInputChange("sscSchool")}
                    placeholder="School name"
                    className={inputClasses}
                  />
                  <input
                    id="sscGpa"
                    name="sscGpa"
                    type="text"
                    value={formState.sscGpa}
                    onChange={handleInputChange("sscGpa")}
                    placeholder="GPA"
                    className={inputClasses}
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className={sectionClasses}>
              <legend className="text-base font-semibold text-gray-800 sm:text-lg">
                Address & Contact
              </legend>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label
                    htmlFor="presentAddress"
                    className="text-sm font-medium text-gray-700"
                  >
                    Present address
                  </label>
                  <textarea
                    id="presentAddress"
                    name="presentAddress"
                    value={formState.presentAddress}
                    onChange={handleInputChange("presentAddress")}
                    rows={3}
                    placeholder="House, road, area"
                    className={`${inputClasses} min-h-[120px] resize-none`}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="homeDistrict"
                    className="text-sm font-medium text-gray-700"
                  >
                    Home district
                  </label>
                  <input
                    id="homeDistrict"
                    name="homeDistrict"
                    type="text"
                    value={formState.homeDistrict}
                    onChange={handleInputChange("homeDistrict")}
                    placeholder="e.g. Dhaka"
                    className={inputClasses}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="studentMobile"
                    className="text-sm font-medium text-gray-700"
                  >
                    Student mobile no. <span className="text-brand">*</span>
                  </label>
                  <input
                    id="studentMobile"
                    name="studentMobile"
                    type="tel"
                    inputMode="tel"
                    value={formState.studentMobile}
                    onChange={handleInputChange("studentMobile")}
                    required
                    placeholder="01XXXXXXXXX"
                    className={inputClasses}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="guardianMobile"
                    className="text-sm font-medium text-gray-700"
                  >
                    Guardian mobile no. <span className="text-brand">*</span>
                  </label>
                  <input
                    id="guardianMobile"
                    name="guardianMobile"
                    type="tel"
                    inputMode="tel"
                    value={formState.guardianMobile}
                    onChange={handleInputChange("guardianMobile")}
                    required
                    placeholder="01XXXXXXXXX"
                    className={inputClasses}
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className={sectionClasses}>
              <legend className="text-base font-semibold text-gray-800 sm:text-lg">
                Batch Information
              </legend>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="classLevel"
                    className="text-sm font-medium text-gray-700"
                  >
                    Class <span className="text-brand">*</span>
                  </label>
                  <input
                    id="classLevel"
                    name="classLevel"
                    type="text"
                    value={formState.classLevel}
                    onChange={handleInputChange("classLevel")}
                    required
                    placeholder="e.g. Class 10"
                    className={inputClasses}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="subject"
                    className="text-sm font-medium text-gray-700"
                  >
                    Subject <span className="text-brand">*</span>
                  </label>
                  <div className="relative">
                    <ChevronDown className="pointer-events-none absolute right-4 top-3.5 h-4 w-4 text-gray-400" />
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formState.subject}
                      onChange={handleSelectChange("subject")}
                      className={`${inputClasses} appearance-none`}
                    >
                      <option value="" disabled>
                        Select subject
                      </option>
                      {subjectOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label
                    htmlFor="batchSlot"
                    className="text-sm font-medium text-gray-700"
                  >
                    Batch (Schedule + Time){" "}
                    <span className="text-brand">*</span>
                  </label>
                  <div className="relative">
                    <ChevronDown className="pointer-events-none absolute right-4 top-3.5 h-4 w-4 text-gray-400" />
                    <select
                      id="batchSlot"
                      name="batchSlot"
                      required
                      value={formState.batchSlot}
                      onChange={handleSelectChange("batchSlot")}
                      className={`${inputClasses} appearance-none`}
                    >
                      <option value="" disabled>
                        Select preferred batch
                      </option>
                      {batchOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email (username) <span className="text-brand">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute right-4 top-3.5 h-4 w-4 text-gray-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleInputChange("email")}
                      required
                      placeholder="you@example.com"
                      className={`${inputClasses} pr-12`}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password <span className="text-brand">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute right-4 top-3.5 h-4 w-4 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formState.password}
                      onChange={handleInputChange("password")}
                      required
                      placeholder="Create a password"
                      className={`${inputClasses} pr-12`}
                    />
                  </div>
                </div>
              </div>
            </fieldset>

            <fieldset className={sectionClasses}>
              <legend className="text-base font-semibold text-gray-800 sm:text-lg">
                How did you hear about Sunny&apos;s Math World?
              </legend>
              <div className="space-y-4">
                <div className="relative">
                  <ChevronDown className="pointer-events-none absolute right-4 top-3.5 h-4 w-4 text-gray-400" />
                  <select
                    id="hearAbout"
                    name="hearAbout"
                    required
                    value={formState.hearAbout}
                    onChange={handleSelectChange("hearAbout")}
                    className={`${inputClasses} appearance-none`}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    {hearAboutOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                {formState.hearAbout === "Others" && (
                  <input
                    id="hearAboutOther"
                    name="hearAboutOther"
                    type="text"
                    value={formState.hearAboutOther}
                    onChange={handleInputChange("hearAboutOther")}
                    required
                    placeholder="Please share how you heard about us"
                    className={inputClasses}
                  />
                )}
              </div>
            </fieldset>

            <div className="space-y-4 rounded-lg border border-brand/15 bg-brand/5 p-6 shadow-inner">
              <label
                htmlFor="declaration"
                className="flex items-start gap-3 text-sm text-gray-700"
              >
                <input
                  id="declaration"
                  name="declaration"
                  type="checkbox"
                  checked={formState.declaration}
                  onChange={handleInputChange("declaration")}
                  className="mt-1 h-4 w-4 rounded border-brand/40 text-brand focus:ring-brand/40"
                  required
                />
                <span>
                  I confirm the information is true and accurate to the best of
                  my knowledge.
                </span>
              </label>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-6 py-3 text-base font-semibold text-brand-foreground shadow-md transition hover:bg-brand-emphasis focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
              >
                Submit application
                <ArrowRight className="h-5 w-5" />
              </button>
              {error && (
                <p className="text-sm font-medium text-red-500">{error}</p>
              )}
              {feedback && (
                <p className="text-sm font-medium text-success">{feedback}</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AdmissionFormSection;
