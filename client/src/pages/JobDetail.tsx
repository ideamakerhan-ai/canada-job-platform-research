import { useParams, useLocation as useWouterLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign, Briefcase, Clock, Heart, Share2, ArrowLeft, CheckCircle, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const sampleJobs = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "TechCorp Canada",
    location: "Toronto, ON",
    salary: "$120,000 - $150,000",
    salaryType: "annual",
    jobType: "Full-time",
    description: "Looking for experienced software engineer with 5+ years in backend development.",
    postedDate: "2 days ago",
    category: "IT Development & Data",
    lmiaAvailable: true,
    visaSponsorshipAvailable: true,
    accommodation: "Accommodation provided",
    applicationEmail: "hr@techcorp.ca",
  },
  {
    id: 2,
    title: "Registered Nurse",
    company: "Vancouver General Hospital",
    location: "Vancouver, BC",
    salary: "$65,000 - $85,000",
    salaryType: "annual",
    jobType: "Full-time",
    description: "Seeking compassionate nurses for our emergency department.",
    postedDate: "1 day ago",
    category: "Healthcare",
    lmiaAvailable: true,
    visaSponsorshipAvailable: true,
    accommodation: "Relocation assistance",
    applicationEmail: "recruitment@vgh.ca",
  },
  {
    id: 3,
    title: "Project Manager",
    company: "BuildRight Construction",
    location: "Calgary, AB",
    salary: "$80,000 - $110,000",
    salaryType: "annual",
    jobType: "Full-time",
    description: "Lead construction projects from conception to completion.",
    postedDate: "3 days ago",
    category: "Construction",
    lmiaAvailable: false,
    visaSponsorshipAvailable: true,
    accommodation: "Housing support",
    applicationEmail: "jobs@buildright.ca",
  },
  {
    id: 4,
    title: "Truck Driver",
    company: "TransCanada Logistics",
    location: "Edmonton, AB",
    salary: "$70,000 - $95,000",
    salaryType: "annual",
    jobType: "Full-time",
    description: "Experienced truck drivers needed for long-haul routes across Canada.",
    postedDate: "5 days ago",
    category: "Transportation",
    lmiaAvailable: true,
    visaSponsorshipAvailable: false,
    accommodation: "Per diem provided",
    applicationEmail: "careers@transcanada.ca",
  },
  {
    id: 5,
    title: "Chef",
    company: "Maple Leaf Hospitality",
    location: "Vancouver, BC",
    salary: "$55,000 - $75,000",
    salaryType: "annual",
    jobType: "Full-time",
    description: "Head chef position for upscale restaurant. Must have 10+ years experience.",
    applicationEmail: "hiring@mapleleaf-hospitality.ca",
    postedDate: "1 week ago",
    category: "Hospitality",
    lmiaAvailable: false,
    visaSponsorshipAvailable: true,
    accommodation: "Accommodation available",
  },
  {
    id: 6,
    title: "Software Developer (Entry Level)",
    company: "InnovateTech Solutions",
    location: "Toronto, ON",
    salary: "$70,000 - $90,000",
    salaryType: "annual",
    jobType: "Full-time",
    description: "Entry-level software developer position. We provide mentorship and training.",
    postedDate: "1 week ago",
    category: "IT Development & Data",
    lmiaAvailable: false,
    visaSponsorshipAvailable: false,
    accommodation: "None",
    applicationEmail: "dev-jobs@innovatetech.ca",
  },
];

export default function JobDetail() {
  const { id } = useParams();
  const [, navigate] = useWouterLocation();
  const [isSaved, setIsSaved] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);


  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const job = sampleJobs.find((j) => j.id === parseInt(id || "0"));

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="container">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Button>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-slate-900">Job not found</h1>
          </div>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? "Job removed from saved" : "Job saved successfully");
  };

  const handleShare = () => {
    toast.success("Job link copied to clipboard");
  };

  const handleApply = () => {
    setShowEmailModal(true);
  };

  const handleCopyEmail = () => {
    const email = job.applicationEmail || "jobs@canadajobs.com";
    navigator.clipboard.writeText(email);
    toast.success(`${email} copied to clipboard`);
    setIsApplied(true);
  };



  const handleApplySuccess = () => {
    setIsApplied(true);
    setShowEmailModal(false);
    toast.success("Application submitted successfully");
    // Open email client with pre-filled email
    const email = job.applicationEmail || "jobs@canadajobs.com";
    window.location.href = `mailto:${email}?subject=Job Application - ${job.title}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* 헤더 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="cursor-pointer hover:opacity-70" onClick={() => navigate("/")}>
              <h1 className="text-2xl font-bold text-slate-900">CJ</h1>
              <p className="text-sm text-slate-600">Canada Jobs</p>
            </div>
            <Button variant="ghost" onClick={() => navigate("/")} className="ml-auto">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* 공고 헤더 */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">{job.title}</h1>
                <p className="text-xl text-slate-600 mb-4">{job.company}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handleSave}
                  title="Save job"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      isSaved
                        ? "fill-red-500 text-red-500"
                        : "text-slate-400"
                    }`}
                  />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleShare}
                >
                  <Share2 className="w-6 h-6" />
                </Button>
              </div>
            </div>

            {/* 기본 정보 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-slate-200">
              <div>
                <p className="text-sm text-slate-600 mb-1">Location</p>
                <div className="flex items-center gap-2 text-slate-900 font-semibold">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Salary</p>
                <div className="flex items-center gap-2 text-slate-900 font-semibold">
                  <DollarSign className="w-4 h-4" />
                  <span>
                    {job.salary}
                    {job.salaryType === "hourly" ? "/hr" : "/year"}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Job Type</p>
                <div className="flex items-center gap-2 text-slate-900 font-semibold">
                  <Briefcase className="w-4 h-4" />
                  {job.jobType}
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Posted</p>
                <div className="flex items-center gap-2 text-slate-900 font-semibold">
                  <Clock className="w-4 h-4" />
                  {job.postedDate}
                </div>
              </div>
            </div>

            {/* 배지 */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="secondary">{job.category}</Badge>
              {job.lmiaAvailable && (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">LMIA</Badge>
              )}
              {job.visaSponsorshipAvailable && (
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Visa Sponsorship</Badge>
              )}
              {job.accommodation && (
                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">{job.accommodation}</Badge>
              )}
            </div>

            {/* 설명 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">About this job</h2>
              <p className="text-slate-700 leading-relaxed text-lg">{job.description}</p>
            </div>

            {/* 지원 버튼 */}
            <Button
              size="lg"
              onClick={handleApply}
              disabled={isApplied}
              className="w-full md:w-auto"
            >
              {isApplied ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Applied
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5 mr-2" />
                  Apply Now
                </>
              )}
            </Button>
          </div>
        </div>
      </main>

      {/* Email Modal */}
      <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Employer</DialogTitle>
            <DialogDescription>
              Send your application to the employer's email address
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm text-slate-600 mb-2">Employer Email:</p>
              <p className="text-lg font-semibold text-slate-900">jobs@canadajobs.com</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-700">
                <strong>Position:</strong> {job.title}
              </p>
              <p className="text-sm text-slate-700">
                <strong>Company:</strong> {job.company}
              </p>
              <p className="text-sm text-slate-700">
                <strong>Location:</strong> {job.location}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCopyEmail}
                className="flex-1"
              >
                Copy Email
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowEmailModal(false)}
                className="flex-1"
              >
                Close
              </Button>
            </div>
            <p className="text-xs text-slate-500 text-center">
              Copy the email address and send your resume and application details
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
