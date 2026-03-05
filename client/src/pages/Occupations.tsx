import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, AlertCircle, CheckCircle, Info } from "lucide-react";
import { toast } from "sonner";

interface NOCOccupation {
  id: number;
  nocCode: string;
  title: string;
  teerLevel: number;
  description: string;
  averageSalary: string;
  jobOutlook: string;
  lmiaEligible: boolean;
  visaSponsorshipAvailable: boolean;
  immigrationNotes: string;
  relatedJobs: number;
  educationRequired: string;
  workExperienceRequired: string;
}

const occupationsData: NOCOccupation[] = [
  {
    id: 1,
    nocCode: "2173",
    title: "Software Engineers and Designers",
    teerLevel: 1,
    description: "Design, develop and test software applications and systems. Conduct research on software development tools and practices.",
    averageSalary: "$85,000 - $130,000",
    jobOutlook: "Strong - High demand across Canada",
    lmiaEligible: true,
    visaSponsorshipAvailable: true,
    immigrationNotes: "In-demand occupation for Express Entry. LMIA processing typically 2-4 weeks. Eligible for Provincial Nominee Programs (PNP).",
    relatedJobs: 245,
    educationRequired: "Bachelor's degree in Computer Science or related field",
    workExperienceRequired: "2+ years in software development",
  },
  {
    id: 2,
    nocCode: "3152",
    title: "Registered Nurses",
    teerLevel: 1,
    description: "Provide direct patient care, administer medications, and coordinate nursing care in hospitals and clinics.",
    averageSalary: "$65,000 - $85,000",
    jobOutlook: "Very Strong - Critical shortage",
    lmiaEligible: true,
    visaSponsorshipAvailable: true,
    immigrationNotes: "Nursing is a priority occupation in most provinces. LMIA often waived for healthcare workers. Fast-track processing available.",
    relatedJobs: 189,
    educationRequired: "Bachelor of Science in Nursing (BSN) or equivalent",
    workExperienceRequired: "Current nursing license required",
  },
  {
    id: 3,
    nocCode: "7231",
    title: "Electricians (Except Industrial and Power System)",
    teerLevel: 2,
    description: "Install, maintain, and repair electrical wiring, equipment, and fixtures in residential and commercial buildings.",
    averageSalary: "$55,000 - $85,000",
    jobOutlook: "Strong - Ongoing demand",
    lmiaEligible: true,
    visaSponsorshipAvailable: true,
    immigrationNotes: "Skilled trade with strong LMIA approval rates. Apprenticeship programs available. PNP opportunities in most provinces.",
    relatedJobs: 156,
    educationRequired: "High school diploma + apprenticeship (4-5 years)",
    workExperienceRequired: "Journeyperson certification required",
  },
  {
    id: 4,
    nocCode: "1122",
    title: "Professional Accountants",
    teerLevel: 1,
    description: "Prepare and audit financial statements, manage accounting systems, and provide financial advice to organizations.",
    averageSalary: "$70,000 - $110,000",
    jobOutlook: "Moderate - Steady demand",
    lmiaEligible: true,
    visaSponsorshipAvailable: true,
    immigrationNotes: "CPA designation recognized in Express Entry. LMIA approval rates vary by province. Strong for PNP applications.",
    relatedJobs: 98,
    educationRequired: "Bachelor's degree + CPA certification",
    workExperienceRequired: "3+ years accounting experience",
  },
  {
    id: 5,
    nocCode: "2174",
    title: "Database Analysts and Data Administrators",
    teerLevel: 1,
    description: "Design, develop, and maintain databases. Manage data security and system performance.",
    averageSalary: "$75,000 - $120,000",
    jobOutlook: "Very Strong - High demand",
    lmiaEligible: true,
    visaSponsorshipAvailable: true,
    immigrationNotes: "In-demand for Express Entry. Tech sector LMIA processing accelerated. Multiple PNP pathways available.",
    relatedJobs: 167,
    educationRequired: "Bachelor's degree in Computer Science or related field",
    workExperienceRequired: "3+ years database administration experience",
  },
  {
    id: 6,
    nocCode: "3414",
    title: "Dental Hygienists and Dental Therapists",
    teerLevel: 2,
    description: "Provide preventive dental care, clean teeth, and educate patients on oral hygiene.",
    averageSalary: "$60,000 - $80,000",
    jobOutlook: "Strong - Growing demand",
    lmiaEligible: false,
    visaSponsorshipAvailable: true,
    immigrationNotes: "LMIA not typically available due to credential recognition requirements. Visa sponsorship possible with employer support.",
    relatedJobs: 45,
    educationRequired: "Dental Hygiene diploma or degree",
    workExperienceRequired: "Provincial licensing required",
  },
];

