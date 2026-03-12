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
  accommodation?: string | undefined;
}

// 샘플 데이터 (데이터베이스가 비어있을 때 사용)
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
];

export default function Home() {
  const { user, loading, error, isAuthenticated, logout } = useAuth();
  const [, navigate] = useWouterLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedJobType, setSelectedJobType] = useState<string[]>([]);
  const [selectedSalaryRange, setSelectedSalaryRange] = useState<string[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobListing[]>([]);
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);
  const [allJobs, setAllJobs] = useState<JobListing[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedJobTitle, setSelectedJobTitle] = useState<string | null>(null);
  
  // 데이터베이스에서 공고 로드
  const { data: dbJobs = [] } = trpc.job.search.useQuery({});

  // 데이터베이스 공고를 JobListing 형식으로 변환
  useEffect(() => {
    if (dbJobs && dbJobs.length > 0) {
      const convertedJobs: JobListing[] = (dbJobs as any[]).map((job: any) => ({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary || 'Competitive',
        jobType: job.jobType,
        description: job.description,
        postedDate: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently',
        category: job.category,
        lmiaAvailable: false,
        visaSponsorshipAvailable: false,
        accommodation: undefined,
      }));
      setAllJobs(convertedJobs);
      setFilteredJobs(convertedJobs);
    } else {
      // 데이터가 없으면 샘플 데이터 사용
      setAllJobs(sampleJobs);
      setFilteredJobs(sampleJobs);
    }
  }, [dbJobs]);

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
          if (range === "$100K - $150K") return minSalary >= 100000 && minSalary <= 150000;
          if (range === "$150K+") return minSalary >= 150000;
          return true;
        });
      });
    }

    // LMIA Approved 필터
    if (selectedFilters.includes("lmia")) {
      filtered = filtered.filter((job) => job.lmiaAvailable);
    }

    // Visa Sponsorship 필터
    if (selectedFilters.includes("visa")) {
      filtered = filtered.filter((job) => job.visaSponsorshipAvailable);
    }

    // Nursing Jobs 필터
    if (selectedFilters.includes("nursing")) {
      filtered = filtered.filter((job) => job.category === "Healthcare");
    }

    // Truck Driver Jobs 필터
    if (selectedFilters.includes("truck")) {
      filtered = filtered.filter((job) => job.category === "Transportation");
    }

    // 직업명 필터
    if (selectedJobTitle) {
      filtered = filtered.filter((job) => {
        const jobTitleLower = selectedJobTitle.toLowerCase();
        return (
          job.title.toLowerCase().includes(jobTitleLower) ||
          job.category.toLowerCase().includes(jobTitleLower)
        );
      });
    }

    setFilteredJobs(filtered);
  }, [
    searchTerm,
    selectedCategory,
    selectedLocation,
    selectedJobType,
    selectedSalaryRange,
    selectedFilters,
    selectedJobTitle,
    allJobs,
  ]);

  const handleFilterToggle = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const handleJobTitleClick = (title: string) => {
    setSelectedJobTitle(selectedJobTitle === title ? null : title);
  };

  const handleJobCardClick = (jobId: number) => {
    navigate(`/job/${jobId}`);
  };

  const handleApply = (jobId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    navigate(`/job/${jobId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-red-600 text-white rounded-lg px-3 py-2 font-bold text-lg">CJ</div>
              <h1 className="text-2xl font-bold text-slate-900">CanadaJobs</h1>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#" className="text-slate-600 hover:text-slate-900 font-medium">Find Jobs</a>
              <a href="#" className="text-slate-600 hover:text-slate-900 font-medium">Post a Job</a>
              <a href="#" className="text-slate-600 hover:text-slate-900 font-medium">Job Guide</a>
            </nav>
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <a href="/my-profile" className="bg-red-100 text-red-600 rounded-full w-10 h-10 flex items-center justify-center font-bold hover:bg-red-200">
                    {user?.name?.charAt(0) || 'U'}
                  </a>
                </>
              ) : (
                <a href={getLoginUrl()} className="bg-red-100 text-red-600 rounded-full w-10 h-10 flex items-center justify-center font-bold hover:bg-red-200">
                  I
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16">
        <div className="container">
          <div className="text-center mb-8">
            <div className="inline-block border border-red-500 rounded-full px-4 py-2 mb-4">
              <span className="text-red-500 text-sm font-semibold">✓ Canada's Job Platform</span>
            </div>
            <h2 className="text-5xl font-bold mb-4">
              Find Your <span className="text-red-500">Perfect Job</span> in Canada
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Browse verified job listings from Canadian employers. Find positions with visa sponsorship, LMIA approval, and accommodation support.
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Job title, NOC code, or keyword..."
                className="pl-12 py-3 bg-white text-slate-900 rounded-lg border-0 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-3 bg-white text-slate-900 rounded-lg border-0 font-medium min-w-[180px]"
            >
              <option value="all">All Locations</option>
              <option value="Toronto, ON">Toronto, ON</option>
              <option value="Vancouver, BC">Vancouver, BC</option>
              <option value="Calgary, AB">Calgary, AB</option>
              <option value="Edmonton, AB">Edmonton, AB</option>
              <option value="Montreal, QC">Montreal, QC</option>
              <option value="Winnipeg, MB">Winnipeg, MB</option>
              <option value="Ottawa, ON">Ottawa, ON</option>
              <option value="Halifax, NS">Halifax, NS</option>
            </select>
            <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold whitespace-nowrap h-auto">
              Search Jobs
            </Button>
          </div>

          {/* Filter Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <Button
              onClick={() => handleFilterToggle("lmia")}
              className={`${
                selectedFilters.includes("lmia")
                  ? "bg-red-600 text-white"
                  : "bg-slate-700 text-slate-200 hover:bg-slate-600"
              } rounded-lg py-2 font-semibold`}
            >
              ✓ LMIA
            </Button>
            <Button
              onClick={() => handleFilterToggle("visa")}
              className={`${
                selectedFilters.includes("visa")
                  ? "bg-red-600 text-white"
                  : "bg-slate-700 text-slate-200 hover:bg-slate-600"
              } rounded-lg py-2 font-semibold`}
            >
              ⊕ Visa Sponsorship
            </Button>
            <Button
              onClick={() => handleFilterToggle("nursing")}
              className={`${
                selectedFilters.includes("nursing")
                  ? "bg-red-600 text-white"
                  : "bg-slate-700 text-slate-200 hover:bg-slate-600"
              } rounded-lg py-2 font-semibold`}
            >
              🏥 Nursing Jobs
            </Button>
            <Button
              onClick={() => handleFilterToggle("truck")}
              className={`${
                selectedFilters.includes("truck")
                  ? "bg-red-600 text-white"
                  : "bg-slate-700 text-slate-200 hover:bg-slate-600"
              } rounded-lg py-2 font-semibold`}
            >
              🚚 Truck Driver Jobs
            </Button>
          </div>
        </div>
      </section>

      {/* Most Searched & Posted Jobs */}
      <section className="bg-slate-900 py-12">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Most Searched Jobs */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Most Searched Jobs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { title: "Healthcare Professionals", count: "1,234" },
                  { title: "Software Developers", count: "892" },
                  { title: "Truck Drivers", count: "756" },
                  { title: "Nurses", count: "645" },
                  { title: "Electricians", count: "534" },
                  { title: "Welders", count: "412" },
                ].map((job, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleJobTitleClick(job.title)}
                    className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition ${
                      selectedJobTitle === job.title
                        ? "bg-red-600 text-white"
                        : "bg-slate-700 text-slate-200 hover:bg-slate-600"
                    }`}
                  >
                    <span className="font-semibold text-lg">{job.title}</span>
                    <span className="text-red-500 font-bold text-xl">{job.count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Most Posted Jobs */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Most Posted Jobs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { title: "Retail & Sales", count: "456" },
                  { title: "Hospitality", count: "389" },
                  { title: "Construction", count: "312" },
                  { title: "Administration", count: "278" },
                  { title: "Manufacturing", count: "245" },
                  { title: "Transportation", count: "198" },
                ].map((job, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleJobTitleClick(job.title)}
                    className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition ${
                      selectedJobTitle === job.title
                        ? "bg-red-600 text-white"
                        : "bg-slate-700 text-slate-200 hover:bg-slate-600"
                    }`}
                  >
                    <span className="font-semibold text-lg">{job.title}</span>
                    <span className="text-red-500 font-bold text-xl">{job.count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 border-t border-slate-200">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">{allJobs.length}+</div>
              <div className="text-slate-600">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">50+</div>
              <div className="text-slate-600">Cities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
              <div className="text-slate-600">Verified</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">Free</div>
              <div className="text-slate-600">For Job Seekers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="bg-slate-50 py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Featured Opportunities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.slice(0, 6).map((job) => (
              <Card
                key={job.id}
                onClick={() => handleJobCardClick(job.id)}
                className="bg-white border-l-4 border-l-red-600 hover:shadow-lg transition cursor-pointer"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge className="bg-red-600 text-white">Featured</Badge>
                  </div>
                  <CardTitle className="text-lg text-slate-900">{job.title}</CardTitle>
                  <CardDescription className="text-slate-600">{job.company}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <DollarSign className="w-4 h-4" />
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Briefcase className="w-4 h-4" />
                    <span>{job.jobType}</span>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2">{job.description}</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {job.lmiaAvailable && (
                      <Badge variant="outline" className="text-red-600 border-red-600">LMIA</Badge>
                    )}
                  </div>
                  <Button
                    onClick={(e) => handleApply(job.id, e)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white mt-4"
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="bg-white py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">All Job Listings</h2>
          <div className="space-y-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <Card
                  key={job.id}
                  onClick={() => handleJobCardClick(job.id)}
                  className="bg-white border-l-4 border-l-slate-200 hover:border-l-red-600 hover:shadow-md transition cursor-pointer"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">{job.title}</h3>
                        <p className="text-slate-600 mb-3">{job.company}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-3">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" /> {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" /> {job.salary}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" /> {job.postedDate}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {job.lmiaAvailable && (
                            <Badge variant="outline" className="text-red-600 border-red-600">LMIA</Badge>
                          )}
                        </div>
                      </div>
                      <Heart className="w-6 h-6 text-slate-300 hover:text-red-600 transition" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-600 text-lg">No jobs found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">About</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">For Employers</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Post a Job</a></li>
                <li><a href="/admin" className="hover:text-white transition">Admin Dashboard</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Job Guide</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2026 CanadaJobs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
