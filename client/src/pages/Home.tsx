import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation as useWouterLocation } from "wouter";
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
  lmiaAvailable?: boolean;
  visaSponsorshipAvailable?: boolean;
  accommodation?: string;
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
  {
    id: 6,
    title: "Data Analyst",
    company: "Analytics Pro",
    location: "Remote",
    salary: "$75,000 - $95,000",
    jobType: "Full-time",
    description: "Analyze complex datasets and provide insights for business decisions.",
    postedDate: "2 days ago",
    category: "IT Development & Data",
    lmiaAvailable: true,
    visaSponsorshipAvailable: true,
    accommodation: "Accommodation provided",
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
    category: "Accounting & Finance",
    lmiaAvailable: false,
    visaSponsorshipAvailable: true,
    accommodation: "Partial accommodation",
  },
  {
    id: 8,
    title: "Sales Representative",
    company: "Global Trade Solutions",
    location: "Vancouver, BC",
    salary: "$50,000 - $80,000",
    jobType: "Full-time",
    description: "Sell enterprise software solutions to corporate clients.",
    postedDate: "3 days ago",
    category: "Sales & Trading",
    lmiaAvailable: false,
    visaSponsorshipAvailable: true,
    accommodation: "Relocation assistance",
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
    lmiaAvailable: false,
    visaSponsorshipAvailable: false,
    accommodation: "Accommodation provided",
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
    category: "HR & Training",
    lmiaAvailable: true,
    visaSponsorshipAvailable: true,
    accommodation: "Accommodation provided",
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
    category: "Administration & Legal",
    lmiaAvailable: false,
    visaSponsorshipAvailable: true,
    accommodation: "Partial accommodation",
  },
];

