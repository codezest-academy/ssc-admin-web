import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { examsApi } from "@/api/exams";
import type { SyllabusNode } from "@/api/exams";
import { getSubjects } from "@/api/subjects";
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
import { Plus, Loader2, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/ui/loading-skeletons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function SyllabusBuilder() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    subjectId: "",
    weightage: "1.0",
    order: "0",
  });

  const { data: exam, isLoading: isLoadingExam } = useQuery({
    queryKey: ["exam", id],
    queryFn: () => examsApi.getById(id!),
    enabled: !!id,
  });

  const { data: syllabus, isLoading: isLoadingSyllabus } = useQuery({
    queryKey: ["syllabus", id],
    queryFn: () => examsApi.getSyllabus(id!),
    enabled: !!id,
  });

  const { data: subjects } = useQuery({
    queryKey: ["subjects"],
    queryFn: () => getSubjects(),
  });

  const addNodeMutation = useMutation({
    mutationFn: (data: Partial<SyllabusNode>) => examsApi.addSyllabusNode(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["syllabus", id] });
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      toast.success("Syllabus node added");
      setIsDialogOpen(false);
      setFormData({ subjectId: "", weightage: "1.0", order: "0" });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add node");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (nodeId: string) => examsApi.deleteSyllabusNode(id!, nodeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["syllabus", id] });
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      toast.success("Node removed");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to remove node");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subjectId) {
      toast.error("Subject is required");
      return;
    }
    
    addNodeMutation.mutate({
      subjectId: formData.subjectId,
      weightage: parseFloat(formData.weightage),
      order: parseInt(formData.order),
    });
  };

  const handleDelete = (nodeId: string) => {
    if (window.confirm("Remove this subject from syllabus?")) {
      deleteMutation.mutate(nodeId);
    }
  };

  if (isLoadingExam) return <div className="p-8">Loading exam details...</div>;
  if (!exam) return <div className="p-8">Exam not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/exams">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{exam.name}</h1>
            <Badge variant="outline">{exam.examYear}</Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            Manage the syllabus for this target exam.
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Subject
        </Button>
      </div>

      <div className="rounded-xl border bg-card">
        {isLoadingSyllabus ? (
          <TableSkeleton />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Weightage</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {syllabus?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No subjects in this syllabus yet. Add one!
                  </TableCell>
                </TableRow>
              ) : (
                syllabus?.map((node: SyllabusNode) => (
                  <TableRow key={node.id}>
                    <TableCell>{node.order}</TableCell>
                    <TableCell className="font-medium">
                      {node.subject?.name}
                    </TableCell>
                    <TableCell>{node.weightage}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(node.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
              <DialogTitle>Add Subject to Syllabus</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Subject</Label>
                <Select
                  value={formData.subjectId}
                  onValueChange={(val) => setFormData({ ...formData, subjectId: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects?.map((s: any) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="weightage">Weightage (Multiplier)</Label>
                  <Input
                    id="weightage"
                    type="number"
                    step="0.1"
                    value={formData.weightage}
                    onChange={(e) =>
                      setFormData({ ...formData, weightage: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="order">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: e.target.value })
                    }
                  />
                </div>
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
              <Button type="submit" disabled={addNodeMutation.isPending}>
                {addNodeMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Add Subject
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
