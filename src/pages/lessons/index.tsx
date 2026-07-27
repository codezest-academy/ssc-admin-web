import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getChapterById } from "@/api/chapters";
import { getLessonsByChapter, createLesson, deleteLesson } from "@/api/lessons";
import type { LessonType } from "@/api/lessons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Loader2, MoreHorizontal, Pencil, Trash2, ArrowLeft, PlayCircle, FileText, File } from "lucide-react";
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

export default function LessonsPage() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);

  // Form state
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<LessonType>("VIDEO");
  const [newIsFree, setNewIsFree] = useState(false);

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
      queryClient.setQueryData(["lessons", chapterId], (old: any) => [
        ...(old || []),
        { ...newLesson, id: "temp-id", isActive: true, slug: "temp-slug" },
      ]);
      return { previousLessons };
    },
    onError: (_err, _newLesson, context) => {
      queryClient.setQueryData(["lessons", chapterId], context?.previousLessons);
      toast.error("Failed to create lesson");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons", chapterId] });
    },
    onSuccess: () => {
      setNewTitle("");
      setNewType("VIDEO");
      setNewIsFree(false);
      setIsCreating(false);
      toast.success("Lesson created successfully");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons", chapterId] });
      toast.success("Lesson deleted");
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !chapter) return;
    createMutation.mutate({
      chapterId: chapter.id,
      subjectId: chapter.subjectId,
      title: newTitle,
      type: newType,
      isFree: newIsFree,
    });
  };

  if (isChapterLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Chapter not found.
        <br />
        <Button variant="link" onClick={() => navigate(-1)}>Go back</Button>
      </div>
    );
  }

  const getLessonIcon = (type: LessonType) => {
    switch (type) {
      case "VIDEO": return <PlayCircle className="w-4 h-4 text-blue-500" />;
      case "ARTICLE": return <FileText className="w-4 h-4 text-orange-500" />;
      case "PDF": return <File className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{chapter.name} - Lessons</h1>
          <p className="text-muted-foreground mt-1">
            Manage the individual lessons within this chapter.
          </p>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)} className="gap-2">
          <Plus className="w-4 h-4" />
          {isCreating ? "Cancel" : "New Lesson"}
        </Button>
      </div>

      {isCreating && (
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Create New Lesson</h3>
          <form onSubmit={handleCreate} className="space-y-4 max-w-md">
            <div>
              <label className="text-sm font-medium mb-1 block">Title</label>
              <Input
                autoFocus
                placeholder="e.g. Introduction to Ratios"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                disabled={createMutation.isPending}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Lesson Type</label>
              <select
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

            <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
              <input
                type="checkbox"
                id="isFree"
                className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
                checked={newIsFree}
                onChange={(e) => setNewIsFree(e.target.checked)}
                disabled={createMutation.isPending}
              />
              <div className="flex-1">
                <label htmlFor="isFree" className="text-sm font-semibold cursor-pointer block">
                  Free Preview (Unlocked)
                </label>
                <p className="text-xs text-muted-foreground">
                  Allow FREE tier students to access this lesson.
                </p>
              </div>
            </div>

            <Button type="submit" disabled={createMutation.isPending || !newTitle.trim()} className="w-full">
              {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Lesson
            </Button>
          </form>
        </div>
      )}

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Type</TableHead>
              <TableHead>Lesson Title</TableHead>
              <TableHead>Access</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLessonsLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  Loading lessons...
                </TableCell>
              </TableRow>
            ) : lessons?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No lessons found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              lessons?.map((lesson) => (
                <TableRow key={lesson.id}>
                  <TableCell>
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted">
                      {getLessonIcon(lesson.type)}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {lesson.title}
                  </TableCell>
                  <TableCell>
                    {lesson.isFree ? (
                      <Badge variant="outline" className="text-success border-success/30 bg-success/10">Free Preview</Badge>
                    ) : (
                      <Badge variant="secondary">Premium</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={lesson.isActive ? "default" : "secondary"} className={lesson.isActive ? "bg-success/10 text-success hover:bg-success/20 border-none" : ""}>
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
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit Content
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
