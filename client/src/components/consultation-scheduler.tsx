import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Consultation } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function ConsultationScheduler() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const { toast } = useToast();

  const { data: consultations, isLoading } = useQuery<Consultation[]>({
    queryKey: ["/api/consultations"],
  });

  const scheduleMutation = useMutation({
    mutationFn: async (date: Date) => {
      try {
        const data = {
          scheduledDate: date.toISOString(),
          status: "scheduled",
          notes: null
        };
        const res = await apiRequest("POST", "/api/consultations", data);
        return res.json();
      } catch (error) {
        throw new Error("Failed to schedule consultation");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/consultations"] });
      toast({
        title: "Consultation Scheduled",
        description: "Your consultation has been successfully scheduled.",
      });
      setSelectedDate(undefined);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to schedule consultation",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Consultation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => {
              const now = new Date();
              return (
                date < now ||
                consultations?.some(
                  (c) => new Date(c.scheduledDate).toDateString() === date.toDateString()
                ) ||
                false
              );
            }}
          />
          <Button
            className="w-full"
            disabled={!selectedDate || scheduleMutation.isPending}
            onClick={() => selectedDate && scheduleMutation.mutate(selectedDate)}
          >
            {scheduleMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Schedule Consultation"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}