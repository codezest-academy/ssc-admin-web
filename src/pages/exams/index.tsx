import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { examsApi } from "@/api/exams";
import type { TargetExam } from "@/api/exams";
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
import { Plus, Loader2, Pencil, Trash2, LayoutList } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { TableSkeleton } from "@/components/ui/loading-skeletons";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function ExamsPage() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<TargetExam | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    examYear: "",
    description: "",
    isActive: true,
  });

  const { data: exams, isLoading } = useQuery({
    queryKey: ["exams"],
    queryFn: examsApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<TargetExam>) => examsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      toast.success("Exam created successfully");
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create exam");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TargetExam> }) =>
      examsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      toast.success("Exam updated successfully");
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update exam");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: examsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      toast.success("Exam deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete exam");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      examYear: formData.examYear ? parseInt(formData.examYear) : undefined,
    };
    
    if (editingExam) {
      updateMutation.mutate({ id: editingExam.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (exam: TargetExam) => {
    setEditingExam(exam);
    setFormData({
      name: exam.name,
      examYear: exam.examYear?.toString() || "",
      description: exam.description || "",
      isActive: exam.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Target Exams</h1>
          <p className="text-muted-foreground mt-2">
            Manage official target exams and their syllabuses.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingExam(null);
            setFormData({ name: "", examYear: "", description: "", isActive: true });
            setIsDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Exam
        </Button>
      </div>

      <div className="rounded-xl border bg-card">
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam Name</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Syllabus Nodes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No target exams found. Create one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                exams?.map((exam: TargetExam) => (
                  <TableRow key={exam.id}>
                    <TableCell className="font-medium">{exam.name}</TableCell>
                    <TableCell>{exam.examYear || "-"}</TableCell>
                    <TableCell>
                      {exam.isActive ? (
                        <Badge className="bg-success/10 text-success hover:bg-success/20">Active</Badge>
                      ) : (
                        <Badge className="bg-warning/10 text-warning hover:bg-warning/20">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>{exam._count?.syllabusNodes || 0} nodes</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/exams/${exam.id}/syllabus`}>
                          <Button variant="outline" size="sm">
                            <LayoutList className="h-4 w-4 mr-2" />
                            Syllabus
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(exam)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(exam.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingExam ? "Edit Exam" : "Add Target Exam"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Exam Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. SSC CGL Tier 1"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="examYear">Exam Year (Optional)</Label>
                <Input
                  id="examYear"
                  type="number"
                  value={formData.examYear}
                  onChange={(e) =>
                    setFormData({ ...formData, examYear: e.target.value })
                  }
                  placeholder="e.g. 2024"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief description"
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <Label htmlFor="isActive" className="cursor-pointer">Active Status</Label>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingExam ? "Save Changes" : "Create Exam"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
