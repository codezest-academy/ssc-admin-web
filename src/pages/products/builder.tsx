import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProductById, addProductItem, removeProductItem } from "@/api/products";
import { getMockTests } from "@/api/mockTests";
import { getPracticeSets } from "@/api/practiceSets";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Loader2, Plus, Trash2, Package } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ProductBuilder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [selectedItemType, setSelectedItemType] = useState<string>("MOCK_TEST");
  const [selectedItemId, setSelectedItemId] = useState<string>("");

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id!),
  });

  const { data: mockTests } = useQuery({
    queryKey: ["mockTests"],
    queryFn: getMockTests,
    enabled: selectedItemType === "MOCK_TEST" && isAddItemModalOpen,
  });

  const { data: practiceSets } = useQuery({
    queryKey: ["practiceSets"],
    queryFn: () => getPracticeSets({}),
    enabled: selectedItemType === "PRACTICE_SET" && isAddItemModalOpen,
  });

  const addMutation = useMutation({
    mutationFn: (data: { itemType: string, itemId: string }) => addProductItem(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      toast.success("Item added to product");
      setIsAddItemModalOpen(false);
      setSelectedItemId("");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to add item");
    }
  });

  const removeMutation = useMutation({
    mutationFn: (itemId: string) => removeProductItem(id!, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      toast.success("Item removed");
    },
    onError: () => {
      toast.error("Failed to remove item");
    }
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId) {
      toast.error("Please select an item");
      return;
    }
    addMutation.mutate({ itemType: selectedItemType, itemId: selectedItemId });
  };

  if (isLoading || !product) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/products")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Product Items</h1>
            <p className="text-muted-foreground mt-1">
              Manage contents of {product.name}
            </p>
          </div>
        </div>
        <Button onClick={() => setIsAddItemModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Type</TableHead>
              <TableHead>Item ID</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {product.items?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">
                  <Package className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                  No items in this product yet.
                </TableCell>
              </TableRow>
            ) : (
              product.items?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Badge variant="outline">{item.itemType}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {item.itemId}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        if (window.confirm("Remove this item?")) {
                          removeMutation.mutate(item.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isAddItemModalOpen} onOpenChange={setIsAddItemModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleAddItem}>
            <DialogHeader>
              <DialogTitle>Add Item to Product</DialogTitle>
              <DialogDescription>
                Select an item to include in this product bundle.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Item Type</Label>
                <Select value={selectedItemType} onValueChange={(val) => {
                  setSelectedItemType(val);
                  setSelectedItemId("");
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MOCK_TEST">Mock Test</SelectItem>
                    <SelectItem value="PRACTICE_SET">Practice Set</SelectItem>
                    {/* Chapters and Lessons could be added here later */}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Select Item</Label>
                <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an item..." />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedItemType === "MOCK_TEST" && mockTests?.map((test: { id: string; title: string }) => (
                      <SelectItem key={test.id} value={test.id}>
                        {test.title}
                      </SelectItem>
                    ))}
                    {selectedItemType === "PRACTICE_SET" && practiceSets?.data?.map((set: { id: string; title: string }) => (
                      <SelectItem key={set.id} value={set.id}>
                        {set.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddItemModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={addMutation.isPending || !selectedItemId}>
                {addMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Add to Product
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
