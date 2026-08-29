import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ErrorState } from "@/components/ui/error-state";
import { ArrowLeft, Save, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createArticle, updateArticle, getArticleById } from "@/api/articles";
import type { ArticleFormData } from "@/api/articles";
import { getCategories } from "@/api/categories";
import type { Category } from "@/api/categories";

const DEFAULT_FORM: ArticleFormData = {
  title: "",
  contentMd: "",
  categoryId: null,
  metaTitle: null,
  metaDescription: null,
  isPublished: false,
};

export default function ArticleEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [formData, setFormData] = useState<ArticleFormData>(DEFAULT_FORM);
  const [preview, setPreview] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: article, isLoading: isArticleLoading, isError, refetch } = useQuery({
    queryKey: ["article", id],
    queryFn: () => getArticleById(id!),
    enabled: isEditing,
  });

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        contentMd: article.contentMd,
        categoryId: article.category?.id ?? null,
        metaTitle: article.metaTitle,
        metaDescription: article.metaDescription,
        isPublished: article.isPublished,
      });
    }
  }, [article]);

  const saveMutation = useMutation({
    mutationFn: (data: ArticleFormData) => {
      if (isEditing) {
        return updateArticle({ id: id!, ...data });
      }
      return createArticle(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success(isEditing ? "Article updated" : "Article created");
      navigate("/articles");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
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

  const updateField = <K extends keyof ArticleFormData>(
    key: K,
    value: ArticleFormData[K]
  ) => setFormData((prev) => ({ ...prev, [key]: value }));

  if (isError) {
    return (
      <div className="p-8">
        <ErrorState title="Failed to load article" onRetry={() => refetch()} />
      </div>
    );
  }

  if (isEditing && isArticleLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading article...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
      {/* Top Bar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button type="button" variant="ghost" size="icon" onClick={() => navigate("/articles")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEditing ? "Edit Article" : "Write Article"}
            </h1>
            {formData.isPublished && (
              <Badge className="text-success bg-success/10 border-success/20 mt-1">Published</Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPreview(!preview)}
            className="gap-2"
          >
            {preview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {preview ? "Edit" : "Preview"}
          </Button>
          <Button type="submit" disabled={saveMutation.isPending}>
            <Save className="h-4 w-4 mr-2" />
            {saveMutation.isPending ? "Saving..." : isEditing ? "Save Changes" : "Create Article"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="col-span-2 space-y-5">
          <Card>
            <CardContent className="p-6 space-y-5">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Title *</label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="Article title..."
                  className="text-lg font-semibold h-12"
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-foreground">Content (Markdown) *</label>
                  <span className="text-xs text-muted-foreground">
                    {formData.contentMd.length} chars
                  </span>
                </div>
                {preview ? (
                  <div className="min-h-[500px] rounded-xl border border-border bg-muted/20 p-6">
                    <div className="prose prose-sm max-w-none text-foreground">
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {formData.contentMd || <span className="text-muted-foreground italic">Nothing to preview yet...</span>}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <Textarea
                    required
                    value={formData.contentMd}
                    onChange={(e) => updateField("contentMd", e.target.value)}
                    placeholder="Write your content in Markdown...

## Introduction
...

## Section 1
...
"
                    className="min-h-[500px] font-mono text-sm leading-relaxed"
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="col-span-1 space-y-5">
          {/* Publish Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Publish Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-foreground">Published</label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Make visible on the blog
                  </p>
                </div>
                <Switch
                  checked={formData.isPublished}
                  onCheckedChange={(c) => updateField("isPublished", c)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Category</label>
                <Select
                  value={formData.categoryId ?? "none"}
                  onValueChange={(val) => updateField("categoryId", val === "none" ? null : val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Uncategorized</SelectItem>
                    {categories?.map((cat: Category) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">SEO Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Meta Title</label>
                <Input
                  value={formData.metaTitle ?? ""}
                  onChange={(e) => updateField("metaTitle", e.target.value || null)}
                  placeholder="Defaults to article title"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Meta Description</label>
                <Textarea
                  value={formData.metaDescription ?? ""}
                  onChange={(e) => updateField("metaDescription", e.target.value || null)}
                  placeholder="Brief summary for search engines..."
                  rows={4}
                  className="text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  {(formData.metaDescription ?? "").length}/160 chars
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
