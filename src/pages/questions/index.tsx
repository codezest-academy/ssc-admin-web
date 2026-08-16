import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  getQuestions,
  deleteQuestion,
  bulkImportQuestions,
} from "@/api/questions";
import type { CreateQuestionInput } from "@/api/questions";
import { getSubjects } from "@/api/subjects";
import { getChaptersBySubject } from "@/api/chapters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Pencil,
  FileUp,
  SlidersHorizontal,
  Search,
  Download,
} from "lucide-react";
import { TableSkeleton } from "@/components/ui/loading-skeletons";
import Papa from "papaparse";
import { downloadCSVTemplate } from "@/utils/csv";

export default function QuestionsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [subjectId, setSubjectId] = useState<string>("all");
  const [chapterId, setChapterId] = useState<string>("all");

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  
  const [importSubjectId, setImportSubjectId] = useState<string>("");
  const [importChapterId, setImportChapterId] = useState<string>("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedQuestions, setParsedQuestions] = useState<CreateQuestionInput[]>([]);

  const { data: subjectsData } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });
  const subjects = Array.isArray(subjectsData)
    ? subjectsData
    : (subjectsData as unknown as { data: { id: string; name: string }[] })
        ?.data || [];

  const { data: chapters } = useQuery({
    queryKey: ["chapters", subjectId],
    queryFn: () => getChaptersBySubject(subjectId),
    enabled: subjectId !== "all",
  });

  const { data: importChapters } = useQuery({
    queryKey: ["chapters", importSubjectId],
    queryFn: () => getChaptersBySubject(importSubjectId),
    enabled: !!importSubjectId,
  });

  const { data: questionsData, isLoading } = useQuery({
    queryKey: ["questions", page, search, subjectId, chapterId],
    queryFn: () =>
      getQuestions({
        page,
        limit: 20,
        search: search || undefined,
        subjectId: subjectId === "all" ? undefined : subjectId,
        chapterId: chapterId === "all" ? undefined : chapterId,
      }),
  });
  const questions = questionsData?.data || [];
  const meta = questionsData?.meta;

  const deleteMutation = useMutation({
    mutationFn: deleteQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      toast.success("Question deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete question");
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFile(file);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const questions: CreateQuestionInput[] = results.data.map((row: any) => {
            return {
              subjectId: importSubjectId, // placeholders, re-mapped on submit
              chapterId: importChapterId,
              questionText: row["Question Text"] || "",
              options: [
                { key: "A", text: row["Option A"] || "", formatType: "TEXT" },
                { key: "B", text: row["Option B"] || "", formatType: "TEXT" },
                { key: "C", text: row["Option C"] || "", formatType: "TEXT" },
                { key: "D", text: row["Option D"] || "", formatType: "TEXT" },
              ],
              correctOption: (row["Correct Option"]?.toUpperCase() || "A") as "A"|"B"|"C"|"D",
              explanation: row["Explanation"] || "",
              difficulty: (row["Difficulty"]?.toUpperCase() || "MEDIUM") as "EASY"|"MEDIUM"|"HARD",
              isPYQ: row["Is PYQ"]?.toUpperCase() === "TRUE",
              pyqYear: row["PYQ Year"] ? parseInt(row["PYQ Year"]) : undefined,
              tags: row["Tags (comma separated)"] ? row["Tags (comma separated)"].split(",").map((t: string) => t.trim()) : [],
              examTypes: ["SSC_CGL"],
              language: "EN",
              isActive: true,
            };
          });
          setParsedQuestions(questions);
        } catch {
          toast.error("Failed to parse CSV format.");
        }
      },
    });
  };

  const handleBulkImport = async () => {
    if (!importSubjectId || !importChapterId) {
      toast.error("Please select a subject and chapter first.");
      return;
    }
    if (parsedQuestions.length === 0) {
      toast.error("No valid questions found in CSV.");
      return;
    }
    try {
      setIsImporting(true);
      const finalQuestions = parsedQuestions.map(q => ({
        ...q,
        subjectId: importSubjectId,
        chapterId: importChapterId
      }));
      const res = await bulkImportQuestions(finalQuestions);
      toast.success(`Successfully imported ${res.count} questions`);
      setIsImportModalOpen(false);
      setCsvFile(null);
      setParsedQuestions([]);
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed to load questions");
    } finally {
      setIsImporting(false);
    }
  };

  // Helper to safely display truncated HTML content as plain text for the table
  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || "";
    return text.length > 60 ? text.substring(0, 60) + "..." : text;
  };

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <div className="space-y-6 max-w-full w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Question Bank</h2>
          <p className="text-muted-foreground mt-1">
            Manage and curate questions for exams, sets, and tests.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <FileUp className="w-4 h-4" /> Bulk Import
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Bulk Import Questions (CSV)</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg border border-dashed">
                  <div>
                    <p className="text-sm font-medium">Download CSV Template</p>
                    <p className="text-xs text-muted-foreground">Use this template to format your questions correctly.</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={downloadCSVTemplate} className="gap-2">
                    <Download className="w-4 h-4" /> Template
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <Select value={importSubjectId} onValueChange={setImportSubjectId}>
                      <SelectTrigger><SelectValue placeholder="Select Subject" /></SelectTrigger>
                      <SelectContent>
                        {subjects.map((sub: { id: string; name: string }) => (
                          <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Chapter</label>
                    <Select value={importChapterId} onValueChange={setImportChapterId} disabled={!importSubjectId}>
                      <SelectTrigger><SelectValue placeholder="Select Chapter" /></SelectTrigger>
                      <SelectContent>
                        {importChapters?.map((chap: { id: string; name: string }) => (
                          <SelectItem key={chap.id} value={chap.id}>{chap.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-sm font-medium">Upload CSV</label>
                  <Input type="file" accept=".csv" onChange={handleFileUpload} />
                  {csvFile && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Parsed {parsedQuestions.length} questions ready for import.
                    </p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsImportModalOpen(false);
                    setCsvFile(null);
                    setParsedQuestions([]);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleBulkImport}
                  disabled={isImporting || parsedQuestions.length === 0 || !importSubjectId || !importChapterId}
                >
                  {isImporting ? "Importing..." : `Import ${parsedQuestions.length} Questions`}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button onClick={() => navigate("/questions/new")} className="gap-2">
            <Plus className="w-4 h-4" /> New Question
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 rounded-xl border">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            className="pl-9 h-10 w-full"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <Select
          value={subjectId}
          onValueChange={(val) => {
            setSubjectId(val);
            setChapterId("all");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="All Subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map((sub: { id: string; name: string }) => (
              <SelectItem key={sub.id} value={sub.id}>
                {sub.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={chapterId}
          onValueChange={(val) => {
            setChapterId(val);
            setPage(1);
          }}
          disabled={subjectId === "all"}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="All Chapters" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Chapters</SelectItem>
            {chapters?.map((chap: { id: string; name: string }) => (
              <SelectItem key={chap.id} value={chap.id}>
                {chap.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setSearch("");
            setSubjectId("all");
            setChapterId("all");
            setPage(1);
          }}
          title="Clear Filters"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </Button>
      </div>

      <div className="border rounded-xl bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[50%]">Question</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Tags/Meta</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-muted-foreground">
                      No questions found in this bank.
                    </p>
                    <Button
                      variant="link"
                      onClick={() => navigate("/questions/new")}
                    >
                      Add your first question
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              questions.map((q: import("@/api/questions").Question) => (
                <TableRow key={q.id}>
                  <TableCell>
                    <p className="text-sm font-medium line-clamp-2">
                      {stripHtml(q.questionText)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      ID: {q.id}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        q.difficulty === "HARD"
                          ? "bg-destructive/10 text-destructive-text-on-tint border-none"
                          : q.difficulty === "MEDIUM"
                            ? "bg-warning/10 text-warning-text-on-tint border-none"
                            : "bg-success/10 text-success border-none"
                      }
                    >
                      {q.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {q.isPYQ && (
                        <Badge
                          variant="outline"
                          className="bg-primary/10 text-primary border-primary/20"
                        >
                          PYQ {q.pyqYear}
                        </Badge>
                      )}
                      {q.examTypes?.slice(0, 2).map((et: string) => (
                        <Badge
                          key={et}
                          variant="outline"
                          className="text-[10px]"
                        >
                          {et}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/questions/${q.id}`)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit Question</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => {
                              if (confirm("Delete this question forever?"))
                                deleteMutation.mutate(q.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete Question</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        {meta && meta.totalPages > 1 && (
          <div className="p-4 border-t flex items-center justify-between bg-muted/20">
            <p className="text-sm text-muted-foreground">
              Showing page {meta.page} of {meta.totalPages} ({meta.total} total)
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={meta.page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={meta.page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
