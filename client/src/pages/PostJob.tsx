import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useLocation } from "wouter";

const categories = [
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
  "Public Service",
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

const experienceOptions = [
  "No experience required",
  "Less than 1 year",
  "1-2 years",
  "2-3 years",
  "3-5 years",
  "5+ years",
  "10+ years",
];

const accommodationOptions = [
  "No accommodation",
  "Accommodation provided",
  "Partial accommodation",
  "Relocation assistance",
];

export default function PostJob() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    category: "",
    location: "",
    salaryType: "annual",
    salaryMin: "",
    salaryMax: "",
    jobType: "Full-time",
    lmiaSponsorship: false,
    visaSponsorship: false,
    experienceRequired: "",
    accommodation: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === "" || /^\d+$/.test(value)) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.company || !formData.description || !formData.category || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.salaryMin || !formData.salaryMax) {
      toast.error("Please enter both minimum and maximum salary");
      return;
    }

    if (!formData.lmiaSponsorship && !formData.visaSponsorship) {
      toast.error("Please select at least one sponsorship option");
      return;
    }

    if (!formData.experienceRequired) {
      toast.error("Please select required experience level");
      return;
    }

    if (!formData.accommodation) {
      toast.error("Please select accommodation option");
      return;
    }

    console.log("Job posting:", formData);
    toast.success("Job posted successfully!");

    setFormData({
      title: "",
      company: "",
      description: "",
      category: "",
      location: "",
      salaryType: "annual",
      salaryMin: "",
      salaryMax: "",
      jobType: "Full-time",
      lmiaSponsorship: false,
      visaSponsorship: false,
      experienceRequired: "",
      accommodation: "",
    });

    setTimeout(() => setLocation("/"), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
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

      <main className="container py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Create a New Job Posting</CardTitle>
            <CardDescription>Fill in the details about your job opening</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Salary Type & Range *</label>
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="salaryType"
                      value="hourly"
                      checked={formData.salaryType === "hourly"}
                      onChange={(e) => handleSelectChange("salaryType", e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-slate-700">Hourly Rate ($)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="salaryType"
                      value="annual"
                      checked={formData.salaryType === "annual"}
                      onChange={(e) => handleSelectChange("salaryType", e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-slate-700">Annual Salary ($)</span>
                  </label>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Minimum</label>
                    <Input
                      type="text"
                      name="salaryMin"
                      placeholder="e.g., 50000"
                      value={formData.salaryMin}
                      onChange={handleSalaryChange}
                      className="w-full"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Maximum</label>
                    <Input
                      type="text"
                      name="salaryMax"
                      placeholder="e.g., 120000"
                      value={formData.salaryMax}
                      onChange={handleSalaryChange}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

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

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Required Experience *</label>
                <Select value={formData.experienceRequired} onValueChange={(value) => handleSelectChange("experienceRequired", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select required experience" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceOptions.map((exp) => (
                      <SelectItem key={exp} value={exp}>
                        {exp}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Accommodation *</label>
                <Select value={formData.accommodation} onValueChange={(value) => handleSelectChange("accommodation", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select accommodation option" />
                  </SelectTrigger>
                  <SelectContent>
                    {accommodationOptions.map((acc) => (
                      <SelectItem key={acc} value={acc}>
                        {acc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Sponsorship Options *</label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.lmiaSponsorship}
                      onChange={(e) => handleCheckboxChange("lmiaSponsorship", e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-slate-700">LMIA Sponsorship Available</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.visaSponsorship}
                      onChange={(e) => handleCheckboxChange("visaSponsorship", e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-slate-700">Visa Sponsorship Available</span>
                  </label>
                </div>
              </div>

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
