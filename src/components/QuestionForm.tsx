
import { useState, useEffect } from "react";
import { X, Save, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { DSAQuestion } from "@/pages/Index";

interface QuestionFormProps {
  question?: DSAQuestion | null;
  onSubmit: (question: Omit<DSAQuestion, "id" | "createdAt">) => void;
  onCancel: () => void;
}

const QuestionForm = ({ question, onSubmit, onCancel }: QuestionFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "Easy" as "Easy" | "Medium" | "Hard",
    topic: "",
    tags: "",
    solution: "",
    timeComplexity: "",
    spaceComplexity: "",
  });

  useEffect(() => {
    if (question) {
      setFormData({
        title: question.title,
        description: question.description,
        difficulty: question.difficulty,
        topic: question.topic,
        tags: question.tags.join(", "),
        solution: question.solution || "",
        timeComplexity: question.timeComplexity || "",
        spaceComplexity: question.spaceComplexity || "",
      });
    }
  }, [question]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.topic.trim()) {
      return;
    }

    const questionData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      difficulty: formData.difficulty,
      topic: formData.topic.trim(),
      tags: formData.tags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0),
      solution: formData.solution.trim() || undefined,
      timeComplexity: formData.timeComplexity.trim() || undefined,
      spaceComplexity: formData.spaceComplexity.trim() || undefined,
    };

    onSubmit(questionData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Code className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-xl text-white">
              {question ? "Edit Question" : "Add New Question"}
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-slate-300">Question Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Two Sum, Binary Search, etc."
                className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="difficulty" className="text-slate-300">Difficulty *</Label>
                <Select value={formData.difficulty} onValueChange={(value) => handleChange("difficulty", value)}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic" className="text-slate-300">Topic *</Label>
                <Input
                  id="topic"
                  value={formData.topic}
                  onChange={(e) => handleChange("topic", e.target.value)}
                  placeholder="Arrays, Trees, Dynamic Programming, etc."
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags" className="text-slate-300">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => handleChange("tags", e.target.value)}
                placeholder="hash-table, two-pointers, sorting (comma separated)"
                className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-300">Problem Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe the problem statement, constraints, and examples..."
                className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 min-h-32"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="solution" className="text-slate-300">Solution (Optional)</Label>
              <Textarea
                id="solution"
                value={formData.solution}
                onChange={(e) => handleChange("solution", e.target.value)}
                placeholder="Write your solution code or approach here..."
                className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 min-h-32 font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timeComplexity" className="text-slate-300">Time Complexity</Label>
                <Input
                  id="timeComplexity"
                  value={formData.timeComplexity}
                  onChange={(e) => handleChange("timeComplexity", e.target.value)}
                  placeholder="O(n), O(log n), O(n²), etc."
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="spaceComplexity" className="text-slate-300">Space Complexity</Label>
                <Input
                  id="spaceComplexity"
                  value={formData.spaceComplexity}
                  onChange={(e) => handleChange("spaceComplexity", e.target.value)}
                  placeholder="O(1), O(n), O(n²), etc."
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {question ? "Update Question" : "Add Question"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionForm;
