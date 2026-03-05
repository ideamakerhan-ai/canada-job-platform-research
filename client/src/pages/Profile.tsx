import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, CheckCircle, LogOut } from "lucide-react";
import { useLocation } from "wouter";

interface SavedJob {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  jobType: string;
  category: string;
  savedDate: string;
}

interface AppliedJob {
  id: number;
  title: string;
  company: string;
  location: string;
  appliedDate: string;
  status: "pending" | "accepted" | "rejected";
}

export default function Profile() {
  const { user, logout, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  // 샘플 저장된 공고
  const savedJobs: SavedJob[] = [
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "TechCorp Canada",
      location: "Toronto, ON",
      salary: "$120,000 - $150,000",
      jobType: "Full-time",
      category: "Technology",
      savedDate: "2 days ago",
    },
    {
      id: 2,
      title: "Data Analyst",
      company: "Analytics Pro",
      location: "Remote",
      salary: "$75,000 - $95,000",
      jobType: "Full-time",
      category: "Technology",
      savedDate: "1 day ago",
    },
  ];

  // 샘플 지원 이력
  const appliedJobs: AppliedJob[] = [
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "TechCorp Canada",
      location: "Toronto, ON",
      appliedDate: "2 days ago",
      status: "pending",
    },
    {
      id: 3,
      title: "Project Manager",
      company: "BuildRight Construction",
      location: "Calgary, AB",
      appliedDate: "3 days ago",
      status: "accepted",
    },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>로그인 필요</CardTitle>
            <CardDescription>프로필을 보려면 로그인해주세요</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => navigate("/")}
            >
              돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* 헤더 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="container py-4">
          <div className="flex items-center justify-between">
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
                <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* 프로필 정보 */}
      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 사이드바 - 사용자 정보 */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600">Name</p>
                  <p className="font-semibold text-slate-900">{user?.name || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Email</p>
                  <p className="font-semibold text-slate-900">{user?.email || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Member Since</p>
                  <p className="font-semibold text-slate-900">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 저장된 공고 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Saved Jobs ({savedJobs.length})
                </CardTitle>
                <CardDescription>
                  Jobs you've bookmarked for later
                </CardDescription>
              </CardHeader>
              <CardContent>
                {savedJobs.length > 0 ? (
                  <div className="space-y-4">
                    {savedJobs.map((job) => (
                      <div
                        key={job.id}
                        className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900">{job.title}</h3>
                            <p className="text-sm text-slate-600">{job.company}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge variant="secondary">{job.location}</Badge>
                              <Badge variant="outline">{job.jobType}</Badge>
                              <Badge variant="outline">{job.salary}</Badge>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">Saved {job.savedDate}</p>
                          </div>
                          <Button size="sm" className="ml-4">
                            View Job
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-600 text-center py-8">
                    No saved jobs yet. Start bookmarking jobs!
                  </p>
                )}
              </CardContent>
            </Card>

            {/* 지원 이력 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Application History ({appliedJobs.length})
                </CardTitle>
                <CardDescription>
                  Track your job applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {appliedJobs.length > 0 ? (
                  <div className="space-y-4">
                    {appliedJobs.map((job) => (
                      <div
                        key={job.id}
                        className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-slate-900">{job.title}</h3>
                              <Badge
                                variant={
                                  job.status === "accepted"
                                    ? "default"
                                    : job.status === "rejected"
                                      ? "destructive"
                                      : "secondary"
                                }
                              >
                                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600">{job.company}</p>
                            <p className="text-sm text-slate-600">{job.location}</p>
                            <p className="text-xs text-slate-500 mt-2">Applied {job.appliedDate}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-600 text-center py-8">
                    No applications yet. Start applying for jobs!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
