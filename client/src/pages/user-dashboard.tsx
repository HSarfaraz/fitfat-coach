import { useAuth } from "@/hooks/use-auth";
import ConsultationScheduler from "@/components/consultation-scheduler";
import ProgressTracker from "@/components/progress-tracker";
import { useQuery } from "@tanstack/react-query";
import type { Consultation } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Activity } from "lucide-react";

export default function UserDashboard() {
  const { user } = useAuth();

  const { data: consultations } = useQuery<Consultation[]>({
    queryKey: ["/api/consultations"],
  });

  const upcomingConsultation = consultations?.find(
    (c) => c.status === "scheduled" && new Date(c.scheduledDate) > new Date()
  );

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.username}!</h1>
          <p className="text-gray-500 mt-2">Track your progress and manage your consultations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Package Info */}
          <Card>
            <CardHeader>
              <CardTitle>Current Package</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold text-primary">
                {user?.currentPackage || "No active package"}
              </div>
              {user?.packageEndDate && (
                <div className="text-sm text-gray-500 mt-1">
                  Valid until {new Date(user.packageEndDate).toLocaleDateString()}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Next Consultation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Next Consultation
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingConsultation ? (
                <div>
                  <div className="text-lg font-semibold">
                    {new Date(upcomingConsultation.scheduledDate).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Status: {upcomingConsultation.status}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">No upcoming consultations</div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Progress Tracker */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Progress Tracker
            </h2>
            <ProgressTracker />
          </div>

          {/* Consultation Scheduler */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Schedule Consultation
            </h2>
            <ConsultationScheduler />
          </div>
        </div>
      </div>
    </div>
  );
}
