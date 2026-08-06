import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getMockTests, deleteMockTest } from "@/api/mockTests";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, Search, Timer } from "lucide-react";

export default function MockTestsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page] = useState(1);
  const [search, setSearch] = useState("");

  const { data: testsData, isLoading } = useQuery({
    queryKey: ["mockTests", page, search],
    queryFn: getMockTests,
    // Add simple frontend filtering for search if API doesn't support it directly yet
    select: (tests: any[]) => {
      if (!search) return tests;
      return tests.filter((t: any) => t.title.toLowerCase().includes(search.toLowerCase()));
    }
  });
  
  const mockTests = testsData || [];

  const deleteMutation = useMutation({
    mutationFn: deleteMockTest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mockTests"] });
      toast.success("Mock Test deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete mock test");
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Mock Tests</h2>
          <p className="text-muted-foreground mt-1">Build full-length exam simulations with sections and timers.</p>
        </div>
        <Button onClick={() => navigate("/mock-tests/new")} className="gap-2">
          <Plus className="w-4 h-4" /> New Mock Test
        </Button>
      </div>

      <div className="flex gap-4 items-center bg-card p-4 rounded-xl border">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search mock tests..." 
            className="pl-9 h-10 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-xl bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[40%]">Title & Exam</TableHead>
              <TableHead>Duration & Marks</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Loading mock tests...</TableCell>
              </TableRow>
            ) : mockTests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-muted-foreground">No mock tests found.</p>
                    <Button variant="link" onClick={() => navigate("/mock-tests/new")}>Create your first test</Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              mockTests.map((test: any) => (
                <TableRow key={test.id}>
                  <TableCell>
                    <p className="text-sm font-medium">{test.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[10px]">
                        {test.examType.replace("_", " ")}
                      </Badge>
                      {test.accessTier === "FREE" && <Badge variant="secondary" className="text-[10px] bg-success/10 text-success">Free</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <span className="font-medium">{test.durationMinutes}</span> mins
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {test.totalQuestions} Qs • {test.totalMarks} Marks
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={test.isActive ? "default" : "secondary"}>
                      {test.isActive ? "Active" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => navigate(`/mock-tests/${test.id}`)} className="gap-2">
                        <Timer className="w-4 h-4" /> Builder
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/mock-tests/${test.id}/edit`)}>
                        <Pencil className="w-4 h-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => {
                        if (confirm("Delete this mock test?")) deleteMutation.mutate(test.id);
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
      </div>
    </div>
  );
}
