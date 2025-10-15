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
  GraduationCap,
  MapPin,
  Megaphone,
  Phone,
  School,
  UploadCloud,
  User,
  Users,
} from "lucide-react";

type AdmissionFormState = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: "Male" | "Female" | "";
  studentMobile: string;
  studentEmail: string;
  presentSchool: string;
  classLevel: string;
  group: "Science" | "Commerce" | "Humanities" | "";
  jscResult: string;
  sscResult: string;
  hscResult: string;
  batch: string;
  batchOther: string;
  fatherName: string;
  fatherOccupation: string;
  fatherPhone: string;
  motherName: string;
  motherOccupation: string;
  motherPhone: string;
  presentAddress: string;
  homeDistrict: string;
  hearAbout: string;
  hearAboutOther: string;
  declaration: boolean;
};

const initialFormState: AdmissionFormState = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  sex: "",
  studentMobile: "",
  studentEmail: "",
  presentSchool: "",
  classLevel: "",
  group: "",
  jscResult: "",
  sscResult: "",
  hscResult: "",
  batch: "",
  batchOther: "",
  fatherName: "",
  fatherOccupation: "",
  fatherPhone: "",
  motherName: "",
  motherOccupation: "",
  motherPhone: "",
  presentAddress: "",
  homeDistrict: "",
  hearAbout: "",
  hearAboutOther: "",
  declaration: false,
};

const batchOptions = [
  "SSC 2024 Crash",
  "HSC 2025 Target",
  "Foundation 2024",
  "Admission Test Turbo",
  "Math Olympiad Lab",
  "Weekend Booster",
  "Other",
];

const hearAboutOptions = [
  "Facebook / Social Media",
  "Friend / Family",
  "Coaching Campus",
  "Teacher Referral",
  "Google Search",
  "Other",
];

