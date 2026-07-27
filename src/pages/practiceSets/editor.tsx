import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSubjects } from "@/api/subjects";
import { getChaptersBySubject } from "@/api/chapters";
import { getPracticeSetById, createPracticeSet, updatePracticeSet } from "@/api/practiceSets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

export default function PracticeSetEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = Boolean(id && id !== "new");

  const [initialLoading, setInitialLoading] = useState(isEditing);

  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [scope, setScope] = useState<"subject" | "chapter">("subject");
  const [chapterId, setChapterId] = useState("none");
  const [order, setOrder] = useState<number>(0);
  const [isFree, setIsFree] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const { data: subjectsData } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });
  const subjects = Array.isArray(subjectsData) ? subjectsData : (subjectsData as any)?.data || [];

  const { data: chapters } = useQuery({
    queryKey: ["chapters", subjectId],
    queryFn: () => getChaptersBySubject(subjectId),
    enabled: Boolean(subjectId),
  });

  // Load existing data if editing
  useEffect(() => {
    if (isEditing && id) {
      getPracticeSetById(id)
        .then((data) => {
          setTitle(data.title);
          setSubjectId(data.subjectId);
          setScope(data.chapterId ? "chapter" : "subject");
          setChapterId(data.chapterId || "none");
          setOrder(data.order);
          setIsFree(data.isFree);
          setIsActive(data.isActive);
        })
        .catch(() => toast.error("Failed to load practice set"))
        .finally(() => setInitialLoading(false));
    }
  }, [id, isEditing]);

  const mutation = useMutation({
    mutationFn: (values: any) => {
      if (isEditing) {
        return updatePracticeSet(id!, values);
      }
      return createPracticeSet(values);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["practiceSets"] });
      toast.success(isEditing ? "Practice set updated" : "Practice set created");
      
      // If it's a new practice set, ask if they want to build it now
      if (!isEditing) {
        navigate(`/practice-sets/${data.id}`); // Go straight to builder
      } else {
        navigate("/practice-sets");
      }
    },
    onError: () => {
      toast.error("An error occurred");
    }
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
    if (scope === "chapter" && (!chapterId || chapterId === "none")) {
      toast.error("Chapter is required for Chapter Level scope");
      return;
    }

    const payload = {
      title,
      subjectId,
      chapterId: scope === "chapter" ? chapterId : null,
      order: Number(order),
      isFree,
      isActive,
    };
    mutation.mutate(payload);
  };

  if (initialLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/practice-sets")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
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
          <div className="space-y-2">
            <Label>Subject</Label>
            <Select onValueChange={setSubjectId} value={subjectId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((sub: any) => (
                  <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Test Scope</Label>
            <Select onValueChange={(val: "subject" | "chapter") => {
              setScope(val);
              if (val === 'subject') setChapterId('none');
            }} value={scope}>
              <SelectTrigger>
                <SelectValue placeholder="Select scope" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="subject">Subject Level (Full Test)</SelectItem>
                <SelectItem value="chapter">Chapter Level (Topic Test)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {scope === "chapter" && (
          <div className="space-y-2">
            <Label>Chapter</Label>
            <Select onValueChange={setChapterId} value={chapterId} disabled={!subjectId}>
              <SelectTrigger>
                <SelectValue placeholder={subjectId ? "Select a chapter" : "Select a subject first"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none" disabled>Select a chapter...</SelectItem>
                {chapters?.map((chap: any) => (
                  <SelectItem key={chap.id} value={chap.id}>{chap.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Display Order</Label>
            <Input 
              type="number" 
              value={order} 
              onChange={(e) => setOrder(Number(e.target.value))} 
            />
            <p className="text-[0.8rem] text-muted-foreground">Order in lists (0 is first)</p>
          </div>

          <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm h-[88px]">
            <Checkbox
              id="isFree"
              checked={isFree}
              onCheckedChange={(val) => setIsFree(Boolean(val))}
            />
            <div className="space-y-1 leading-none">
              <Label htmlFor="isFree">Free Set</Label>
              <p className="text-[0.8rem] text-muted-foreground">
                Available to non-pro users
              </p>
            </div>
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
          <Button type="button" variant="outline" onClick={() => navigate("/practice-sets")}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={mutation.isPending} className="gap-2">
            {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            <Save className="w-4 h-4" />
            {isEditing ? "Save Changes" : "Create & Build"}
          </Button>
        </div>
      </div>
    </div>
  );
}
