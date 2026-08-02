import { Badge } from "@/components/ui/badge";
export function SubjectSystemSection() {
  return (
    <section id="subjects" className="space-y-8 pt-12 border-t mt-12">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Subject Color System</h2>
        <p className="text-muted-foreground mt-2">Dedicated colors for the 5 core SSC subjects. Always use with 10% opacity for backgrounds.</p>
      </div>
      <div className="flex flex-wrap gap-4">
        <Badge className="bg-subject-quant/10 text-subject-quant border-subject-quant/20 hover:bg-subject-quant/20 text-sm py-1">Quantitative Aptitude</Badge>
        <Badge className="bg-subject-english/10 text-subject-english border-subject-english/20 hover:bg-subject-english/20 text-sm py-1">English Language</Badge>
        <Badge className="bg-subject-ga/10 text-subject-ga border-subject-ga/20 hover:bg-subject-ga/20 text-sm py-1">General Awareness</Badge>
        <Badge className="bg-subject-reason/10 text-subject-reason border-subject-reason/20 hover:bg-subject-reason/20 text-sm py-1">Reasoning</Badge>
        <Badge className="bg-subject-science/10 text-subject-science border-subject-science/20 hover:bg-subject-science/20 text-sm py-1">General Science</Badge>
      </div>
    </section>
  );
}
