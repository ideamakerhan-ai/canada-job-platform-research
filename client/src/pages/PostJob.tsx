import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useLocation } from "wouter";

const categories = [
  "Technology",
  "Healthcare",
  "Construction",
  "Marketing",
  "Trades",
  "Finance",
  "Sales",
  "Education",
  "HR",
  "Operations",
];

const locations = [
  "Toronto, ON",
  "Vancouver, BC",
  "Calgary, AB",
  "Montreal, QC",
  "Edmonton, AB",
  "Remote",
  "Ottawa, ON",
  "Winnipeg, MB",
  "Halifax, NS",
  "Quebec City, QC",
  "Victoria, BC",
];

export default function PostJob() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    category: "",
    location: "",
    salary: "",
    jobType: "Full-time",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.company || !formData.description || !formData.category || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    // 여기서 실제로 서버에 데이터를 보낼 수 있습니다
    console.log("Job posting:", formData);
    toast.success("Job posted successfully!");

    // 폼 초기화
    setFormData({
      title: "",
      company: "",
      description: "",
      category: "",
      location: "",
      salary: "",
      jobType: "Full-time",
    });

    // 홈으로 돌아가기
    setTimeout(() => setLocation("/"), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* 헤더 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Post a Job</h1>
              <p className="text-slate-600 mt-1">Share your job opportunity with Canadian employers</p>
            </div>
            <Button variant="outline" onClick={() => setLocation("/")}>
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Create a New Job Posting</CardTitle>
            <CardDescription>Fill in the details about your job opening</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 직책 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Job Title *</label>
                <Input
                  type="text"
                  name="title"
                  placeholder="e.g., Senior Software Engineer"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>

              {/* 회사명 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Company Name *</label>
                <Input
                  type="text"
                  name="company"
                  placeholder="e.g., TechCorp Canada"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>

              {/* 카테고리 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category *</label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 위치 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Location *</label>
                <Select value={formData.location} onValueChange={(value) => handleSelectChange("location", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 급여 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Salary Range</label>
                <Input
                  type="text"
                  name="salary"
                  placeholder="e.g., $80,000 - $120,000"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>

              {/* 근무형태 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Job Type</label>
                <Select value={formData.jobType} onValueChange={(value) => handleSelectChange("jobType", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Temporary">Temporary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 설명 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Job Description *</label>
                <Textarea
                  name="description"
                  placeholder="Describe the job, responsibilities, and requirements..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full h-40"
                />
              </div>

              {/* 버튼 */}
              <div className="flex gap-4">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Post Job
                </Button>
                <Button type="button" variant="outline" onClick={() => setLocation("/")}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