export default function Occupations() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTEER, setSelectedTEER] = useState<number | null>(null);

  const filteredOccupations = occupationsData.filter((occ) => {
    const matchesSearch =
      occ.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      occ.nocCode.includes(searchTerm) ||
      occ.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTEER = selectedTEER === null || occ.teerLevel === selectedTEER;
    
    return matchesSearch && matchesTEER;
  });

  const getTEERColor = (level: number) => {
    switch (level) {
      case 0:
        return "bg-blue-100 text-blue-800";
      case 1:
        return "bg-green-100 text-green-800";
      case 2:
        return "bg-yellow-100 text-yellow-800";
      case 3:
        return "bg-orange-100 text-orange-800";
      case 4:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTEERDescription = (level: number) => {
    switch (level) {
      case 0:
        return "Management occupations";
      case 1:
        return "Professional occupations";
      case 2:
        return "Technical occupations";
      case 3:
        return "Intermediate occupations";
      case 4:
        return "Elemental occupations";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* 헤더 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">NOC Occupations</h1>
              <p className="text-sm text-slate-600">National Occupational Classification & Immigration Information</p>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container py-8">
        {/* 검색 및 필터 섹션 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Occupations</CardTitle>
            <CardDescription>Find NOC codes, TEER levels, and immigration information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search by occupation title, NOC code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" size="sm">
                <Search className="w-4 h-4" />
              </Button>
            </div>

            {/* TEER 레벨 필터 */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedTEER === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTEER(null)}
              >
                All TEER Levels
              </Button>
              {[0, 1, 2, 3, 4].map((level) => (
                <Button
                  key={level}
                  variant={selectedTEER === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTEER(level)}
                  className={selectedTEER === level ? "" : ""}
                >
                  TEER {level}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 결과 */}
        <div className="space-y-4">
          {filteredOccupations.length > 0 ? (
            filteredOccupations.map((occ) => (
              <Card key={occ.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-slate-900">{occ.title}</h3>
                        <Badge className={getTEERColor(occ.teerLevel)}>
                          TEER {occ.teerLevel}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{occ.description}</p>
                      <div className="flex gap-2 flex-wrap">
                        {occ.lmiaEligible && (
                          <Badge variant="outline" className="bg-green-50 border-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            LMIA Eligible
                          </Badge>
                        )}
                        {occ.visaSponsorshipAvailable && (
                          <Badge variant="outline" className="bg-blue-50 border-blue-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Visa Sponsorship Available
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono bg-slate-100 px-3 py-2 rounded">
                        NOC {occ.nocCode}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* 기본 정보 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Average Salary</h4>
                      <p className="text-slate-600">{occ.averageSalary}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Job Outlook</h4>
                      <p className="text-slate-600">{occ.jobOutlook}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Education Required</h4>
                      <p className="text-slate-600">{occ.educationRequired}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Work Experience</h4>
                      <p className="text-slate-600">{occ.workExperienceRequired}</p>
                    </div>
                  </div>

                  {/* 이민 정보 */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex gap-2 mb-2">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <h4 className="font-semibold text-blue-900">Immigration Information</h4>
                    </div>
                    <p className="text-blue-800 text-sm">{occ.immigrationNotes}</p>
                  </div>

                  {/* TEER 설명 */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <p className="text-sm text-slate-600">
                      <span className="font-semibold">TEER Level {occ.teerLevel}:</span> {getTEERDescription(occ.teerLevel)}
                    </p>
                  </div>

                  {/* 관련 공고 */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      {occ.relatedJobs} related job listings available
                    </span>
                    <Button size="sm" variant="outline">
                      View Related Jobs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-900">No occupations found</h4>
                    <p className="text-sm text-yellow-800">Try adjusting your search criteria</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 정보 섹션 */}
        <Card className="mt-8 bg-slate-50">
          <CardHeader>
            <CardTitle className="text-lg">About NOC & TEER</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <p>
              <span className="font-semibold text-slate-900">NOC (National Occupational Classification):</span> Canada's official system for classifying occupations used for immigration, labour market information, and employment equity.
            </p>
            <p>
              <span className="font-semibold text-slate-900">TEER (Training, Education, Experience and Responsibilities):</span> A skill level classification system that groups occupations by the type and amount of training required.
            </p>
            <p>
              <span className="font-semibold text-slate-900">LMIA (Labour Market Impact Assessment):</span> A process employers use to demonstrate they need foreign workers because no Canadian workers are available.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
