import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSubjects, createSubject, updateSubject, deleteSubject } from "@/api/subjects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Loader2, MoreHorizontal, Pencil, Trash2, LayoutList } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function SubjectsPage() {
  const queryClient = useQueryClient();
  
  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any>(null);
  const [editSubjectName, setEditSubjectName] = useState("");
  const [editIsActive, setEditIsActive] = useState(true);

  const { data: subjects, isLoading } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });

  const createMutation = useMutation({
    mutationFn: createSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      setNewSubjectName("");
      setIsCreateModalOpen(false);
      toast.success("Subject created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create subject");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => updateSubject({ id, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      setIsEditModalOpen(false);
      toast.success("Subject updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update subject");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      toast.success("Subject deleted");
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    createMutation.mutate({ name: newSubjectName });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSubjectName.trim() || !editingSubject) return;
    updateMutation.mutate({ 
      id: editingSubject.id, 
      data: { name: editSubjectName, isActive: editIsActive } 
    });
  };

  const openEditModal = (subject: any) => {
    setEditingSubject(subject);
    setEditSubjectName(subject.name);
    setEditIsActive(subject.isActive);
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subjects</h1>
          <p className="text-muted-foreground mt-2">
            Manage the high-level subjects in the curriculum.
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Subject
        </Button>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Subject Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  Loading subjects...
                </TableCell>
              </TableRow>
            ) : subjects?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                  No subjects found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              subjects?.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell className="font-medium">{subject.name}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-sm">
                    {subject.slug}
                  </TableCell>
                  <TableCell>
                    <Badge variant={subject.isActive ? "default" : "secondary"} className={subject.isActive ? "bg-success/10 text-success hover:bg-success/20 border-none" : ""}>
                      {subject.isActive ? "Active" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to={`/subjects/${subject.slug}/chapters`} className="cursor-pointer">
                            <LayoutList className="mr-2 h-4 w-4" />
                            Manage Chapters
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditModal(subject)} className="cursor-pointer">
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                          onClick={() => {
                            if (window.confirm(`Delete ${subject.name}? This will delete all chapters and lessons inside it.`)) {
                              deleteMutation.mutate(subject.id);
                            }
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Subject
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle>Create New Subject</DialogTitle>
              <DialogDescription>
                Add a new subject to the curriculum. The slug will be generated automatically.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Subject Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Quantitative Aptitude"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  disabled={createMutation.isPending}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || !newSubjectName.trim()}>
                {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Create Subject
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Subject</DialogTitle>
              <DialogDescription>
                Update the details for this subject.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-name">Subject Name</Label>
                <Input
                  id="edit-name"
                  value={editSubjectName}
                  onChange={(e) => setEditSubjectName(e.target.value)}
                  disabled={updateMutation.isPending}
                />
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="edit-active"
                  checked={editIsActive}
                  onCheckedChange={(val) => setEditIsActive(Boolean(val))}
                  disabled={updateMutation.isPending}
                />
                <Label htmlFor="edit-active" className="cursor-pointer">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending || !editSubjectName.trim()}>
                {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
