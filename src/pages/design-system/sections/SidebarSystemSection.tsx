import { useState, useEffect } from "react";
import { LayoutPanelLeft, Search, FileText, Settings, CheckCircle2, AlertTriangle } from "lucide-react";
import { oklchToRelativeLuminance, getContrastRatio, parseOklch } from "@/lib/color-utils";

function ContrastBadge({ fg, bg, label }: { fg: string; bg: string; label: string }) {
  const [ratio, setRatio] = useState<number | null>(null);

  useEffect(() => {
    // Get actual computed values from document root
    const rootStyle = getComputedStyle(document.documentElement);
    const fgVal = rootStyle.getPropertyValue(fg).trim();
    const bgVal = rootStyle.getPropertyValue(bg).trim();
    
    const parsedFg = parseOklch(`oklch(${fgVal})`);
    const parsedBg = parseOklch(`oklch(${bgVal})`);

    if (parsedFg && parsedBg) {
      const lumFg = oklchToRelativeLuminance(parsedFg.l, parsedFg.c, parsedFg.h);
      const lumBg = oklchToRelativeLuminance(parsedBg.l, parsedBg.c, parsedBg.h);
      setRatio(getContrastRatio(lumFg, lumBg));
    }
  }, [fg, bg]);

  if (ratio === null) return null;

  const isValid = ratio >= 4.5; // AA standard for normal text

  return (
    <div className="flex items-center justify-between text-xs p-2 rounded border bg-card">
      <span className="font-medium text-muted-foreground">{label}</span>
      <div className={`flex items-center gap-1.5 font-medium px-2 py-0.5 rounded ${isValid ? 'text-success bg-success/10' : 'text-warning bg-warning/10'}`}>
        {isValid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
        {ratio.toFixed(2)}:1
      </div>
    </div>
  );
}

function SidebarMockup() {
  return (
    <div className={`border rounded-lg overflow-hidden flex flex-col h-[320px]`}>
      <div className="bg-background flex-1 p-4 flex gap-4">
        {/* The Mockup Sidebar */}
        <div className="w-48 bg-sidebar border-r border-sidebar-border flex flex-col h-full rounded-md overflow-hidden shadow-sm">
          <div className="p-3 border-b border-sidebar-border flex items-center gap-2 text-sidebar-foreground font-semibold text-sm">
            <LayoutPanelLeft className="w-4 h-4 text-sidebar-primary" />
            Sidebar
          </div>
          <div className="p-2 space-y-1 flex-1">
            <div className="text-xs font-semibold text-sidebar-foreground/50 px-2 py-1 uppercase tracking-wider">Menu</div>
            <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-sidebar-primary-foreground bg-sidebar-primary rounded-md font-medium shadow-sm">
              <FileText className="w-4 h-4" />
              Active Item
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-sidebar-accent-foreground bg-sidebar-accent rounded-md font-medium">
              <Search className="w-4 h-4" />
              Hover Item
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-sidebar-foreground/70 rounded-md font-medium">
              <Settings className="w-4 h-4" />
              Inactive Item
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 border border-dashed border-border rounded-md bg-card/50 flex flex-col p-4">
          <div className="h-4 w-1/3 bg-muted rounded mb-2"></div>
          <div className="h-3 w-full bg-muted/50 rounded mb-1"></div>
          <div className="h-3 w-2/3 bg-muted/50 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function SidebarSystemSection() {
  return (
    <section id="sidebar-system" className="space-y-8 pt-12 border-t mt-12">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Sidebar Token Family</h2>
        <p className="text-muted-foreground mt-2">
          Sidebars use an isolated token family (`--sidebar-*`) to allow for independent theming. Toggle the page theme to see it adapt.
        </p>
      </div>

      <div className="max-w-2xl">
        <SidebarMockup />
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="font-semibold">Live WCAG Contrast Verification</h3>
        <p className="text-sm text-muted-foreground">Proper sRGB relative luminance checks (OKLCH → sRGB → Y).</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ContrastBadge fg="--sidebar-foreground" bg="--sidebar" label="Text on Background" />
          <ContrastBadge fg="--sidebar-accent-foreground" bg="--sidebar-accent" label="Hover Text on Accent" />
          <ContrastBadge fg="--sidebar-primary-foreground" bg="--sidebar-primary" label="Active Text on Primary" />
        </div>
      </div>
    </section>
  );
}
