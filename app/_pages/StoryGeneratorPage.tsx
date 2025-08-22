"use client";
import React, { useState } from "react";
import { BookOpen, Wand2, Download, FileText, Share } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import DatePicker from "@/components/ui/DatePicker";
import Loader from "@/components/ui/Loader";
import { sampleStoryExample } from "@/data/sampleData";
import Input from "../_components/ui/Input";
import { jsPDF } from "jspdf";
import { Document, Paragraph, Packer, TextRun } from "docx";

interface StorySettings {
  dateRange: {
    start: string;
    end: string;
  };
  tone: "reflective" | "celebratory" | "nostalgic";
  length: "short" | "medium" | "long";
  includeImages: boolean;
}

const StoryGeneratorPage: React.FC = () => {
  const [settings, setSettings] = useState<StorySettings>({
    dateRange: {
      start: "2024-01-01",
      end: "2024-12-31",
    },
    tone: "reflective",
    length: "medium",
    includeImages: true,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("story");

  const toneOptions = [
    { value: "reflective", label: "Reflective & Thoughtful" },
    { value: "celebratory", label: "Celebratory & Joyful" },
    { value: "nostalgic", label: "Nostalgic & Warm" },
  ];

  const lengthOptions = [
    { value: "short", label: "Short (1-2 pages)" },
    { value: "medium", label: "Medium (3-5 pages)" },
    { value: "long", label: "Long (6+ pages)" },
  ];

  const handleGenerateStory = async () => {
    setIsGenerating(true);
    setProgress(0);
    setGeneratedStory(null);

    // Simulate AI story generation with progress
    const steps = [
      "Analyzing your memories...",
      "Identifying key themes...",
      "Crafting narrative structure...",
      "Writing your story...",
      "Adding finishing touches...",
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProgress(((i + 1) / steps.length) * 100);
    }
    console.log("Settings", settings);

    setGeneratedStory(sampleStoryExample);
    setIsGenerating(false);
  };

  const handleExport = async (format: "pdf" | "docx") => {
    if (!generatedStory) return;

    const fileNameWithExtension = `${fileName}.${format}`;

    if (format === "pdf") {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      // Title and author
      //  doc.setFont("helvetica", "bold");
      //  doc.setFontSize(24);
      const paragraphs = generatedStory
        .split("\n")
        .filter((line) => line.trim() !== "")
        .map((line) => line.trim());

      const formattedParagraphs = paragraphs.map((para, index) => {
        if (index === 0) return para; // Title remains unchanged
        // Split by sentence or idea, adding separators
        const sentences = para.split(". ").map((sentence) => sentence.trim());
        return sentences
          .filter((s) => s)
          .map((s, i) => (i > 0 ? `---- ${s}.` : `${s}.`))
          .join(" ");
      });

      let yPosition = 40;
      formattedParagraphs.forEach((paragraph, index) => {
        doc.text(paragraph, 20, yPosition);
        yPosition += 10; // Space between paragraphs
      });

      doc.save(fileNameWithExtension);
    } else if (format === "docx") {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [new TextRun(generatedStory)],
              }),
            ],
          },
        ],
      });

      Packer.toBlob(doc).then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileNameWithExtension;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }
    console.log(
      `Exporting story as ${format.toUpperCase()} with filename ${fileNameWithExtension}`
    );
  };

  return (
    <div className="min-h-fit bg-neutral-50">
      <div className="flex">
        <main className="flex">
          <div className="p-6 max-w-6xl mx-auto">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-display font-bold text-neutral-900">
                  AI Story Generator
                </h1>
                <p className="text-neutral-600 mt-1">
                  Create beautiful stories from your memories using AI
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Settings Panel */}
                <div className="lg:col-span-1">
                  <Card className="space-y-6">
                    <div className="flex items-center space-x-2">
                      <Wand2 className="w-5 h-5 text-primary-600" />
                      <h2 className="text-lg font-semibold text-neutral-900">
                        Story Settings
                      </h2>
                    </div>

                    <div className="space-y-4">
                      {/* Date Range */}
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-neutral-700">
                          Time Period
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <DatePicker
                            value={settings.dateRange.start}
                            onChange={(date) =>
                              setSettings((prev) => ({
                                ...prev,
                                dateRange: { ...prev.dateRange, start: date },
                              }))
                            }
                            placeholder="Start date"
                          />
                          <DatePicker
                            value={settings.dateRange.end}
                            onChange={(date) =>
                              setSettings((prev) => ({
                                ...prev,
                                dateRange: { ...prev.dateRange, end: date },
                              }))
                            }
                            placeholder="End date"
                          />
                        </div>
                      </div>

                      {/* Tone */}
                      <Select
                        label="Story Tone"
                        options={toneOptions}
                        value={settings.tone}
                        onChange={(value) =>
                          setSettings((prev) => ({
                            ...prev,
                            tone: value as StorySettings["tone"],
                          }))
                        }
                      />

                      {/* Length */}
                      <Select
                        label="Story Length"
                        options={lengthOptions}
                        value={settings.length}
                        onChange={(value) =>
                          setSettings((prev) => ({
                            ...prev,
                            length: value as StorySettings["length"],
                          }))
                        }
                      />

                      {/* Include Images */}
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="includeImages"
                          checked={false}
                          disabled
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              includeImages: e.target.checked,
                            }))
                          }
                          className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                        />
                        <label
                          htmlFor="includeImages"
                          className="text-sm text-neutral-700"
                        >
                          Include images in story{" "}
                          <span className="text-xs text-amber-500 font-semibold ml-1">
                            (Premium)
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Generate Button */}
                    <Button
                      onClick={handleGenerateStory}
                      loading={isGenerating}
                      disabled={isGenerating}
                      className="w-full"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Generate Story
                    </Button>

                    {/* Progress */}
                    {isGenerating && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-600">
                            Generating...
                          </span>
                          <span className="text-neutral-600">
                            {Math.round(progress)}%
                          </span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </Card>

                  {/* Export Options */}
                  {generatedStory && (
                    <Card className="mt-6 space-y-4">
                      <h3 className="font-semibold text-neutral-900">
                        Export Options
                      </h3>
                      <div className="space-y-2">
                        {/* export file name input */}
                        <Input
                          label="File Name"
                          placeholder="Enter file name"
                          type="text"
                          value={fileName}
                          onChange={(e) => setFileName(e.target.value)}
                        />
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleExport("pdf")}
                          className="w-full justify-start"
                          disabled={fileName.trim() == "" ? true : false}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Export as PDF
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleExport("docx")}
                          className="w-full justify-start"
                          disabled={fileName.trim() == "" ? true : false}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export as Word
                        </Button>
                      </div>
                    </Card>
                  )}
                </div>

                {/* Story Preview */}
                <div className="lg:col-span-2">
                  <Card className="min-h-96">
                    {!generatedStory && !isGenerating && (
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                        <BookOpen className="w-16 h-16 text-neutral-300 mb-4" />
                        <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                          Ready to Create Your Story
                        </h3>
                        <p className="text-neutral-600 max-w-md">
                          Configure your settings and click "Generate Story" to
                          create a beautiful narrative from your memories.
                        </p>
                      </div>
                    )}

                    {isGenerating && (
                      <div className="flex flex-col items-center justify-center py-20">
                        <Loader size="lg" className="mb-4" />
                        <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                          Creating Your Story
                        </h3>
                        <p className="text-neutral-600">
                          Our AI is crafting a personalized story from your
                          memories...
                        </p>
                      </div>
                    )}

                    {generatedStory && (
                      <div className="prose prose-neutral max-w-none">
                        <div className="whitespace-pre-wrap text-neutral-800 leading-relaxed">
                          {generatedStory}
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StoryGeneratorPage;
