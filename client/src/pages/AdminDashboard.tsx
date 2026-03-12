import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Trash2, Edit, CheckCircle, XCircle, Eye, Search, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function AdminDashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showJobDetail, setShowJobDetail] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);

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

  // Filter jobs based on search and filters
  const filteredJobs = jobs.filter((job: any) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || job.category === filterCategory;
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "active" && job.isActive === 1) ||
                         (filterStatus === "inactive" && job.isActive === 0);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(jobs.map((j: any) => j.category)))];

  // Chart data - category distribution
  const categoryData = categories.filter(c => c !== "all").map(cat => ({
    name: cat,
    value: jobs.filter((j: any) => j.category === cat).length,
  }));

  // Chart data - location distribution
  const locationData = [...Array.from(new Set(jobs.map((j: any) => j.location)))].map(loc => ({
    name: loc,
    value: jobs.filter((j: any) => j.location === loc).length,
  }));

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

  const COLORS = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  <CardTitle>Jobs by Category</CardTitle>
                  <CardDescription>Distribution across categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

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
              <CardContent className="space-y-4">
                {/* Search and Filter Bar */}
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input
                        placeholder="Search by title, company, or location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSearchQuery("")}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="px-3 py-2 border border-slate-200 rounded-md text-sm"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat === "all" ? "All Categories" : cat}
                        </option>
                      ))}
                    </select>

                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 border border-slate-200 rounded-md text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <p className="text-sm text-slate-600">
                    Showing {filteredJobs.length} of {jobs.length} jobs
                  </p>
                </div>

                {/* Jobs List */}
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map((job: any) => (
                      <div key={job.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900">{job.title}</h3>
                          <p className="text-sm text-slate-600">{job.company} • {job.location}</p>
                          <div className="flex gap-2 mt-2">
                            <span className={`text-xs px-2 py-1 rounded ${
                              job.isActive === 1 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}>
                              {job.isActive === 1 ? "Active" : "Inactive"}
                            </span>
                            <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                              {job.category}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedJob(job);
                              setShowJobDetail(true);
                            }}
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingJob(job);
                              setShowEditModal(true);
                            }}
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatusMutation.mutate({
                              jobId: job.id,
                              status: job.isActive === 1 ? "inactive" : "active",
                            })}
                            title={job.isActive === 1 ? "Deactivate" : "Activate"}
                          >
                            {job.isActive === 1 ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this job?")) {
                                deleteJobMutation.mutate(job.id);
                              }
                            }}
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-600">
                      No jobs found matching your criteria.
                    </div>
                  )}
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

      {/* Job Detail Modal */}
      <Dialog open={showJobDetail} onOpenChange={setShowJobDetail}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Job Details</DialogTitle>
            <DialogDescription>Complete information about this job posting</DialogDescription>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Title</label>
                  <p className="text-slate-900 font-semibold">{selectedJob.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Company</label>
                  <p className="text-slate-900 font-semibold">{selectedJob.company}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Location</label>
                  <p className="text-slate-900">{selectedJob.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Category</label>
                  <p className="text-slate-900">{selectedJob.category}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Salary</label>
                  <p className="text-slate-900">{selectedJob.salary || "Not specified"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Job Type</label>
                  <p className="text-slate-900">{selectedJob.jobType}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600">Description</label>
                <p className="text-slate-900 whitespace-pre-wrap">{selectedJob.description}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600">Requirements</label>
                <p className="text-slate-900 whitespace-pre-wrap">{selectedJob.requirements || "Not specified"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Status</label>
                  <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                    selectedJob.isActive === 1 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}>
                    {selectedJob.isActive === 1 ? "Active" : "Inactive"}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Posted By</label>
                  <p className="text-slate-900">User ID: {selectedJob.postedBy}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Created At</label>
                  <p className="text-slate-900">{new Date(selectedJob.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Updated At</label>
                  <p className="text-slate-900">{new Date(selectedJob.updatedAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => {
                    setEditingJob(selectedJob);
                    setShowJobDetail(false);
                    setShowEditModal(true);
                  }}
                  className="flex-1"
                >
                  Edit Job
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this job?")) {
                      deleteJobMutation.mutate(selectedJob.id);
                      setShowJobDetail(false);
                    }
                  }}
                  className="flex-1"
                >
                  Delete Job
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Job Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Job</DialogTitle>
            <DialogDescription>Update job posting information</DialogDescription>
          </DialogHeader>
          {editingJob && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Title</label>
                  <p className="text-slate-900 font-semibold">{editingJob.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Company</label>
                  <p className="text-slate-900 font-semibold">{editingJob.company}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Location</label>
                  <p className="text-slate-900">{editingJob.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Category</label>
                  <p className="text-slate-900">{editingJob.category}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600">Status</label>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant={editingJob.isActive === 1 ? "default" : "outline"}
                    onClick={() => updateStatusMutation.mutate({
                      jobId: editingJob.id,
                      status: "active",
                    })}
                  >
                    Active
                  </Button>
                  <Button
                    variant={editingJob.isActive === 0 ? "default" : "outline"}
                    onClick={() => updateStatusMutation.mutate({
                      jobId: editingJob.id,
                      status: "inactive",
                    })}
                  >
                    Inactive
                  </Button>
                </div>
              </div>

              <p className="text-sm text-slate-600 bg-slate-100 p-3 rounded">
                Note: Full editing capabilities coming soon. Currently you can only change the job status.
              </p>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
