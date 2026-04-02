import { CardTitle } from "@/components/ui/card";
import { FolderGit2 } from "lucide-react";
import type { RepoAnalysis } from "@/lib/github";
import RepoCard from "./RepoCard";

interface RepoListProps {
  repos: RepoAnalysis[];
}

const RepoList = ({ repos }: RepoListProps) => {
  return (
    <div>
      <CardTitle className="flex items-center gap-2 text-lg mb-4">
        <FolderGit2 className="w-5 h-5 text-primary" />
        Repository Analysis
        <span className="text-sm font-normal text-muted-foreground">({repos.length} repos)</span>
      </CardTitle>
      <div className="grid gap-4 md:grid-cols-2">
        {repos.map((analysis) => (
          <RepoCard key={analysis.repo.id} analysis={analysis} />
        ))}
      </div>
    </div>
  );
};

export default RepoList;
