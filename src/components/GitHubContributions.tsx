import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp } from 'lucide-react';

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface GitHubContributionsProps {
  username: string;
  className?: string;
}

const GitHubContributions: React.FC<GitHubContributionsProps> = ({ 
  username, 
  className = '' 
}) => {
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalContributions, setTotalContributions] = useState(0);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Since GitHub doesn't provide a public API for contribution graphs,
        // we'll create a mock visualization based on recent activity
        // In a real implementation, you might use GitHub GraphQL API with authentication
        // or a service like GitHub Contributions API
        
        const mockContributions = generateMockContributions();
        setContributions(mockContributions);
        setTotalContributions(mockContributions.reduce((sum, day) => sum + day.count, 0));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load contributions');
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, [username]);

  const generateMockContributions = (): ContributionDay[] => {
    const contributions: ContributionDay[] = [];
    const today = new Date();
    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    
    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
      const count = Math.floor(Math.random() * 8); // 0-7 contributions per day
      const level = count === 0 ? 0 : Math.min(Math.ceil(count / 2), 4);
      
      contributions.push({
        date: d.toISOString().split('T')[0],
        count,
        level
      });
    }
    
    return contributions;
  };

  const getContributionColor = (level: number): string => {
    const colors = [
      'bg-muted/30', // 0 contributions
      'bg-green-200 dark:bg-green-900/50', // 1-2 contributions
      'bg-green-300 dark:bg-green-800/70', // 3-4 contributions
      'bg-green-400 dark:bg-green-700/80', // 5-6 contributions
      'bg-green-500 dark:bg-green-600', // 7+ contributions
    ];
    return colors[level] || colors[0];
  };

  const getWeeksInYear = (contributions: ContributionDay[]): ContributionDay[][] => {
    const weeks: ContributionDay[][] = [];
    let currentWeek: ContributionDay[] = [];
    
    contributions.forEach((day, index) => {
      const dayOfWeek = new Date(day.date).getDay();
      
      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      
      currentWeek.push(day);
      
      if (index === contributions.length - 1) {
        weeks.push(currentWeek);
      }
    });
    
    return weeks;
  };

  if (loading) {
    return (
      <div className={`glass-card p-6 rounded-2xl ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-48 mb-4"></div>
          <div className="flex gap-1 overflow-x-auto">
            {[...Array(53)].map((_, i) => (
              <div key={i} className="flex flex-col gap-1">
                {[...Array(7)].map((_, j) => (
                  <div key={j} className="w-3 h-3 bg-muted rounded-sm"></div>
                ))}
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
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Unable to load contribution graph</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const weeks = getWeeksInYear(contributions);
  const currentStreak = calculateCurrentStreak(contributions);
  const longestStreak = calculateLongestStreak(contributions);

  return (
    <div className={`glass-card p-6 rounded-2xl ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-display font-bold flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          GitHub Activity
        </h3>
        <div className="text-sm text-muted-foreground">
          {totalContributions} contributions in the last year
        </div>
      </div>

      <div className="mb-6">
        <div className="flex gap-1 mb-4 overflow-x-auto">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {Array.from({ length: 7 }, (_, dayIndex) => {
                const day = week[dayIndex];
                return (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`w-3 h-3 rounded-sm ${
                      day ? getContributionColor(day.level) : 'bg-transparent'
                    }`}
                    title={day ? `${day.count} contributions on ${day.date}` : ''}
                  />
                );
              })}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Less</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-sm ${getContributionColor(level)}`}
                />
              ))}
            </div>
            <span className="text-muted-foreground">More</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
            <TrendingUp className="h-5 w-5" />
            {currentStreak}
          </div>
          <div className="text-sm text-muted-foreground">Current Streak</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{longestStreak}</div>
          <div className="text-sm text-muted-foreground">Longest Streak</div>
        </div>
      </div>
    </div>
  );
};

function calculateCurrentStreak(contributions: ContributionDay[]): number {
  let streak = 0;
  for (let i = contributions.length - 1; i >= 0; i--) {
    if (contributions[i].count > 0) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function calculateLongestStreak(contributions: ContributionDay[]): number {
  let maxStreak = 0;
  let currentStreak = 0;
  
  contributions.forEach(day => {
    if (day.count > 0) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  });
  
  return maxStreak;
}

export default GitHubContributions;
