import { Link, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { useAuthStore } from "@/store/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  LayoutDashboard,
  Users,
  Shield,
  BookOpen,
  ClipboardList,
  Package,
  IndianRupee,
  ChevronRight,
  MessageSquare,
} from "lucide-react";

type NavItem = {
  name: string;
  href?: string;
  icon: any;
  roles?: string[]; // Array of allowed roles, or undefined to allow all
  children?: { name: string; href: string; roles?: string[] }[];
};

type NavGroup = {
  title: string;
  roles?: string[];
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    title: "OVERVIEW",
    items: [
      { name: "Dashboard",     href: "/dashboard",     icon: LayoutDashboard },
    ]
  },
  {
    title: "MANAGEMENT",
    items: [
      { name: "Users",         href: "/users",         icon: Users },
      { name: "Staff",         href: "/staff",         icon: Shield },
      { name: "Subjects",      href: "/subjects",      icon: BookOpen },
      { name: "Feedback",      href: "/feedback",      icon: MessageSquare },
    ]
  },
  {
    title: "CONTENT",
    items: [
      { name: "Test Engine",   icon: ClipboardList, children: [
        { name: "Question Bank", href: "/questions" },
        { name: "Practice Sets", href: "/practice-sets" },
        { name: "Mock Tests",    href: "/mock-tests" }
      ]},
      { name: "Products",      href: "/products",      icon: Package },
    ]
  },
  {
    title: "CMS",
    items: [
      { name: "Categories",    href: "/categories",    icon: BookOpen }, // Or FolderTree, I'll just reuse BookOpen and ClipboardList for simplicity
      { name: "Articles",      href: "/articles",      icon: ClipboardList },
    ]
  },
  {
    title: "REVENUE",
    items: [
      { name: "Sales",         href: "/sales",         icon: IndianRupee },
    ]
  }
];

export function AppSidebar() {
  const location = useLocation();
  const { user } = useAuthStore();
  const { state, setOpen } = useSidebar();
  const userRole = user?.role || "GUEST";

  // Filter navigation groups based on RBAC roles
  const filteredNavGroups = useMemo(() => {
    return navGroups.map(group => {
      // If group has specific role requirements and user lacks them, empty out items
      if (group.roles && !group.roles.includes(userRole)) {
        return { ...group, items: [] };
      }

      const filteredItems = group.items.map(item => {
        // If item has roles and user lacks them, nullify item
        if (item.roles && !item.roles.includes(userRole)) return null;

        // Filter children
        let filteredChildren = item.children;
        if (filteredChildren) {
          filteredChildren = filteredChildren.filter(child => {
            return !(child.roles && !child.roles.includes(userRole));
          });
        }
        
        // If it's a parent menu item but all children were filtered out, nullify parent
        if (item.children && (!filteredChildren || filteredChildren.length === 0)) {
            return null;
        }

        return { ...item, children: filteredChildren };
      }).filter(Boolean) as NavItem[];

      return { ...group, items: filteredItems };
    }).filter(group => group.items.length > 0); // Drop entirely empty groups
  }, [userRole]);

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader className="h-16 flex items-center justify-center px-2 overflow-hidden">
        <span className="text-base font-bold text-primary tracking-tight truncate flex items-center justify-center w-full h-full group-data-[collapsible=icon]:hidden">
          Code Zest Academy
        </span>
        <span className="text-xl font-bold text-primary tracking-tight truncate hidden items-center justify-center w-full h-full group-data-[collapsible=icon]:flex">
          CZ
        </span>
      </SidebarHeader>
      <SidebarContent>
        {filteredNavGroups.map(group => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel 
              className="text-[length:var(--sidebar-group-label-size,12px)] font-[var(--sidebar-group-label-weight,600)] tracking-[var(--sidebar-group-label-tracking,0.08em)] text-[var(--sidebar-group-label-color,var(--sidebar-foreground))]"
            >
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1.5">
                {group.items.map((item) => {
                  const isActive = item.href 
                    ? location.pathname.startsWith(item.href)
                    : item.children?.some(c => location.pathname.startsWith(c.href));

                  if (item.children) {
                    return (
                      <Collapsible key={item.name} defaultOpen={isActive} className="group/collapsible">
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton 
                              tooltip={item.name} 
                              isActive={isActive} 
                              onClick={() => {
                                if (state === "collapsed") setOpen(true);
                              }}
                              className="transition-transform [&>svg]:duration-200 hover:[&>svg]:translate-x-0.5 focus-visible:[&>svg]:translate-x-0"
                            >
                              <item.icon />
                              <span className="group-data-[collapsible=icon]:hidden">{item.name}</span>
                              <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.children.map(child => {
                                const isChildActive = location.pathname.startsWith(child.href);
                                return (
                                  <SidebarMenuSubItem key={child.name}>
                                    <SidebarMenuSubButton asChild isActive={isChildActive} className="transition-transform hover:translate-x-1 focus-visible:translate-x-0">
                                      <Link to={child.href}>
                                        <span>{child.name}</span>
                                      </Link>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                );
                              })}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    );
                  }

                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton asChild tooltip={item.name} isActive={isActive} className="transition-transform [&>svg]:duration-200 hover:[&>svg]:translate-x-0.5 focus-visible:[&>svg]:translate-x-0">
                        <Link to={item.href!}>
                          <item.icon />
                          <span className="group-data-[collapsible=icon]:hidden">{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
