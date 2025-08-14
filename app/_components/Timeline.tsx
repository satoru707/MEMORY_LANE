"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronRight, Filter, Search } from "lucide-react";
import { Memory } from "../types";
import MemoryCard from "./MemoryCard";
import Button from "./ui/Button";
import Input from "./ui/Input";
import { cn } from "../_lib/utils";

interface TimelineProps {
  memories: Memory[];
  onMemoryClick: (memory: Memory) => void;
}

const Timeline: React.FC<TimelineProps> = ({ memories, onMemoryClick }) => {
  const [expandedYears, setExpandedYears] = useState<Set<number>>(
    new Set([2024])
  );
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Group memories by year, month, and day
  const groupedMemories = memories.reduce((acc, memory) => {
    const date = new Date(memory.date);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    if (!acc[year]) acc[year] = {};
    if (!acc[year][month]) acc[year][month] = {};
    if (!acc[year][month][day]) acc[year][month][day] = [];

    acc[year][month][day].push(memory);
    return acc;
  }, {} as Record<number, Record<number, Record<number, Memory[]>>>);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const toggleYear = (year: number) => {
    const newExpanded = new Set(expandedYears);
    if (newExpanded.has(year)) {
      newExpanded.delete(year);
    } else {
      newExpanded.add(year);
    }
    setExpandedYears(newExpanded);
  };

  const toggleMonth = (yearMonth: string) => {
    const newExpanded = new Set(expandedMonths);
    if (newExpanded.has(yearMonth)) {
      newExpanded.delete(yearMonth);
    } else {
      newExpanded.add(yearMonth);
    }
    setExpandedMonths(newExpanded);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-soft">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search memories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none" />
          </div>
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </Button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-neutral-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input placeholder="Date range..." />
              <Input placeholder="Tags..." />
              <Input placeholder="Mood..." />
            </div>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        {Object.keys(groupedMemories)
          .map(Number)
          .sort((a, b) => b - a)
          .map((year) => (
            <div key={year} className="space-y-4">
              {/* Year Header */}
              <div className="sticky top-20 bg-white/90 backdrop-blur-sm z-10 py-2 border-b border-neutral-200">
                <button
                  onClick={() => toggleYear(year)}
                  className="flex items-center space-x-2 text-2xl font-bold text-neutral-900 hover:text-primary-600 transition-colors"
                >
                  {expandedYears.has(year) ? (
                    <ChevronDown className="w-6 h-6" />
                  ) : (
                    <ChevronRight className="w-6 h-6" />
                  )}
                  <span>{year}</span>
                  <span className="text-sm font-normal text-neutral-500 ml-2">
                    (
                    {Object.values(groupedMemories[year]).reduce(
                      (acc, month) =>
                        acc +
                        Object.values(month).reduce(
                          (acc2, day) => acc2 + day.length,
                          0
                        ),
                      0
                    )}{" "}
                    memories)
                  </span>
                </button>
              </div>

              {/* Year Content */}
              {expandedYears.has(year) && (
                <div className="space-y-6 pl-8">
                  {Object.keys(groupedMemories[year])
                    .map(Number)
                    .sort((a, b) => b - a)
                    .map((month) => {
                      const yearMonth = `${year}-${month}`;
                      return (
                        <div key={month} className="space-y-4">
                          {/* Month Header */}
                          <button
                            onClick={() => toggleMonth(yearMonth)}
                            className="flex items-center space-x-2 text-lg font-semibold text-neutral-700 hover:text-primary-600 transition-colors"
                          >
                            {expandedMonths.has(yearMonth) ? (
                              <ChevronDown className="w-5 h-5" />
                            ) : (
                              <ChevronRight className="w-5 h-5" />
                            )}
                            <span>{monthNames[month]}</span>
                            <span className="text-sm font-normal text-neutral-500 ml-2">
                              (
                              {Object.values(
                                groupedMemories[year][month]
                              ).reduce((acc, day) => acc + day.length, 0)}{" "}
                              memories)
                            </span>
                          </button>

                          {/* Month Content */}
                          {expandedMonths.has(yearMonth) && (
                            <div className="space-y-4 pl-6">
                              {Object.keys(groupedMemories[year][month])
                                .map(Number)
                                .sort((a, b) => b - a)
                                .map((day) => (
                                  <div key={day} className="space-y-3">
                                    {/* Day Header */}
                                    <h4 className="text-sm font-medium text-neutral-600 border-l-2 border-primary-200 pl-3">
                                      {monthNames[month]} {day}
                                    </h4>

                                    {/* Day Memories */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pl-5">
                                      {groupedMemories[year][month][day]
                                        .sort(
                                          (a, b) =>
                                            new Date(b.createdAt).getTime() -
                                            new Date(a.createdAt).getTime()
                                        )
                                        .map((memory) => (
                                          <MemoryCard
                                            key={memory.id}
                                            memory={memory}
                                            onClick={() =>
                                              onMemoryClick(memory)
                                            }
                                          />
                                        ))}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Load More */}
      {memories.length > 0 && (
        <div className="text-center">
          <Button variant="secondary" size="lg">
            Load More Memories
          </Button>
        </div>
      )}
    </div>
  );
};

export default Timeline;
