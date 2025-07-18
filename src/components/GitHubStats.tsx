import React, { useState, useEffect } from 'react';
import { Github, Star, GitFork, Calendar, Activity } from 'lucide-react';

interface GitHubUser {
  login: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  avatar_url: string;
}

interface GitHubRepo {
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  html_url: string;
  updated_at: string;
}

interface GitHubStatsProps {
  username: string;
  className?: string;
}

const GitHubStats: React.FC<GitHubStatsProps> = ({ username, className = '' }) => {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user data
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await userResponse.json();
        setUser(userData);

        // Fetch repositories (top 6 by stars)
        const reposResponse = await fetch(
          `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`
        );
        if (!reposResponse.ok) {
          throw new Error('Failed to fetch repositories');
        }
        const reposData = await reposResponse.json();
        setRepos(reposData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, [username]);

  if (loading) {
    return (
      <div className={`glass-card p-6 rounded-2xl ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-muted rounded-full"></div>
            <div className="space-y-2">
              <div className="h-6 bg-muted rounded w-32"></div>
              <div className="h-4 bg-muted rounded w-24"></div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-8 bg-muted rounded w-12 mx-auto mb-2"></div>
                <div className="h-4 bg-muted rounded w-16 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`glass-card p-6 rounded-2xl ${className}`}>
        <div className="text-center text-muted-foreground">
          <Github className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Unable to load GitHub stats</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const joinDate = new Date(user.created_at).getFullYear();

  return (
    <div className={`glass-card p-6 rounded-2xl ${className}`}>
      <div className="flex items-center gap-4 mb-6">
        <img
          src={user.avatar_url}
          alt={user.name}
          className="w-16 h-16 rounded-full border-2 border-primary/20"
        />
        <div>
          <h3 className="text-xl font-display font-bold">{user.name}</h3>
          <p className="text-muted-foreground">@{user.login}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <Calendar className="h-4 w-4" />
            <span>Joined {joinDate}</span>
          </div>
        </div>
      </div>

      {user.bio && (
        <p className="text-muted-foreground mb-6">{user.bio}</p>
      )}

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{user.public_repos}</div>
          <div className="text-sm text-muted-foreground">Repositories</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{user.followers}</div>
          <div className="text-sm text-muted-foreground">Followers</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{user.following}</div>
          <div className="text-sm text-muted-foreground">Following</div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Recent Repositories
        </h4>
        {repos.slice(0, 3).map((repo) => (
          <a
            key={repo.name}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 rounded-lg border border-border hover:border-primary/50 transition-colors group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h5 className="font-medium group-hover:text-primary transition-colors">
                  {repo.name}
                </h5>
                {repo.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {repo.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  {repo.language && (
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      {repo.language}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="h-3 w-3" />
                    {repo.forks_count}
                  </span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-accent transition-colors"
        >
          <Github className="h-4 w-4" />
          View on GitHub
        </a>
      </div>
    </div>
  );
};

export default GitHubStats;
