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
import { QuestionRenderer } from "@/components/ui/question-renderer";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2, FileText } from "lucide-react";

const EXAM_TYPES: ExamType[] = ["SSC_CGL", "SSC_CHSL", "SSC_MTS", "SSC_CPO", "SSC_GD"];
const OPTION_KEYS = ["A", "B", "C", "D"];

const initialOptions: QuestionOption[] = OPTION_KEYS.map(key => ({ key, text: "", imageUrl: null, formatType: "TEXT" }));

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
        setOptions(existingQuestion.options.map(opt => ({ ...opt, formatType: opt.formatType || "TEXT" })));
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

  const updateOption = (index: number, field: "text" | "imageUrl" | "formatType", value: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setOptions(newOptions);
  };

  if (isEditing && isFetching) {
    return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-8 pb-12 max-w-[1400px] mx-auto">
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

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Main Editor Section (Left 60%) */}
        <div className="w-full lg:w-[60%] space-y-8">
          
          {/* Categorization & Settings Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold">Categorization</h3>
              <div className="space-y-2">
                <Label>Subject *</Label>
                <Select value={subjectId} onValueChange={setSubjectId}>
                  <SelectTrigger><SelectValue placeholder="Select Subject" /></SelectTrigger>
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
                  <SelectTrigger><SelectValue placeholder={subjectId ? "Select Chapter" : "Select Subject first"} /></SelectTrigger>
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
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EASY">Easy</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HARD">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-card border rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold">Tags & Target Exams</h3>
              <div className="flex items-center space-x-2">
                <Checkbox id="isPYQ" checked={isPYQ} onCheckedChange={(val) => setIsPYQ(Boolean(val))} />
                <Label htmlFor="isPYQ">Is Previous Year Question (PYQ)?</Label>
              </div>
              {isPYQ && (
                <div className="space-y-2 pl-6">
                  <Label>PYQ Year</Label>
                  <Input type="number" value={pyqYear} onChange={e => setPyqYear(e.target.value ? parseInt(e.target.value) : "")} placeholder="e.g. 2023" />
                </div>
              )}
              <div className="space-y-3 pt-4 border-t">
                <Label>Relevant Exams</Label>
                <div className="flex flex-wrap gap-2">
                  {EXAM_TYPES.map(exam => (
                    <div key={exam} className="flex items-center space-x-1">
                      <Checkbox id={`exam-${exam}`} checked={examTypes.includes(exam)} onCheckedChange={() => toggleExamType(exam)} />
                      <Label htmlFor={`exam-${exam}`} className="text-xs">{exam.replace("SSC_", "")}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

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
            
            <RadioGroup value={correctOption} onValueChange={setCorrectOption} className="space-y-6">
              {options.map((opt, i) => (
                <div key={opt.key} className={`border rounded-lg p-4 transition-colors ${correctOption === opt.key ? 'bg-success/5 border-success/30' : 'bg-muted/30'}`}>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value={opt.key} id={`opt-${opt.key}`} className={correctOption === opt.key ? "text-success border-success" : ""} />
                      <Label htmlFor={`opt-${opt.key}`} className="text-base font-bold">Option {opt.key}</Label>
                      {correctOption === opt.key && <Badge variant="outline" className="bg-success text-success-foreground border-success">Correct Answer</Badge>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Select value={opt.formatType || "TEXT"} onValueChange={(val: any) => updateOption(i, "formatType", val)}>
                        <SelectTrigger className="w-[140px] h-8 text-xs bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TEXT">Plain Text</SelectItem>
                          <SelectItem value="RICH_TEXT">Rich Text / Math</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4 pl-7">
                    {(!opt.formatType || opt.formatType === "TEXT") ? (
                      <Textarea 
                        value={opt.text} 
                        onChange={e => updateOption(i, "text", e.target.value)} 
                        placeholder={`Enter text for Option ${opt.key}`}
                        className="min-h-[80px]"
                      />
                    ) : (
                      <div className="bg-background">
                        <RichTextEditor 
                          value={opt.text} 
                          onChange={(val) => updateOption(i, "text", val)} 
                          placeholder={`Enter rich text or KaTeX for Option ${opt.key}`}
                        />
                      </div>
                    )}
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

        {/* Live Preview Panel (Right 40% Sticky) */}
        <div className="w-full lg:w-[40%] sticky top-8">
          <div className="bg-card border rounded-xl p-0 overflow-hidden shadow-sm">
            <div className="bg-muted/50 border-b px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Live Preview
              </h3>
              <Badge variant="secondary">Student View</Badge>
            </div>
            <div className="p-6 space-y-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
              
              {/* Question */}
              <div className="space-y-4">
                {questionText ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <QuestionRenderer content={questionText} />
                  </div>
                ) : (
                  <p className="text-muted-foreground italic text-sm">Question text will appear here...</p>
                )}
                {questionImageUrl && (
                  <img src={questionImageUrl} alt="Question" className="max-w-full rounded-md border" />
                )}
              </div>

              {/* Options */}
              <div className="space-y-3">
                {options.map(opt => (
                  <div key={opt.key} className={`border rounded-lg p-3 flex gap-3 ${correctOption === opt.key ? 'border-primary ring-1 ring-primary/20' : ''}`}>
                    <div className="flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs font-medium bg-muted/50">
                      {opt.key}
                    </div>
                    <div className="flex-1 space-y-2 min-w-0">
                      {opt.text ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <QuestionRenderer content={opt.text} />
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic text-xs">Empty option</span>
                      )}
                      {opt.imageUrl && (
                        <img src={opt.imageUrl} alt={`Option ${opt.key}`} className="max-w-full h-auto rounded border" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Explanation Preview */}
              {(explanation || explanationImageUrl) && (
                <div className="mt-8 p-4 bg-success/10 border border-success/20 rounded-lg space-y-3">
                  <h4 className="font-semibold text-success flex items-center gap-2 text-sm">
                    Explanation
                  </h4>
                  {explanation && (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <QuestionRenderer content={explanation} />
                    </div>
                  )}
                  {explanationImageUrl && (
                    <img src={explanationImageUrl} alt="Explanation" className="max-w-full rounded-md border mt-2" />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
