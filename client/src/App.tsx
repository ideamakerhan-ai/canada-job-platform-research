import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import { useLocation } from "wouter";
import Profile from "./pages/Profile";
import ProfilePage from "./pages/ProfilePage";
import PostJob from "./pages/PostJob";
import PostJobCompliance from "./pages/PostJobCompliance";
import Occupations from "./pages/Occupations";
import JobDetail from "./pages/JobDetail";
import AdminDashboard from "./pages/AdminDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import PaymentCheckout from "./pages/PaymentCheckout";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
          <Route path={"/job/:id"} component={JobDetail} />
      <Route path={"/profile"} component={Profile} />
      <Route path={"/my-profile"} component={ProfilePage} />
      <Route path={"/post-job-compliance"} component={PostJobCompliance} />
      <Route path={"/post-job"} component={PostJob} />
      <Route path={"/occupations"} component={Occupations} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/employer/dashboard"} component={EmployerDashboard} />
      <Route path={"/payment/checkout"} component={PaymentCheckout} />
      <Route path={"/terms"} component={Terms} />
      <Route path={"/privacy"} component={Privacy} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