export default function Home() {
  const { user, loading, error, isAuthenticated, logout } = useAuth();
  const [, navigate] = useWouterLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedJobType, setSelectedJobType] = useState<string[]>([]);
  const [selectedSalaryRange, setSelectedSalaryRange] = useState<string[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobListing[]>(sampleJobs);
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);
  const [allJobs, setAllJobs] = useState<JobListing[]>(sampleJobs);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // 초기화: 샘플 데이터만 사용
  useEffect(() => {
    setAllJobs(sampleJobs);
  }, []);

  // 필터 업데이트 함수
  useEffect(() => {
    let filtered = allJobs;

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

    // 히어로 섹션 필터 적용
    if (selectedFilters.length > 0) {
      filtered = filtered.filter((job) => {
        let meetsLMIA = !selectedFilters.includes("LMIA Jobs") || job.lmiaAvailable;
        let meetsNursing = !selectedFilters.includes("Nursing Jobs") || (job.lmiaAvailable && job.category === "Healthcare");
        let meetsTruck = !selectedFilters.includes("Truck Driver Jobs") || (job.lmiaAvailable && job.category === "Transportation");
        let meetsVisa = !selectedFilters.includes("Visa Sponsorship") || job.visaSponsorshipAvailable;
        
        return meetsLMIA && meetsNursing && meetsTruck && meetsVisa;
      });
    }

    setFilteredJobs(filtered);
  }, [searchTerm, selectedCategory, selectedLocation, selectedJobType, selectedSalaryRange, selectedFilters]);

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
        title: "LMIAJobsCanada",
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

  const toggleFilter = (filterName: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterName) ? prev.filter((f) => f !== filterName) : [...prev, filterName]
    );
  };

  const categories = [
    "all",
    "Strategy & Planning",
    "Marketing & Communications",
    "Accounting & Finance",
    "HR & Training",
    "Administration & Legal",
    "IT Development & Data",
    "Design",
    "Sales & Trading",
    "Construction",
    "Healthcare",
    "Research & Development",
    "Education",
    "Media & Culture",
    "Finance & Insurance",
    "Transportation",
    "Service",
    "Manufacturing",
    "Public Service"
  ];
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
            <div className="cursor-pointer flex items-center gap-2" onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
              setSelectedLocation("all");
              setSelectedJobType([]);
              setSelectedSalaryRange([]);
              navigate("/");
            }}>
              <div className="bg-red-600 text-white rounded-md p-2 font-bold">LJ</div>
              <h1 className="text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors">LMIAJobs</h1>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#" className="text-slate-700 hover:text-slate-900 font-medium">Find Jobs</a>
              <a href="#" className="text-slate-700 hover:text-slate-900 font-medium" onClick={() => navigate("/post-job")}>Post a Job</a>
              <a href="#" className="text-slate-700 hover:text-slate-900 font-medium">LMIA Guide</a>
            </nav>
            <nav className="md:hidden flex items-center gap-4">
              <a href="#" className="text-slate-700 hover:text-slate-900 font-medium text-sm" onClick={() => navigate("/post-job")}>Post a Job</a>
            </nav>
            <div className="flex gap-3">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" onClick={() => navigate("/profile")}>
                    <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center text-red-600 font-bold">I</div>
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
      <section className="bg-slate-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"></div>
        <div className="container relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-4 py-2 border border-red-500 rounded-full text-sm text-red-400">
              ✓ Trusted LMIA Job Platform
            </div>
            <h2 className="text-5xl font-bold mb-4">
              Find <span className="text-red-500">LMIA-Approved</span> Jobs<br/>in Canada
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Browse verified job listings with Labour Market Impact Assessment approval and visa sponsorship from Canadian employers.
            </p>
          </div>

          {/* 검색 바 */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Job title, NOC code, or keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 py-3 text-base text-slate-900 placeholder:text-slate-400 border-0 rounded-lg"
                />
              </div>
              <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium">
                Search Jobs
              </Button>
            </div>
          </div>

          {/* 필터 버튼 */}
          <div className="flex flex-wrap justify-center gap-3">
            <Button 
              onClick={() => toggleFilter("LMIA Jobs")}
              className={`${
                selectedFilters.includes("LMIA Jobs")
                  ? "bg-red-600 border-red-600 text-white hover:bg-red-700"
                  : "bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
              }`}
              variant="outline"
            >
              ✓ LMIA Jobs
            </Button>
            <Button 
              onClick={() => toggleFilter("Visa Sponsorship")}
              className={`${
                selectedFilters.includes("Visa Sponsorship")
                  ? "bg-red-600 border-red-600 text-white hover:bg-red-700"
                  : "bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
              }`}
              variant="outline"
            >
              ⊕ Visa Sponsorship
            </Button>
            <Button 
              onClick={() => toggleFilter("Nursing Jobs")}
              className={`${
                selectedFilters.includes("Nursing Jobs")
                  ? "bg-red-600 border-red-600 text-white hover:bg-red-700"
                  : "bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
              }`}
              variant="outline"
            >
              🏥 Nursing Jobs
            </Button>
            <Button 
              onClick={() => toggleFilter("Truck Driver Jobs")}
              className={`${
                selectedFilters.includes("Truck Driver Jobs")
                  ? "bg-red-600 border-red-600 text-white hover:bg-red-700"
                  : "bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
              }`}
              variant="outline"
            >
              🚚 Truck Driver Jobs
            </Button>
          </div>

          {/* 검색 통계 섹션 */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-sm border border-white border-opacity-30">
              <h3 className="text-lg font-bold mb-4 text-white">Most Searched Jobs</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold text-base">Healthcare Professionals</span>
                  <span className="text-red-500 font-bold text-xl">1,234</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold text-base">Software Developers</span>
                  <span className="text-red-500 font-bold text-xl">892</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold text-base">Truck Drivers</span>
                  <span className="text-red-500 font-bold text-xl">756</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold text-base">Nurses</span>
                  <span className="text-red-500 font-bold text-xl">645</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold text-base">Electricians</span>
                  <span className="text-red-500 font-bold text-xl">534</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold text-base">Welders</span>
                  <span className="text-red-500 font-bold text-xl">423</span>
                </div>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-sm border border-white border-opacity-30">
              <h3 className="text-lg font-bold mb-4 text-white">Most Posted Jobs</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold text-base">Retail & Sales</span>
                  <span className="text-red-500 font-bold text-xl">456</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold text-base">Hospitality</span>
                  <span className="text-red-500 font-bold text-xl">389</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold text-base">Construction</span>
                  <span className="text-red-500 font-bold text-xl">312</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold text-base">Manufacturing</span>
                  <span className="text-red-500 font-bold text-xl">298</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold text-base">Transportation</span>
                  <span className="text-red-500 font-bold text-xl">267</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold text-base">Administration</span>
                  <span className="text-red-500 font-bold text-xl">245</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 통계 섹션 */}
      <section className="bg-slate-100 py-12 border-b border-slate-200">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">8+</div>
              <div className="text-sm md:text-base text-slate-600">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">8+</div>
              <div className="text-sm md:text-base text-slate-600">Cities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">100%</div>
              <div className="text-sm md:text-base text-slate-600">LMIA Verified</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">Free</div>
              <div className="text-sm md:text-base text-slate-600">For Job Seekers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs 섹션 */}
      <section className="bg-white border-b border-slate-200 py-12">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Featured Jobs</h2>
              <p className="text-slate-600">Latest LMIA-approved opportunities</p>
            </div>
            <Button variant="outline" onClick={() => navigate("/")}>
              View All Jobs <span className="ml-2">→</span>
            </Button>
          </div>

          {/* Featured Jobs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allJobs.slice(0, 6).map((job) => (
              <div
                key={job.id}
                onClick={() => navigate(`/job/${job.id}`)}
                className="cursor-pointer group"
              >
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-red-300 bg-white h-full group-hover:bg-slate-50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                        ⭐ Featured
                      </Badge>
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-red-600 transition-colors">{job.title}</h3>
                    <p className="text-slate-600 text-sm mb-4">{job.company}</p>
                    
                    <div className="space-y-2 mb-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        {job.salary}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.lmiaAvailable && (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">✓ LMIA</Badge>
                      )}
                      {job.visaSponsorshipAvailable && (
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs">⊕ Visa Sponsor</Badge>
                      )}
                      {job.accommodation && (
                        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 text-xs">🏠 {job.accommodation.split(' ')[0]}</Badge>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 mb-2">NOC 72200</p>
                    <p className="text-xs text-slate-500">Click to view details →</p>
                  </CardContent>
                </Card>
              </div>
            ))}
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
                <Card key={job.id} className="hover:shadow-lg transition-shadow cursor-pointer bg-white" onClick={() => navigate(`/job/${job.id}`)}>
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

                        <div className="flex flex-wrap gap-2">
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
                      </div>

                      <div className="flex flex-col gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
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
                <li><button onClick={() => navigate("/post-job")} className="hover:text-white cursor-pointer">Post a Job</button></li>
                <li><button onClick={() => toast.info("Pricing information coming soon!")} className="hover:text-white cursor-pointer">Pricing</button></li>
                <li><button onClick={() => toast.info("Company Page feature coming soon!")} className="hover:text-white cursor-pointer">Company Page</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">For Job Seekers</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => window.scrollTo(0, 0)} className="hover:text-white cursor-pointer">Browse Jobs</button></li>
                <li><button onClick={() => navigate("/occupations")} className="hover:text-white cursor-pointer">NOC Occupations</button></li>
                <li><button onClick={() => toast.info("Salary Guide coming soon!")} className="hover:text-white cursor-pointer">Salary Guide</button></li>
                <li><button onClick={() => toast.info("LMIA Guide coming soon!")} className="hover:text-white cursor-pointer">LMIA Guide</button></li>
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
