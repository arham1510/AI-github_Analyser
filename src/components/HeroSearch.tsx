import { useState } from "react";
import { Search, Github, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeroSearchProps {
  onSearch: (username: string) => void;
  loading: boolean;
}

const HeroSearch = ({ onSearch, loading }: HeroSearchProps) => {
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) onSearch(username.trim());
  };

  return (
    <section className="relative min-h-[60vh] flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/5 rounded-full blur-3xl animate-pulse-slow" />

      <div className="relative z-10 text-center max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
            <Github className="w-8 h-8 text-primary" />
          </div>
          <Zap className="w-5 h-5 text-accent animate-float" />
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
          <span className="text-gradient">GitHub Profile</span>{" "}
          <span className="text-foreground">Analyzer</span>
        </h1>

        <p className="text-muted-foreground text-lg sm:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
          Deep-dive into any GitHub profile. Analyze code quality, language diversity, commit patterns, and get an overall developer score.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Enter GitHub username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10 h-12 bg-card border-border text-foreground placeholder:text-muted-foreground focus:ring-primary/30 text-base"
            />
          </div>
          <Button type="submit" variant="hero" size="lg" disabled={loading || !username.trim()}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Analyzing...
              </span>
            ) : (
              "Analyze"
            )}
          </Button>
        </form>

        <p className="text-muted-foreground text-sm mt-4">
          Try: <button type="button" onClick={() => { setUsername("torvalds"); onSearch("torvalds"); }} className="text-primary hover:underline">torvalds</button>
          {" · "}
          <button type="button" onClick={() => { setUsername("gaearon"); onSearch("gaearon"); }} className="text-primary hover:underline">gaearon</button>
          {" · "}
          <button type="button" onClick={() => { setUsername("sindresorhus"); onSearch("sindresorhus"); }} className="text-primary hover:underline">sindresorhus</button>
        </p>
      </div>
    </section>
  );
};

export default HeroSearch;
