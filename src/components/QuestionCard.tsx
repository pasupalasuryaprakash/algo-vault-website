
import { useState } from "react";
import { Edit, Trash2, Clock, Database, Tag, ChevronDown, ChevronUp, Code2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DSAQuestion } from "@/pages/Index";

interface QuestionCardProps {
  question: DSAQuestion;
  onEdit: (question: DSAQuestion) => void;
  onDelete: (id: string) => void;
}

const QuestionCard = ({ question, onEdit, onDelete }: QuestionCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-gradient-to-r from-green-600 to-green-700 text-white border-0 shadow-lg shadow-green-500/25";
      case "Medium":
        return "bg-gradient-to-r from-yellow-600 to-yellow-700 text-white border-0 shadow-lg shadow-yellow-500/25";
      case "Hard":
        return "bg-gradient-to-r from-red-600 to-red-700 text-white border-0 shadow-lg shadow-red-500/25";
      default:
        return "bg-gradient-to-r from-gray-600 to-gray-700 text-white border-0";
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      onDelete(question.id);
    }
  };

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-900/70 transition-all duration-300 group shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-300 transition-colors">
              {question.title}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-3">
              <Badge className={`${getDifficultyColor(question.difficulty)} font-semibold px-3 py-1`}>
                {question.difficulty}
              </Badge>
              <Badge variant="outline" className="border-slate-600 text-slate-300 bg-slate-800/50 font-medium px-3 py-1">
                {question.topic}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(question)}
              className="text-slate-400 hover:text-blue-400 hover:bg-slate-800/50 h-9 w-9 p-0 rounded-lg transition-all duration-200"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-slate-400 hover:text-red-400 hover:bg-slate-800/50 h-9 w-9 p-0 rounded-lg transition-all duration-200"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-slate-300 text-sm mb-5 line-clamp-3 leading-relaxed">
          {question.description}
        </p>

        {question.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {question.tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs bg-slate-800/50 text-slate-300 border-slate-600/50 hover:bg-slate-700/50 transition-colors font-medium px-2 py-1"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {(question.timeComplexity || question.spaceComplexity || question.solution) && (
          <>
            <Separator className="my-5 bg-slate-700/50" />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full text-slate-400 hover:text-white hover:bg-slate-800/50 h-11 rounded-lg transition-all duration-200"
            >
              <Code2 className="h-4 w-4 mr-2" />
              <span className="font-medium">{isExpanded ? "Hide Details" : "Show Details"}</span>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 ml-2" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-2" />
              )}
            </Button>

            {isExpanded && (
              <div className="mt-5 space-y-4 animate-fade-in">
                {(question.timeComplexity || question.spaceComplexity) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {question.timeComplexity && (
                      <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <Clock className="h-4 w-4 text-blue-400" />
                        </div>
                        <div>
                          <span className="text-slate-400 text-xs font-medium uppercase tracking-wide">Time Complexity</span>
                          <code className="block text-blue-300 font-mono font-semibold">
                            {question.timeComplexity}
                          </code>
                        </div>
                      </div>
                    )}
                    {question.spaceComplexity && (
                      <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <Database className="h-4 w-4 text-purple-400" />
                        </div>
                        <div>
                          <span className="text-slate-400 text-xs font-medium uppercase tracking-wide">Space Complexity</span>
                          <code className="block text-purple-300 font-mono font-semibold">
                            {question.spaceComplexity}
                          </code>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {question.solution && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                      <Code2 className="h-4 w-4" />
                      Solution Implementation
                    </h4>
                    <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-700/50 overflow-hidden">
                      <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
                        {question.solution}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        <div className="mt-6 pt-4 border-t border-slate-700/50">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar className="h-3 w-3" />
            <span>Added on {question.createdAt.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
