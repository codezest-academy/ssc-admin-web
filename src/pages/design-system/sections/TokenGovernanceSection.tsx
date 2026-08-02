import { Check, X, Palette, Layout, ShieldAlert } from "lucide-react";

export function TokenGovernanceSection() {
  return (
    <div className="space-y-12 mb-16">
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Token Governance</h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          CodeZest uses a strict token governance model. Hardcoded Tailwind palette colors (e.g., <code className="bg-muted px-2.5 py-0.5 rounded text-sm font-mono text-muted-foreground">bg-indigo-500</code>, <code className="bg-muted px-2.5 py-0.5 rounded text-sm font-mono text-muted-foreground">text-slate-800</code>) are prohibited in UI components. Instead, use semantic design tokens.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Do / Don't: Colors */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Palette className="w-4 h-4" /> 
            Color Tokens
          </h3>
          <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border shadow-sm">
            <div className="p-4 bg-destructive/5 flex gap-4 items-start">
              <div className="mt-2 w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                <X className="w-3 h-3 text-destructive" />
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-foreground text-sm">Don't use palette strings</p>
                <code className="text-xs text-destructive font-mono bg-destructive/10 px-2.5 py-0.5 rounded block w-fit">className="text-emerald-600 bg-emerald-50"</code>
                <p className="text-xs text-muted-foreground">Breaks dark mode, tenant themes, and status colors.</p>
              </div>
            </div>
            <div className="p-4 bg-success/5 flex gap-4 items-start">
              <div className="mt-2 w-6 h-6 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-success" />
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-foreground text-sm">Do use semantic tokens</p>
                <code className="text-xs text-success font-mono bg-success/10 px-2.5 py-0.5 rounded block w-fit">className="text-success bg-success/10"</code>
                <p className="text-xs text-muted-foreground">Adapts to themes automatically via index.css mapping.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Do / Don't: Structural */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Layout className="w-4 h-4" /> 
            Structural Tokens
          </h3>
          <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border shadow-sm">
            <div className="p-4 bg-destructive/5 flex gap-4 items-start">
              <div className="mt-2 w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                <X className="w-3 h-3 text-destructive" />
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-foreground text-sm">Don't hardcode grays</p>
                <code className="text-xs text-destructive font-mono bg-destructive/10 px-2.5 py-0.5 rounded block w-fit">className="border-slate-200 text-slate-500"</code>
                <p className="text-xs text-muted-foreground">Fails when switching to zinc, neutral, or stone bases.</p>
              </div>
            </div>
            <div className="p-4 bg-success/5 flex gap-4 items-start">
              <div className="mt-2 w-6 h-6 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-success" />
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-foreground text-sm">Do use structural tokens</p>
                <code className="text-xs text-success font-mono bg-success/10 px-2.5 py-0.5 rounded block w-fit">className="border-border text-muted-foreground"</code>
                <p className="text-xs text-muted-foreground">Ensures consistency across all UI surfaces.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ESLint Rule */}
      <div className="bg-muted/30 border border-border rounded-lg p-6 flex flex-col sm:flex-row gap-6 items-center shadow-sm">
        <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
          <ShieldAlert className="w-6 h-6 text-foreground" />
        </div>
        <div className="space-y-2 flex-1">
          <h4 className="text-base font-semibold text-foreground">Enforced via ESLint</h4>
          <p className="text-sm text-muted-foreground">
            The <code className="bg-muted px-2 py-0.5 rounded font-mono text-xs border border-border">no-restricted-syntax</code> rule is configured in <code className="bg-muted px-2 py-0.5 rounded font-mono text-xs border border-border">eslint.config.js</code> to block the usage of raw Tailwind palette names.
          </p>
        </div>
        <div className="shrink-0 text-sm font-mono bg-card border border-border px-4 py-2 rounded-xl text-foreground shadow-sm">
          bun run lint
        </div>
      </div>
    </div>
  );
}
