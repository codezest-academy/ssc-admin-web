import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getQuestionById, createQuestion, updateQuestion } from "@/api/questions";
import type { CreateQuestionInput, QuestionOption, ExamType } from "@/api/questions";
import { getSubjects } from "@/api/subjects";
import { getChaptersBySubject } from "@/api/chapters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

const EXAM_TYPES: ExamType[] = ["SSC_CGL", "SSC_CHSL", "SSC_MTS", "SSC_CPO", "SSC_GD"];
const OPTION_KEYS = ["A", "B", "C", "D"];

const initialOptions: QuestionOption[] = OPTION_KEYS.map(key => ({ key, text: "", imageUrl: null }));

export default function QuestionEditor() {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = Boolean(questionId);

  const [subjectId, setSubjectId] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM");
  const [isPYQ, setIsPYQ] = useState(false);
  const [pyqYear, setPyqYear] = useState<number | "">("");
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  
  const [questionText, setQuestionText] = useState("");
  const [questionImageUrl, setQuestionImageUrl] = useState("");
  
  const [options, setOptions] = useState<QuestionOption[]>(initialOptions);
  const [correctOption, setCorrectOption] = useState<string>("A");
  
  const [explanation, setExplanation] = useState("");
  const [explanationImageUrl, setExplanationImageUrl] = useState("");

  const { data: subjectsData } = useQuery({ queryKey: ["subjects"], queryFn: getSubjects });
  const subjects = Array.isArray(subjectsData) ? subjectsData : (subjectsData as any)?.data || [];

  const { data: chapters } = useQuery({
    queryKey: ["chapters", subjectId],
    queryFn: () => getChaptersBySubject(subjectId),
    enabled: Boolean(subjectId),
  });

  const { data: existingQuestion, isLoading: isFetching } = useQuery({
    queryKey: ["question", questionId],
    queryFn: () => getQuestionById(questionId!),
    enabled: isEditing,
  });

  useEffect(() => {
    if (existingQuestion) {
      setSubjectId(existingQuestion.subjectId);
      setChapterId(existingQuestion.chapterId);
      setDifficulty(existingQuestion.difficulty);
      setIsPYQ(existingQuestion.isPYQ);
      setPyqYear(existingQuestion.pyqYear || "");
      setExamTypes(existingQuestion.examTypes || []);
      setQuestionText(existingQuestion.questionText);
      setQuestionImageUrl(existingQuestion.questionImageUrl || "");
      setCorrectOption(existingQuestion.correctOption);
      setExplanation(existingQuestion.explanation || "");
      setExplanationImageUrl(existingQuestion.explanationImageUrl || "");
      
      if (existingQuestion.options?.length === 4) {
        setOptions(existingQuestion.options);
      }
    }
  }, [existingQuestion]);

  const mutation = useMutation({
    mutationFn: (data: CreateQuestionInput) => isEditing ? updateQuestion(questionId!, data) : createQuestion(data),
    onSuccess: () => {
      toast.success(isEditing ? "Question updated successfully" : "Question created successfully");
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      navigate("/questions");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to save question");
    }
  });

  const handleSave = () => {
    if (!subjectId || !chapterId || !questionText || !correctOption) {
      toast.error("Please fill all required fields");
      return;
    }
    
    // Validate options
    if (options.some(opt => !opt.text.trim() && !opt.imageUrl)) {
      toast.error("All 4 options must have text or an image");
      return;
    }

    const payload: CreateQuestionInput = {
      subjectId,
      chapterId,
      difficulty,
      isPYQ,
      pyqYear: isPYQ ? Number(pyqYear) || null : null,
      examTypes,
      questionText,
      questionImageUrl: questionImageUrl || null,
      options,
      correctOption,
      explanation: explanation || null,
      explanationImageUrl: explanationImageUrl || null,
      tags: [],
      language: "EN",
      isActive: true,
    };

    mutation.mutate(payload);
  };

  const toggleExamType = (type: ExamType) => {
    setExamTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const updateOption = (index: number, field: "text" | "imageUrl", value: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setOptions(newOptions);
  };

  if (isEditing && isFetching) {
    return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/questions")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{isEditing ? "Edit Question" : "New Question"}</h2>
            <p className="text-muted-foreground mt-1">Fill out the details below to configure the question.</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={mutation.isPending} className="gap-2">
          {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Question
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Editor Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Question Body */}
          <div className="bg-card border rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold">Question Details</h3>
            
            <div className="space-y-2">
              <Label>Question Text *</Label>
              <RichTextEditor value={questionText} onChange={setQuestionText} placeholder="Enter your question here. Use formatting for math/emphasis." />
            </div>

            <div className="space-y-2">
              <Label>Question Image URL (Optional)</Label>
              <Input value={questionImageUrl} onChange={e => setQuestionImageUrl(e.target.value)} placeholder="https://example.com/image.png" />
            </div>
          </div>

          {/* Options */}
          <div className="bg-card border rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Answer Options *</h3>
              <p className="text-sm text-muted-foreground">Select the correct option</p>
            </div>
            
            <RadioGroup value={correctOption} onValueChange={setCorrectOption} className="space-y-4">
              {options.map((opt, i) => (
                <div key={opt.key} className={`border rounded-lg p-4 flex gap-4 transition-colors ${correctOption === opt.key ? 'bg-success/5 border-success/30' : 'bg-muted/30'}`}>
                  <div className="pt-2">
                    <RadioGroupItem value={opt.key} id={`opt-${opt.key}`} className={correctOption === opt.key ? "text-success border-success" : ""} />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`opt-${opt.key}`} className="text-base font-bold min-w-8">Option {opt.key}</Label>
                      {correctOption === opt.key && <Badge variant="outline" className="bg-success text-success-foreground border-success">Correct Answer</Badge>}
                    </div>
                    <Textarea 
                      value={opt.text} 
                      onChange={e => updateOption(i, "text", e.target.value)} 
                      placeholder={`Enter text for Option ${opt.key}`}
                      className="min-h-[80px]"
                    />
                    <Input 
                      value={opt.imageUrl || ""} 
                      onChange={e => updateOption(i, "imageUrl", e.target.value)} 
                      placeholder="Image URL (optional)" 
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Explanation */}
          <div className="bg-card border rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold">Explanation (Optional)</h3>
            <p className="text-sm text-muted-foreground mb-4">Shown to students after they attempt the question.</p>
            
            <div className="space-y-2">
              <RichTextEditor value={explanation} onChange={setExplanation} placeholder="Explain why the correct answer is correct..." />
            </div>

            <div className="space-y-2">
              <Label>Explanation Image URL (Optional)</Label>
              <Input value={explanationImageUrl} onChange={e => setExplanationImageUrl(e.target.value)} placeholder="https://example.com/explain.png" />
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-card border rounded-xl p-6 space-y-6">
            <h3 className="text-lg font-semibold">Categorization</h3>
            
            <div className="space-y-2">
              <Label>Subject *</Label>
              <Select value={subjectId} onValueChange={setSubjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((sub: any) => (
                    <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Chapter *</Label>
              <Select value={chapterId} onValueChange={setChapterId} disabled={!subjectId}>
                <SelectTrigger>
                  <SelectValue placeholder={subjectId ? "Select Chapter" : "Select Subject first"} />
                </SelectTrigger>
                <SelectContent>
                  {chapters?.map((chap: any) => (
                    <SelectItem key={chap.id} value={chap.id}>{chap.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select value={difficulty} onValueChange={(val: any) => setDifficulty(val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EASY">Easy</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HARD">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-card border rounded-xl p-6 space-y-6">
            <h3 className="text-lg font-semibold">Tags & Target Exams</h3>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="isPYQ" checked={isPYQ} onCheckedChange={(val) => setIsPYQ(Boolean(val))} />
              <Label htmlFor="isPYQ">Is Previous Year Question (PYQ)?</Label>
            </div>

            {isPYQ && (
              <div className="space-y-2 pl-6">
                <Label>PYQ Year</Label>
                <Input 
                  type="number" 
                  value={pyqYear} 
                  onChange={e => setPyqYear(e.target.value ? parseInt(e.target.value) : "")} 
                  placeholder="e.g. 2023" 
                />
              </div>
            )}

            <div className="space-y-3 pt-4 border-t">
              <Label>Relevant Exams</Label>
              <div className="space-y-2">
                {EXAM_TYPES.map(exam => (
                  <div key={exam} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`exam-${exam}`} 
                      checked={examTypes.includes(exam)}
                      onCheckedChange={() => toggleExamType(exam)}
                    />
                    <Label htmlFor={`exam-${exam}`}>{exam.replace("_", " ")}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
