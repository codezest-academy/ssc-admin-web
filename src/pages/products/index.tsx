import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProducts, deleteProduct } from "@/api/products";
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
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Settings,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/ui/loading-skeletons";
import { ErrorState } from "@/components/ui/error-state";

export default function ProductsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: products, isLoading , isError, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete product");
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(id);
    }
  };

  const filteredProducts = products?.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (isError) {
    return <ErrorState title="Failed to load data" onRetry={() => refetch()} />;
  }

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <div className="space-y-6 max-w-full w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Products & Combos
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage subscription plans, combos, and purchasable items.
          </p>
        </div>
        <Button onClick={() => navigate("/products/new")} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Product
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Product Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price (₹)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-muted-foreground"
                >
                  No products found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1 max-w-[300px]">
                      {product.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.type}</Badge>
                  </TableCell>
                  <TableCell>
                    {product.discountedPrice !== null &&
                    product.discountedPrice < product.price ? (
                      <div className="flex flex-col">
                        <span className="font-medium text-success">
                          ₹{product.discountedPrice}
                        </span>
                        <span className="text-xs text-muted-foreground line-through">
                          ₹{product.price}
                        </span>
                      </div>
                    ) : (
                      <span className="font-medium">₹{product.price}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        product.isActive
                          ? "bg-success/10 text-success hover:bg-success/20 border-none"
                          : "bg-warning/10 text-warning-text-on-tint hover:bg-warning/20 border-none"
                      }
                    >
                      {product.isActive ? "Active" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {product.type !== "SUBSCRIPTION" && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10" onClick={() => navigate(`/products/${product.id}`)}>
                              <Settings className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Manage Items</TooltipContent>
                        </Tooltip>
                      )}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/products/${product.id}/edit`)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit Details</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive" 
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete Product</TooltipContent>
                      </Tooltip>
                    </div>
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
