const GITHUB_API = "https://api.github.com";

export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  html_url: string;
  location: string | null;
  company: string | null;
  blog: string | null;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  default_branch: string;
  fork: boolean;
  topics: string[];
}

export interface RepoAnalysis {
  repo: GitHubRepo;
  languages: Record<string, number>;
  commitCount: number;
  score: number;
  scoreBreakdown: {
    activity: number;
    popularity: number;
    codeQuality: number;
    documentation: number;
  };
}

export interface ProfileAnalysis {
  user: GitHubUser;
  repos: RepoAnalysis[];
  languageStats: Record<string, number>;
  overallScore: number;
  totalCommits: number;
  totalStars: number;
  totalForks: number;
  accountAge: number;
  topLanguages: { name: string; percentage: number; bytes: number }[];
  activityTimeline: { month: string; commits: number }[];
}

async function ghFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${GITHUB_API}${path}`, {
    headers: { Accept: "application/vnd.github.v3+json" },
  });
  if (!res.ok) {
    if (res.status === 404) throw new Error("User not found");
    if (res.status === 403) throw new Error("API rate limit exceeded. Try again later.");
    throw new Error(`GitHub API error: ${res.status}`);
  }
  return res.json();
}

async function getRepoLanguages(owner: string, repo: string): Promise<Record<string, number>> {
  try {
    return await ghFetch<Record<string, number>>(`/repos/${owner}/${repo}/languages`);
  } catch {
    return {};
  }
}

async function getRepoCommitCount(owner: string, repo: string): Promise<number> {
  try {
    const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/commits?per_page=1`, {
      headers: { Accept: "application/vnd.github.v3+json" },
    });
    const link = res.headers.get("link");
    if (link) {
      const match = link.match(/page=(\d+)>; rel="last"/);
      if (match) return parseInt(match[1], 10);
    }
    const data = await res.json();
    return Array.isArray(data) ? data.length : 0;
  } catch {
    return 0;
  }
}

function scoreRepo(repo: GitHubRepo, languages: Record<string, number>, commitCount: number): RepoAnalysis["scoreBreakdown"] {
  const now = new Date();
  const lastPush = new Date(repo.pushed_at);
  const daysSinceLastPush = (now.getTime() - lastPush.getTime()) / (1000 * 60 * 60 * 24);

  // Activity score (0-25): based on commits and recency
  const commitScore = Math.min(commitCount / 50, 1) * 15;
  const recencyScore = daysSinceLastPush < 30 ? 10 : daysSinceLastPush < 90 ? 7 : daysSinceLastPush < 365 ? 4 : 1;
  const activity = Math.round(commitScore + recencyScore);

  // Popularity score (0-25): stars, forks, watchers
  const starScore = Math.min(repo.stargazers_count / 20, 1) * 12;
  const forkScore = Math.min(repo.forks_count / 10, 1) * 8;
  const watchScore = Math.min(repo.watchers_count / 10, 1) * 5;
  const popularity = Math.round(starScore + forkScore + watchScore);

  // Code quality score (0-25): language diversity, code size, issues ratio
  const langCount = Object.keys(languages).length;
  const langDiversity = Math.min(langCount / 4, 1) * 10;
  const sizeScore = repo.size > 100 ? (repo.size > 5000 ? 10 : 7) : 3;
  const issueRatio = repo.open_issues_count > 0 ? Math.max(0, 5 - repo.open_issues_count) : 5;
  const codeQuality = Math.round(langDiversity + sizeScore + issueRatio);

  // Documentation score (0-25): description, topics
  const hasDescription = repo.description ? 10 : 0;
  const topicScore = Math.min((repo.topics?.length || 0) / 3, 1) * 10;
  const nameQuality = repo.name.includes("-") || repo.name.includes("_") ? 5 : 3;
  const documentation = Math.round(hasDescription + topicScore + nameQuality);

  return { activity, popularity, codeQuality, documentation };
}

export async function analyzeProfile(username: string): Promise<ProfileAnalysis> {
  const user = await ghFetch<GitHubUser>(`/users/${username}`);
  const allRepos = await ghFetch<GitHubRepo[]>(`/users/${username}/repos?per_page=100&sort=updated`);
  const repos = allRepos.filter((r) => !r.fork);

  // Analyze top 15 repos in parallel
  const topRepos = repos.slice(0, 15);
  const analyses = await Promise.all(
    topRepos.map(async (repo): Promise<RepoAnalysis> => {
      const [languages, commitCount] = await Promise.all([
        getRepoLanguages(username, repo.name),
        getRepoCommitCount(username, repo.name),
      ]);
      const scoreBreakdown = scoreRepo(repo, languages, commitCount);
      const score = scoreBreakdown.activity + scoreBreakdown.popularity + scoreBreakdown.codeQuality + scoreBreakdown.documentation;
      return { repo, languages, commitCount, score, scoreBreakdown };
    })
  );

  // Aggregate language stats
  const languageStats: Record<string, number> = {};
  analyses.forEach((a) => {
    Object.entries(a.languages).forEach(([lang, bytes]) => {
      languageStats[lang] = (languageStats[lang] || 0) + bytes;
    });
  });

  const totalBytes = Object.values(languageStats).reduce((a, b) => a + b, 0);
  const topLanguages = Object.entries(languageStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: totalBytes > 0 ? Math.round((bytes / totalBytes) * 1000) / 10 : 0,
    }));

  const totalCommits = analyses.reduce((sum, a) => sum + a.commitCount, 0);
  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0);
  const accountAge = Math.round((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365));

  // Generate activity timeline (last 6 months approximation based on repo push dates)
  const months: string[] = [];
  const commitsByMonth: Record<string, number> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    months.push(key);
    commitsByMonth[key] = 0;
  }
  analyses.forEach((a) => {
    const pushDate = new Date(a.repo.pushed_at);
    const key = pushDate.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    if (commitsByMonth[key] !== undefined) {
      commitsByMonth[key] += a.commitCount;
    }
  });
  const activityTimeline = months.map((month) => ({ month, commits: commitsByMonth[month] || 0 }));

  const overallScore = analyses.length > 0
    ? Math.round(analyses.reduce((sum, a) => sum + a.score, 0) / analyses.length)
    : 0;

  return {
    user,
    repos: analyses.sort((a, b) => b.score - a.score),
    languageStats,
    overallScore,
    totalCommits,
    totalStars,
    totalForks,
    accountAge,
    topLanguages,
    activityTimeline,
  };
}
