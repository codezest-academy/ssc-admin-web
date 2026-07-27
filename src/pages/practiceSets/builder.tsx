import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { getPracticeSetById, assignQuestionsToSet } from "@/api/practiceSets";
import { getQuestions } from "@/api/questions";
import type { Question } from "@/api/questions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2, GripVertical, Search, Plus, Trash2 } from "lucide-react";

export default function PracticeSetBuilder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Practice Set Data
  const { data: practiceSet, isLoading: isSetLoading } = useQuery({
    queryKey: ["practiceSet", id],
    queryFn: () => getPracticeSetById(id!),
    enabled: Boolean(id),
  });

  // Local state for the questions assigned to this set
  const [assignedQuestions, setAssignedQuestions] = useState<Question[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (practiceSet?.questions) {
      // Sort by order and extract the Question object
      const sorted = [...practiceSet.questions].sort((a, b) => a.order - b.order);
      setAssignedQuestions(sorted.map(q => q.question));
    }
  }, [practiceSet]);

  // Question Bank filters & data
  const [search, setSearch] = useState("");
  const { data: questionsData, isLoading: isBankLoading } = useQuery({
    queryKey: ["questions", 1, search, practiceSet?.subjectId, practiceSet?.chapterId],
    queryFn: () => getQuestions({
      page: 1,
      limit: 100, // Load more for builder
      search: search || undefined,
      subjectId: practiceSet?.subjectId,
      chapterId: practiceSet?.chapterId || undefined,
    }),
    enabled: Boolean(practiceSet?.subjectId),
  });
  
  const bankQuestions = questionsData?.data || [];

  // Filter out questions already in the set for the left pane
  const availableQuestions = bankQuestions.filter(
    (bq) => !assignedQuestions.some((aq) => aq.id === bq.id)
  );

  const saveMutation = useMutation({
    mutationFn: (questionIds: string[]) => assignQuestionsToSet(id!, questionIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["practiceSet", id] });
      queryClient.invalidateQueries({ queryKey: ["practiceSets"] });
      toast.success("Questions saved successfully");
      setHasUnsavedChanges(false);
    },
    onError: () => {
      toast.error("Failed to save questions");
    }
  });

  const handleSave = () => {
    saveMutation.mutate(assignedQuestions.map(q => q.id));
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    
    // Dropped outside the list
    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.droppableId === "set") {
      // Reordering within the set
      const newAssigned = Array.from(assignedQuestions);
      const [movedItem] = newAssigned.splice(source.index, 1);
      newAssigned.splice(destination.index, 0, movedItem);
      
      setAssignedQuestions(newAssigned);
      setHasUnsavedChanges(true);
    } 
    else if (source.droppableId === "bank" && destination.droppableId === "set") {
      // Dragging from bank to set
      const sourceItem = availableQuestions[source.index];
      const newAssigned = Array.from(assignedQuestions);
      newAssigned.splice(destination.index, 0, sourceItem);
      
      setAssignedQuestions(newAssigned);
      setHasUnsavedChanges(true);
    }
  };

  const addToSet = (question: Question) => {
    setAssignedQuestions(prev => [...prev, question]);
    setHasUnsavedChanges(true);
  };

  const removeFromSet = (index: number) => {
    setAssignedQuestions(prev => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
    setHasUnsavedChanges(true);
  };

  if (isSetLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
  }

  if (!practiceSet) {
    return <div>Practice set not found.</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/practice-sets")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Builder: {practiceSet.title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-[10px]">
                {practiceSet.chapterId ? 'Chapter Level' : 'Subject Level'}
              </Badge>
              <p className="text-sm text-muted-foreground">
                {assignedQuestions.length} Questions Assigned
              </p>
            </div>
          </div>
        </div>
        
        <Button onClick={handleSave} disabled={!hasUnsavedChanges || saveMutation.isPending} className="gap-2">
          {saveMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          <Save className="w-4 h-4" /> Save Configuration
        </Button>
      </div>

      {/* Main Drag & Drop Area */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-1 gap-6 pt-4 min-h-0">
          
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
                    <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
                  ) : availableQuestions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No matching questions available.
                    </div>
                  ) : (
                    availableQuestions.map((q, index) => (
                      <Draggable key={`bank-${q.id}`} draggableId={`bank-${q.id}`} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 bg-background border rounded-lg shadow-sm group hover:border-primary/50 transition-colors ${
                              snapshot.isDragging ? 'shadow-md ring-2 ring-primary/20 z-50' : ''
                            }`}
                          >
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1">
                                <p className="text-sm line-clamp-2" dangerouslySetInnerHTML={{ __html: q.questionText }}></p>
                                <div className="flex gap-2 mt-2">
                                  <Badge variant="secondary" className="text-[10px]">{q.difficulty}</Badge>
                                  {q.isPYQ && <Badge variant="outline" className="text-[10px]">PYQ</Badge>}
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
          <div className="w-1/2 flex flex-col border rounded-xl bg-card border-primary/20 overflow-hidden">
            <div className="p-4 border-b bg-primary/5 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-primary">Assigned Questions</h3>
                <p className="text-xs text-muted-foreground mt-1">Drag to reorder questions in the test.</p>
              </div>
              <Badge variant="default" className="text-xs">{assignedQuestions.length}</Badge>
            </div>
            
            <Droppable droppableId="set">
              {(provided, snapshot) => (
                <div 
                  ref={provided.innerRef} 
                  {...provided.droppableProps}
                  className={`flex-1 overflow-y-auto p-4 space-y-3 transition-colors ${
                    snapshot.isDraggingOver ? 'bg-primary/5' : ''
                  }`}
                >
                  {assignedQuestions.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl p-8">
                      <Plus className="w-8 h-8 mb-2 opacity-50" />
                      <p>Drag questions here to add them to the set</p>
                    </div>
                  ) : (
                    assignedQuestions.map((q, index) => (
                      <Draggable key={`set-${q.id}`} draggableId={`set-${q.id}`} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`p-3 bg-background border rounded-lg shadow-sm group flex items-start gap-3 ${
                              snapshot.isDragging ? 'shadow-lg ring-2 ring-primary z-50' : 'hover:border-primary/50'
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
                                <p className="text-sm font-medium mb-1 truncate text-muted-foreground">Q{index + 1}.</p>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive shrink-0"
                                  onClick={() => removeFromSet(index)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              <p className="text-sm line-clamp-3 text-foreground" dangerouslySetInnerHTML={{ __html: q.questionText }}></p>
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
    </div>
  );
}
