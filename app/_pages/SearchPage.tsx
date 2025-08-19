import React, { useState, useEffect } from "react";
import { Search, Filter, Calendar, Tag as TagIcon, Clock } from "lucide-react";
import MemoryCard from "@/components/MemoryCard";
import EmptyState from "@/components/ui/EmptyState";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Tag from "@/components/ui/Tag";
import { Memory } from "@/types/types";
import { sampleMemories } from "@/data/sampleData";
import DatePicker from "@/components/ui/DatePicker";
import MultiSelect from "@/components/ui/MultiSelect";

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Memory[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [recentSearches] = useState([
    "family vacation",
    "birthday party",
    "work milestone",
  ]);
  const [popularTags] = useState([
    "family",
    "travel",
    "work",
    "friends",
    "celebrations",
  ]);

  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      // Simulate search delay
      const timer = setTimeout(() => {
        const filtered = sampleMemories.filter(
          (memory) =>
            memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            memory.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            memory.tags.some((tag) =>
              tag.toLowerCase().includes(searchQuery.toLowerCase())
            ) ||
            memory.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            memory.mood.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filtered);
        setIsSearching(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchQuery]);

  const filteredMemories = React.useMemo(() => {
    const dataToFilter = searchQuery.trim() ? searchResults : sampleMemories;
    return dataToFilter.filter((memory) => {
      const memoryDate = new Date(memory.date);
      const matchesDateRange =
        (!startDate || memoryDate >= startDate) &&
        (!endDate || memoryDate <= endDate);
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => memory.tags.includes(tag));
      const matchesMoods =
        selectedMoods.length === 0 ||
        (memory.mood && selectedMoods.includes(memory.mood));

      return matchesDateRange && matchesTags && matchesMoods;
    });
  }, [
    searchQuery,
    searchResults,
    selectedTags,
    selectedMoods,
    startDate,
    endDate,
  ]);

  console.log("FIltered", filteredMemories);

  const availableTags = Array.from(
    new Set(sampleMemories.flatMap((mem) => mem.tags))
  );
  const availableMoods = Array.from(
    new Set(sampleMemories.map((mem) => mem.mood).filter(Boolean))
  ) as string[];

  const groupedResults = {
    memories: filteredMemories, // Use filteredMemories here
    tags: popularTags.filter((tag) =>
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    dates: [], // Could include date-based results
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="flex">
        <main className="flex">
          <div className="p-6 max-w-4xl mx-auto">
            {/* Search Header */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-display font-bold text-neutral-900">
                  Search Memories
                </h1>
                <p className="text-neutral-600 mt-1">
                  Find memories by content, tags, dates, or locations
                </p>
              </div>

              {/* Search Input */}
              <div className="relative">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search memories,..."
                  className="pl-12 text-lg py-3"
                />
                <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                {isSearching && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-600 border-t-transparent" />
                  </div>
                )}
              </div>

              {/* Quick Filters */}
              <div className="flex items-center space-x-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setFilterModalOpen(true)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            <Modal
              isOpen={filterModalOpen}
              onClose={() => setFilterModalOpen(false)}
              title="Filter Memories"
            >
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">
                    Date Range
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DatePicker
                      label="Start Date"
                      value={
                        startDate ? startDate.toISOString().split("T")[0] : ""
                      }
                      onChange={(date) =>
                        setStartDate(date ? new Date(date) : null)
                      }
                    />
                    <DatePicker
                      label="End Date"
                      value={endDate ? endDate.toISOString().split("T")[0] : ""}
                      onChange={(date) =>
                        setEndDate(date ? new Date(date) : null)
                      }
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">
                    Tags
                  </h3>
                  <MultiSelect
                    options={availableTags.map((tag) => ({
                      label: tag,
                      value: tag,
                    }))}
                    value={selectedTags}
                    onChange={setSelectedTags}
                    placeholder="Select tags"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">
                    Moods
                  </h3>
                  <MultiSelect
                    options={availableMoods.map((mood) => ({
                      label: mood,
                      value: mood,
                    }))}
                    value={selectedMoods}
                    onChange={setSelectedMoods}
                    placeholder="Select moods"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSelectedTags([]);
                      setSelectedMoods([]);
                      setStartDate(null);
                      setEndDate(null);
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </Modal>

            {/* Search Results */}
            {searchQuery ||
            selectedTags.length > 0 ||
            selectedMoods.length > 0 ||
            startDate ||
            endDate ? (
              <div className="mt-8 space-y-8">
                {/* Memories Results */}
                {groupedResults.memories.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-neutral-900">
                      Memories ({groupedResults.memories.length})
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {groupedResults.memories.map((memory) => (
                        <MemoryCard
                          key={memory.id}
                          memory={memory}
                          onClick={() => {}}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags Results */}
                {groupedResults.tags.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-neutral-900">
                      Tags ({groupedResults.tags.length})
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {groupedResults.tags.map((tag) => (
                        <Tag
                          key={tag}
                          className="cursor-pointer hover:bg-primary-200"
                        >
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {groupedResults.memories.length === 0 &&
                  groupedResults.tags.length === 0 &&
                  !isSearching && (
                    <EmptyState
                      icon={Search}
                      title="No results found"
                      description={
                        searchQuery
                          ? `No memories found for "${searchQuery}". Try different keywords or check your spelling.`
                          : "No memories match your selected filters. Try adjusting them."
                      }
                    />
                  )}
              </div>
            ) : (
              /* Search Suggestions */
              <div className="mt-8 space-y-8">
                {/* Recent Searches */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-neutral-900 flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Recent Searches
                  </h2>
                  <div className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => setSearchQuery(search)}
                        className="flex items-center space-x-3 p-3 w-full text-left hover:bg-neutral-100 rounded-lg transition-colors"
                      >
                        <Search className="w-4 h-4 text-neutral-400" />
                        <span className="text-neutral-700">{search}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Popular Tags */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-neutral-900 flex items-center">
                    <TagIcon className="w-5 h-5 mr-2" />
                    Popular Tags
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag) => (
                      <Tag
                        key={tag}
                        className="cursor-pointer hover:bg-primary-200"
                        onClick={() => {
                          setSearchQuery(tag), console.log("test");
                        }}
                      >
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </div>

                {/* Search Tips */}
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
                  <h3 className="font-semibold text-primary-900 mb-3">
                    Search Tips
                  </h3>
                  <ul className="space-y-2 text-sm text-primary-800">
                    <li>• Use quotes for exact phrases: "family vacation"</li>
                    <li>• Search by date: "2023" or "December"</li>
                    <li>• Find by location: "Paris" or "home"</li>
                    <li>• Search by mood: "joyful" or "peaceful"</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SearchPage;
