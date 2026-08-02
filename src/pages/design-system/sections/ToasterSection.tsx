import { Button } from "@/components/ui/button";
import { toast } from "sonner";
export function ToasterSection() {
  return (
    <section id="toasts" className="space-y-8 pt-12 border-t mt-12">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Toasts (Sonner)</h2>
        <p className="text-muted-foreground mt-2">Interactive system feedback.</p>
      </div>
      <div className="flex flex-wrap gap-4">
        <Button variant="outline" className="border-success text-success hover:bg-success/10" onClick={() => toast.success("Question published successfully.")}>Trigger Success</Button>
        <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10" onClick={() => toast.error("Failed to delete user. Please try again.")}>Trigger Error</Button>
        <Button variant="outline" className="border-warning text-warning hover:bg-warning/10" onClick={() => toast.warning("Draft saved with missing fields.")}>Trigger Warning</Button>
        <Button variant="outline" className="border-info text-info hover:bg-info/10" onClick={() => toast.info("New update available. Refresh the page.")}>Trigger Info</Button>
      </div>
    </section>
  );
}
