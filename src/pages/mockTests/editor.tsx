import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMockTestById,
  createMockTest,
  updateMockTest,
} from "@/api/mockTests";
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
import { ErrorState } from "@/components/ui/error-state";

export default function MockTestEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = Boolean(id && id !== "new");

  const [title, setTitle] = useState("");
  const [examType, setExamType] = useState("SSC_CGL");
  const [totalQuestions, setTotalQuestions] = useState<number>(100);
  const [totalMarks, setTotalMarks] = useState<number>(200);
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [markingCorrect, setMarkingCorrect] = useState<number>(2);
  const [markingIncorrect, setMarkingIncorrect] = useState<number>(0.5);
  const [markingSkipped, setMarkingSkipped] = useState<number>(0);
  const [accessTier, setAccessTier] = useState<"FREE" | "PRO" | "EXCLUSIVE">(
    "FREE",
  );
  const [isActive, setIsActive] = useState(true);

  const { data: mockTest, isLoading: initialLoading , isError, refetch } = useQuery({
    queryKey: ["mockTest", id],
    queryFn: () => getMockTestById(id!),
    enabled: isEditing,
  });

  // Sync loaded data to local state
  useEffect(() => {
    if (mockTest) {
      setTitle(mockTest.title);
      setExamType(mockTest.examType);
      setTotalQuestions(mockTest.totalQuestions);
      setTotalMarks(mockTest.totalMarks);
      setDurationMinutes(mockTest.durationMinutes);
      setMarkingCorrect(mockTest.markingCorrect);
      setMarkingIncorrect(mockTest.markingIncorrect);
      setMarkingSkipped(mockTest.markingSkipped);
      setAccessTier(mockTest.accessTier);
      setIsActive(mockTest.isActive);
    }
  }, [mockTest]);

  const mutation = useMutation({
    mutationFn: (values: Record<string, unknown>) => {
      if (isEditing) {
        return updateMockTest(id!, values);
      }
      return createMockTest(values);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["mockTests"] });
      toast.success(isEditing ? "Mock Test updated" : "Mock Test created");

      // If it's a new mock test, ask if they want to build sections now
      if (!isEditing) {
        navigate(`/mock-tests/${data.id}`); // Go straight to builder
      } else {
        navigate("/mock-tests");
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

    const payload = {
      title,
      examType,
      totalQuestions: Number(totalQuestions),
      totalMarks: Number(totalMarks),
      durationMinutes: Number(durationMinutes),
      markingCorrect: Number(markingCorrect),
      markingIncorrect: Number(markingIncorrect),
      markingSkipped: Number(markingSkipped),
      accessTier,
      isActive,
    };
    mutation.mutate(payload);
  };

  if (isError) {
    return <ErrorState title="Failed to load data" onRetry={() => refetch()} />;
  }

  if (initialLoading) {
    return <EditorSkeleton />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link
            to="/mock-tests"
            className="hover:text-primary transition-colors"
          >
            Mock Tests
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">
            {isEditing ? "Edit Mock Test" : "Create Mock Test"}
          </span>
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {isEditing ? "Edit Mock Test" : "Create Mock Test"}
          </h2>
          <p className="text-muted-foreground mt-1">
            Configure the blueprint and marking scheme.
          </p>
        </div>
      </div>

      <div className="space-y-8 bg-card p-6 rounded-xl border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              placeholder="e.g. SSC CGL Tier 1 Mock 1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Exam Type</Label>
            <Select onValueChange={setExamType} value={examType}>
              <SelectTrigger>
                <SelectValue placeholder="Select Exam Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SSC_CGL">SSC CGL</SelectItem>
                <SelectItem value="SSC_CHSL">SSC CHSL</SelectItem>
                <SelectItem value="SSC_MTS">SSC MTS</SelectItem>
                <SelectItem value="SSC_CPO">SSC CPO</SelectItem>
                <SelectItem value="SSC_GD">SSC GD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold border-b pb-2">Target Blueprint</h3>
          <p className="text-sm text-muted-foreground">
            The builder will validate sections against these targets.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Duration (Minutes)</Label>
              <Input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Total Questions</Label>
              <Input
                type="number"
                value={totalQuestions}
                onChange={(e) => setTotalQuestions(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Total Marks</Label>
              <Input
                type="number"
                value={totalMarks}
                onChange={(e) => setTotalMarks(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold border-b pb-2">
            Marking Scheme (Default)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-success">
                Marks per Correct Answer (+)
              </Label>
              <Input
                type="number"
                step="0.1"
                value={markingCorrect}
                onChange={(e) => setMarkingCorrect(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-destructive">
                Marks per Incorrect Answer (-)
              </Label>
              <Input
                type="number"
                step="0.1"
                value={markingIncorrect}
                onChange={(e) => setMarkingIncorrect(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Enter as a positive number (e.g. 0.5)
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Marks if Skipped</Label>
              <Input
                type="number"
                step="0.1"
                value={markingSkipped}
                onChange={(e) => setMarkingSkipped(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
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
              Define who can access this mock test.
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

        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/mock-tests")}
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
            {isEditing ? "Save Changes" : "Create & Open Builder"}
          </Button>
        </div>
      </div>
    </div>
  );
}
