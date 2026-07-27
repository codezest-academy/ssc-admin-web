import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSubjectBySlug } from "@/api/subjects";
import { getChaptersBySubject, createChapter, updateChapter, deleteChapter } from "@/api/chapters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Loader2, MoreHorizontal, Pencil, Trash2, ArrowLeft, Layers } from "lucide-react";
import { toast } from "sonner";
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

export default function ChaptersPage() {
  const { subjectSlug } = useParams<{ subjectSlug: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newChapterName, setNewChapterName] = useState("");

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<any>(null);
  const [editChapterName, setEditChapterName] = useState("");
  const [editIsActive, setEditIsActive] = useState(true);

  const { data: subject, isLoading: isSubjectLoading } = useQuery({
    queryKey: ["subject", subjectSlug],
    queryFn: () => getSubjectBySlug(subjectSlug!),
    enabled: !!subjectSlug,
  });

  const { data: chapters, isLoading: isChaptersLoading } = useQuery({
    queryKey: ["chapters", subject?.id],
    queryFn: () => getChaptersBySubject(subject!.id),
    enabled: !!subject?.id,
  });

  const createMutation = useMutation({
    mutationFn: createChapter,
    onMutate: async (newChapter) => {
      await queryClient.cancelQueries({ queryKey: ["chapters", subject?.id] });
      const previousChapters = queryClient.getQueryData(["chapters", subject?.id]);
      queryClient.setQueryData(["chapters", subject?.id], (old: any) => [
        ...(old || []),
        { ...newChapter, id: "temp-id", isActive: true, _count: { lessons: 0 } },
      ]);
      return { previousChapters };
    },
    onError: (_err, _newChapter, context) => {
      queryClient.setQueryData(["chapters", subject?.id], context?.previousChapters);
      toast.error("Failed to create chapter");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters", subject?.id] });
    },
    onSuccess: () => {
      setNewChapterName("");
      setIsCreateModalOpen(false);
      toast.success("Chapter created successfully");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => updateChapter({ id, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters", subject?.id] });
      setIsEditModalOpen(false);
      toast.success("Chapter updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update chapter");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteChapter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters", subject?.id] });
      toast.success("Chapter deleted");
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapterName.trim() || !subject) return;
    createMutation.mutate({ subjectId: subject.id, name: newChapterName });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editChapterName.trim() || !editingChapter) return;
    updateMutation.mutate({ 
      id: editingChapter.id, 
      data: { name: editChapterName, isActive: editIsActive } 
    });
  };

  const openEditModal = (chapter: any) => {
    setEditingChapter(chapter);
    setEditChapterName(chapter.name);
    setEditIsActive(chapter.isActive);
    setIsEditModalOpen(true);
  };

  if (isSubjectLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Subject not found.
        <br />
        <Button variant="link" onClick={() => navigate("/subjects")}>Go back to Subjects</Button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/subjects")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{subject.name} Chapters</h1>
          <p className="text-muted-foreground mt-1">
            Manage chapters for {subject.name}.
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Chapter
        </Button>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Chapter Name</TableHead>
              <TableHead>Lessons</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isChaptersLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  Loading chapters...
                </TableCell>
              </TableRow>
            ) : chapters?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                  No chapters found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              chapters?.map((chapter) => (
                <TableRow key={chapter.id}>
                  <TableCell className="font-medium">{chapter.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {chapter._count?.lessons || 0} lessons
                  </TableCell>
                  <TableCell>
                    <Badge variant={chapter.isActive ? "default" : "secondary"} className={chapter.isActive ? "bg-success/10 text-success hover:bg-success/20 border-none" : ""}>
                      {chapter.isActive ? "Active" : "Draft"}
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
                          <Link to={`/chapters/${chapter.id}/lessons`} className="cursor-pointer">
                            <Layers className="mr-2 h-4 w-4" />
                            Manage Lessons
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditModal(chapter)} className="cursor-pointer">
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                          onClick={() => {
                            if (window.confirm(`Delete ${chapter.name}? This will delete all lessons inside it.`)) {
                              deleteMutation.mutate(chapter.id);
                            }
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Chapter
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
              <DialogTitle>Create New Chapter</DialogTitle>
              <DialogDescription>
                Add a new chapter to {subject.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Chapter Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Percentage & Ratios"
                  value={newChapterName}
                  onChange={(e) => setNewChapterName(e.target.value)}
                  disabled={createMutation.isPending}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || !newChapterName.trim()}>
                {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Create Chapter
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
              <DialogTitle>Edit Chapter</DialogTitle>
              <DialogDescription>
                Update the details for this chapter.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-name">Chapter Name</Label>
                <Input
                  id="edit-name"
                  value={editChapterName}
                  onChange={(e) => setEditChapterName(e.target.value)}
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
              <Button type="submit" disabled={updateMutation.isPending || !editChapterName.trim()}>
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
