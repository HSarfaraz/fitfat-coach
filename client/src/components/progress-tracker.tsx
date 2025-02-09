import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Progress } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function ProgressTracker() {
  const [weight, setWeight] = useState("");
  const { toast } = useToast();

  const { data: progressData, isLoading } = useQuery<Progress[]>({
    queryKey: ["/api/progress"],
  });

  const addProgressMutation = useMutation({
    mutationFn: async (weight: string) => {
      const data = {
        weight: parseInt(weight, 10),
        date: new Date().toISOString(),
        notes: null
      };
      const res = await apiRequest("POST", "/api/progress", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
      toast({
        title: "Progress Updated",
        description: "Your weight has been recorded successfully.",
      });
      setWeight("");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update progress",
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

  const chartData = progressData?.map(p => ({
    date: new Date(p.date).toLocaleDateString(),
    weight: p.weight
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weight Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {chartData && chartData.length > 0 && (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Enter weight in kg"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
            <Button
              disabled={!weight || addProgressMutation.isPending}
              onClick={() => addProgressMutation.mutate(weight)}
            >
              {addProgressMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Add Entry"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}