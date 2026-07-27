import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getPracticeSets, deletePracticeSet } from "@/api/practiceSets";
import { getSubjects } from "@/api/subjects";
import { getChaptersBySubject } from "@/api/chapters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Trash2, Edit, Search, FilterX, LayoutList } from "lucide-react";

export default function PracticeSetsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [subjectId, setSubjectId] = useState<string>("all");
  const [chapterId, setChapterId] = useState<string>("all");

  const { data: subjectsData } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });
  const subjects = Array.isArray(subjectsData) ? subjectsData : (subjectsData as any)?.data || [];

  const { data: chapters } = useQuery({
    queryKey: ["chapters", subjectId],
    queryFn: () => getChaptersBySubject(subjectId),
    enabled: subjectId !== "all",
  });

  const { data: setsData, isLoading } = useQuery({
    queryKey: ["practiceSets", page, search, subjectId, chapterId],
    queryFn: () => getPracticeSets({
      page,
      limit: 20,
      search: search || undefined,
      subjectId: subjectId === "all" ? undefined : subjectId,
      chapterId: chapterId === "all" ? undefined : chapterId,
    }),
  });
  const practiceSets = setsData?.data || [];
  const meta = setsData?.meta;

  const deleteMutation = useMutation({
    mutationFn: deletePracticeSet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["practiceSets"] });
      toast.success("Practice Set deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete practice set");
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Practice Sets</h2>
          <p className="text-muted-foreground mt-1">Group questions into practice sets for students.</p>
        </div>
        <Button onClick={() => navigate("/practice-sets/new")} className="gap-2">
          <Plus className="w-4 h-4" /> New Practice Set
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 rounded-xl border">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search practice sets..." 
            className="pl-9 h-10 w-full"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        
        <Select value={subjectId} onValueChange={(val) => { setSubjectId(val); setChapterId("all"); setPage(1); }}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="All Subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map((sub: any) => (
              <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          value={chapterId} 
          onValueChange={(val) => { setChapterId(val); setPage(1); }} 
          disabled={subjectId === "all"}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="All Chapters" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Chapters</SelectItem>
            {chapters?.map((chap: any) => (
              <SelectItem key={chap.id} value={chap.id}>{chap.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button variant="ghost" size="icon" onClick={() => { setSearch(""); setSubjectId("all"); setChapterId("all"); setPage(1); }} title="Clear Filters">
          <FilterX className="w-4 h-4" />
        </Button>
      </div>

      <div className="border rounded-xl bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[40%]">Title & Scope</TableHead>
              <TableHead>Questions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Loading practice sets...</TableCell>
              </TableRow>
            ) : practiceSets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-muted-foreground">No practice sets found.</p>
                    <Button variant="link" onClick={() => navigate("/practice-sets/new")}>Create your first set</Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              practiceSets.map((set: any) => (
                <TableRow key={set.id}>
                  <TableCell>
                    <p className="text-sm font-medium">{set.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[10px]">
                        {set.chapterId ? 'Chapter Level' : 'Subject Level'}
                      </Badge>
                      {set.isFree && <Badge variant="secondary" className="text-[10px] bg-green-500/10 text-green-600">Free</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{set.questionCount}</span> questions
                  </TableCell>
                  <TableCell>
                    <Badge variant={set.isActive ? "default" : "secondary"}>
                      {set.isActive ? "Active" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => navigate(`/practice-sets/${set.id}`)} className="gap-2">
                        <LayoutList className="w-4 h-4" /> Build
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/practice-sets/${set.id}/edit`)}>
                        <Edit className="w-4 h-4 text-slate-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => {
                        if (confirm("Delete this practice set?")) deleteMutation.mutate(set.id);
                      }}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="p-4 border-t flex items-center justify-between bg-muted/20">
            <p className="text-sm text-muted-foreground">
              Showing page {meta.page} of {meta.totalPages} ({meta.total} total)
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={meta.page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
              <Button variant="outline" size="sm" disabled={meta.page >= meta.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
