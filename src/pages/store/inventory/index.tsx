import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StoreAPI, type StoreItem } from "@/api/store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Image as ImageIcon, Box } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

export default function StoreInventoryPage() {
  const queryClient = useQueryClient();
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["store-items"],
    queryFn: StoreAPI.getItems,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<StoreItem> | null>(null);

  const saveMutation = useMutation({
    mutationFn: (data: Partial<StoreItem>) =>
      data.id ? StoreAPI.updateItem(data.id, data) : StoreAPI.createItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-items"] });
      toast.success(editingItem?.id ? "Item updated" : "Item created");
      setIsModalOpen(false);
      setEditingItem(null);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to save item"),
  });

  const handleEdit = (item: StoreItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem({ name: "", description: "", cost: 500, stock: 10, isActive: true, imageUrl: "" });
    setIsModalOpen(true);
  };

  if (isLoading) return <div>Loading inventory...</div>;

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto pb-12 pt-4 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rewards Inventory</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage the physical merchandise available in the Gamification Store.
          </p>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="w-4 h-4" /> Add Item
        </Button>
      </div>

      <div className="surface-elevated rounded-xl overflow-hidden border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Item Name</TableHead>
              <TableHead>Cost (Coins)</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  <Box className="w-8 h-8 mx-auto mb-3 opacity-20" />
                  No items in inventory. Click "Add Item" to create one.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item: StoreItem) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-md object-cover border border-border" />
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1 max-w-[300px]">{item.description}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-amber-200/20">
                      {item.cost} Coins
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={item.stock === 0 ? "text-destructive font-medium" : ""}>
                      {item.stock} units
                    </span>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={item.isActive}
                      onCheckedChange={(checked) => saveMutation.mutate({ id: item.id, isActive: checked })}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(item as StoreItem)}>
                      <Edit className="w-4 h-4 mr-2" /> Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem?.id ? "Edit Item" : "Add Item"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input
                value={editingItem?.name || ""}
                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                placeholder="e.g. CZ Coffee Mug"
              />
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea
                value={editingItem?.description || ""}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                placeholder="Describe the item..."
              />
            </div>
            <div className="grid gap-2">
              <Label>Image URL</Label>
              <Input
                value={editingItem?.imageUrl || ""}
                onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Cost (Coins)</Label>
                <Input
                  type="number"
                  value={editingItem?.cost || 0}
                  onChange={(e) => setEditingItem({ ...editingItem, cost: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Stock</Label>
                <Input
                  type="number"
                  value={editingItem?.stock || 0}
                  onChange={(e) => setEditingItem({ ...editingItem, stock: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <Label>Active (Visible in store)</Label>
              <Switch
                checked={editingItem?.isActive ?? true}
                onCheckedChange={(checked) => setEditingItem({ ...editingItem, isActive: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={() => saveMutation.mutate(editingItem!)} disabled={saveMutation.isPending || !editingItem?.name}>
              {saveMutation.isPending ? "Saving..." : "Save Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
