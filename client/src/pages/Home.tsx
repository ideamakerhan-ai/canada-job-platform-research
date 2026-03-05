import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, DollarSign, Clock, Heart, Share2, Search, CheckCircle } from "lucide-react";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";

interface JobListing {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  jobType: string;
  description: string;
  postedDate: string;
  category: string;
  isSaved?: boolean;
}

// 샘플 데이터
const sampleJobs: JobListing[] = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "TechCorp Canada",
    location: "Toronto, ON",
    salary: "$120,000 - $150,000",
    jobType: "Full-time",
    description: "Looking for experienced software engineer with 5+ years in backend development.",
    postedDate: "2 days ago",
    category: "Technology",
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
    category: "Marketing",
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
    category: "Trades",
  },
  {
    id: 6,
    title: "Data Analyst",
    company: "Analytics Pro",
    location: "Remote",
    salary: "$75,000 - $95,000",
    jobType: "Full-time",
    description: "Analyze complex datasets and provide insights for business decisions.",
    postedDate: "2 days ago",
    category: "Technology",
  },
  {
    id: 7,
    title: "Financial Analyst",
    company: "Bay Street Finance",
    location: "Toronto, ON",
    salary: "$70,000 - $95,000",
    jobType: "Full-time",
    description: "Analyze financial data and provide strategic recommendations.",
    postedDate: "1 day ago",
    category: "Finance",
  },
  {
    id: 8,
    title: "Sales Manager",
    company: "Global Sales Corp",
    location: "Vancouver, BC",
    salary: "$65,000 - $85,000",
    jobType: "Full-time",
    description: "Lead sales team and achieve quarterly targets.",
    postedDate: "2 days ago",
    category: "Sales",
  },
  {
    id: 9,
    title: "Education Coordinator",
    company: "Learning Academy",
    location: "Montreal, QC",
    salary: "$45,000 - $60,000",
    jobType: "Full-time",
    description: "Coordinate educational programs and student services.",
    postedDate: "3 days ago",
    category: "Education",
  },
  {
    id: 10,
    title: "HR Manager",
    company: "People First HR",
    location: "Calgary, AB",
    salary: "$60,000 - $80,000",
    jobType: "Full-time",
    description: "Manage human resources and employee relations.",
    postedDate: "1 day ago",
    category: "HR",
  },
  {
    id: 11,
    title: "Operations Manager",
    company: "Logistics Plus",
    location: "Edmonton, AB",
    salary: "$55,000 - $75,000",
    jobType: "Full-time",
    description: "Oversee operations and optimize efficiency.",
    postedDate: "2 days ago",
    category: "Operations",
  },
];

