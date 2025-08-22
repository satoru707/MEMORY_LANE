import React, { useState } from "react";
import {
  TrendingUp,
  Calendar,
  Heart,
  Tag as TagIcon,
  Users,
  Clock,
  MapPin,
  BarChart3,
} from "lucide-react";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import Select from "@/components/ui/Select";
import {
  moodColors,
  analytics,
  timeRangeOptions,
  sampleMemories,
} from "@/data/sampleData";

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState("year");

  const filterMemories = (memories: typeof sampleMemories, range: string) => {
    const now = new Date();
    let startDate = new Date();

    switch (range) {
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "quarter":
        startDate.setMonth(now.getMonth() - 3);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case "all":
      default:
        return memories;
    }

    return memories.filter((memory) => {
      const memoryDate = new Date(memory.date);
      return memoryDate >= startDate && memoryDate <= now;
    });
  };

  const filteredMemories = filterMemories(sampleMemories, timeRange);

  // Recalculate analytics based on filtered memories
  const calculatedAnalytics = {
    totalMemories: filteredMemories.length,
    memoriesThisMonth: filteredMemories.filter((memory) => {
      const memoryDate = new Date(memory.date);
      return (
        memoryDate.getMonth() === new Date().getMonth() &&
        memoryDate.getFullYear() === new Date().getFullYear()
      );
    }).length,
    averagePerWeek: parseFloat(((filteredMemories.length / 52) * 4).toFixed(1)),
    longestStreak: 0, // This would require more complex logic to calculate based on dates
    topMoods: [], // Placeholder, will be calculated dynamically
    topTags: [], // Placeholder, will be calculated dynamically
    monthlyActivity: [], // Placeholder, will be calculated dynamically
    weeklyPattern: [], // Placeholder, will be calculated dynamically
  };

  // Helper function to calculate top moods from filtered memories
  const calculateTopMoods = (memories: typeof sampleMemories) => {
    const moodCounts: { [key: string]: number } = {};
    memories.forEach((memory) => {
      moodCounts[memory.mood] = (moodCounts[memory.mood] || 0) + 1;
    });

    const total = memories.length;
    return Object.entries(moodCounts)
      .map(([mood, count]) => ({
        mood,
        count,
        percentage:
          total > 0 ? parseFloat(((count / total) * 100).toFixed(0)) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  // Helper function to calculate top tags from filtered memories
  const calculateTopTags = (memories: typeof sampleMemories) => {
    const tagCounts: { [key: string]: number } = {};
    memories.forEach((memory) => {
      memory.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const total = memories.length;
    return Object.entries(tagCounts)
      .map(([tag, count]) => ({
        tag,
        count,
        percentage:
          total > 0 ? parseFloat(((count / total) * 100).toFixed(0)) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  // Helper function to calculate monthly activity
  const calculateMonthlyActivity = (memories: typeof sampleMemories) => {
    const monthlyCounts: { [key: string]: number } = {};
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    memories.forEach((memory) => {
      const date = new Date(memory.date);
      const month = monthNames[date.getMonth()];
      monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
    });

    return monthNames.map((month) => ({
      month,
      memories: monthlyCounts[month] || 0,
    }));
  };

  // Helper function to calculate weekly pattern
  const calculateWeeklyPattern = (memories: typeof sampleMemories) => {
    const weeklyCounts: { [key: string]: number } = {};
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    memories.forEach((memory) => {
      const date = new Date(memory.date);
      const day = dayNames[date.getDay()];
      weeklyCounts[day] = (weeklyCounts[day] || 0) + 1;
    });

    return dayNames.map((day) => ({
      day,
      memories: weeklyCounts[day] || 0,
    }));
  };

  // Update calculatedAnalytics with dynamic data
  calculatedAnalytics.topMoods = calculateTopMoods(filteredMemories);
  calculatedAnalytics.topTags = calculateTopTags(filteredMemories);
  calculatedAnalytics.monthlyActivity =
    calculateMonthlyActivity(filteredMemories);
  calculatedAnalytics.weeklyPattern = calculateWeeklyPattern(filteredMemories);

  const displayAnalytics =
    timeRange === "all" ? analytics : calculatedAnalytics;

  return (
    <div className="min-h-fit bg-neutral-50">
      <div className="">
        <main className="">
          <div className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-display font-bold text-neutral-900">
                    Analytics & Insights
                  </h1>
                  <p className="text-neutral-600 mt-1">
                    Discover patterns and insights from your memories
                  </p>
                </div>

                <div className="w-48">
                  <Select
                    options={timeRangeOptions}
                    value={timeRange}
                    onChange={setTimeRange}
                    placeholder="Select time range"
                  />
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Memories"
                  value={displayAnalytics.totalMemories.toLocaleString()}
                  icon={Calendar}
                  change={{ value: "+12%", trend: "up" }}
                />
                <StatCard
                  title="This Month"
                  value={displayAnalytics.memoriesThisMonth.toString()}
                  icon={TrendingUp}
                  change={{ value: "+3", trend: "up" }}
                />
                <StatCard
                  title="Weekly Average"
                  value={displayAnalytics.averagePerWeek.toString()}
                  icon={BarChart3}
                  change={{ value: "+0.5", trend: "up" }}
                />
                <StatCard
                  title="Longest Streak"
                  value={`${displayAnalytics.longestStreak} days`}
                  icon={Clock}
                  change={{ value: "Personal best!", trend: "up" }}
                />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Activity */}
                <Card>
                  <div className="p-6 border-b border-neutral-200">
                    <h2 className="text-xl font-semibold text-neutral-900">
                      Monthly Activity
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {displayAnalytics.monthlyActivity.map((month) => (
                        <div
                          key={month.month}
                          className="flex items-center space-x-4"
                        >
                          <div className="w-8 text-sm text-neutral-600 font-medium">
                            {month.month}
                          </div>
                          <div className="flex-1">
                            <div className="w-full bg-neutral-200 rounded-full h-2">
                              <div
                                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                                style={{
                                  width: `${(month.memories / 35) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                          <div className="w-8 text-sm text-neutral-900 font-medium text-right">
                            {month.memories}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Weekly Pattern */}
                <Card>
                  <div className="p-6 border-b border-neutral-200">
                    <h2 className="text-xl font-semibold text-neutral-900">
                      Weekly Pattern
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {displayAnalytics.weeklyPattern.map((day) => (
                        <div
                          key={day.day}
                          className="flex items-center space-x-4"
                        >
                          <div className="w-8 text-sm text-neutral-600 font-medium">
                            {day.day}
                          </div>
                          <div className="flex-1">
                            <div className="w-full bg-neutral-200 rounded-full h-2">
                              <div
                                className="bg-secondary-600 h-2 rounded-full transition-all duration-300"
                                style={{
                                  width: `${(day.memories / 35) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                          <div className="w-8 text-sm text-neutral-900 font-medium text-right">
                            {day.memories}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Insights Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Moods */}
                <Card>
                  <div className="p-6 border-b border-neutral-200">
                    <div className="flex items-center space-x-2">
                      <Heart className="w-5 h-5 text-primary-600" />
                      <h2 className="text-xl font-semibold text-neutral-900">
                        Top Moods
                      </h2>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {displayAnalytics.topMoods.map((mood) => (
                        <div
                          key={mood.mood}
                          className="flex items-center space-x-4"
                        >
                          <div
                            className={`w-4 h-4 rounded-full ${
                              moodColors[mood.mood as keyof typeof moodColors]
                            }`}
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-neutral-900 capitalize">
                                {mood.mood}
                              </span>
                              <span className="text-sm text-neutral-600">
                                {mood.count} ({mood.percentage}%)
                              </span>
                            </div>
                            <div className="w-full bg-neutral-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  moodColors[
                                    mood.mood as keyof typeof moodColors
                                  ]
                                }`}
                                style={{ width: `${mood.percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Top Tags */}
                <Card>
                  <div className="p-6 border-b border-neutral-200">
                    <div className="flex items-center space-x-2">
                      <TagIcon className="w-5 h-5 text-primary-600" />
                      <h2 className="text-xl font-semibold text-neutral-900">
                        Top Tags
                      </h2>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {displayAnalytics.topTags.map((tag) => (
                        <div
                          key={tag.tag}
                          className="flex items-center space-x-4"
                        >
                          <div className="w-4 h-4 rounded bg-primary-600" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-neutral-900">
                                {tag.tag}
                              </span>
                              <span className="text-sm text-neutral-600">
                                {tag.count} ({tag.percentage}%)
                              </span>
                            </div>
                            <div className="w-full bg-neutral-200 rounded-full h-2">
                              <div
                                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${tag.percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

              {/* AI Insights */}
              <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-neutral-900">
                        AI Insights
                      </h3>
                      <div className="space-y-2 text-sm text-neutral-700">
                        <p>
                          • You're most active on weekends, with 63% more
                          memories created
                        </p>
                        <p>
                          • Your happiest memories often include the "family"
                          and "travel" tags
                        </p>
                        <p>
                          • You've been consistently grateful this month - 40%
                          of memories have a grateful mood
                        </p>
                        <p>
                          • Your memory creation has increased 23% compared to
                          last quarter
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsPage;
