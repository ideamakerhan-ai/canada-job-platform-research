import { useParams, useLocation as useWouterLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign, Briefcase, Clock, Heart, Share2, ArrowLeft, CheckCircle, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ResumeModal } from "@/components/ResumeModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const sampleJobs = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "TechCorp Canada",
    location: "Toronto, ON",
    salary: "$120,000 - $150,000",
    jobType: "Full-time",
    description: "Looking for experienced software engineer with 5+ years in backend development.",
    postedDate: "2 days ago",
    category: "IT Development & Data",
    lmiaAvailable: true,
    visaSponsorshipAvailable: true,
    accommodation: "Accommodation provided",
  },
  {
    id: 2,
    title: "Registered Nurse",
    company: "Vancouver General Hospital",
    location: "Vancouver, BC",
    salary: "$65,000 - $85,000",
    jobType: "Full-time",
    description: "Seeking compassionate nurses for our emergency department.",
    postedDate: "1 day ago",
    category: "Healthcare",
    lmiaAvailable: true,
    visaSponsorshipAvailable: true,
    accommodation: "Relocation assistance",
  },
  {
    id: 3,
    title: "Project Manager",
    company: "BuildRight Construction",
    location: "Calgary, AB",
    salary: "$80,000 - $110,000",
    jobType: "Full-time",
    description: "Lead construction projects from conception to completion.",
    postedDate: "3 days ago",
    category: "Construction",
    lmiaAvailable: false,
    visaSponsorshipAvailable: true,
    accommodation: "Housing support",
  },
  {
    id: 4,
    title: "Truck Driver",
    company: "TransCanada Logistics",
    location: "Edmonton, AB",
    salary: "$70,000 - $95,000",
    jobType: "Full-time",
    description: "Experienced truck drivers needed for long-haul routes across Canada.",
    postedDate: "5 days ago",
    category: "Transportation",
    lmiaAvailable: true,
    visaSponsorshipAvailable: false,
    accommodation: "Per diem provided",
  },
  {
    id: 5,
    title: "Chef",
    company: "Maple Leaf Hospitality",
    location: "Vancouver, BC",
    salary: "$55,000 - $75,000",
    jobType: "Full-time",
    description: "Head chef position for upscale restaurant. Must have 10+ years experience.",
    postedDate: "1 week ago",
    category: "Hospitality",
    lmiaAvailable: false,
    visaSponsorshipAvailable: true,
    accommodation: "Accommodation available",
  },
  {
    id: 6,
    title: "Electrician",
    company: "Power Solutions Inc",
    location: "Montreal, QC",
    salary: "$60,000 - $85,000",
    jobType: "Full-time",
    description: "Licensed electrician for commercial and residential projects.",
    postedDate: "3 days ago",
    category: "Skilled Trades",
    lmiaAvailable: true,
    visaSponsorshipAvailable: true,
    accommodation: "Relocation package",
  },
];

export default function JobDetail() {
  const { id } = useParams();
  const [, navigate] = useWouterLocation();
  const [isSaved, setIsSaved] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");

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
    setShowApplyModal(true);
  };

  const handleSubmitApplication = () => {
    if (!applicantName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!applicantEmail.trim()) {
      toast.error("Please enter your email");
      return;
    }

    const subject = encodeURIComponent(`Job Application: ${job.title}`);
    const body = encodeURIComponent(
      `I would like to apply for the position of ${job.title} at ${job.company}.\n\n` +
      `Applicant Name: ${applicantName}\n` +
      `Email: ${applicantEmail}\n` +
      `Phone: ${applicantPhone || "N/A"}\n\n` +
      `Job Link: ${window.location.href}`
    );

    const recipientEmail = "jobs@canadajobs.com";
    window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;

    setIsApplied(true);
    setShowApplyModal(false);
    setApplicantName("");
    setApplicantEmail("");
    setApplicantPhone("");
    toast.success("Opening email client to submit your application");
  };

  const handleApplySuccess = () => {
    setIsApplied(true);
    setShowResumeModal(false);
    toast.success("Application submitted successfully");
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
                  {job.salary}
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

      {/* Apply Modal */}
      <Dialog open={showApplyModal} onOpenChange={setShowApplyModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Apply for this job</DialogTitle>
            <DialogDescription>
              Enter your information to apply for the {job.title} position at {job.company}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Your Name</label>
              <Input
                type="text"
                placeholder="Enter your full name"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Your Email</label>
              <Input
                type="email"
                placeholder="Enter your email address"
                value={applicantEmail}
                onChange={(e) => setApplicantEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Phone (Optional)</label>
              <Input
                type="tel"
                placeholder="Enter your phone number"
                value={applicantPhone}
                onChange={(e) => setApplicantPhone(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowApplyModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitApplication}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Send Application
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>


    </div>
  );
}
