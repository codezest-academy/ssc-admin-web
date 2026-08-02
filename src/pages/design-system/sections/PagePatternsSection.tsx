import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, Search, Settings, Users, FileText } from "lucide-react";
import { ThemePreview } from "../components/ThemePreview";
export function PagePatternsSection() {
  return (
    <section id="patterns" className="space-y-8 pt-12 border-t mt-12">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Composed Page Patterns</h2>
        <p className="text-muted-foreground mt-2">How components assemble into complex interfaces.</p>
      </div>
      <ThemePreview title="Data Grid (Table)" description="Standard table pattern with status badges.">
        <div className="border rounded-md bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>Mock Test</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Enrolled</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow><TableCell className="font-medium">SSC CGL Tier-1</TableCell><TableCell><Badge className="bg-success/20 text-success hover:bg-success/30 border-none">Active</Badge></TableCell><TableCell className="text-right">1,234</TableCell></TableRow>
              <TableRow><TableCell className="font-medium">SSC CHSL Mini Mock</TableCell><TableCell><Badge className="bg-warning/20 text-warning hover:bg-warning/30 border-none">Draft</Badge></TableCell><TableCell className="text-right">—</TableCell></TableRow>
              <TableRow><TableCell className="font-medium">Old 2025 Pattern</TableCell><TableCell><Badge className="bg-destructive/20 text-destructive hover:bg-destructive/30 border-none">Archived</Badge></TableCell><TableCell className="text-right">5,432</TableCell></TableRow>
            </TableBody>
          </Table>
        </div>
      </ThemePreview>
      <ThemePreview title="Sidebar Navigation" description="The core navigation using --sidebar-* tokens.">
        <div className="bg-sidebar border-sidebar-border border rounded-lg p-4 w-64 text-sidebar-foreground shadow-sm">
          <div className="flex items-center gap-2 mb-8 px-2 font-bold text-lg"><BookOpen className="text-sidebar-primary" />CodeZest</div>
          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-3 py-2 bg-sidebar-accent text-sidebar-accent-foreground rounded-md font-medium text-sm"><Search className="h-4 w-4" />Dashboard</a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground rounded-md font-medium text-sm transition-colors"><FileText className="h-4 w-4" />Question Bank</a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground rounded-md font-medium text-sm transition-colors"><Users className="h-4 w-4" />Students</a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground rounded-md font-medium text-sm transition-colors"><Settings className="h-4 w-4" />Settings</a>
          </nav>
        </div>
      </ThemePreview>
    </section>
  );
}
