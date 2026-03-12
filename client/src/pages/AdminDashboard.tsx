import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Trash2, Edit, CheckCircle, XCircle } from "lucide-react";

export default function AdminDashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  // Redirect if not admin
  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "admin")) {
      setLocation("/");
    }
  }, [loading, isAuthenticated, user, setLocation]);

  // Fetch admin data
  const statsQuery = trpc.admin.stats.useQuery();
  const jobsQuery = trpc.admin.jobs.useQuery();
  const applicationsQuery = trpc.admin.applications.useQuery();
  const usersQuery = trpc.admin.usersList.useQuery();

  // Delete job mutation
  const deleteJobMutation = trpc.admin.deleteJob.useMutation({
    onSuccess: () => {
      jobsQuery.refetch();
    },
  });

  // Update job status mutation
  const updateStatusMutation = trpc.admin.updateJobStatus.useMutation({
    onSuccess: () => {
      jobsQuery.refetch();
    },
  });

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return <div className="flex items-center justify-center min-h-screen">Access Denied</div>;
  }

  const stats = statsQuery.data;
  const jobs = jobsQuery.data || [];
  const applications = applicationsQuery.data || [];
  const usersList = usersQuery.data || [];

  // Sample chart data
  const chartData = [
    { name: "Mon", applications: 12, jobs: 5 },
    { name: "Tue", applications: 19, jobs: 7 },
    { name: "Wed", applications: 15, jobs: 6 },
    { name: "Thu", applications: 25, jobs: 9 },
    { name: "Fri", applications: 22, jobs: 8 },
    { name: "Sat", applications: 18, jobs: 4 },
    { name: "Sun", applications: 14, jobs: 3 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-slate-600 text-sm">Welcome, {user?.name}</p>
            </div>
            <Button variant="outline" onClick={() => setLocation("/")}>
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-slate-500 mt-1">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Active Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats?.totalJobs || 0}</div>
              <p className="text-xs text-slate-500 mt-1">Job listings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats?.totalApplications || 0}</div>
              <p className="text-xs text-slate-500 mt-1">Job applications</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Conversion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {stats?.totalJobs ? Math.round((stats.totalApplications / (stats.totalJobs * 5)) * 100) : 0}%
              </div>
              <p className="text-xs text-slate-500 mt-1">Application rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Applications & Jobs Trend</CardTitle>
                <CardDescription>Weekly overview</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="applications" stroke="#ef4444" />
                    <Line type="monotone" dataKey="jobs" stroke="#3b82f6" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>Latest 5 applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.slice(-5).reverse().map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">Application #{app.id}</p>
                        <p className="text-sm text-slate-600">User ID: {app.userId} | Job ID: {app.jobId}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        app.status === "applied" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <CardTitle>Job Listings</CardTitle>
                <CardDescription>Manage all job postings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{job.title}</h3>
                        <p className="text-sm text-slate-600">{job.company} • {job.location}</p>
                        <div className="flex gap-2 mt-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            job.isActive === 1 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}>
                            {job.isActive === 1 ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatusMutation.mutate({
                            jobId: job.id,
                            status: job.isActive === 1 ? "inactive" : "active",
                          })}
                        >
                          {job.isActive === 1 ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteJobMutation.mutate(job.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Job Applications</CardTitle>
                <CardDescription>All user applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 font-semibold text-slate-900">ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-900">User ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-900">Job ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-900">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-900">Applied At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app) => (
                        <tr key={app.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4">#{app.id}</td>
                          <td className="py-3 px-4">{app.userId}</td>
                          <td className="py-3 px-4">{app.jobId}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              app.status === "applied" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                            }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">{new Date(app.appliedAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>All registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 font-semibold text-slate-900">ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-900">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-900">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-900">Role</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-900">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.map((u) => (
                        <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4">#{u.id}</td>
                          <td className="py-3 px-4">{u.name || "N/A"}</td>
                          <td className="py-3 px-4">{u.email || "N/A"}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              u.role === "admin" ? "bg-red-100 text-red-800" : "bg-slate-100 text-slate-800"
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3 px-4">{new Date(u.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
