import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createArticle, updateArticle } from "@/api/articles";
import type { Article } from "@/api/articles";
import { getCategories } from "@/api/categories";

export default function ArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: "",
    contentMd: "",
    categoryId: "none",
    metaTitle: "",
    metaDescription: "",
    isPublished: false,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: article, isLoading: isArticleLoading } = useQuery({
    queryKey: ["article", id],
    // HACK: id is actually passing slug here in API? No, the router should probably pass id, but getArticleBySlug uses slug. 
    // We will just fetch articles and find by id to be safe for now, or update the API to fetch by ID. 
    // Let's assume the API provides an endpoint or we just use the list. Actually, we'll fetch all and find it since admin lists are small.
    // Wait, better yet, update the form from the list if it's there. 
    queryFn: async () => {
      if (!isEditing) return null;
      // We don't have getArticleById, so we fetch all and find. 
      // For a real app, add getArticleById.
      const res = await import("@/api/articles").then(m => m.getArticles());
      return res.find((a: Article) => a.id === id) || null;
    },
    enabled: isEditing,
  });

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        contentMd: article.contentMd,
        categoryId: article.category?.id || "none",
        metaTitle: article.metaTitle || "",
        metaDescription: article.metaDescription || "",
        isPublished: article.isPublished,
      });
    }
  }, [article]);

  const saveMutation = useMutation({
    mutationFn: (data: any) => {
      const payload = {
        ...data,
        categoryId: data.categoryId === "none" ? null : data.categoryId,
      };
      if (isEditing) {
        return updateArticle({ id, ...payload });
      }
      return createArticle(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success(isEditing ? "Article updated" : "Article created");
      navigate("/articles");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to save article");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.contentMd.trim()) {
      toast.error("Title and content are required");
      return;
    }
    saveMutation.mutate(formData);
  };

  if (isEditing && isArticleLoading) return <div className="p-8">Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button type="button" variant="ghost" size="icon" onClick={() => navigate("/articles")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEditing ? "Edit Article" : "Write Article"}
            </h1>
          </div>
        </div>
        <Button type="submit" disabled={saveMutation.isPending}>
          <Save className="h-4 w-4 mr-2" />
          {isEditing ? "Save Changes" : "Publish Article"}
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Article Title"
                  className="text-lg font-semibold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Content (Markdown)</label>
                <Textarea
                  required
                  value={formData.contentMd}
                  onChange={(e) => setFormData({ ...formData, contentMd: e.target.value })}
                  placeholder="Write your content here..."
                  className="min-h-[400px] font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Published Status</label>
                <Switch
                  checked={formData.isPublished}
                  onCheckedChange={(c: boolean) => setFormData({ ...formData, isPublished: c })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(val) => setFormData({ ...formData, categoryId: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Uncategorized</SelectItem>
                    {categories?.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t space-y-4">
                <h3 className="font-semibold text-sm">SEO Metadata</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Meta Title</label>
                  <Input
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Meta Description</label>
                  <Textarea
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    placeholder="Optional"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
