import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Briefcase, Users } from "lucide-react";

interface RoleSelectionModalProps {
  open: boolean;
  onSelectRole: (role: "job_seeker" | "employer") => void;
}

export function RoleSelectionModal({ open, onSelectRole }: RoleSelectionModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Choose Your Role</DialogTitle>
          <DialogDescription>
            Select whether you're looking for a job or posting positions
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-4 py-6">
          {/* Job Seeker */}
          <Card
            className="cursor-pointer hover:border-red-600 hover:shadow-lg transition"
            onClick={() => onSelectRole("job_seeker")}
          >
            <div className="p-6 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-red-600" />
              <h3 className="text-lg font-semibold mb-2">Job Seeker</h3>
              <p className="text-sm text-slate-600 mb-4">
                Browse and apply for job opportunities across Canada
              </p>
              <Button className="w-full bg-red-600 hover:bg-red-700">
                Continue as Job Seeker
              </Button>
            </div>
          </Card>

          {/* Employer */}
          <Card
            className="cursor-pointer hover:border-red-600 hover:shadow-lg transition"
            onClick={() => onSelectRole("employer")}
          >
            <div className="p-6 text-center">
              <Briefcase className="w-12 h-12 mx-auto mb-4 text-red-600" />
              <h3 className="text-lg font-semibold mb-2">Employer</h3>
              <p className="text-sm text-slate-600 mb-4">
                Post job openings and manage your hiring process
              </p>
              <Button className="w-full bg-red-600 hover:bg-red-700">
                Continue as Employer
              </Button>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
