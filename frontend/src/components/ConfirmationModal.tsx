"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, Mail } from "lucide-react";
import { format } from "date-fns";

const batchTimingLabels: Record<string, string> = {
  "sat-mon-thurs-morning": "Sat, Mon, Thurs - 10:00 AM - 12:00 PM",
  "sun-tue-thu-afternoon": "Sun, Tue, Thu - 2:00 PM - 4:00 PM",
  "fri-sat-evening": "Fri & Sat - 6:00 PM - 8:00 PM",
  "weekend-intensive-morning": "Weekend Intensive - 8:00 AM - 11:00 AM",
};

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    fullName: string;
    nickname: string;
    homeDistrict: string;
    dateOfBirth: Date;
    gender: string;
    email: string;
    phone: string;
    address: string;
    fatherName: string;
    fatherOccupation: string;
    fatherPhone: string;
    motherName: string;
    motherOccupation: string;
    motherPhone: string;
    guardianRelation: "father" | "mother" | "other";
    guardianContact: string;
    jscSchool: string;
    jscGrade: string;
    sscSchool: string;
    sscGrade: string;
    classLevel: string;
    group: string;
    subject: string;
    batchTiming: string;
    hearAboutUs: string;
    agreeTerms: boolean;
  };
  photoPreview: string | null;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  data,
  photoPreview,
}: ConfirmationModalProps) {
  const formatLabel = (key: string): string => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  type DataShape = ConfirmationModalProps["data"];
  const formatValue = (
    key: keyof DataShape | string,
    value: string | Date
  ): string => {
    if (value instanceof Date) {
      return format(value, "PPP");
    }

    const str = value;
    switch (key) {
      case "gender":
      case "guardianRelation":
        return str.charAt(0).toUpperCase() + str.slice(1);
      case "classLevel":
        return str
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l: string) => l.toUpperCase());
      case "group":
        return str
          ? str.charAt(0).toUpperCase() + str.slice(1)
          : "Not Applicable";
      case "subject":
        if (str.toLowerCase() === "ict") {
          return "ICT";
        }
        return str
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l: string) => l.toUpperCase());
      case "batchTiming":
        return batchTimingLabels[str] ?? str;
      case "hearAboutUs":
        return str
          .split("-")
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      default:
        return str;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.6, bounce: 0.5 }}
                className="flex justify-center mb-4"
              >
                <div className="relative">
                  <motion.div
                    className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <CheckCircle2 className="w-20 h-20 text-green-500 relative z-10" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <DialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                  Application Submitted Successfully!
                </DialogTitle>
                <p className="text-center text-muted-foreground mt-2">
                  Thank you for applying to Sunny&apos;s Math World. We&apos;ll contact
                  you within 2-3 business days.
                </p>
              </motion.div>
            </DialogHeader>

            <motion.div
              className="mt-8 space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {/* Photo Section */}
              {photoPreview && (
                <motion.div
                  className="flex justify-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
                    <img
                      src={photoPreview}
                      alt="Student"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>
              )}

              {/* Application Details */}
              <div className="space-y-6">
                {/* Personal Information */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <h3 className="text-lg font-semibold mb-3 text-primary">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-muted/50 p-4 rounded-lg">
                    <DetailItem label="Full Name" value={data.fullName} />
                    <DetailItem label="Nickname" value={data.nickname} />
                    <DetailItem
                      label="Date of Birth"
                      value={formatValue("dateOfBirth", data.dateOfBirth)}
                    />
                    <DetailItem
                      label="Gender"
                      value={formatValue("gender", data.gender)}
                    />
                    <DetailItem label="Email" value={data.email} />
                    <DetailItem label="Phone" value={data.phone} />
                    <DetailItem
                      label="Home District"
                      value={data.homeDistrict}
                    />
                    <DetailItem
                      label="Address"
                      value={data.address}
                      className="md:col-span-2"
                    />
                  </div>
                </motion.div>

                {/* Parents Information */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <h3 className="text-lg font-semibold mb-3 text-primary">
                    Parents Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-muted/50 p-4 rounded-lg">
                    <DetailItem label="Father's Name" value={data.fatherName} />
                    <DetailItem
                      label="Father's Occupation"
                      value={data.fatherOccupation}
                    />
                    <DetailItem
                      label="Father's Phone"
                      value={data.fatherPhone}
                    />
                    <DetailItem label="Mother's Name" value={data.motherName} />
                    <DetailItem
                      label="Mother's Occupation"
                      value={data.motherOccupation}
                    />
                    <DetailItem
                      label="Mother's Phone"
                      value={data.motherPhone}
                    />
                    <DetailItem
                      label="Guardian Relation"
                      value={formatValue("guardianRelation", data.guardianRelation)}
                    />
                    <DetailItem
                      label="Guardian Contact"
                      value={data.guardianContact}
                    />
                  </div>
                </motion.div>

                {/* Educational Details */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <h3 className="text-lg font-semibold mb-3 text-primary">
                    Educational Background
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-muted/50 p-4 rounded-lg">
                    <DetailItem label="JSC School" value={data.jscSchool} />
                    <DetailItem label="JSC Grade" value={data.jscGrade} />
                    <DetailItem label="SSC School" value={data.sscSchool} />
                    <DetailItem label="SSC Grade" value={data.sscGrade} />
                  </div>
                </motion.div>

                {/* Batch Information */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <h3 className="text-lg font-semibold mb-3 text-primary">
                    Batch Preferences
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-muted/50 p-4 rounded-lg">
                    <DetailItem
                      label="Class"
                      value={formatValue("classLevel", data.classLevel)}
                    />
                    <DetailItem
                      label="Group"
                      value={formatValue("group", data.group)}
                    />
                    <DetailItem
                      label="Subject"
                      value={formatValue("subject", data.subject)}
                    />
                    <DetailItem
                      label="Batch Timing"
                      value={formatValue("batchTiming", data.batchTiming)}
                      className="md:col-span-2"
                    />
                    <DetailItem
                      label="How Did You Hear About Us"
                      value={formatValue("hearAboutUs", data.hearAboutUs)}
                    />
                  </div>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-3 pt-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <motion.div
                  className="flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => window.print()}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </motion.div>
                <motion.div
                  className="flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() =>
                      (window.location.href = `mailto:${data.email}`)
                    }
                    variant="outline"
                    className="w-full"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Confirmation Email
                  </Button>
                </motion.div>
                <motion.div
                  className="flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={onClose}
                    className="w-full bg-gradient-to-r from-primary to-primary/80"
                  >
                    Close
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}

function DetailItem({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
