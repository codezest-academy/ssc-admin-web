import { useState, useEffect, useMemo } from "react";
import {
  Palette,
  Square,
  Type,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Download,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { oklchToRelativeLuminance, getContrastRatio } from "@/lib/color-utils";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type TabType = "colors" | "shape" | "type";

const DEFAULTS = {
  hue: 275,
  chroma: 0.2,
  radius: 0.5,
  fontSans: "Inter, sans-serif",
};

export function TokenEditorSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("colors");
  const [hue, setHue] = useState(DEFAULTS.hue);
  const [chroma, setChroma] = useState(DEFAULTS.chroma);
  const [radius, setRadius] = useState(DEFAULTS.radius);
  const [fontSans, setFontSans] = useState(DEFAULTS.fontSans);

  // Compute preview theme
  const previewTheme = useMemo(() => {
    // Generate OKLCH base for primary
    const primary = `oklch(0.55 ${chroma} ${hue})`;
    return {
      light: { "--primary": primary, "--radius": `${radius}rem` },
      dark: { "--primary": primary, "--radius": `${radius}rem` },
    };
  }, [hue, chroma, radius]);

  // Contrast check using proper OKLCH -> sRGB -> Luminance conversion
  const primaryLuminance = oklchToRelativeLuminance(0.55, chroma, hue);
  const bgLuminance = oklchToRelativeLuminance(0.96, 0.01, 250); // Light mode background approximation
  const contrastRatio = getContrastRatio(primaryLuminance, bgLuminance);
  const contrastIsValid = contrastRatio >= 3.0;

  const swatchStyle = `oklch(0.55 ${chroma} ${hue})`;
  const swatchFg =
    chroma < 0.05 ? "#808080" : primaryLuminance > 0.3 ? "#111111" : "#ffffff";

  // Inject scoped CSS vars
  useEffect(() => {
    const styleId = "design-system-token-overrides";
    let style = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement("style");
      style.id = styleId;
      document.head.appendChild(style);
    }

    const lightVars = Object.entries(previewTheme.light)
      .map(([k, v]) => `${k}: ${v};`)
      .join("\n        ");
    const darkVars = Object.entries(previewTheme.dark)
      .map(([k, v]) => `${k}: ${v};`)
      .join("\n        ");

    style.innerHTML = `
      .design-system-root {
        ${lightVars}
        --font-sans: ${fontSans};
      }
      .design-system-root.dark {
        ${darkVars}
        --font-sans: ${fontSans};
      }
    `;

    return () => {
      style?.remove();
    };
  }, [previewTheme, fontSans]);

  const handleReset = () => {
    setHue(DEFAULTS.hue);
    setChroma(DEFAULTS.chroma);
    setRadius(DEFAULTS.radius);
    setFontSans(DEFAULTS.fontSans);
    toast.success("Tokens reset to CodeZest defaults");
  };

  const handleCopy = () => {
    const vars = Object.entries(previewTheme.light)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join("\n");
    const output = `:root {\n${vars}\n  --font-sans: ${fontSans};\n}`;
    navigator.clipboard.writeText(output);
    toast.success("CSS variables copied!", {
      description: "Paste into src/index.css under :root { }",
    });
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "colors", label: "Colors", icon: <Palette className="w-4 h-4" /> },
    { id: "shape", label: "Shape", icon: <Square className="w-4 h-4" /> },
    { id: "type", label: "Type", icon: <Type className="w-4 h-4" /> },
  ];

  if (isCollapsed) {
    return (
      <aside className="w-12 shrink-0 border-r border-border bg-card flex flex-col items-center py-4 transition-all duration-300 h-full sticky top-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(false)}
          className="mb-4"
          title="Expand Editor"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex flex-col gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setActiveTab("colors");
              setIsCollapsed(false);
            }}
            title="Colors"
          >
            <Palette className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setActiveTab("shape");
              setIsCollapsed(false);
            }}
            title="Shape"
          >
            <Square className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setActiveTab("type");
              setIsCollapsed(false);
            }}
            title="Type"
          >
            <Type className="h-4 w-4" />
          </Button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-80 shrink-0 border-r border-border bg-card overflow-y-auto flex flex-col transition-all duration-300 h-full sticky top-0">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">
              Token Editor
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Edit tokens live — changes preview instantly
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(true)}
          className="-mt-1 -mr-2"
          title="Collapse Editor"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex gap-2 p-4 border-b border-border">
        {tabs.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all flex-1 justify-center ${
              activeTab === id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {activeTab === "colors" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Primary Hue</Label>
                <span className="text-xs bg-muted px-2 py-0.5 rounded-md text-muted-foreground font-mono">
                  {Math.round(hue)}
                </span>
              </div>
              <Slider
                value={[hue]}
                min={0}
                max={360}
                step={1}
                onValueChange={(v) => setHue(Array.isArray(v) ? v[0] : v)}
              />
              <div className="h-2 w-full rounded-full bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-purple-500 to-red-500 opacity-60" />

              <div className="flex items-center gap-4 mt-2">
                <div
                  className="h-8 w-8 rounded-lg border border-border/50 flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                  style={{ background: swatchStyle, color: swatchFg }}
                >
                  Aa
                </div>
                <div
                  className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border flex-1 ${
                    contrastIsValid
                      ? "bg-success/10 text-success border-success/20"
                      : "bg-warning/10 text-warning border-warning/20"
                  }`}
                >
                  {contrastIsValid ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <AlertTriangle className="h-3.5 w-3.5" />
                  )}
                  {contrastIsValid
                    ? `${contrastRatio.toFixed(1)}:1 — WCAG AA`
                    : `${contrastRatio.toFixed(1)}:1 — Too low`}
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border/50">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">
                  Intensity (Chroma)
                </Label>
                <span className="text-xs bg-muted px-2 py-0.5 rounded-md text-muted-foreground font-mono">
                  {chroma.toFixed(2)}
                </span>
              </div>
              <Slider
                value={[chroma]}
                min={0}
                max={0.3}
                step={0.01}
                onValueChange={(v) => setChroma(Array.isArray(v) ? v[0] : v)}
              />
            </div>
          </div>
        )}

        {activeTab === "shape" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Border Radius</Label>
                <span className="text-xs bg-muted px-2 py-0.5 rounded-md text-muted-foreground font-mono">
                  {radius}rem
                </span>
              </div>
              <Slider
                value={[radius]}
                min={0}
                max={2}
                step={0.1}
                onValueChange={(v) => setRadius(Array.isArray(v) ? v[0] : v)}
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Sharp (0rem)</span>
                <span>Pill (2rem)</span>
              </div>
            </div>
            <div className="flex items-center gap-4 pt-4 border-t border-border/50">
              <div
                className="h-16 w-16 bg-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold shrink-0"
                style={{ borderRadius: `${radius}rem` }}
              >
                Btn
              </div>
              <div
                className="flex-1 h-16 bg-card border flex items-center justify-center text-xs text-muted-foreground"
                style={{ borderRadius: `${radius}rem` }}
              >
                Card
              </div>
            </div>
          </div>
        )}

        {activeTab === "type" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-4">
              <Label className="text-sm font-semibold">Primary Font</Label>
              <Select
                value={fontSans}
                onValueChange={(v) => setFontSans(v || DEFAULTS.fontSans)}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter, sans-serif">
                    Inter (Current)
                  </SelectItem>
                  <SelectItem value="Poppins, sans-serif">Poppins</SelectItem>
                  <SelectItem value="Roboto, sans-serif">Roboto</SelectItem>
                  <SelectItem value="ui-sans-serif, system-ui, sans-serif">
                    System UI
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border space-y-2 shrink-0">
        <Button
          onClick={handleCopy}
          className="w-full h-9 text-sm font-semibold"
          size="sm"
        >
          <Download className="h-4 w-4 mr-2" />
          Copy CSS Variables
        </Button>
        <Button
          variant="outline"
          onClick={handleReset}
          className="w-full h-9 text-sm"
          size="sm"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
      </div>
    </aside>
  );
}
