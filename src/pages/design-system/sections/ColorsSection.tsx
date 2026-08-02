export function ColorsSection() {
  return (
    <section id="colors" className="space-y-8 pt-12 border-t mt-12">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Brand & Core Surfaces</h2>
        <p className="text-muted-foreground mt-2">The foundational colors based on the 60-30-10 rule.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-background text-foreground p-6 rounded-xl border flex flex-col font-medium h-28 justify-end">Background</div>
        <div className="bg-card text-card-foreground p-6 rounded-xl border flex flex-col font-medium h-28 justify-end">Card</div>
        <div className="bg-muted text-muted-foreground p-6 rounded-xl border flex flex-col font-medium h-28 justify-end">Muted</div>
        <div className="bg-primary text-primary-foreground p-6 rounded-xl border flex flex-col font-medium h-28 justify-end">Primary (Cobalt)</div>
        <div className="bg-secondary text-secondary-foreground p-6 rounded-xl border flex flex-col font-medium h-28 justify-end">Secondary</div>
        <div className="bg-accent text-accent-foreground p-6 rounded-xl border flex flex-col font-medium h-28 justify-end">Accent</div>
      </div>
    </section>
  );
}
