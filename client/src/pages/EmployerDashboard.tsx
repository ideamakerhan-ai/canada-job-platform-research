import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2, Plus, Trash2, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function EmployerDashboard() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("postings");

  // Fetch employer's job postings
  const { data: postings, isLoading: postingsLoading } = trpc.employer.myPostings.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // Fetch applications for all postings - need to fetch for each posting
  const { data: applications, isLoading: applicationsLoading } = trpc.employer.getApplications.useQuery(
    postings?.[0]?.id || 0,
    { enabled: isAuthenticated && postings && postings.length > 0 }
  );

  const deletePostingMutation = trpc.employer.deletePosting.useMutation({
    onSuccess: () => {
      trpc.useUtils().employer.myPostings.invalidate();
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>Please sign in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              You need to be signed in to manage your job postings.
            </p>
            <Button onClick={() => setLocation("/")} className="w-full">
              Go Back Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDeletePosting = async (postingId: number) => {
    if (confirm("Are you sure you want to delete this job posting?")) {
      await deletePostingMutation.mutateAsync(postingId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="container">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Employer Dashboard</h1>
            <p className="text-slate-600">Manage your job postings and view applications</p>
          </div>
          <Button onClick={() => setLocation("/post-job")} className="gap-2">
            <Plus className="w-4 h-4" />
            Post New Job
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white border border-slate-200 p-1">
            <TabsTrigger value="postings">My Job Postings</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="billing">Billing & Payments</TabsTrigger>
          </TabsList>

          {/* My Job Postings Tab */}
          <TabsContent value="postings" className="space-y-4">
            {postingsLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                </CardContent>
              </Card>
            ) : postings && postings.length > 0 ? (
              <div className="grid gap-4">
                {postings.map((posting: any) => (
                  <Card key={posting.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl">{posting.title}</CardTitle>
                          <CardDescription>{posting.company}</CardDescription>
                        </div>
                        <Badge variant="outline">{posting.jobType}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <p className="text-slate-600">Location</p>
                          <p className="font-medium text-slate-900">{posting.location}</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Category</p>
                          <p className="font-medium text-slate-900">{posting.category}</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Salary Range</p>
                          <p className="font-medium text-slate-900">
                            ${posting.salaryMin?.toLocaleString()} - ${posting.salaryMax?.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-600">Posted</p>
                          <p className="font-medium text-slate-900">
                            {formatDistanceToNow(new Date(posting.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>

                      {/* Benefits */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {posting.visaSponsorship && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            Visa Sponsorship
                          </Badge>
                        )}
                        {posting.lmiaAvailable && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            LMIA Available
                          </Badge>
                        )}
                        {posting.accommodationProvided && (
                          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                            Accommodation Provided
                          </Badge>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => setLocation(`/job/${posting.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleDeletePosting(posting.id)}
                          disabled={deletePostingMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-slate-600 mb-4">You haven't posted any jobs yet.</p>
                  <Button onClick={() => setLocation("/post-job")}>Post Your First Job</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-4">
            {applicationsLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                </CardContent>
              </Card>
            ) : applications && applications.length > 0 ? (
              <div className="grid gap-4">
                {applications.map((app: any) => {
                  const jobPosting = postings?.find((p: any) => p.id === app.jobPostingId);
                  return (
                    <Card key={app.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{jobPosting?.title}</CardTitle>
                            <CardDescription>{jobPosting?.company}</CardDescription>
                          </div>
                          <Badge variant="outline">Applied</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-slate-600">Applicant Email</p>
                            <p className="font-medium text-slate-900">{app.applicantEmail}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Applied Date</p>
                            <p className="font-medium text-slate-900">
                              {formatDistanceToNow(new Date(app.appliedAt), { addSuffix: true })}
                            </p>
                          </div>
                        </div>

                        {/* Action */}
                        <div className="mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.location.href = `mailto:${app.applicantEmail}`}
                          >
                            Contact Applicant
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-slate-600">No applications yet.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Billing & Payments Tab */}
          <TabsContent value="billing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>View your job posting package purchases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">5 Job Postings Package</p>
                      <p className="text-sm text-slate-600">Purchased on Mar 13, 2026</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">$124.99 CAD</p>
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Purchase More Postings</CardTitle>
                <CardDescription>Add more job posting credits to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setLocation("/payment/checkout")} className="w-full">
                  Buy Job Posting Package
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
