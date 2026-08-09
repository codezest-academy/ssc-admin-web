import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getChapterById } from "@/api/chapters";
import type { Lesson } from "@/api/lessons";
import {
  getLessonsByChapter,
  createLesson,
  updateLesson,
  deleteLesson,
  reorderLessons,
} from "@/api/lessons";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import type { LessonType } from "@/api/lessons";
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
  Plus,
  Loader2,
  MoreHorizontal,
  Pencil,
  Trash2,
  ChevronRight,
  PlayCircle,
  FileText,
  FileBadge,
} from "lucide-react";
import { Link } from "react-router-dom";
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
import { TableSkeleton } from "@/components/ui/loading-skeletons";
import { GripVertical } from "lucide-react";

export default function LessonsPage() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<LessonType>("VIDEO");
  const [newAccessTier, setNewAccessTier] = useState<
    "FREE" | "PRO" | "EXCLUSIVE"
  >("FREE");

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editType, setEditType] = useState<LessonType>("VIDEO");
  const [editAccessTier, setEditAccessTier] = useState<
    "FREE" | "PRO" | "EXCLUSIVE"
  >("FREE");
  const [editIsActive, setEditIsActive] = useState(true);

  const { data: chapter, isLoading: isChapterLoading } = useQuery({
    queryKey: ["chapter", chapterId],
    queryFn: () => getChapterById(chapterId!),
    enabled: !!chapterId,
  });

  const { data: lessons, isLoading: isLessonsLoading } = useQuery({
    queryKey: ["lessons", chapterId],
    queryFn: () => getLessonsByChapter(chapterId!),
    enabled: !!chapterId,
  });

  const createMutation = useMutation({
    mutationFn: createLesson,
    onMutate: async (newLesson) => {
      await queryClient.cancelQueries({ queryKey: ["lessons", chapterId] });
      const previousLessons = queryClient.getQueryData(["lessons", chapterId]);
      queryClient.setQueryData(
        ["lessons", chapterId],
        (old: Lesson[] | undefined) => [
          ...(old || []),
          { ...newLesson, id: "temp-id", isActive: true, slug: "temp-slug" },
        ],
      );
      return { previousLessons };
    },
    onError: (_err, _newLesson, context) => {
      queryClient.setQueryData(
        ["lessons", chapterId],
        context?.previousLessons,
      );
      toast.error("Failed to create lesson");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons", chapterId] });
    },
    onSuccess: () => {
      setNewTitle("");
      setNewType("VIDEO");
      setNewAccessTier("FREE");
      setIsCreateModalOpen(false);
      toast.success("Lesson created successfully");
    },
  });

  const updateMutation = useMutation<
    unknown,
    unknown,
    { id: string; data: Partial<Lesson> },
    unknown
  >({
    mutationFn: ({ id, data }: { id: string; data: Partial<Lesson> }) =>
      updateLesson({ id, ...data }),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["lessons", chapterId] });
      const previousLessons = queryClient.getQueryData(["lessons", chapterId]);
      queryClient.setQueryData(
        ["lessons", chapterId],
        (old: Lesson[] | undefined) =>
          old?.map((lesson) =>
            lesson.id === id ? { ...lesson, ...data } : lesson,
          ),
      );
      return { previousLessons };
    },
    onError: (error: unknown, _variables: unknown, context: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      queryClient.setQueryData(
        ["lessons", chapterId],
        (context as { previousLessons: unknown })?.previousLessons,
      );
      toast.error(err.response?.data?.message || "Failed to update lesson");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons", chapterId] });
    },
    onSuccess: () => {
      setIsEditModalOpen(false);
      toast.success("Lesson updated successfully");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLesson,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["lessons", chapterId] });
      const previousLessons = queryClient.getQueryData(["lessons", chapterId]);
      queryClient.setQueryData(
        ["lessons", chapterId],
        (old: Lesson[] | undefined) =>
          old?.filter((lesson) => lesson.id !== id),
      );
      return { previousLessons };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(
        ["lessons", chapterId],
        context?.previousLessons,
      );
      toast.error("Failed to delete lesson");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons", chapterId] });
    },
    onSuccess: () => {
      toast.success("Lesson deleted");
    },
  });

  const reorderMutation = useMutation({
    mutationFn: reorderLessons,
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: ["lessons", chapterId] });
      const previous = queryClient.getQueryData<Lesson[]>(["lessons", chapterId]);
      if (previous) {
        const newLessons = [...previous];
        updates.forEach(update => {
          const l = newLessons.find(c => c.id === update.id);
          if (l) l.order = update.order;
        });
        newLessons.sort((a, b) => a.order - b.order);
        queryClient.setQueryData(["lessons", chapterId], newLessons);
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["lessons", chapterId], context?.previous);
      toast.error("Failed to reorder lessons");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons", chapterId] });
    },
  });

  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !lessons) return;
    const startIndex = result.source.index;
    const endIndex = result.destination.index;
    if (startIndex === endIndex) return;

    const items = Array.from(lessons);
    const [reorderedItem] = items.splice(startIndex, 1);
    items.splice(endIndex, 0, reorderedItem);

    // Update orders locally for optimistic UI
    const updates = items.map((item, index) => ({
      id: item.id,
      order: index,
    }));

    reorderMutation.mutate(updates);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !chapter) return;
    createMutation.mutate({
      chapterId: chapter.id,
      subjectId: chapter.subjectId,
      title: newTitle,
      type: newType,
      accessTier: newAccessTier,
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim() || !editingLesson) return;
    updateMutation.mutate({
      id: editingLesson.id,
      data: {
        title: editTitle,
        type: editType,
        accessTier: editAccessTier,
        isActive: editIsActive,
      },
    });
  };

  const openEditModal = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setEditTitle(lesson.title);
    setEditType(lesson.type);
    setEditAccessTier(lesson.accessTier);
    setEditIsActive(lesson.isActive);
    setIsEditModalOpen(true);
  };

  if (isChapterLoading) {
    return <TableSkeleton />;
  }

  if (!chapter) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Chapter not found.
        <br />
        <Button variant="link" onClick={() => navigate(-1)}>
          Go back
        </Button>
      </div>
    );
  }

  const getLessonIcon = (type: LessonType) => {
    switch (type) {
      case "VIDEO":
        return <PlayCircle className="w-4 h-4 text-primary" />;
      case "ARTICLE":
        return <FileText className="w-4 h-4 text-warning" />;
      case "PDF":
        return <FileBadge className="w-4 h-4 text-destructive" />;
    }
  };

  return (
    <div className="space-y-6 max-w-full w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link
              to={`/subjects/${chapter.subjectId}/chapters`}
              className="hover:text-primary transition-colors"
            >
              Chapters
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">Lessons</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            {chapter.name} - Lessons
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage the individual lessons within this chapter.
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Lesson
        </Button>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Lesson Title</TableHead>
              <TableHead>Access</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="lessons" direction="vertical">
              {(provided) => (
                <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                  {isLessonsLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-32 text-center text-muted-foreground"
                      >
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                        Loading lessons...
                      </TableCell>
                    </TableRow>
                  ) : lessons?.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-32 text-center text-muted-foreground"
                      >
                        No lessons found. Create one to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    lessons?.map((lesson, index) => (
                      <Draggable key={lesson.id} draggableId={lesson.id} index={index}>
                        {(provided, snapshot) => (
                          <TableRow
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={snapshot.isDragging ? "bg-accent opacity-90" : ""}
                            style={{ ...provided.draggableProps.style, display: snapshot.isDragging ? 'table' : '' }}
                          >
                            <TableCell className="w-[50px] cursor-grab active:cursor-grabbing" {...provided.dragHandleProps}>
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted">
                                {getLessonIcon(lesson.type)}
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{lesson.title}</TableCell>
                            <TableCell>
                              {lesson.accessTier === "FREE" ? (
                                <Badge
                                  variant="outline"
                                  className="text-success border-success/30 bg-success/10"
                                >
                                  Free Preview
                                </Badge>
                              ) : lesson.accessTier === "PRO" ? (
                                <Badge variant="secondary">Pro</Badge>
                              ) : (
                                <Badge
                                  variant="secondary"
                                  className="bg-primary/20 text-primary"
                                >
                                  Exclusive
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={lesson.isActive ? "default" : "secondary"}
                                className={
                                  lesson.isActive
                                    ? "bg-success/10 text-success hover:bg-success/20 border-none"
                                    : ""
                                }
                              >
                                {lesson.isActive ? "Active" : "Draft"}
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
                                  <DropdownMenuItem
                                    onClick={() => openEditModal(lesson)}
                                    className="cursor-pointer"
                                  >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit Details
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                                    onClick={() => {
                                      if (window.confirm(`Delete ${lesson.title}?`)) {
                                        deleteMutation.mutate(lesson.id);
                                      }
                                    }}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Lesson
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </TableBody>
              )}
            </Droppable>
          </DragDropContext>
        </Table>
      </div>

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle>Create New Lesson</DialogTitle>
              <DialogDescription>
                Add a new lesson to {chapter.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="title">Lesson Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Introduction to Ratios"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  disabled={createMutation.isPending}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="type">Lesson Type</Label>
                <select
                  id="type"
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as LessonType)}
                  disabled={createMutation.isPending}
                >
                  <option value="VIDEO">Video</option>
                  <option value="ARTICLE">Article (Text)</option>
                  <option value="PDF">PDF Document</option>
                </select>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <Label htmlFor="accessTier">Access Tier</Label>
                <select
                  id="accessTier"
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={newAccessTier}
                  onChange={(e) =>
                    setNewAccessTier(
                      e.target.value as "FREE" | "PRO" | "EXCLUSIVE",
                    )
                  }
                  disabled={createMutation.isPending}
                >
                  <option value="FREE">FREE</option>
                  <option value="PRO">PRO</option>
                  <option value="EXCLUSIVE">EXCLUSIVE</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || !newTitle.trim()}
              >
                {createMutation.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Create Lesson
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
              <DialogTitle>Edit Lesson</DialogTitle>
              <DialogDescription>
                Update the details for this lesson.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-title">Lesson Title</Label>
                <Input
                  id="edit-title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  disabled={updateMutation.isPending}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-type">Lesson Type</Label>
                <select
                  id="edit-type"
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={editType}
                  onChange={(e) => setEditType(e.target.value as LessonType)}
                  disabled={updateMutation.isPending}
                >
                  <option value="VIDEO">Video</option>
                  <option value="ARTICLE">Article (Text)</option>
                  <option value="PDF">PDF Document</option>
                </select>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <Label htmlFor="edit-accessTier">Access Tier</Label>
                <select
                  id="edit-accessTier"
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={editAccessTier}
                  onChange={(e) =>
                    setEditAccessTier(
                      e.target.value as "FREE" | "PRO" | "EXCLUSIVE",
                    )
                  }
                  disabled={updateMutation.isPending}
                >
                  <option value="FREE">FREE</option>
                  <option value="PRO">PRO</option>
                  <option value="EXCLUSIVE">EXCLUSIVE</option>
                </select>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="edit-active"
                  checked={editIsActive}
                  onCheckedChange={(val) => setEditIsActive(Boolean(val))}
                  disabled={updateMutation.isPending}
                />
                <Label htmlFor="edit-active" className="cursor-pointer">
                  Active
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateMutation.isPending || !editTitle.trim()}
              >
                {updateMutation.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
