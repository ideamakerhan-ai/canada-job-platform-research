import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Plus, Trash2 } from "lucide-react";

interface ResumeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: number;
  onApplySuccess?: () => void;
}

export function ResumeModal({ open, onOpenChange, jobId, onApplySuccess }: ResumeModalProps) {
  const [step, setStep] = useState<"check" | "register" | "select">("check");
  const [formData, setFormData] = useState({
    title: "",
    fullName: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    experience: "",
    education: "",
    skills: "",
  });
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);

  // Queries and Mutations
  const resumesQuery = trpc.resume.myResumes.useQuery();
  const createResumeMutation = trpc.resume.create.useMutation({
    onSuccess: () => {
      resumesQuery.refetch();
      setFormData({
        title: "",
        fullName: "",
        email: "",
        phone: "",
        location: "",
        summary: "",
        experience: "",
        education: "",
        skills: "",
      });
      setStep("select");
    },
  });

  const applyMutation = trpc.application.applyWithResume.useMutation({
    onSuccess: () => {
      onOpenChange(false);
      onApplySuccess?.();
    },
  });

  const deleteResumeMutation = trpc.resume.delete.useMutation({
    onSuccess: () => {
      resumesQuery.refetch();
    },
  });

  const resumes = resumesQuery.data || [];
  const hasResumes = resumes.length > 0;
  const canAddMore = resumes.length < 5;

  const handleCreateResume = () => {
    if (!formData.fullName || !formData.email || !formData.title) {
      alert("Please fill in required fields (Title, Full Name, Email)");
      return;
    }
    createResumeMutation.mutate(formData);
  };

  const handleApply = () => {
    if (!selectedResumeId) {
      alert("Please select a resume");
      return;
    }
    applyMutation.mutate({ jobId, resumeId: selectedResumeId });
  };

  const handleDeleteResume = (resumeId: number) => {
    if (confirm("Are you sure you want to delete this resume?")) {
      deleteResumeMutation.mutate(resumeId);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Check Step - Show resume status */}
        {step === "check" && (
          <>
            <DialogHeader>
              <DialogTitle>Apply for Job</DialogTitle>
              <DialogDescription>
                {hasResumes
                  ? "Select a resume to apply with"
                  : "You need to create a resume first"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {!hasResumes ? (
                <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-amber-900">No Resume Found</p>
                    <p className="text-sm text-amber-800">
                      Create a resume to apply for jobs. You can create up to 5 resumes.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600">
                    Your Resumes ({resumes.length}/5)
                  </p>
                  <div className="space-y-2">
                    {resumes.map((resume) => (
                      <div
                        key={resume.id}
                        className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50"
                      >
                        <div>
                          <p className="font-medium text-slate-900">{resume.title}</p>
                          <p className="text-sm text-slate-600">{resume.fullName}</p>
                        </div>
                        {resume.isDefault && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                {canAddMore && (
                  <Button
                    variant="outline"
                    onClick={() => setStep("register")}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    {hasResumes ? "Add Another Resume" : "Create Resume"}
                  </Button>
                )}
                {hasResumes && (
                  <Button onClick={() => setStep("select")} className="flex-1">
                    Continue
                  </Button>
                )}
                <Button variant="ghost" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Register Step - Create new resume */}
        {step === "register" && (
          <>
            <DialogHeader>
              <DialogTitle>Create Resume</DialogTitle>
              <DialogDescription>
                Fill in your resume information. You can create up to 5 resumes.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Resume Title *</label>
                  <Input
                    placeholder="e.g., Software Developer Resume"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Full Name *</label>
                  <Input
                    placeholder="Your full name"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Email *</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Phone</label>
                  <Input
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Location</label>
                <Input
                  placeholder="City, Province"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Professional Summary</label>
                <Textarea
                  placeholder="Brief overview of your professional background"
                  value={formData.summary}
                  onChange={(e) =>
                    setFormData({ ...formData, summary: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Experience</label>
                <Textarea
                  placeholder="Your work experience"
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData({ ...formData, experience: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Education</label>
                <Textarea
                  placeholder="Your education background"
                  value={formData.education}
                  onChange={(e) =>
                    setFormData({ ...formData, education: e.target.value })
                  }
                  rows={2}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Skills</label>
                <Textarea
                  placeholder="Your skills (comma-separated)"
                  value={formData.skills}
                  onChange={(e) =>
                    setFormData({ ...formData, skills: e.target.value })
                  }
                  rows={2}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep("check")}
                  disabled={createResumeMutation.isPending}
                >
                  Back
                </Button>
                <Button
                  onClick={handleCreateResume}
                  disabled={createResumeMutation.isPending}
                  className="flex-1"
                >
                  {createResumeMutation.isPending ? "Creating..." : "Create Resume"}
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Select Step - Choose resume and apply */}
        {step === "select" && (
          <>
            <DialogHeader>
              <DialogTitle>Select Resume to Apply</DialogTitle>
              <DialogDescription>
                Choose which resume you want to submit with this application
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                {resumes.map((resume) => (
                  <div
                    key={resume.id}
                    onClick={() => setSelectedResumeId(resume.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                      selectedResumeId === resume.id
                        ? "border-red-500 bg-red-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{resume.title}</p>
                        <p className="text-sm text-slate-600">{resume.fullName}</p>
                        <p className="text-sm text-slate-500">{resume.email}</p>
                        {resume.location && (
                          <p className="text-sm text-slate-500">{resume.location}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {resume.isDefault && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteResume(resume.id);
                          }}
                          className="p-2 hover:bg-red-50 rounded text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {canAddMore && (
                <Button
                  variant="outline"
                  onClick={() => setStep("register")}
                  className="w-full gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Resume
                </Button>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep("check")}
                  disabled={applyMutation.isPending}
                >
                  Back
                </Button>
                <Button
                  onClick={handleApply}
                  disabled={!selectedResumeId || applyMutation.isPending}
                  className="flex-1"
                >
                  {applyMutation.isPending ? "Applying..." : "Apply Now"}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
