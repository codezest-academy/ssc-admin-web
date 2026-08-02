import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
export function SemanticStatusSection() {
  return (
    <section id="semantic-status" className="space-y-8 pt-12 border-t mt-12">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Semantic Statuses</h2>
        <p className="text-muted-foreground mt-2">Use these tokens for operational states. Never use raw Tailwind red/green classes.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-success/20 bg-success/5 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-success text-lg flex items-center justify-between">Success <Badge className="bg-success/20 text-success hover:bg-success/30 border-none">Active</Badge></CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-success">Published, active, approved, or student passed.</CardContent>
        </Card>
        <Card className="border-warning/20 bg-warning/5 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-warning text-lg flex items-center justify-between">Warning <Badge className="bg-warning/20 text-warning hover:bg-warning/30 border-none">Draft</Badge></CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-warning">Draft, pending review, upcoming, or in-progress.</CardContent>
        </Card>
        <Card className="border-destructive/20 bg-destructive/5 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-destructive text-lg flex items-center justify-between">Destructive <Badge className="bg-destructive/20 text-destructive hover:bg-destructive/30 border-none">Deleted</Badge></CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-destructive">Inactive, deleted, error, or student failed.</CardContent>
        </Card>
        <Card className="border-info/20 bg-info/5 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-info text-lg flex items-center justify-between">Info <Badge className="bg-info/20 text-info hover:bg-info/30 border-none">New</Badge></CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-info">Informational callouts and tooltips.</CardContent>
        </Card>
      </div>
    </section>
  );
}
