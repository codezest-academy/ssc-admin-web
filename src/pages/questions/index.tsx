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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Pencil,
  FileUp,
  Search,
  SlidersHorizontal,
} from "lucide-react";

export default function QuestionsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [subjectId, setSubjectId] = useState<string>("all");
  const [chapterId, setChapterId] = useState<string>("all");

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJson, setImportJson] = useState("");
  const [isImporting, setIsImporting] = useState(false);

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

  const handleBulkImport = async () => {
    try {
      setIsImporting(true);
      const parsed: CreateQuestionInput[] = JSON.parse(importJson);
      if (!Array.isArray(parsed)) {
        throw new Error("JSON must be an array of questions");
      }
      const res = await bulkImportQuestions(parsed);
      toast.success(`Successfully imported ${res.count} questions`);
      setIsImportModalOpen(false);
      setImportJson("");
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

  return (
    <div className="space-y-6">
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
                <DialogTitle>Bulk Import Questions</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Paste a JSON array of questions matching the
                  `CreateQuestionInput` schema.
                </p>
                <Textarea
                  value={importJson}
                  onChange={(e) => setImportJson(e.target.value)}
                  placeholder={
                    '[ { "subjectId": "...", "questionText": "..." } ]'
                  }
                  className="h-64 font-mono text-sm"
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsImportModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleBulkImport}
                  disabled={isImporting || !importJson.trim()}
                >
                  {isImporting ? "Importing..." : "Run Import"}
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
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-muted-foreground"
                >
                  Loading questions...
                </TableCell>
              </TableRow>
            ) : questions.length === 0 ? (
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
                      variant={
                        q.difficulty === "HARD"
                          ? "destructive"
                          : q.difficulty === "MEDIUM"
                            ? "default"
                            : "secondary"
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
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/questions/${q.id}`)}
                      >
                        <Pencil className="w-4 h-4 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm("Delete this question forever?"))
                            deleteMutation.mutate(q.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
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
