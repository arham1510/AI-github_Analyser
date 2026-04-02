import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2 } from "lucide-react";

interface LanguageBreakdownProps {
  languages: { name: string; percentage: number; bytes: number }[];
}

const LANG_COLORS: Record<string, string> = {
  JavaScript: "bg-[hsl(50,90%,55%)]",
  TypeScript: "bg-[hsl(210,80%,55%)]",
  Python: "bg-[hsl(210,50%,45%)]",
  Java: "bg-[hsl(20,80%,50%)]",
  "C++": "bg-[hsl(340,70%,55%)]",
  C: "bg-[hsl(220,15%,50%)]",
  Go: "bg-[hsl(195,80%,55%)]",
  Rust: "bg-[hsl(25,60%,45%)]",
  Ruby: "bg-[hsl(0,70%,50%)]",
  PHP: "bg-[hsl(240,40%,55%)]",
  Swift: "bg-[hsl(15,80%,55%)]",
  Kotlin: "bg-[hsl(270,60%,55%)]",
  Shell: "bg-primary",
  HTML: "bg-[hsl(15,80%,55%)]",
  CSS: "bg-[hsl(265,60%,55%)]",
  Dart: "bg-[hsl(195,80%,45%)]",
};

const getColor = (lang: string) => LANG_COLORS[lang] || "bg-muted-foreground";

const LanguageBreakdown = ({ languages }: LanguageBreakdownProps) => {
  if (languages.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Code2 className="w-5 h-5 text-accent" />
          Language Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Bar */}
        <div className="flex h-4 rounded-full overflow-hidden gap-0.5 mb-4">
          {languages.map((lang) => (
            <div
              key={lang.name}
              className={`${getColor(lang.name)} transition-all duration-500`}
              style={{ width: `${lang.percentage}%` }}
              title={`${lang.name}: ${lang.percentage}%`}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {languages.map((lang) => (
            <div key={lang.name} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getColor(lang.name)}`} />
              <div>
                <span className="text-sm font-medium text-foreground">{lang.name}</span>
                <span className="text-xs text-muted-foreground ml-1">{lang.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LanguageBreakdown;
