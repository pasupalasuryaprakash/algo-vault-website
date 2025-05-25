import { useState, useEffect } from "react";
import { Plus, Search, Filter, Code, BookOpen, Zap, Trophy, Star, Target, Brain } from "lucide-react";
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
  notes?: string;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      {/* CogniZap Brand in Top Left Corner */}
      <div className="absolute top-6 left-6 z-20">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-md opacity-70" />
            <div className="relative p-3 bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl shadow-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              CogniZap
            </h1>
            <p className="text-xs text-slate-400 font-medium tracking-wider">DSA VAULT</p>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-12 max-w-7xl">
        {/* Enhanced Header */}
        <div className="text-center mb-16 mt-16">
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-lg opacity-50" />
              <div className="relative p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-2xl">
                <Code className="h-10 w-10 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-white to-purple-400 bg-clip-text text-transparent mb-2">
                DSA Vault
              </h1>
              <div className="flex items-center justify-center gap-2 text-blue-300">
                <Star className="h-4 w-4" />
                <span className="text-sm font-medium tracking-wider uppercase">Professional Edition</span>
                <Star className="h-4 w-4" />
              </div>
            </div>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Your premium repository for Data Structures & Algorithms mastery. 
            <br />
            <span className="text-blue-400 font-medium">Organize, practice, and excel</span> in your coding journey.
          </p>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-900/70 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-300 tracking-wide uppercase">Total Questions</CardTitle>
              <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                <BookOpen className="h-5 w-5 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-1">{stats.total}</div>
              <p className="text-xs text-slate-400">Problems in vault</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-900/70 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-300 tracking-wide uppercase">Easy</CardTitle>
              <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                <Target className="h-5 w-5 text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400 mb-1">{stats.easy}</div>
              <p className="text-xs text-slate-400">Beginner friendly</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-900/70 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-300 tracking-wide uppercase">Medium</CardTitle>
              <div className="p-2 bg-yellow-500/20 rounded-lg group-hover:bg-yellow-500/30 transition-colors">
                <Brain className="h-5 w-5 text-yellow-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400 mb-1">{stats.medium}</div>
              <p className="text-xs text-slate-400">Skill building</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-900/70 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-300 tracking-wide uppercase">Hard</CardTitle>
              <div className="p-2 bg-red-500/20 rounded-lg group-hover:bg-red-500/30 transition-colors">
                <Trophy className="h-5 w-5 text-red-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-400 mb-1">{stats.hard}</div>
              <p className="text-xs text-slate-400">Expert level</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Controls */}
        <Card className="bg-slate-900/30 backdrop-blur-md border-slate-700/50 mb-12 shadow-2xl">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full lg:w-auto">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <Input
                    placeholder="Search questions, tags, or descriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                </div>
                
                <div className="flex gap-3">
                  <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                    <SelectTrigger className="w-40 h-12 bg-slate-800/50 border-slate-600/50 text-white focus:ring-2 focus:ring-blue-500/50">
                      <Filter className="h-4 w-4 mr-2 text-slate-400" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={topicFilter} onValueChange={setTopicFilter}>
                    <SelectTrigger className="w-44 h-12 bg-slate-800/50 border-slate-600/50 text-white focus:ring-2 focus:ring-blue-500/50">
                      <SelectValue placeholder="All Topics" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
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
                className="h-12 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add New Question
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Questions Grid */}
        {filteredQuestions.length === 0 ? (
          <Card className="bg-slate-900/30 border-slate-700/50 backdrop-blur-md shadow-2xl">
            <CardContent className="text-center py-20">
              <div className="mb-8">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl" />
                  <div className="relative p-6 bg-slate-800/50 rounded-full">
                    <Code className="h-16 w-16 text-slate-400" />
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {questions.length === 0 ? "Welcome to DSA Vault" : "No questions match your search"}
              </h3>
              <p className="text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
                {questions.length === 0 
                  ? "Start building your professional DSA question repository. Add your first question to begin your coding mastery journey."
                  : "Try adjusting your search terms or filters to find what you're looking for."
                }
              </p>
              {questions.length === 0 && (
                <Button 
                  onClick={() => {
                    setEditingQuestion(null);
                    setIsFormOpen(true);
                  }}
                  className="h-12 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Your First Question
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
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
