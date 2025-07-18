import React, { useState, useEffect } from "react";
import { Github, Star, GitFork, Calendar, TrendingUp, Code, Users } from "lucide-react";

interface GitHubStats {
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

interface Repository {
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  html_url: string;
  updated_at: string;
}

const GitHub: React.FC = () => {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const username = "LidlDev";

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        // Fetch user stats
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        const userData = await userResponse.json();
        setStats(userData);

        // Fetch repositories
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        const reposData = await reposResponse.json();
        setRepos(reposData);
      } catch (error) {
        console.error('Error fetching GitHub data:', error);
        setError('Failed to load GitHub data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      JavaScript: '#f1e05a',
      TypeScript: '#3178c6',
      Swift: '#fa7343',
      Python: '#3572A5',
      Java: '#b07219',
      HTML: '#e34c26',
      CSS: '#1572B6',
      React: '#61dafb',
      Vue: '#4FC08D',
      default: '#8B5CF6'
    };
    return colors[language] || colors.default;
  };

  if (loading) {
    return (
      <section id="github" className="py-20 md:py-32 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              GitHub <span className="magic-text">Activity</span>
            </h2>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="github" className="py-20 md:py-32 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              GitHub <span className="magic-text">Activity</span>
            </h2>
          </div>
          <div className="text-center">
            <div className="glass-card p-8 rounded-2xl max-w-md mx-auto">
              <Github className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">{error}</p>
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full hover:bg-primary/90 transition-colors"
              >
                <Github className="w-5 h-5" />
                Visit GitHub Profile
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="github" className="py-20 md:py-32 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            GitHub <span className="magic-text">Activity</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Check out my latest contributions and projects on GitHub.
            Building in public and sharing knowledge with the community.
          </p>
        </div>

        {/* GitHub Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 max-w-5xl mx-auto">
            <div className="glass-card p-6 rounded-2xl text-center hover-card">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                <Code className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-primary">{stats.public_repos}</div>
              <div className="text-sm text-muted-foreground">Public Repos</div>
            </div>
            
            <div className="glass-card p-6 rounded-2xl text-center hover-card">
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-accent">{stats.followers}</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </div>
            
            <div className="glass-card p-6 rounded-2xl text-center hover-card">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-primary">{stats.following}</div>
              <div className="text-sm text-muted-foreground">Following</div>
            </div>
            
            <div className="glass-card p-6 rounded-2xl text-center hover-card">
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-lg flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-accent">{formatDate(stats.created_at)}</div>
              <div className="text-sm text-muted-foreground">Joined GitHub</div>
            </div>
          </div>
        )}

        {/* Contribution Graph */}
        <div className="mb-12 max-w-5xl mx-auto">
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
              <Github className="w-5 h-5" />
              Contribution Activity
            </h3>
            <div className="bg-background/50 rounded-lg p-4 overflow-hidden border border-border/50">
              <img
                src={`https://ghchart.rshah.org/262%2083%25%2058/${username}`}
                alt="GitHub Contribution Graph"
                className="w-full h-auto rounded"
                style={{ filter: 'brightness(1.1) contrast(1.1)' }}
              />
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Contributions in the last year • Updated daily
              </p>
            </div>
          </div>
        </div>

        {/* Recent Repositories */}
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl font-display font-bold mb-8 text-center">
            Recent <span className="magic-text">Projects</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.slice(0, 6).map((repo, index) => (
              <a
                key={repo.name}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-6 rounded-2xl hover-card transition-all duration-300 hover:scale-105 animate-fade-in group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-lg truncate pr-2 group-hover:text-primary transition-colors">{repo.name}</h4>
                  <Github className="w-5 h-5 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors" />
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {repo.description || "No description available"}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    {repo.language && (
                      <div className="flex items-center gap-1">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getLanguageColor(repo.language) }}
                        ></div>
                        <span className="text-muted-foreground">{repo.language}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span>{repo.stargazers_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork className="w-4 h-4" />
                      <span>{repo.forks_count}</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="inline-block glass-card p-6 rounded-2xl">
            <h3 className="font-display font-semibold text-xl mb-4">Want to collaborate?</h3>
            <p className="text-muted-foreground mb-6">
              Check out my repositories and feel free to contribute or reach out!
            </p>
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full hover:bg-primary/90 transition-colors"
            >
              <Github className="w-5 h-5" />
              Follow on GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GitHub;
