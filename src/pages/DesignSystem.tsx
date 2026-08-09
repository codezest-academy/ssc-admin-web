import { useState, useEffect } from "react";

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
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    const container = document.getElementById("ds-main-scroll");
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, [isManualScroll]);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    setIsManualScroll(true);
    const container = document.getElementById("ds-main-scroll");
    const el = document.getElementById(id);
    if (container && el) {
      container.scrollTo({ top: el.offsetTop - 24, behavior: "smooth" });
    }
    setTimeout(() => setIsManualScroll(false), 1000);
  };

  return (
    <div className="design-system-root -m-6 h-[calc(100%+3rem)] overflow-hidden flex text-foreground">
      {/* Inner Section Nav */}
      <aside className="hidden w-52 shrink-0 overflow-y-auto border-r border-border md:block py-6 px-3">
        <h4 className="mb-3 px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Sections
        </h4>
        <div className="grid grid-flow-row auto-rows-max text-sm gap-0.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`flex w-full items-center rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                activeSection === item.id
                  ? "bg-muted text-foreground font-medium"
                  : "text-muted-foreground font-normal"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </aside>

      {/* Scrollable Content */}
      <main id="ds-main-scroll" className="flex-1 overflow-y-auto p-8 lg:p-10 pb-32">
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
  );
}