const passportPlaceholder =
  "https://images.unsplash.com/photo-1615198581261-9bdb8be03c81?auto=format&fit=crop&w=256&q=80";

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
      const value = event.target.value;
      setFormState((previous) => ({
        ...previous,
        [field]: value,
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
    <section className="relative overflow-hidden pb-24 pt-16 sm:pt-24">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand/10 via-white to-sky-100" />
      <div className="absolute -right-40 top-20 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
      <div className="absolute -bottom-32 left-20 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr),minmax(0,520px)] lg:items-start">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
              Step Into <span className="text-brand">SuNnY&apos;s MaTh WORLD</span>
            </h1>
            <p className="max-w-xl text-sm text-gray-600 sm:text-base">
              Share the details below so we can match you with the perfect
              learning experience and welcome you onboard.
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 translate-x-6 translate-y-6 rounded-3xl bg-brand/20 blur-xl" />
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Admission Form
                  </h2>
                  <p className="text-sm text-gray-500">
                    Fill all mandatory fields marked with *
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                  <CalendarRange className="h-4 w-4" />
                  {applicationDate}
                </span>
              </div>
              <form className="mt-8 space-y-10" onSubmit={handleSubmit}>
                <fieldset className="space-y-6">
                  <legend className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                    <Users className="h-4 w-4 text-brand" />
                    Student Information
                  </legend>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="firstName"
                        className="text-sm font-medium text-gray-700"
                      >
                        First name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formState.firstName}
                        onChange={handleInputChange("firstName")}
                        required
                        placeholder="John"
                        className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 shadow-sm outline-none transition hover:border-brand/40 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="lastName"
                        className="text-sm font-medium text-gray-700"
                      >
                        Last name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formState.lastName}
                        onChange={handleInputChange("lastName")}
                        required
                        placeholder="Doe"
                        className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 shadow-sm outline-none transition hover:border-brand/40 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="dateOfBirth"
                        className="text-sm font-medium text-gray-700"
                      >
                        Date of birth{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={formState.dateOfBirth}
                        onChange={handleInputChange("dateOfBirth")}
                        required
                        className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 shadow-sm outline-none transition hover:border-brand/40 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-medium text-gray-700">
                        Sex <span className="text-red-500">*</span>
                      </span>
                      <div className="flex gap-3">
                        {["Male", "Female"].map((option) => (
                          <label
                            key={option}
                            className={`flex flex-1 items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                              formState.sex === option
                                ? "border-brand bg-brand/10 text-brand"
                                : "border-gray-200 bg-gray-50 text-gray-600 hover:border-brand/40 hover:text-gray-900"
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
                            <User className="h-4 w-4" />
                            {option}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="studentMobile"
                        className="text-sm font-medium text-gray-700"
                      >
                        Student mobile number{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="pointer-events-none absolute left-4 top-3 h-5 w-5 text-gray-400" />
                        <input
                          id="studentMobile"
                          name="studentMobile"
                          type="tel"
                          inputMode="tel"
                          value={formState.studentMobile}
                          onChange={handleInputChange("studentMobile")}
                          required
                          placeholder="01XXXXXXXXX"
                          className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 pl-12 text-sm font-medium text-gray-900 shadow-sm outline-none transition hover:border-brand/40 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="studentEmail"
                        className="text-sm font-medium text-gray-700"
                      >
                        Student email address
                      </label>
                      <div className="relative">
                        <Megaphone className="pointer-events-none absolute left-4 top-3 h-5 w-5 text-gray-400" />
                        <input
                          id="studentEmail"
                          name="studentEmail"
                          type="email"
                          value={formState.studentEmail}
                          onChange={handleInputChange("studentEmail")}
                          placeholder="you@example.com"
                          className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 pl-12 text-sm font-medium text-gray-900 shadow-sm outline-none transition hover:border-brand/40 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 sm:col-span-2">
                      <span className="text-sm font-medium text-gray-700">
                        Portrait photograph
                        <span className="text-red-500"> *</span>
                      </span>
                      <label
                        htmlFor="photograph"
                        className="group relative flex flex-col gap-6 overflow-hidden rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-brand/5 p-6 text-left shadow-sm transition hover:border-brand/40 hover:shadow-md sm:flex-row sm:items-center"
                      >
                        <div className="relative w-24 shrink-0">
                          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-white shadow-inner ring-1 ring-inset ring-white/70 transition group-hover:ring-brand/40">
                            <img
                              src={photoPreview ?? passportPlaceholder}
                              alt="Photograph preview"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/60" />
                        </div>
                        <div className="flex flex-1 flex-col gap-1 text-sm text-gray-600">
                          <span className="text-sm font-semibold text-gray-900">
                            Upload a portrait photo
                          </span>
                          <span className="text-xs text-gray-500">
                            JPG or PNG, up to 3 MB
                          </span>
                          <span className="inline-flex items-center gap-2 text-xs font-semibold text-brand transition group-hover:text-brand/80">
                            <UploadCloud className="h-4 w-4" />
                            Tap to browse
                          </span>
                          {photoFileName ? (
                            <span className="text-xs font-medium text-gray-500">
                              Selected: <span className="text-brand">{photoFileName}</span>
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">
                              Drag & drop or choose a file
                            </span>
                          )}
                        </div>
                        <input
                          id="photograph"
                          name="photograph"
                          type="file"
                          accept="image/*"
                          required
                          onChange={handlePhotoUpload}
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>
                </fieldset>

                <fieldset className="space-y-6">
                  <legend className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                    <School className="h-4 w-4 text-brand" />
                    Academic Details
                  </legend>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-2 sm:col-span-2">
                      <label
                        htmlFor="presentSchool"
                        className="text-sm font-medium text-gray-700"
                      >
                        Present school / college
                      </label>
                      <input
                        id="presentSchool"
                        name="presentSchool"
                        type="text"
                        value={formState.presentSchool}
                        onChange={handleInputChange("presentSchool")}
                        placeholder="Institute name"
                        className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 shadow-sm outline-none transition hover:border-brand/40 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="classLevel"
                        className="text-sm font-medium text-gray-700"
                      >
                        Class
                      </label>
                      <input
                        id="classLevel"
                        name="classLevel"
                        type="text"
                        value={formState.classLevel}
                        onChange={handleInputChange("classLevel")}
                        placeholder="e.g. Class 11"
                        className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 shadow-sm outline-none transition hover:border-brand/40 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        Group
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {["Science", "Commerce", "Humanities"].map((option) => (
                          <label
                            key={option}
                            className={`flex flex-1 min-w-[120px] items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                              formState.group === option
                                ? "border-sky-400 bg-sky-50 text-sky-600"
                                : "border-gray-200 bg-gray-50 text-gray-600 hover:border-sky-300 hover:text-gray-900"
                            }`}
                          >
                            <GraduationCap className="h-4 w-4" />
                            <input
                              type="radio"
                              name="group"
                              value={option}
                              checked={formState.group === option}
                              onChange={handleInputChange("group")}
                              className="hidden"
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="jscResult"
                        className="text-sm font-medium text-gray-700"
                      >
                        JSC result
                      </label>
                      <input
                        id="jscResult"
                        name="jscResult"
                        type="text"
                        value={formState.jscResult}
                        onChange={handleInputChange("jscResult")}
                        placeholder="GPA / Result"
                        className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 shadow-sm outline-none transition hover:border-brand/40 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="sscResult"
                        className="text-sm font-medium text-gray-700"
                      >
                        SSC result
                      </label>
                      <input
                        id="sscResult"
                        name="sscResult"
                        type="text"
                        value={formState.sscResult}
                        onChange={handleInputChange("sscResult")}
                        placeholder="GPA / Result"
                        className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 shadow-sm outline-none transition hover:border-brand/40 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="hscResult"
                        className="text-sm font-medium text-gray-700"
                      >
                        HSC result
                      </label>
                      <input
                        id="hscResult"
                        name="hscResult"
                        type="text"
                        value={formState.hscResult}
                        onChange={handleInputChange("hscResult")}
                        placeholder="GPA / Result"
                        className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 shadow-sm outline-none transition hover:border-brand/40 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
                      />
                    </div>
                    <div className="flex flex-col gap-2 sm:col-span-2">
                      <label
                        htmlFor="batch"
                        className="text-sm font-medium text-gray-700"
                      >
                        Batch applying for
                        <span className="text-red-500"> *</span>
                      </label>
                      <div className="relative">
                        <ChevronDown className="pointer-events-none absolute right-4 top-3.5 h-4 w-4 text-gray-400" />
                        <select
                          id="batch"
                          name="batch"
                          required
                          value={formState.batch}
                          onChange={handleSelectChange("batch")}
                          className="w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 shadow-sm outline-none transition hover:border-brand/40 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
                        >
                          <option value="" disabled>
                            Select your batch
                          </option>
                          {batchOptions.map((batch) => (
                            <option key={batch} value={batch}>
                              {batch}
                            </option>
                          ))}
                        </select>
                      </div>
                      {formState.batch === "Other" && (
                        <input
                          id="batchOther"
                          name="batchOther"
                          type="text"
                          value={formState.batchOther}
                          onChange={handleInputChange("batchOther")}
                          placeholder="Please specify"
                          className="mt-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 shadow-sm outline-none transition hover:border-brand/40 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
                          required
                        />
                      )}
                    </div>
                  </div>
                </fieldset>

                <fieldset className="space-y-6">
                  <legend className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                    <Users className="h-4 w-4 text-brand" />
                    Parental / Guardian Information
                  </legend>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-4">
                      <p className="text-sm font-semibold text-gray-900">
                        Father
                      </p>
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="fatherName"
                          className="text-xs font-medium uppercase tracking-wide text-gray-500"
                        >
                          Full name
                        </label>
                        <input
                          id="fatherName"
                          name="fatherName"
                          type="text"
                          value={formState.fatherName}
                          onChange={handleInputChange("fatherName")}
                          className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 shadow-sm outline-none transition hover:border-brand/40 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="fatherOccupation"
                          className="text-xs font-medium uppercase tracking-wide text-gray-500"
                        >
                          Occupation
                        </label>
                        <input
                          id="fatherOccupation"
                          name="fatherOccupation"
                          type="text"
                          value={formState.fatherOccupation}
                          onChange={handleInputChange("fatherOccupation")}
                          className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 shadow-sm outline-none transition hover:border-brand/40 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="fatherPhone"
                          className="text-xs font-medium uppercase tracking-wide text-gray-500"
                        >
                          Contact number
                        </label>
                        <input
                          id="fatherPhone"
                          name="fatherPhone"
                          type="tel"
                          inputMode="tel"
                          value={formState.fatherPhone}
                          onChange={handleInputChange("fatherPhone")}
                          placeholder="01XXXXXXXXX"
                          className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 shadow-sm outline-none transition hover:border-brand/40 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <p className="text-sm font-semibold text-gray-900">
                        Mother
                      </p>
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="motherName"
                          className="text-xs font-medium uppercase tracking-wide text-gray-500"
                        >
                          Full name
                        </label>
                        <input
                          id="motherName"
                          name="motherName"
                          type="text"
                          value={formState.motherName}
                          onChange={handleInputChange("motherName")}
                          className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 shadow-sm outline-none transition hover:border-brand/40 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="motherOccupation"
                          className="text-xs font-medium uppercase tracking-wide text-gray-500"
                        >
                          Occupation
                        </label>
                        <input
                          id="motherOccupation"
                          name="motherOccupation"
                          type="text"
                          value={formState.motherOccupation}
                          onChange={handleInputChange("motherOccupation")}
                          className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 shadow-sm outline-none transition hover:border-brand/40 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="motherPhone"
                          className="text-xs font-medium uppercase tracking-wide text-gray-500"
                        >
                          Contact number
                        </label>
                        <input
                          id="motherPhone"
                          name="motherPhone"
                          type="tel"
                          inputMode="tel"
                          value={formState.motherPhone}
                          onChange={handleInputChange("motherPhone")}
                          placeholder="01XXXXXXXXX"
                          className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 shadow-sm outline-none transition hover:border-brand/40 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
                        />
                      </div>
                    </div>
                  </div>
                </fieldset>

                <fieldset className="space-y-6">
                  <legend className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                    <MapPin className="h-4 w-4 text-brand" />
                    Address & Contact
                  </legend>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-2 sm:col-span-2">
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
                        placeholder="House, Road, Area"
                        className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 shadow-sm outline-none transition hover:border-brand/40 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
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
                        placeholder="District"
                        className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 shadow-sm outline-none transition hover:border-brand/40 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
                      />
                    </div>
                  </div>
                </fieldset>

                <fieldset className="space-y-6 border-t border-dashed border-gray-200 pt-10">
                  <legend className="sr-only">Other Information</legend>
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-auto bg-gray-200" />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                      Other Information
                    </span>
                    <div className="h-px flex-auto bg-gray-200" />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-2 sm:col-span-2">
                      <label
                        htmlFor="hearAbout"
                        className="text-sm font-medium text-gray-700"
                      >
                        How did you hear about us?
                        <span className="text-red-500"> *</span>
                      </label>
                      <div className="relative">
                        <ChevronDown className="pointer-events-none absolute right-4 top-3.5 h-4 w-4 text-gray-400" />
                        <select
                          id="hearAbout"
                          name="hearAbout"
                          required
                          value={formState.hearAbout}
                          onChange={handleSelectChange("hearAbout")}
                          className="w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 shadow-sm outline-none transition hover:border-brand/40 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
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
                      {formState.hearAbout === "Other" && (
                        <input
                          id="hearAboutOther"
                          name="hearAboutOther"
                          type="text"
                          value={formState.hearAboutOther}
                          onChange={handleInputChange("hearAboutOther")}
                          placeholder="Please specify"
                          className="mt-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 shadow-sm outline-none transition hover:border-brand/40 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
                          required
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <input
                      id="declaration"
                      name="declaration"
                      type="checkbox"
                      checked={formState.declaration}
                      onChange={handleInputChange("declaration")}
                      className="mt-1 h-5 w-5 rounded border-gray-300 text-brand focus:ring-brand"
                      required
                    />
                    <label
                      htmlFor="declaration"
                      className="text-sm text-gray-600"
                    >
                      I confirm the information is true and accurate to the best
                      of my knowledge.
                    </label>
                  </div>
                </fieldset>

                <div className="space-y-3">
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-3 text-base font-semibold text-brand-foreground shadow-lg transition-transform duration-200 hover:-translate-y-0.5 hover:bg-brand-emphasis focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                  >
                    Submit application
                    <ArrowRight className="h-5 w-5" />
                  </button>
                  {error && (
                    <p className="text-sm font-medium text-red-500">{error}</p>
                  )}
                  {feedback && (
                    <p className="text-sm font-medium text-success">
                      {feedback}
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdmissionFormSection;
