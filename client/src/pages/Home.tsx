import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Download, Share2, BookmarkIcon } from "lucide-react";
import { Streamdown } from 'streamdown';

// 시장 데이터
const marketData = [
  { name: "2024", unemployment: 6.2, jobPostings: 95000, avgWages: 1280 },
  { name: "2025 Q1", unemployment: 6.4, jobPostings: 98000, avgWages: 1290 },
  { name: "2025 Q2", unemployment: 6.5, jobPostings: 102000, avgWages: 1295 },
  { name: "2025 Q3", unemployment: 6.6, jobPostings: 105000, avgWages: 1305 },
  { name: "2026 Q1", unemployment: 6.5, jobPostings: 108000, avgWages: 1312 },
];

const jobCategoryData = [
  { name: "Service & Retail", value: 28, fill: "#3b82f6" },
  { name: "Professional Tech", value: 22, fill: "#ef4444" },
  { name: "Construction", value: 18, fill: "#10b981" },
  { name: "Healthcare", value: 16, fill: "#f59e0b" },
  { name: "Other", value: 16, fill: "#8b5cf6" },
];

const wageComparisonData = [
  { occupation: "Retail Manager", jobkorea: 3500, jobbank: 4200 },
  { occupation: "Software Dev", jobkorea: 5800, jobbank: 7200 },
  { occupation: "Nurse", jobkorea: 4200, jobbank: 5100 },
  { occupation: "Electrician", jobkorea: 4800, jobbank: 5900 },
  { occupation: "Admin Assistant", jobkorea: 2800, jobbank: 3400 },
];

export default function Home() {
  const [reportContent, setReportContent] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // 보고서 콘텐츠 로드
    fetch("/report-content.md")
      .then(res => res.text())
      .then(text => setReportContent(text))
      .catch(err => console.error("Failed to load report:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* 헤더 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Canada Job Platform Research</h1>
              <p className="text-slate-600 mt-1">Benchmarking JobKorea & Job Bank for Canadian Market</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Download
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container py-12">
        {/* 히어로 배너 */}
        <div className="mb-12 rounded-lg overflow-hidden shadow-lg">
          <img src="/images/hero-banner.png" alt="Hero Banner" className="w-full h-auto object-cover" />
        </div>

        {/* 탭 네비게이션 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white border border-slate-200 p-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="strategy">Strategy</TabsTrigger>
            <TabsTrigger value="report">Full Report</TabsTrigger>
          </TabsList>

          {/* Overview 탭 */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 플랫폼 비교 */}
              <Card className="border-slate-200 shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl">Platform Comparison</CardTitle>
                  <CardDescription>JobKorea vs Canada Job Bank</CardDescription>
                </CardHeader>
                <CardContent>
                  <img src="/images/platform-comparison.png" alt="Platform Comparison" className="w-full rounded-lg" />
                </CardContent>
              </Card>

              {/* 핵심 통계 */}
              <div className="space-y-4">
                <Card className="border-slate-200 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg">Market Snapshot (2026)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-sm text-slate-600 font-medium">Job Postings</p>
                        <p className="text-2xl font-bold text-blue-600">52,860</p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <p className="text-sm text-slate-600 font-medium">Unemployment</p>
                        <p className="text-2xl font-bold text-red-600">6.5%</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <p className="text-sm text-slate-600 font-medium">Avg Weekly Wage</p>
                        <p className="text-2xl font-bold text-green-600">$1,312</p>
                      </div>
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                        <p className="text-sm text-slate-600 font-medium">Employers</p>
                        <p className="text-2xl font-bold text-amber-600">300K+</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Analysis 탭 */}
          <TabsContent value="analysis" className="space-y-6">
            {/* 시장 트렌드 차트 */}
            <Card className="border-slate-200 shadow-md">
              <CardHeader>
                <CardTitle>Canadian Labour Market Trends</CardTitle>
                <CardDescription>Unemployment, Job Postings & Average Wages (2024-2026)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={marketData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: "#f1f5f9", border: "1px solid #cbd5e1" }} />
                    <Legend />
                    <Line type="monotone" dataKey="unemployment" stroke="#ef4444" name="Unemployment (%)" strokeWidth={2} />
                    <Line type="monotone" dataKey="jobPostings" stroke="#3b82f6" name="Job Postings (100s)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* 직종별 분포 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-slate-200 shadow-md">
                <CardHeader>
                  <CardTitle>Top Job Categories</CardTitle>
                  <CardDescription>Distribution of job postings by sector</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={jobCategoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name} ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {jobCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* 임금 비교 */}
              <Card className="border-slate-200 shadow-md">
                <CardHeader>
                  <CardTitle>Wage Comparison</CardTitle>
                  <CardDescription>JobKorea vs Job Bank (CAD Monthly)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={wageComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="occupation" angle={-45} textAnchor="end" height={100} stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip contentStyle={{ backgroundColor: "#f1f5f9", border: "1px solid #cbd5e1" }} />
                      <Legend />
                      <Bar dataKey="jobkorea" fill="#10b981" name="JobKorea" />
                      <Bar dataKey="jobbank" fill="#3b82f6" name="Job Bank" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Strategy 탭 */}
          <TabsContent value="strategy" className="space-y-6">
            <Card className="border-slate-200 shadow-md">
              <CardHeader>
                <CardTitle>Localization Strategy</CardTitle>
                <CardDescription>Implementation Roadmap for Canadian Market</CardDescription>
              </CardHeader>
              <CardContent>
                <img src="/images/localization-strategy.png" alt="Localization Strategy" className="w-full rounded-lg" />
              </CardContent>
            </Card>

            {/* 전략 상세 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-slate-200 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Phase 1: MVP</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>✓ Basic job search & filters</p>
                  <p>✓ Location & job type filtering</p>
                  <p>✓ Mobile optimization</p>
                  <p>✓ User profile & saved jobs</p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Phase 2: Expansion</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>✓ AI matching algorithm</p>
                  <p>✓ LMI dashboard</p>
                  <p>✓ Community features</p>
                  <p>✓ Wage analytics</p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Phase 3: Advanced</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>✓ Resume builder</p>
                  <p>✓ Immigration filters</p>
                  <p>✓ Company reviews</p>
                  <p>✓ EDI information</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Full Report 탭 */}
          <TabsContent value="report" className="space-y-6">
            <Card className="border-slate-200 shadow-md">
              <CardHeader>
                <CardTitle>Complete Research Report</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                {reportContent ? (
                  <Streamdown>{reportContent}</Streamdown>
                ) : (
                  <p className="text-slate-600">Loading report...</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 하단 CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-red-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Build Your Platform?</h2>
          <p className="mb-6 text-blue-50">This research provides a comprehensive foundation for launching a successful job platform in Canada.</p>
          <div className="flex gap-4 justify-center">
            <Button variant="secondary" size="lg" className="gap-2">
              <BookmarkIcon className="w-4 h-4" />
              Save Report
            </Button>
            <Button variant="secondary" size="lg" className="gap-2">
              <Share2 className="w-4 h-4" />
              Share Findings
            </Button>
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-slate-900 text-slate-300 mt-16 py-8">
        <div className="container text-center text-sm">
          <p>© 2026 Canada Job Platform Research | Benchmarking Study</p>
          <p className="mt-2">Data sources: JobKorea, Canada Job Bank, Statistics Canada</p>
        </div>
      </footer>
    </div>
  );
}
