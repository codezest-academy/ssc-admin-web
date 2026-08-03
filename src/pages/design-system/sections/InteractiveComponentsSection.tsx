import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemePreview } from "../components/ThemePreview";
import { QuestionRenderer } from "@/components/ui/question-renderer";

export function InteractiveComponentsSection() {
  return (
    <section id="interactive" className="space-y-8 pt-12 border-t mt-12">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">UI Components</h2>
        <p className="text-muted-foreground mt-2">Standardized building blocks used across the application.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ThemePreview title="Buttons" description="Action triggers across the application.">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <Button variant="default">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </ThemePreview>

        <ThemePreview title="Badges & Avatars" description="Small visual indicators and user profiles.">
          <div className="flex flex-col gap-6 items-center justify-center">
            <div className="flex gap-4">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
            <div className="flex gap-4">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </ThemePreview>

        <ThemePreview title="Form Controls" description="Inputs and selects used in settings and builders.">
          <div className="space-y-6 w-full max-w-sm mx-auto">
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

        <ThemePreview title="Checkboxes & Radios" description="Selection controls for forms and settings.">
          <div className="space-y-8 flex flex-col items-center">
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms" className="font-normal text-sm">Accept terms and conditions</Label>
            </div>
            
            <RadioGroup defaultValue="comfortable">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="default" id="r1" />
                <Label htmlFor="r1" className="font-normal text-sm">Default Layout</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="comfortable" id="r2" />
                <Label htmlFor="r2" className="font-normal text-sm">Comfortable Layout</Label>
              </div>
            </RadioGroup>
          </div>
        </ThemePreview>

        <ThemePreview title="Loading Skeletons" description="Placeholder states while data is fetching.">
          <div className="flex flex-col gap-4 w-full max-w-sm mx-auto">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[80%]" />
            </div>
          </div>
        </ThemePreview>

        <ThemePreview title="KaTeX Question Renderer" description="Safe HTML rendering with automatic LaTeX math parsing.">
          <div className="w-full text-left bg-card p-6 rounded-xl border shadow-sm">
            <QuestionRenderer 
              content={`
                <p>Solve the following quadratic equation for \\(x\\):</p>
                <p>$$ax^2 + bx + c = 0$$</p>
                <p>The solution is given by the quadratic formula:</p>
                <p>$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$</p>
                <p>Where \\(a \\neq 0\\). Note that if \\(b^2 - 4ac < 0\\), the roots are complex.</p>
              `}
            />
          </div>
        </ThemePreview>
      </div>
    </section>
  );
}
