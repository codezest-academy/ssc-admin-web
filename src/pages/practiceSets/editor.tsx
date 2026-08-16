import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSubjects } from "@/api/subjects";
import { getChaptersBySubject } from "@/api/chapters";
import { getLessonsByChapter } from "@/api/lessons";
import {
  getPracticeSetById,
  createPracticeSet,
  updatePracticeSet,
} from "@/api/practiceSets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ChevronRight, Save, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { EditorSkeleton } from "@/components/ui/loading-skeletons";

export default function PracticeSetEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = Boolean(id && id !== "new");

  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [scope, setScope] = useState<"subject" | "chapter" | "lesson">("subject");
  const [chapterId, setChapterId] = useState("none");
  const [lessonId, setLessonId] = useState("none");
  const [order, setOrder] = useState<number>(0);
  const [accessTier, setAccessTier] = useState<"FREE" | "PRO" | "EXCLUSIVE">(
    "FREE",
  );
  const [isActive, setIsActive] = useState(true);

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
    enabled: Boolean(subjectId),
  });

  
  const { data: lessons } = useQuery({
    queryKey: ["lessons", chapterId],
    queryFn: () => getLessonsByChapter(chapterId),
    enabled: Boolean(chapterId && chapterId !== "none"),
  });

  const { data: practiceSet, isLoading: initialLoading } = useQuery({
    queryKey: ["practiceSet", id],
    queryFn: () => getPracticeSetById(id!),
    enabled: isEditing,
  });

  // Sync loaded data to local state
  useEffect(() => {
    if (practiceSet) {
      setTitle(practiceSet.title);
      setSubjectId(practiceSet.subjectId);
      setScope(practiceSet.lessonId ? "lesson" : practiceSet.chapterId ? "chapter" : "subject");
      setChapterId(practiceSet.chapterId || "none");
      setLessonId(practiceSet.lessonId || "none");
      setOrder(practiceSet.order);
      setAccessTier(practiceSet.accessTier);
      setIsActive(practiceSet.isActive);
    }
  }, [practiceSet]);

  const mutation = useMutation({
    mutationFn: (values: {
      title: string;
      subjectId: string;
      [key: string]: unknown;
    }) => {
      if (isEditing) {
        return updatePracticeSet(id!, values);
      }
      return createPracticeSet(values);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["practiceSets"] });
      toast.success(
        isEditing ? "Practice set updated" : "Practice set created",
      );

      // If it's a new practice set, ask if they want to build it now
      if (!isEditing) {
        navigate(`/practice-sets/${data.id}`); // Go straight to builder
      } else {
        navigate("/practice-sets");
      }
    },
    onError: () => {
      toast.error("An error occurred");
    },
  });

  const handleSave = () => {
    if (!title || title.length < 2) {
      toast.error("Title must be at least 2 characters");
      return;
    }
    if (!subjectId) {
      toast.error("Subject is required");
      return;
    }
    if (scope === "lesson" && (!lessonId || lessonId === "none")) {
      toast.error("Lesson is required for Lesson Level scope");
      return;
    }
    if ((scope === "chapter" || scope === "lesson") && (!chapterId || chapterId === "none")) {
      toast.error("Chapter is required for Chapter Level scope");
      return;
    }

    const payload = {
      title,
      subjectId,
      chapterId: (scope === "chapter" || scope === "lesson") ? chapterId : null,
      lessonId: scope === "lesson" ? lessonId : null,
      order: Number(order),
      accessTier,
      isActive,
    };
    mutation.mutate(payload);
  };

  if (initialLoading) {
    return <EditorSkeleton />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link
            to="/practice-sets"
            className="hover:text-primary transition-colors"
          >
            Practice Sets
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">
            {isEditing ? "Edit Practice Set" : "Create Practice Set"}
          </span>
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {isEditing ? "Edit Practice Set" : "Create Practice Set"}
          </h2>
          <p className="text-muted-foreground mt-1">
            Configure the basic details and scope of the test.
          </p>
        </div>
      </div>

      <div className="space-y-6 bg-card p-6 rounded-xl border">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            placeholder="e.g. Algebra Weekly Test 1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
          <div className="space-y-2">
            <Label>Subject</Label>
            <Select onValueChange={setSubjectId} value={subjectId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((sub: { id: string; name: string }) => (
                  <SelectItem key={sub.id} value={sub.id}>
                    {sub.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Test Scope</Label>
            <Select
              onValueChange={(val: "subject" | "chapter" | "lesson") => {
                setScope(val);
                if (val === "subject") setChapterId("none");
              }}
              value={scope}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select scope" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="subject">
                  Subject Level (Full Test)
                </SelectItem>
                <SelectItem value="chapter">
                  Chapter Level (Topic Test)
                </SelectItem>
                <SelectItem value="lesson">
                  Lesson Level (Knowledge Check)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {["chapter", "lesson"].includes(scope) && (
          <div className="space-y-2">
            <Label>Chapter</Label>
            <Select
              onValueChange={setChapterId}
              value={chapterId}
              disabled={!subjectId}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    subjectId ? "Select a chapter" : "Select a subject first"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none" disabled>
                  Select a chapter...
                </SelectItem>
                {chapters?.map((chap: { id: string; name: string }) => (
                  <SelectItem key={chap.id} value={chap.id}>
                    {chap.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {scope === "lesson" && (
              <div className="space-y-2 mt-4">
                <Label>Lesson</Label>
                <Select
                  value={lessonId}
                  onValueChange={setLessonId}
                  disabled={!chapters || !chapterId || chapterId === "none" || !lessons}
                >
                  <SelectTrigger className="bg-card">
                    <SelectValue placeholder="Select a lesson" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select a lesson...</SelectItem>
                    {lessons?.map((lesson: any) => (
                      <SelectItem key={lesson.id} value={lesson.id}>
                        {lesson.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(!lessons || lessons.length === 0) && chapterId !== "none" && (
                  <p className="text-sm text-muted-foreground mt-1">
                    No lessons found in this chapter.
                  </p>
                )}
              </div>
            )}

          </div>
        )}
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Display Order</Label>
            <Input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
            />
            <p className="text-[0.8rem] text-muted-foreground">
              Order in lists (0 is first)
            </p>
          </div>

          <div className="flex flex-col items-start space-y-2 rounded-md border p-4 shadow-sm min-h-[88px]">
            <div className="w-full">
              <Label>Access Tier</Label>
              <Select
                onValueChange={(val: string) =>
                  setAccessTier(val as "FREE" | "PRO" | "EXCLUSIVE")
                }
                value={accessTier}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FREE">FREE</SelectItem>
                  <SelectItem value="PRO">PRO</SelectItem>
                  <SelectItem value="EXCLUSIVE">EXCLUSIVE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-[0.8rem] text-muted-foreground">
              Define who can access this practice set.
            </p>
          </div>

          <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm h-[88px]">
            <Checkbox
              id="isActive"
              checked={isActive}
              onCheckedChange={(val) => setIsActive(Boolean(val))}
            />
            <div className="space-y-1 leading-none">
              <Label htmlFor="isActive">Active Status</Label>
              <p className="text-[0.8rem] text-muted-foreground">
                Visible on the platform
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/practice-sets")}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={mutation.isPending}
            className="gap-2"
          >
            {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            <Save className="w-4 h-4" />
            {isEditing ? "Save Changes" : "Create & Build"}
          </Button>
        </div>
      </div>
    </div>
  );
}
