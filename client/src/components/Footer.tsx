import { Link } from "wouter";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-100 mt-20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">CanadaJobBoard</h3>
            <p className="text-slate-400 text-sm mb-4">
              Connecting job seekers with employers across Canada.
            </p>
            <p className="text-slate-400 text-sm">
              <Link href="/contact" className="hover:text-slate-100 underline">
                Contact us
              </Link>
            </p>
          </div>

          {/* For Job Seekers */}
          <div>
            <h4 className="font-semibold mb-4">For Job Seekers</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-slate-100">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/saved-jobs" className="hover:text-slate-100">
                  Saved Jobs
                </Link>
              </li>
              <li>
                <Link href="/my-applications" className="hover:text-slate-100">
                  My Applications
                </Link>
              </li>
              <li>
                <Link href="/resumes" className="hover:text-slate-100">
                  My Resumes
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="font-semibold mb-4">For Employers</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/post-job" className="hover:text-slate-100">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link href="/employer-dashboard" className="hover:text-slate-100">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-slate-100">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/terms" className="hover:text-slate-100">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-slate-100">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-slate-100">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
            <p>&copy; {currentYear} CanadaJobBoard. All rights reserved.</p>
            <p>Made with care for Canadian job seekers and employers.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
