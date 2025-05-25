
import { useState, useEffect } from "react";
import { Plus, Search, Filter, Code, BookOpen, Zap, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import QuestionForm from "@/components/QuestionForm";
import QuestionCard from "@/components/QuestionCard";
import { useToast } from "@/hooks/use-toast";

export interface DSAQuestion {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  tags: string[];
  solution?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  createdAt: Date;
}

const Index = () => {
  const [questions, setQuestions] = useState<DSAQuestion[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<DSAQuestion | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [topicFilter, setTopicFilter] = useState<string>("all");
  const { toast } = useToast();

  // Load questions from localStorage on component mount
  useEffect(() => {
    const savedQuestions = localStorage.getItem("dsaQuestions");
    if (savedQuestions) {
      const parsed = JSON.parse(savedQuestions);
      setQuestions(parsed.map((q: any) => ({ ...q, createdAt: new Date(q.createdAt) })));
    }
  }, []);

  // Save questions to localStorage whenever questions array changes
  useEffect(() => {
    localStorage.setItem("dsaQuestions", JSON.stringify(questions));
  }, [questions]);

  const addQuestion = (questionData: Omit<DSAQuestion, "id" | "createdAt">) => {
    const newQuestion: DSAQuestion = {
      ...questionData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setQuestions(prev => [newQuestion, ...prev]);
    setIsFormOpen(false);
    toast({
      title: "Question Added",
      description: "Your DSA question has been successfully added!",
    });
  };

  const updateQuestion = (questionData: Omit<DSAQuestion, "id" | "createdAt">) => {
    if (!editingQuestion) return;
    
    setQuestions(prev => 
      prev.map(q => 
        q.id === editingQuestion.id 
          ? { ...questionData, id: editingQuestion.id, createdAt: editingQuestion.createdAt }
          : q
      )
    );
    setEditingQuestion(null);
    setIsFormOpen(false);
    toast({
      title: "Question Updated",
      description: "Your DSA question has been successfully updated!",
    });
  };

  const deleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
    toast({
      title: "Question Deleted",
      description: "The DSA question has been removed from your vault.",
    });
  };

  const handleEdit = (question: DSAQuestion) => {
    setEditingQuestion(question);
    setIsFormOpen(true);
  };

  // Get unique topics for filter
  const topics = Array.from(new Set(questions.map(q => q.topic)));

  // Filter questions based on search and filters
  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDifficulty = difficultyFilter === "all" || question.difficulty === difficultyFilter;
    const matchesTopic = topicFilter === "all" || question.topic === topicFilter;
    
    return matchesSearch && matchesDifficulty && matchesTopic;
  });

  const stats = {
    total: questions.length,
    easy: questions.filter(q => q.difficulty === "Easy").length,
    medium: questions.filter(q => q.difficulty === "Medium").length,
    hard: questions.filter(q => q.difficulty === "Hard").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Code className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">DSA Vault</h1>
          </div>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Your personal repository for Data Structures & Algorithms questions. 
            Organize, practice, and master your coding skills.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Questions</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Easy</CardTitle>
              <Zap className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{stats.easy}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Medium</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{stats.medium}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Hard</CardTitle>
              <Trophy className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{stats.hard}</div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 mb-8 border border-slate-700">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger className="w-32 bg-slate-700/50 border-slate-600 text-white">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={topicFilter} onValueChange={setTopicFilter}>
                  <SelectTrigger className="w-40 bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue placeholder="All Topics" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="all">All Topics</SelectItem>
                    {topics.map(topic => (
                      <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              onClick={() => {
                setEditingQuestion(null);
                setIsFormOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>
        </div>

        {/* Questions Grid */}
        {filteredQuestions.length === 0 ? (
          <Card className="bg-slate-800/30 border-slate-700">
            <CardContent className="text-center py-12">
              <Code className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {questions.length === 0 ? "No questions yet" : "No questions match your search"}
              </h3>
              <p className="text-slate-400 mb-6">
                {questions.length === 0 
                  ? "Start building your DSA question vault by adding your first question."
                  : "Try adjusting your search terms or filters to find what you're looking for."
                }
              </p>
              {questions.length === 0 && (
                <Button 
                  onClick={() => {
                    setEditingQuestion(null);
                    setIsFormOpen(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Question
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredQuestions.map((question) => (
              <QuestionCard 
                key={question.id} 
                question={question} 
                onEdit={handleEdit}
                onDelete={deleteQuestion}
              />
            ))}
          </div>
        )}

        {/* Question Form Modal */}
        {isFormOpen && (
          <QuestionForm
            question={editingQuestion}
            onSubmit={editingQuestion ? updateQuestion : addQuestion}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingQuestion(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
