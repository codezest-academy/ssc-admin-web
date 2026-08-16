import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import {
  getMockTestById,
  assignQuestionsToSection,
  createSection,
  deleteSection,
} from "@/api/mockTests";
import { getQuestions } from "@/api/questions";
import { getSubjects } from "@/api/subjects";
import type { Question } from "@/api/questions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { BuilderSkeleton } from "@/components/ui/loading-skeletons";
import {
  ChevronRight,
  Save,
  Loader2,
  GripVertical,
  Search,
  Plus,
  Trash2,
  FolderEdit,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export default function MockTestBuilder() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  // Fetch Mock Test & Subjects
  const { data: mockTest, isLoading: isTestLoading } = useQuery({
    queryKey: ["mockTest", id],
    queryFn: () => getMockTestById(id!),
    enabled: Boolean(id),
  });

  const { data: subjectsData } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });
  const subjects = Array.isArray(subjectsData)
    ? subjectsData
    : (subjectsData as unknown as { data: { id: string; name: string }[] })
        ?.data || [];

  // Local State
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [assignedQuestions, setAssignedQuestions] = useState<Question[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [search, setSearch] = useState("");

  // Section Form State
  const [isCreatingSection, setIsCreatingSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [newSectionSubject, setNewSectionSubject] = useState("");
  const [newSectionCount, setNewSectionCount] = useState<number>(25);
  const [newSectionMarks, setNewSectionMarks] = useState<number>(50);

  const sections = useMemo(() => {
    if (!mockTest?.sections) return [];
    return [...mockTest.sections].sort((a, b) => a.order - b.order);
  }, [mockTest]);

  const activeSection = useMemo(() => {
    return sections.find((s) => s.id === activeSectionId) || null;
  }, [sections, activeSectionId]);

  // Set active section on load if none selected
  useEffect(() => {
    if (sections.length > 0 && !activeSectionId) {
      setActiveSectionId(sections[0].id);
    }
  }, [sections, activeSectionId]);

  // Load questions when active section changes
  useEffect(() => {
    if (activeSection?.questions) {
      const sorted = [...activeSection.questions].sort(
        (a, b) => a.order - b.order,
      );
      setAssignedQuestions(sorted.map((q) => q.question));
      setHasUnsavedChanges(false);
    } else {
      setAssignedQuestions([]);
      setHasUnsavedChanges(false);
    }
  }, [activeSection]);

  // Query Question Bank based on active section's subject
  const { data: questionsData, isLoading: isBankLoading } = useQuery({
    queryKey: ["questions", 1, search, activeSection?.subjectId],
    queryFn: () =>
      getQuestions({
        page: 1,
        limit: 100,
        search: search || undefined,
        subjectId: activeSection?.subjectId,
      }),
    enabled: Boolean(activeSection?.subjectId),
  });

  const bankQuestions = questionsData?.data || [];
  const availableQuestions = bankQuestions.filter(
    (bq) => !assignedQuestions.some((aq) => aq.id === bq.id),
  );

  // Mutations
  const createSectionMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      createSection(id!, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["mockTest", id] });
      setActiveSectionId(data.id);
      setIsCreatingSection(false);
      toast.success("Section created");
    },
  });

  const deleteSectionMutation = useMutation({
    mutationFn: deleteSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mockTest", id] });
      setActiveSectionId(null);
      toast.success("Section deleted");
    },
  });

  const saveQuestionsMutation = useMutation({
    mutationFn: () =>
      assignQuestionsToSection(
        activeSectionId!,
        assignedQuestions.map((q) => q.id),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mockTest", id] });
      setHasUnsavedChanges(false);
      toast.success("Section questions saved");
    },
  });

  // Derived Validation
  const currentTotalQuestions = sections.reduce(
    (acc, s) => acc + (s.questions?.length || 0),
    0,
  );
  const currentTotalMarks = sections.reduce((acc, s) => {
    // Assuming marks are calculated per question based on the test's marking scheme, or section maxMarks?
    // Let's use the schema's section.maxMarks for the blueprint, but actual marks = questions * correctMarks
    // Actually, best practice: Calculate based on assigned questions * test.markingCorrect
    return acc + (s.questions?.length || 0) * (mockTest?.markingCorrect || 2);
  }, 0);

  const isValid = currentTotalQuestions === mockTest?.totalQuestions;

  // Handlers
  const handleCreateSection = () => {
    if (!newSectionName || !newSectionSubject) {
      toast.error("Name and Subject are required");
      return;
    }
    createSectionMutation.mutate({
      name: newSectionName,
      subjectId: newSectionSubject,
      questionCount: newSectionCount,
      maxMarks: newSectionMarks,
      order: sections.length,
    });
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.droppableId === "set"
    ) {
      const newAssigned = Array.from(assignedQuestions);
      const [movedItem] = newAssigned.splice(source.index, 1);
      newAssigned.splice(destination.index, 0, movedItem);

      setAssignedQuestions(newAssigned);
      setHasUnsavedChanges(true);
    } else if (
      source.droppableId === "bank" &&
      destination.droppableId === "set"
    ) {
      const sourceItem = availableQuestions[source.index];
      const newAssigned = Array.from(assignedQuestions);
      newAssigned.splice(destination.index, 0, sourceItem);

      setAssignedQuestions(newAssigned);
      setHasUnsavedChanges(true);
    }
  };

  const addToSet = (question: Question) => {
    setAssignedQuestions((prev) => [...prev, question]);
    setHasUnsavedChanges(true);
  };

  const removeFromSet = (index: number) => {
    setAssignedQuestions((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
    setHasUnsavedChanges(true);
  };

  if (isTestLoading) {
    return <BuilderSkeleton />;
  }

  if (!mockTest) return <div>Test not found.</div>;

  return (
    <div className="flex flex-col min-h-full bg-background">
      {/* Structural Page Header */}
      <div className="bg-card border-b px-6 py-6 sm:px-8 shrink-0">
        <div className="max-w-full flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Link
                to="/mock-tests"
                className="hover:text-primary transition-colors"
              >
                Mock Tests
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground font-medium">Builder</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Builder: {mockTest.title}
              </h2>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-sm text-muted-foreground">
                  Blueprint: {mockTest.totalQuestions} Qs • {mockTest.totalMarks}{" "}
                  Marks
                </p>

                <Badge
                  variant={isValid ? "outline" : "secondary"}
                  className={`text-xs ${isValid ? "text-success border-success" : "text-warning bg-warning/10"}`}
                >
                  {isValid ? (
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 mr-1" />
                  )}
                  Current: {currentTotalQuestions} Qs • {currentTotalMarks} Marks
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 sm:p-8 flex flex-col min-h-0">
        <div className="max-w-full w-full flex flex-1 gap-6 min-h-0">
        {/* Left Sidebar: Sections */}
        <div className="w-64 flex flex-col border rounded-xl bg-card overflow-hidden shrink-0">
          <div className="p-4 border-b bg-muted/20 flex justify-between items-center">
            <h3 className="font-semibold">Sections</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsCreatingSection(true)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {isCreatingSection && (
              <div className="p-3 border rounded-lg bg-muted/30 space-y-3">
                <Input
                  placeholder="Section Name"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  className="h-8 text-sm"
                />
                <Select
                  value={newSectionSubject}
                  onValueChange={setNewSectionSubject}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s: { id: string; name: string }) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Qs"
                    className="h-8 text-sm w-1/2"
                    value={newSectionCount}
                    onChange={(e) => setNewSectionCount(Number(e.target.value))}
                    title="Target Questions"
                  />
                  <Input
                    type="number"
                    placeholder="Marks"
                    className="h-8 text-sm w-1/2"
                    value={newSectionMarks}
                    onChange={(e) => setNewSectionMarks(Number(e.target.value))}
                    title="Target Marks"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setIsCreatingSection(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="h-7 text-xs"
                    onClick={handleCreateSection}
                    disabled={createSectionMutation.isPending}
                  >
                    Add
                  </Button>
                </div>
              </div>
            )}

            {sections.map((section) => (
              <div
                key={section.id}
                onClick={() => {
                  if (hasUnsavedChanges) {
                    if (!confirm("Discard unsaved changes in current section?"))
                      return;
                  }
                  setActiveSectionId(section.id);
                }}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  activeSectionId === section.id
                    ? "bg-primary/10 border-primary shadow-sm"
                    : "bg-background hover:bg-muted/50 hover:border-border"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="font-medium text-sm">{section.name}</div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 text-muted-foreground hover:text-destructive shrink-0 -mt-1 -mr-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (
                        confirm(
                          "Delete this section and unassign all its questions?",
                        )
                      ) {
                        deleteSectionMutation.mutate(section.id);
                      }
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                  <span>
                    {section.questions?.length || 0} / {section.questionCount}{" "}
                    Qs
                  </span>
                  <span>{section.maxMarks} Marks</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Workspace: Drag & Drop (Only visible if section is selected) */}
        {!activeSection ? (
          <div className="flex-1 border rounded-xl bg-card flex flex-col items-center justify-center text-muted-foreground">
            <FolderEdit className="w-12 h-12 mb-4 opacity-20" />
            <p>Select or create a section to assign questions.</p>
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex-1 flex gap-4 min-w-0">
              {/* Left Pane: Question Bank */}
              <div className="w-1/2 flex flex-col border rounded-xl bg-card overflow-hidden">
                <div className="p-4 border-b bg-muted/20">
                  <h3 className="font-semibold mb-3">Question Bank</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search available questions..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9 bg-background"
                    />
                  </div>
                </div>

                <Droppable droppableId="bank" isDropDisabled={true}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex-1 overflow-y-auto p-4 space-y-3"
                    >
                      {isBankLoading ? (
                        <div className="space-y-3">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="p-4 bg-background border rounded-lg shadow-sm">
                               <div className="h-4 w-3/4 bg-muted animate-pulse rounded-md mb-2"></div>
                               <div className="h-3 w-1/4 bg-muted animate-pulse rounded-md"></div>
                            </div>
                          ))}
                        </div>
                      ) : availableQuestions.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                          No questions found in this subject.
                        </div>
                      ) : (
                        availableQuestions.map((q, index) => (
                          <Draggable
                            key={`bank-${q.id}`}
                            draggableId={`bank-${q.id}`}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`p-3 bg-background border rounded-lg shadow-sm group hover:border-primary/50 transition-colors ${
                                  snapshot.isDragging
                                    ? "shadow-md ring-2 ring-primary/20 z-50"
                                    : ""
                                }`}
                              >
                                <div className="flex justify-between items-start gap-4">
                                  <div className="flex-1">
                                    <p
                                      className="text-sm line-clamp-2"
                                      dangerouslySetInnerHTML={{
                                        __html: q.questionText,
                                      }}
                                    ></p>
                                    <div className="flex gap-2 mt-2">
                                      <Badge
                                        variant="secondary"
                                        className="text-[10px]"
                                      >
                                        {q.difficulty}
                                      </Badge>
                                      {q.isPYQ && (
                                        <Badge
                                          variant="outline"
                                          className="text-[10px]"
                                        >
                                          PYQ
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="opacity-0 group-hover:opacity-100 h-8"
                                    onClick={() => addToSet(q)}
                                  >
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>

              {/* Right Pane: Assigned Questions */}
              <div className="w-1/2 flex flex-col border rounded-xl bg-card border-primary/20 overflow-hidden relative">
                <div className="p-4 border-b bg-primary/5 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-primary">
                      {activeSection.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Target: {activeSection.questionCount} Qs •{" "}
                      {activeSection.maxMarks} Marks
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        assignedQuestions.length === activeSection.questionCount
                          ? "default"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {assignedQuestions.length} / {activeSection.questionCount}
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => saveQuestionsMutation.mutate()}
                      disabled={
                        !hasUnsavedChanges || saveQuestionsMutation.isPending
                      }
                      className="h-8"
                    >
                      {saveQuestionsMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save
                    </Button>
                  </div>
                </div>

                <Droppable droppableId="set">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 overflow-y-auto p-4 space-y-3 transition-colors ${
                        snapshot.isDraggingOver ? "bg-primary/5" : ""
                      }`}
                    >
                      {assignedQuestions.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl p-8">
                          <Plus className="w-8 h-8 mb-2 opacity-50" />
                          <p>
                            Drag questions here to add to {activeSection.name}
                          </p>
                        </div>
                      ) : (
                        assignedQuestions.map((q, index) => (
                          <Draggable
                            key={`set-${q.id}`}
                            draggableId={`set-${q.id}`}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`p-3 bg-background border rounded-lg shadow-sm group flex items-start gap-3 ${
                                  snapshot.isDragging
                                    ? "shadow-lg ring-2 ring-primary z-50"
                                    : "hover:border-primary/50"
                                }`}
                              >
                                <div
                                  {...provided.dragHandleProps}
                                  className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
                                >
                                  <GripVertical className="w-5 h-5" />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start gap-2">
                                    <p className="text-sm font-medium mb-1 truncate text-muted-foreground">
                                      Q{index + 1}.
                                    </p>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive shrink-0"
                                      onClick={() => removeFromSet(index)}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                  <p
                                    className="text-sm line-clamp-3 text-foreground"
                                    dangerouslySetInnerHTML={{
                                      __html: q.questionText,
                                    }}
                                  ></p>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          </DragDropContext>
        )}
        </div>
      </div>
    </div>
  );
}
