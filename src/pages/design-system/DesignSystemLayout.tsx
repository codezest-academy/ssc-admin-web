import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Bell, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/mode-toggle";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TokenEditorSidebar } from "./TokenEditorSidebar";
import { IntroSection } from "./sections/IntroSection";
import { ColorsSection } from "./sections/ColorsSection";
import { SemanticStatusSection } from "./sections/SemanticStatusSection";
import { SubjectSystemSection } from "./sections/SubjectSystemSection";
import { SidebarSystemSection } from "./sections/SidebarSystemSection";
import { ChartSystemSection } from "./sections/ChartSystemSection";
import { InteractiveComponentsSection } from "./sections/InteractiveComponentsSection";
import { ToasterSection } from "./sections/ToasterSection";
import { PagePatternsSection } from "./sections/PagePatternsSection";
import { TokenGovernanceSection } from "./sections/TokenGovernanceSection";

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

export default function DesignSystemLayout() {
  const [activeSection, setActiveSection] = useState("intro");
  const [isManualScroll, setIsManualScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isManualScroll) return;
      for (const { id } of navItems) {
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
    <TooltipProvider delayDuration={200}>
      <div className="design-system-root bg-mesh text-foreground min-h-screen">
        {/* Same floating shell as AdminLayout */}
        <div className="app-shell-floating bg-transparent w-full">

          {/* Docs Sections Sidebar — styled like the floating AppSidebar */}
          <div
            className="sidebar-floating flex flex-col h-full bg-sidebar"
            style={{ width: "var(--sidebar-width, 16rem)" }}
          >
            {/* Sidebar Header */}
            <div className="h-16 flex items-center px-4 border-b border-sidebar-border shrink-0">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 bg-primary rounded-md flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
                  CZ
                </div>
                <span className="text-sm font-bold text-foreground truncate">UI Docs</span>
              </div>
            </div>

            {/* Nav Items */}
            <div className="flex-1 overflow-y-auto py-4 px-3">
              <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Sections
              </p>
              <div className="flex flex-col gap-0.5">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className={`flex w-full items-center rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                      activeSection === item.id
                        ? "bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-fg)] font-medium shadow-[inset_3px_0_0_var(--sidebar-active-border)]"
                        : "text-sidebar-foreground font-normal"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Back to Admin */}
            <div className="p-3 border-t border-sidebar-border shrink-0">
              <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" asChild>
                <Link to="/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Admin
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column: Navbar + Content */}
          <div className="flex flex-col flex-1 gap-3 min-w-0">
            {/* Floating Navbar */}
            <header className="navbar-floating flex items-center justify-between px-5 h-14 flex-shrink-0">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative w-full max-w-sm hidden sm:block">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search docs..."
                    className="w-full bg-muted/50 shadow-none pl-8 h-9 rounded-full border-border/60"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ModeToggle />
                <Button variant="ghost" size="icon" className="text-muted-foreground rounded-full hidden sm:flex">
                  <Bell className="w-5 h-5" />
                  <span className="sr-only">Notifications</span>
                </Button>
              </div>
            </header>

            {/* Floating Content Panel */}
            <div className="content-floating flex overflow-hidden">
              <main id="ds-main-scroll" className="flex-1 overflow-y-auto p-8 lg:p-10">
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
              <TokenEditorSidebar />
            </div>
          </div>

        </div>
      </div>
    </TooltipProvider>
  );
}
