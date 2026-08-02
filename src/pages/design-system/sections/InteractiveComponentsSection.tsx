import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemePreview } from "../components/ThemePreview";
export function InteractiveComponentsSection() {
  return (
    <section id="interactive" className="space-y-8 pt-12 border-t mt-12">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Interactive Components</h2>
        <p className="text-muted-foreground mt-2">Standardized action triggers and inputs.</p>
      </div>
      <ThemePreview title="Buttons" description="Action triggers across the application.">
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <Button variant="default">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </ThemePreview>
      <ThemePreview title="Form Controls" description="Inputs and selects used in settings and builders.">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input type="email" placeholder="admin@codezest.com" />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="editor">Content Editor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </ThemePreview>
    </section>
  );
}
