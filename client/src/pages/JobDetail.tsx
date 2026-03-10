import { useParams, useLocation as useWouterLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign, Briefcase, Clock, Heart, Share2, ArrowLeft, CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ResumeModal } from "@/components/ResumeModal";

// 샘플 데이터 (Home.tsx와 동일)
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
    accommodation: "Partial accommodation",
  },
  {
    id: 4,
    title: "Marketing Specialist",
    company: "Digital Solutions Inc",
    location: "Montreal, QC",
    salary: "$55,000 - $75,000",
    jobType: "Full-time",
    description: "Create and execute marketing strategies for growing tech company.",
    postedDate: "1 day ago",
    category: "Marketing & Communications",
    lmiaAvailable: false,
    visaSponsorshipAvailable: false,
    accommodation: "Accommodation provided",
  },
  {
    id: 5,
    title: "Electrician Apprentice",
    company: "Spark Electric Ltd",
    location: "Edmonton, AB",
    salary: "$45,000 - $65,000",
    jobType: "Full-time",
    description: "Join our team and learn from experienced electricians.",
    postedDate: "4 days ago",
    category: "Construction",
    lmiaAvailable: true,
    visaSponsorshipAvailable: true,
    accommodation: "Accommodation provided",
  },
];

export default function JobDetail() {
  const { id } = useParams();
  const [, navigate] = useWouterLocation();
  const [isApplied, setIsApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);

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
    setShowResumeModal(true);
  };

  const handleApplySuccess = () => {
    setIsApplied(true);
    toast.success("Application submitted successfully");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* 헤더 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="cursor-pointer" onClick={() => navigate("/")}>
              <h1 className="text-2xl font-bold text-slate-900 hover:text-blue-600 transition-colors">CanadaJobs</h1>
              <p className="text-sm text-slate-600">Find Your Perfect Job in Canada</p>
            </div>
            <Button variant="ghost" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
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
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">LMIA Sponsorship Available</Badge>
              )}
              {job.visaSponsorshipAvailable && (
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Visa Sponsorship Available</Badge>
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
                "Apply Now"
              )}
            </Button>

            <ResumeModal
              open={showResumeModal}
              onOpenChange={setShowResumeModal}
              jobId={job.id}
              onApplySuccess={handleApplySuccess}
            />
          </div>

          {/* 추가 정보 */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Requirements</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              <li>5+ years of professional experience</li>
              <li>Strong communication skills</li>
              <li>Valid work authorization or willingness to obtain LMIA</li>
              <li>Relevant certifications (if applicable)</li>
            </ul>
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-slate-900 text-slate-300 py-12 mt-16">
        <div className="container">
          <p className="text-center text-sm">© 2026 CanadaJobs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
