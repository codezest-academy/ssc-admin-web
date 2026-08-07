import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/mode-toggle";
import { Search } from "lucide-react";

import { TokenEditorSidebar } from "./design-system/TokenEditorSidebar";
import { IntroSection } from "./design-system/sections/IntroSection";
import { ColorsSection } from "./design-system/sections/ColorsSection";
import { SemanticStatusSection } from "./design-system/sections/SemanticStatusSection";
import { SubjectSystemSection } from "./design-system/sections/SubjectSystemSection";
import { SidebarSystemSection } from "./design-system/sections/SidebarSystemSection";
import { ChartSystemSection } from "./design-system/sections/ChartSystemSection";
import { InteractiveComponentsSection } from "./design-system/sections/InteractiveComponentsSection";
import { ToasterSection } from "./design-system/sections/ToasterSection";
import { PagePatternsSection } from "./design-system/sections/PagePatternsSection";
import { TokenGovernanceSection } from "./design-system/sections/TokenGovernanceSection";

const navItems = [
  { id: "intro", label: "Introduction" },
  { id: "governance", label: "Token Governance" },
  { id: "colors", label: "Brand & Colors" },
  { id: "semantic-status", label: "Semantic Status" },
  { id: "subjects", label: "Subject System" },
  { id: "sidebar-system", label: "Sidebar System" },
  { id: "chart-system", label: "Chart System" },
  { id: "interactive", label: "Interactive Components" },
  { id: "toasts", label: "Toasts (Sonner)" },
  { id: "patterns", label: "Page Patterns" },
];

export default function DesignSystem() {
  const [activeSection, setActiveSection] = useState("intro");
  const [isManualScroll, setIsManualScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isManualScroll) return;

      const sectionIds = navItems.map((item) => item.id);
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Check if the section is in the upper part of the viewport
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    const mainContainer = document.getElementById("main-scroll-container");
    mainContainer?.addEventListener("scroll", handleScroll);
    return () => mainContainer?.removeEventListener("scroll", handleScroll);
  }, [isManualScroll]);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    setIsManualScroll(true);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

    // Reset manual scroll flag after animation completes
    setTimeout(() => {
      setIsManualScroll(false);
    }, 1000);
  };

  return (
    <div className="design-system-root h-screen overflow-hidden bg-background bg-grid-pattern text-foreground flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="shrink-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-6 gap-4">
          <div className="flex items-center gap-2 font-bold text-lg mr-6">
            <div className="h-6 w-6 bg-primary rounded-sm flex items-center justify-center text-primary-foreground text-xs font-bold">
              C
            </div>
            CodeZest UI Docs
          </div>
          <div className="flex-1 flex items-center">
            <div className="relative w-full max-w-sm hidden md:flex items-center text-muted-foreground">
              <Search className="absolute left-2.5 h-4 w-4" />
              <Input
                placeholder="Search documentation..."
                className="w-full bg-muted shadow-none pl-9 h-9"
              />
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <a
              href="#"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              GitHub
            </a>
            <ModeToggle />
          </nav>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Page Nav Sidebar (Left) */}
        <aside className="hidden w-64 shrink-0 overflow-y-auto border-r md:block py-6 px-4">
          <div className="space-y-4">
            <div className="pb-4">
              <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">
                Design System
              </h4>
              <div className="grid grid-flow-row auto-rows-max text-sm">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className={`flex w-full items-center rounded-md px-2 py-1.5 text-left text-sm font-medium transition-colors hover:bg-muted ${
                      activeSection === item.id
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main
          id="main-scroll-container"
          className="flex-1 overflow-y-auto p-8 lg:p-12 pb-32"
        >
          <div className="max-w-5xl mx-auto pb-32">
            <IntroSection />
            <TokenGovernanceSection />
            <ColorsSection />
            <SemanticStatusSection />
            <SubjectSystemSection />
            <SidebarSystemSection />
            <ChartSystemSection />
            <InteractiveComponentsSection />
            <ToasterSection />
            <PagePatternsSection />
          </div>
        </main>

        {/* Token Editor Sidebar (Right) */}
        <TokenEditorSidebar />
      </div>
    </div>
  );
}
