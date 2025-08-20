import React, { useState } from "react";
import { Tag as TagIcon, TrendingUp, Calendar, Search } from "lucide-react";
import MemoryCard from "@/components/MemoryCard";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { sampleTags, sampleMemories } from "@/data/sampleData";

const TagsPage: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTags = sampleTags.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tagMemories = selectedTag
    ? sampleMemories.filter((memory) => memory.tags.includes(selectedTag))
    : [];

  const getTagSize = (count: number) => {
    if (count > 30) return "text-2xl";
    if (count > 20) return "text-xl";
    if (count > 10) return "text-lg";
    return "text-base";
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <main className="flex">
        <div className="p-6">
          {!selectedTag ? (
            /* Tags Overview */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-display font-bold text-neutral-900">
                    Tags & Categories
                  </h1>
                  <p className="text-neutral-600 mt-1">
                    Explore your memories by topics and themes
                  </p>
                </div>
              </div>

              {/* Search Tags */}
              <div className="max-w-md">
                <Input
                  placeholder="Search tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none" />
              </div>

              {/* Tag Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center space-y-2">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto">
                    <TagIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900">
                    {sampleTags.length}
                  </h3>
                  <p className="text-neutral-600">Total Tags</p>
                </Card>

                <Card className="text-center space-y-2">
                  <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mx-auto">
                    <TrendingUp className="w-6 h-6 text-secondary-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900">
                    {sampleTags[0]?.name}
                  </h3>
                  <p className="text-neutral-600">Most Used</p>
                </Card>

                <Card className="text-center space-y-2">
                  <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mx-auto">
                    <Calendar className="w-6 h-6 text-accent-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900">
                    {
                      //filter sample memories for memoris created this month
                      sampleMemories.filter(
                        (mem) =>
                          mem.date.split("-")[1] ===
                          `${new Date().getMonth() + 1}`
                      ).length
                    }
                  </h3>
                  <p className="text-neutral-600">This Month</p>
                </Card>
              </div>

              {/* Tag Cloud */}
              <Card className="p-8">
                <h2 className="text-xl font-semibold text-neutral-900 mb-6">
                  Tag Cloud
                </h2>
                <div className="flex flex-wrap gap-4 justify-center">
                  {filteredTags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => setSelectedTag(tag.name)}
                      className={`${getTagSize(
                        tag.count
                      )} font-medium text-primary-600 hover:text-primary-700 transition-colors`}
                      style={{ opacity: Math.max(0.4, tag.count / 50) }}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Tag List */}
              <Card>
                <div className="p-6 border-b border-neutral-200">
                  <h2 className="text-xl font-semibold text-neutral-900">
                    All Tags
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTags.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => setSelectedTag(tag.name)}
                        className="flex items-center justify-between p-3 hover:bg-neutral-50 rounded-lg transition-colors text-left"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: tag.color }}
                          />
                          <span className="font-medium text-neutral-900">
                            {tag.name}
                          </span>
                        </div>
                        <span className="text-sm text-neutral-500">
                          {tag.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            /* Tag Detail View */
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={() => setSelectedTag(null)}>
                  ← Back to Tags
                </Button>
              </div>

              <div className="flex items-center space-x-4">
                <div
                  className="w-8 h-8 rounded-full"
                  style={{
                    backgroundColor:
                      sampleTags.find((t) => t.name === selectedTag)?.color ||
                      "#3B82F6",
                  }}
                />
                <div>
                  <h1 className="text-3xl font-display font-bold text-neutral-900">
                    {selectedTag}
                  </h1>
                  <p className="text-neutral-600">
                    {tagMemories.length} memories with this tag
                  </p>
                </div>
              </div>

              {/* Tag Timeline */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {tagMemories.map((memory) => (
                  <MemoryCard
                    key={memory.id}
                    memory={memory}
                    onClick={() => {}}
                  />
                ))}
              </div>

              {tagMemories.length === 0 && (
                <Card className="text-center py-12">
                  <TagIcon className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    No memories found
                  </h3>
                  <p className="text-neutral-600">
                    No memories are tagged with "{selectedTag}" yet.
                  </p>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TagsPage;