export default function Home() {
  const { user, loading, error, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedJobType, setSelectedJobType] = useState<string[]>([]);
  const [selectedSalaryRange, setSelectedSalaryRange] = useState<string[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobListing[]>(sampleJobs);
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);

  // 필터 업데이트 함수
  useEffect(() => {
    let filtered = sampleJobs;

    // 검색어 필터링
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 카테고리 필터링
    if (selectedCategory !== "all") {
      filtered = filtered.filter((job) => job.category === selectedCategory);
    }

    // 위치 필터링
    if (selectedLocation !== "all") {
      filtered = filtered.filter((job) => {
        if (selectedLocation === "Remote") {
          return job.location === "Remote";
        }
        return job.location.includes(selectedLocation.split(",")[0]);
      });
    }

    // 직종 필터링
    if (selectedJobType.length > 0) {
      filtered = filtered.filter((job) => selectedJobType.includes(job.jobType));
    }

    // 급여 범위 필터링
    if (selectedSalaryRange.length > 0) {
      filtered = filtered.filter((job) => {
        const salaryStr = job.salary.replace(/[$,]/g, "");
        const [minStr] = salaryStr.split("-");
        const minSalary = parseInt(minStr.trim());

        return selectedSalaryRange.some((range) => {
          if (range === "$0 - $50K") return minSalary <= 50000;
          if (range === "$50K - $100K") return minSalary >= 50000 && minSalary <= 100000;
          if (range === "$100K+") return minSalary >= 100000;
          return false;
        });
      });
    }

    setFilteredJobs(filtered);
  }, [searchTerm, selectedCategory, selectedLocation, selectedJobType, selectedSalaryRange]);

  const handleSaveJob = (jobId: number) => {
    setSavedJobs((prev) => {
      if (prev.includes(jobId)) {
        toast.success("Job removed from saved");
        return prev.filter((id) => id !== jobId);
      } else {
        toast.success("Job saved!");
        return [...prev, jobId];
      }

    });
  };

  const handleApplyJob = (jobId: number, jobTitle: string) => {
    if (!isAuthenticated) {
      toast.error("Please log in to apply for jobs");
      window.location.href = getLoginUrl();
      return;
    }

    setAppliedJobs((prev) => {
      if (!prev.includes(jobId)) {
        toast.success(`Applied for ${jobTitle}!`);
        return [...prev, jobId];
      }
      return prev;
    });
  };

  const handleShareJob = (jobTitle: string, jobCompany: string) => {
    const text = `Check out this job: ${jobTitle} at ${jobCompany}`;
    if (navigator.share) {
      navigator.share({
        title: "CanadaJobs",
        text: text,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(text);
      toast.success("Job link copied to clipboard!");
    }
  };

  const toggleJobType = (type: string) => {
    setSelectedJobType((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleSalaryRange = (range: string) => {
    setSelectedSalaryRange((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
  };

  const categories = ["all", "Technology", "Healthcare", "Construction", "Marketing", "Trades", "Finance", "Sales", "Education", "HR", "Operations"];
  const locations = [
    "all",
    "Toronto, ON",
    "Vancouver, BC",
    "Calgary, AB",
    "Montreal, QC",
    "Edmonton, AB",
    "Ottawa, ON",
    "Winnipeg, MB",
    "Halifax, NS",
    "Quebec City, QC",
    "Victoria, BC",
    "Remote",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* 헤더 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="cursor-pointer" onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
              setSelectedLocation("all");
              setSelectedJobType([]);
              setSelectedSalaryRange([]);
              navigate("/");
            }}>
              <h1 className="text-2xl font-bold text-slate-900 hover:text-blue-600 transition-colors">CanadaJobs</h1>
              <p className="text-sm text-slate-600">Find Your Perfect Job in Canada</p>
            </div>
            <div className="flex gap-3">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-700">Welcome, {user?.name || "User"}</span>
                  <Button variant="outline" size="sm" onClick={() => navigate("/profile")}>
                    Profile
                  </Button>
                </div>
              ) : (
                <Button size="sm" onClick={() => (window.location.href = getLoginUrl())}>
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
        <div className="container">
          <h2 className="text-4xl font-bold mb-4">Find Your Next Opportunity</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Browse thousands of job listings from top Canadian employers
          </p>

          {/* 검색 바 */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Job title or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat === "all" ? "All Categories" : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc === "all" ? "All Locations" : loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* 메인 콘텐츠 */}
      <main className="container py-12">
        <div className="grid grid-cols-1 gap-8">
          {/* 사이드바 - 필터 (숨김) */}
          <aside className="lg:col-span-1 hidden">
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 직종 필터 */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Job Type</h3>
                  <div className="space-y-2">
                    {["Full-time", "Part-time", "Contract"].map((type) => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedJobType.includes(type)}
                          onChange={() => toggleJobType(type)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-slate-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 급여 범위 필터 */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Salary Range</h3>
                  <div className="space-y-2">
                    {["$0 - $50K", "$50K - $100K", "$100K+"].map((range) => (
                      <label key={range} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedSalaryRange.includes(range)}
                          onChange={() => toggleSalaryRange(range)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-slate-700">{range}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
             </Card>
          </aside>
          {/* 공고 리스트 */}
          <section className="lg:col-span-4">
            <div className="mb-6">
              <p className="text-slate-600">Showing {filteredJobs.length} jobs</p>
            </div>

            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-slate-900 mb-1">{job.title}</h3>
                        <p className="text-slate-600 mb-3">{job.company}</p>
                        <p className="text-slate-700 text-sm mb-4">{job.description}</p>

                        <div className="flex flex-wrap gap-4 mb-4 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {job.salary}
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {job.jobType}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {job.postedDate}
                          </div>
                        </div>

                        <Badge variant="secondary">{job.category}</Badge>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSaveJob(job.id)}
                          title="Save job"
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              savedJobs.includes(job.id)
                                ? "fill-red-500 text-red-500"
                                : "text-slate-400"
                            }`}
                          />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShareJob(job.title, job.company)}
                        >
                          <Share2 className="w-4 h-4" />
                          Share
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApplyJob(job.id, job.title)}
                          disabled={appliedJobs.includes(job.id)}
                        >
                          {appliedJobs.includes(job.id) ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Applied
                            </>
                          ) : (
                            "Apply Now"
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-slate-900 text-slate-300 py-12 mt-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-white mb-4">About CanadaJobs</h4>
              <p className="text-sm">Your trusted platform for finding jobs across Canada.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">For Employers</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => toast.info("Post a Job feature coming soon!")} className="hover:text-white cursor-pointer">Post a Job</button></li>
                <li><button onClick={() => toast.info("Pricing information coming soon!")} className="hover:text-white cursor-pointer">Pricing</button></li>
                <li><button onClick={() => toast.info("Company Page feature coming soon!")} className="hover:text-white cursor-pointer">Company Page</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">For Job Seekers</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => window.scrollTo(0, 0)} className="hover:text-white cursor-pointer">Browse Jobs</button></li>
                <li><button onClick={() => toast.info("Career Advice section coming soon!")} className="hover:text-white cursor-pointer">Career Advice</button></li>
                <li><button onClick={() => toast.info("Salary Guide coming soon!")} className="hover:text-white cursor-pointer">Salary Guide</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => toast.info("Help Center coming soon!")} className="hover:text-white cursor-pointer">Help Center</button></li>
                <li><button onClick={() => toast.info("Contact Us feature coming soon!")} className="hover:text-white cursor-pointer">Contact Us</button></li>
                <li><button onClick={() => toast.info("Privacy Policy coming soon!")} className="hover:text-white cursor-pointer">Privacy Policy</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-sm">
            <p>&copy; 2026 CanadaJobs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
