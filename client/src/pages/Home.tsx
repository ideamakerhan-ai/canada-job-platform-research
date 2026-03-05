import { useEffect, useState } from "react";
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
];

export default function Home() {
  const { user, isAuthenticated } = useAuth();
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
      filtered = filtered.filter((job) => job.location.includes(selectedLocation));
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

  const toggleSaveJob = (jobId: number) => {
    setSavedJobs((prev) => {
      const newSaved = prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId];
      if (newSaved.includes(jobId)) {
        toast.success("Job saved!");
      } else {
        toast.info("Job removed from saved");
      }
      return newSaved;
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

  const categories = ["all", ...Array.from(new Set(sampleJobs.map((job) => job.category)))];
  const locations = ["all", "Toronto", "Vancouver", "Calgary", "Montreal", "Edmonton", "Remote"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* 헤더 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">CanadaJobs</h1>
              <p className="text-sm text-slate-600">Find Your Perfect Job in Canada</p>
            </div>
            <div className="flex gap-3">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-700">Welcome, {user?.name || "User"}</span>
                  <Button variant="outline" size="sm">
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
                <div className="relative">
                  <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Job title or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-12 pl-10"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Category" />
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
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Location" />
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 사이드바 - 필터 */}
          <div className="lg:col-span-1">
            <Card className="border-slate-200 shadow-md sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Job Type</label>
                  <div className="space-y-2">
                    {["Full-time", "Part-time", "Contract"].map((type) => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={selectedJobType.includes(type)}
                          onChange={() => toggleJobType(type)}
                        />
                        <span className="text-sm text-slate-600">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Salary Range</label>
                  <div className="space-y-2">
                    {["$0 - $50K", "$50K - $100K", "$100K+"].map((range) => (
                      <label key={range} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={selectedSalaryRange.includes(range)}
                          onChange={() => toggleSalaryRange(range)}
                        />
                        <span className="text-sm text-slate-600">{range}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 메인 - 공고 리스트 */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-slate-600">
                Showing <span className="font-semibold">{filteredJobs.length}</span> jobs
              </p>
            </div>

            <div className="space-y-4">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <Card
                    key={job.id}
                    className="border-slate-200 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-slate-900 mb-1">{job.title}</h3>
                          <p className="text-slate-600 font-medium">{job.company}</p>
                        </div>
                        <button
                          onClick={() => toggleSaveJob(job.id)}
                          className="p-2 hover:bg-slate-100 rounded-lg transition"
                          title="Save job"
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              savedJobs.includes(job.id)
                                ? "fill-red-500 text-red-500"
                                : "text-slate-400"
                            }`}
                          />
                        </button>
                      </div>

                      <p className="text-slate-700 mb-4">{job.description}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{job.salary}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Briefcase className="w-4 h-4 text-purple-600" />
                          <span className="text-sm">{job.jobType}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock className="w-4 h-4 text-amber-600" />
                          <span className="text-sm">{job.postedDate}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{job.category}</Badge>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => handleShareJob(job.title, job.company)}
                          >
                            <Share2 className="w-4 h-4" />
                            Share
                          </Button>
                          {appliedJobs.includes(job.id) ? (
                            <Button size="sm" disabled className="gap-2">
                              <CheckCircle className="w-4 h-4" />
                              Applied
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleApplyJob(job.id, job.title)}
                            >
                              Apply Now
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border-slate-200 shadow-md">
                  <CardContent className="p-12 text-center">
                    <p className="text-slate-600 text-lg">No jobs found matching your criteria.</p>
                    <p className="text-slate-500 text-sm mt-2">Try adjusting your search filters.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-slate-900 text-slate-300 mt-16 py-8">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-white mb-4">About CanadaJobs</h4>
              <p className="text-sm">Your trusted platform for finding jobs across Canada.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">For Employers</h4>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-white">Post a Job</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Company Page</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">For Job Seekers</h4>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-white">Browse Jobs</a></li>
                <li><a href="#" className="hover:text-white">Career Advice</a></li>
                <li><a href="#" className="hover:text-white">Salary Guide</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Contact</h4>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
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
