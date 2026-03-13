import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2 } from "lucide-react";

const JOB_CATEGORIES = [
  "Healthcare",
  "Technology",
  "Construction",
  "Trades",
  "Retail & Service",
  "Transportation",
  "Finance",
  "Education",
  "Manufacturing",
  "Other"
];

const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Temporary",
  "Seasonal"
];

const CANADIAN_PROVINCES = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Northwest Territories",
  "Nova Scotia",
  "Nunavut",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Yukon"
];

export default function PostJob() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "",
    category: "",
    salaryMin: "",
    salaryMax: "",
    description: "",
    requirements: "",
    applicationEmail: "",
    lmiaAvailable: false,
    visaSponsorship: false,
    accommodationProvided: false,
  });

  const createPostingMutation = trpc.employer.createPosting.useMutation();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>Please sign in to post a job</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              You need to be signed in to post job listings.
            </p>
            <Button onClick={() => setLocation("/")} className="w-full">
              Go Back Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createPostingMutation.mutateAsync({
        title: formData.title,
        company: formData.company,
        location: formData.location,
        jobType: formData.jobType,
        category: formData.category,
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : undefined,
        description: formData.description,
        requirements: formData.requirements,
        applicationEmail: formData.applicationEmail,
        lmiaAvailable: formData.lmiaAvailable,
        visaSponsorship: formData.visaSponsorship,
        accommodationProvided: formData.accommodationProvided,
      });

      // Navigate to employer dashboard
      setLocation("/employer/dashboard");
    } catch (error) {
      console.error("Failed to create job posting:", error);
      alert("Failed to create job posting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="container max-w-2xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Post a Job</h1>
          <p className="text-slate-600">Create a new job listing to attract qualified candidates</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>Fill in the information about your job opening</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">Job Title *</label>
                <Input
                  name="title"
                  placeholder="e.g., Senior Software Engineer"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Company Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">Company Name *</label>
                <Input
                  name="company"
                  placeholder="Your company name"
                  value={formData.company}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">Location *</label>
                <Select value={formData.location} onValueChange={(value) => handleSelectChange("location", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a province" />
                  </SelectTrigger>
                  <SelectContent>
                    {CANADIAN_PROVINCES.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Job Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">Job Type *</label>
                <Select value={formData.jobType} onValueChange={(value) => handleSelectChange("jobType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">Job Category *</label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Salary Range */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">Salary Min (CAD)</label>
                  <Input
                    name="salaryMin"
                    type="number"
                    placeholder="e.g., 50000"
                    value={formData.salaryMin}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">Salary Max (CAD)</label>
                  <Input
                    name="salaryMax"
                    type="number"
                    placeholder="e.g., 80000"
                    value={formData.salaryMax}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">Job Description *</label>
                <Textarea
                  name="description"
                  placeholder="Describe the job, responsibilities, and what you're looking for..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  required
                />
              </div>

              {/* Requirements */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">Requirements</label>
                <Textarea
                  name="requirements"
                  placeholder="List required qualifications, experience, skills, etc."
                  value={formData.requirements}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>

              {/* Application Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">Application Email *</label>
                <Input
                  name="applicationEmail"
                  type="email"
                  placeholder="where@company.com"
                  value={formData.applicationEmail}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Benefits */}
              <div className="space-y-3 border-t pt-4">
                <label className="text-sm font-medium text-slate-900">Benefits & Sponsorship</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="visaSponsorship"
                      checked={formData.visaSponsorship}
                      onCheckedChange={(checked) => handleCheckboxChange("visaSponsorship", checked as boolean)}
                    />
                    <label htmlFor="visaSponsorship" className="text-sm cursor-pointer">
                      Visa Sponsorship Available
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="lmiaAvailable"
                      checked={formData.lmiaAvailable}
                      onCheckedChange={(checked) => handleCheckboxChange("lmiaAvailable", checked as boolean)}
                    />
                    <label htmlFor="lmiaAvailable" className="text-sm cursor-pointer">
                      LMIA Approved
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="accommodationProvided"
                      checked={formData.accommodationProvided}
                      onCheckedChange={(checked) => handleCheckboxChange("accommodationProvided", checked as boolean)}
                    />
                    <label htmlFor="accommodationProvided" className="text-sm cursor-pointer">
                      Accommodation Provided
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    "Post Job"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
