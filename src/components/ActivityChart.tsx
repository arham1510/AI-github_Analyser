import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Activity } from "lucide-react";

interface ActivityChartProps {
  timeline: { month: string; commits: number }[];
}

const ActivityChart = ({ timeline }: ActivityChartProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="w-5 h-5 text-primary" />
          Activity Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timeline} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <XAxis dataKey="month" tick={{ fill: "hsl(215 14% 50%)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(215 14% 50%)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "hsl(220 16% 12%)",
                  border: "1px solid hsl(220 14% 20%)",
                  borderRadius: "8px",
                  color: "hsl(210 20% 92%)",
                }}
              />
              <Bar dataKey="commits" radius={[4, 4, 0, 0]}>
                {timeline.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(142 72% ${40 + index * 4}%)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityChart;
