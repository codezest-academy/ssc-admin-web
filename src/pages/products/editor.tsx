import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProductById, createProduct, updateProduct, type ProductType } from "@/api/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

export default function ProductEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = Boolean(id && id !== "new");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<ProductType>("COMBO");
  const [price, setPrice] = useState<number>(0);
  const [discountedPrice, setDiscountedPrice] = useState<number | "">("");
  const [validityDays, setValidityDays] = useState<number | "">("");
  const [isActive, setIsActive] = useState(true);

  const { data: product, isLoading: initialLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id!),
    enabled: isEditing,
  });

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description || "");
      setType(product.type);
      setPrice(product.price);
      setDiscountedPrice(product.discountedPrice ?? "");
      setValidityDays(product.validityDays ?? "");
      setIsActive(product.isActive);
    }
  }, [product]);

  const mutation = useMutation({
    mutationFn: (values: any) => {
      if (isEditing) {
        return updateProduct(id!, values);
      }
      return createProduct(values);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(isEditing ? "Product updated" : "Product created");
      
      if (!isEditing && data.type !== "SUBSCRIPTION") {
        navigate(`/products/${data.id}`); 
      } else {
        navigate("/products");
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  });

  const handleSave = () => {
    if (!name || name.length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }
    if (price < 0) {
      toast.error("Price must be positive");
      return;
    }

    const payload = {
      name,
      description,
      type,
      price: Number(price),
      discountedPrice: discountedPrice === "" ? null : Number(discountedPrice),
      validityDays: validityDays === "" ? null : Number(validityDays),
      isActive,
    };
    mutation.mutate(payload);
  };

  if (initialLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/products")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {isEditing ? "Edit Product" : "Create Product"}
          </h2>
          <p className="text-muted-foreground mt-1">
            Configure product details, pricing, and validity.
          </p>
        </div>
      </div>

      <div className="space-y-6 bg-card p-6 rounded-xl border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <Label>Product Name</Label>
            <Input 
              placeholder="e.g. Science Mastery Combo" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Description</Label>
            <Textarea 
              placeholder="Detailed description of what is included..." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Product Type</Label>
            <Select onValueChange={(val: any) => setType(val)} value={type}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SUBSCRIPTION">Subscription</SelectItem>
                <SelectItem value="COMBO">Combo (Mixed items)</SelectItem>
                <SelectItem value="MOCK_TEST_SERIES">Mock Test Series</SelectItem>
                <SelectItem value="COURSE">Course (Video Chapters)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Validity (Days)</Label>
            <Input 
              type="number" 
              placeholder="e.g. 365 (leave empty for lifetime)" 
              value={validityDays} 
              onChange={(e) => setValidityDays(e.target.value ? Number(e.target.value) : "")} 
            />
          </div>

          <div className="space-y-2">
            <Label>Original Price (₹)</Label>
            <Input 
              type="number" 
              placeholder="0" 
              value={price} 
              onChange={(e) => setPrice(Number(e.target.value))} 
            />
          </div>

          <div className="space-y-2">
            <Label>Discounted Price (₹)</Label>
            <Input 
              type="number" 
              placeholder="Optional sale price" 
              value={discountedPrice} 
              onChange={(e) => setDiscountedPrice(e.target.value ? Number(e.target.value) : "")} 
            />
          </div>
        </div>

        <div className="pt-2">
          <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm h-[88px] w-full md:w-1/2">
            <Checkbox
              id="isActive"
              checked={isActive}
              onCheckedChange={(val) => setIsActive(Boolean(val))}
            />
            <div className="space-y-1 leading-none">
              <Label htmlFor="isActive">Active Status</Label>
              <p className="text-[0.8rem] text-muted-foreground">
                Visible for purchase by students
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button type="button" variant="outline" onClick={() => navigate("/products")}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={mutation.isPending} className="gap-2">
            {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            <Save className="w-4 h-4" />
            {isEditing ? "Save Changes" : "Create Product"}
          </Button>
        </div>
      </div>
    </div>
  );
}
