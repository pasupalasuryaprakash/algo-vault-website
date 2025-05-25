
import { useState } from "react";
import { Edit, Trash2, Clock, Database, Tag, ChevronDown, ChevronUp, Code2 } from "lucide-react";
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
        return "bg-green-600 text-green-100";
      case "Medium":
        return "bg-yellow-600 text-yellow-100";
      case "Hard":
        return "bg-red-600 text-red-100";
      default:
        return "bg-gray-600 text-gray-100";
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      onDelete(question.id);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg text-white mb-2 line-clamp-2">
              {question.title}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={`${getDifficultyColor(question.difficulty)} border-0`}>
                {question.difficulty}
              </Badge>
              <Badge variant="outline" className="border-slate-600 text-slate-300">
                {question.topic}
              </Badge>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(question)}
              className="text-slate-400 hover:text-blue-400 hover:bg-slate-700"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-slate-400 hover:text-red-400 hover:bg-slate-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-slate-300 text-sm mb-4 line-clamp-3">
          {question.description}
        </p>

        {question.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {question.tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs bg-slate-700 text-slate-300 border-0"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {(question.timeComplexity || question.spaceComplexity || question.solution) && (
          <>
            <Separator className="my-4 bg-slate-600" />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <Code2 className="h-4 w-4 mr-2" />
              {isExpanded ? "Hide Details" : "Show Details"}
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 ml-2" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-2" />
              )}
            </Button>

            {isExpanded && (
              <div className="mt-4 space-y-3">
                {(question.timeComplexity || question.spaceComplexity) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {question.timeComplexity && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-blue-400" />
                        <span className="text-slate-400">Time:</span>
                        <code className="bg-slate-700 px-2 py-1 rounded text-blue-300">
                          {question.timeComplexity}
                        </code>
                      </div>
                    )}
                    {question.spaceComplexity && (
                      <div className="flex items-center gap-2 text-sm">
                        <Database className="h-4 w-4 text-purple-400" />
                        <span className="text-slate-400">Space:</span>
                        <code className="bg-slate-700 px-2 py-1 rounded text-purple-300">
                          {question.spaceComplexity}
                        </code>
                      </div>
                    )}
                  </div>
                )}

                {question.solution && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Solution:</h4>
                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-600">
                      <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono">
                        {question.solution}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        <div className="mt-4 pt-3 border-t border-slate-600">
          <p className="text-xs text-slate-500">
            Added on {question.createdAt.toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
