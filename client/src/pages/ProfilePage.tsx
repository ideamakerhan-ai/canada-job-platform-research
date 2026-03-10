import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Trash2, Edit2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [showResumeForm, setShowResumeForm] = useState(false);
  const [editingResumeId, setEditingResumeId] = useState<number | null>(null);

  const resumesQuery = trpc.resume.myResumes.useQuery();
  const deleteResumeMutation = trpc.resume.delete.useMutation({
    onSuccess: () => {
      resumesQuery.refetch();
      toast.success("Resume deleted successfully");
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="container">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div className="text-center py-12">
            <p className="text-slate-600">Please log in to view your profile</p>
          </div>
        </div>
      </div>
    );
  }

  const resumes = resumesQuery.data || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* 헤더 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
              <p className="text-sm text-slate-600">Manage your account and resumes</p>
            </div>
            <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 프로필 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-600">Name</p>
                <p className="text-lg font-semibold text-slate-900">{user.name || "Not set"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Email</p>
                <p className="text-lg font-semibold text-slate-900">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Role</p>
                <Badge className="mt-2">{user.role === "admin" ? "Administrator" : "Job Seeker"}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* 이력서 관리 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>My Resumes</CardTitle>
                  <CardDescription>Manage your resumes for job applications</CardDescription>
                </div>
                <Button onClick={() => setShowResumeForm(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Resume
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {resumes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-600 mb-4">You haven't created any resumes yet</p>
                  <Button onClick={() => setShowResumeForm(true)} variant="outline" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Create Your First Resume
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-slate-600 mb-4">
                    You have {resumes.length}/5 resumes
                  </p>
                  {resumes.map((resume) => (
                    <div
                      key={resume.id}
                      className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{resume.title}</p>
                        <p className="text-sm text-slate-600">{resume.fullName}</p>
                        <p className="text-sm text-slate-500">{resume.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {resume.isDefault && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            Default
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingResumeId(resume.id)}
                          className="gap-1"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this resume?")) {
                              deleteResumeMutation.mutate(resume.id);
                            }
                          }}
                          className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 지원 이력 */}
          <Card>
            <CardHeader>
              <CardTitle>Application History</CardTitle>
              <CardDescription>Jobs you've applied to</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">Your application history will appear here</p>
            </CardContent>
          </Card>

          {/* 최근 본 공고 */}
          <Card>
            <CardHeader>
              <CardTitle>Recently Viewed Jobs</CardTitle>
              <CardDescription>Jobs you've recently viewed</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">Your recently viewed jobs will appear here</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
