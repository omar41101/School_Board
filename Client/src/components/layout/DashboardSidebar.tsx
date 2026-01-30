import { useState } from "react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import {
  Home,
  Users,
  GraduationCap,
  UserCheck,
  User,
  Settings,
  BarChart3,
  CreditCard,
  Calendar,
  MessageSquare,
  FileText,
  Utensils,
  PartyPopper,
  Brain,
  Search,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface SidebarItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  view: string;
  badge?: string;
  children?: SidebarItem[];
}

interface DashboardSidebarProps {
  role: 'admin' | 'teacher' | 'student' | 'parent' | 'direction';
  currentView?: string;
  onNavigate?: (view: string) => void;
}

export function DashboardSidebar({ role, currentView = 'overview', onNavigate }: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const getMenuItems = (r: DashboardSidebarProps["role"]): SidebarItem[] => {
    const common: SidebarItem[] = [
      { label: "Dashboard", icon: Home, view: "overview" },
    ];

    const byRole: Record<DashboardSidebarProps["role"], SidebarItem[]> = {
      admin: [
        ...common,
        { label: "Analytics", icon: BarChart3, view: "analytics" },
        { label: "Users", icon: Users, view: "users" },
        { label: "Students", icon: GraduationCap, view: "students" },
        { label: "Teachers", icon: UserCheck, view: "teachers" },
        { label: "Parents", icon: User, view: "parents" },
        { label: "Courses", icon: Calendar, view: "courses" },
        { label: "Settings", icon: Settings, view: "settings" },
      ],
      direction: [
        ...common,
        { label: "Analytics", icon: BarChart3, view: "analytics" },
        { label: "Users", icon: Users, view: "users" },
        { label: "Students", icon: GraduationCap, view: "students" },
        { label: "Teachers", icon: UserCheck, view: "teachers" },
        { label: "Parents", icon: User, view: "parents" },
        { label: "Courses", icon: Calendar, view: "courses" },
        { label: "Settings", icon: Settings, view: "settings" },
      ],
      teacher: [
        ...common,
        { label: "My Classes", icon: GraduationCap, view: "classes" },
        { label: "Grades", icon: FileText, view: "grades" },
        { label: "Schedule", icon: Calendar, view: "schedule" },
        { label: "Messages", icon: MessageSquare, view: "messages" },
        { label: "Events", icon: PartyPopper, view: "events" },
      ],
      student: [
        ...common,
        { label: "My Grades", icon: BarChart3, view: "grades" },
        { label: "Homework", icon: FileText, view: "homework" },
        { label: "Schedule", icon: Calendar, view: "schedule" },
        { label: "Messages", icon: MessageSquare, view: "messages" },
        { label: "Events", icon: PartyPopper, view: "events" },
        { label: "Payments", icon: CreditCard, view: "payments" },
        { label: "Cantine", icon: Utensils, view: "cantine" },
      ],
      parent: [
        ...common,
        { label: "Child Progress", icon: BarChart3, view: "progress" },
        { label: "Communication", icon: MessageSquare, view: "communication" },
        { label: "Payments", icon: CreditCard, view: "payments" },
        { label: "Events", icon: PartyPopper, view: "events" },
      ],
    };

    return byRole[r] ?? common;
  };

  const menuItems = getMenuItems(role);

  return (
    <div className={`bg-gradient-to-b from-[#0D1B2A] via-[#1B2B3A] to-[#0D1B2A] border-r border-[#3E92CC]/20 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } min-h-screen rounded-r-xl m-2 shadow-2xl`}>
      {/* Header */}
      <div className="p-4 border-b border-[#3E92CC]/20">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-bold text-white">SchoolERP</h2>
              <p className="text-xs text-[#3E92CC] capitalize">{role} Portal</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0 text-white hover:bg-[#3E92CC]/20"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 p-4">
        <nav className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentView === item.view;
            
            return (
              <Button
                key={index}
                variant="ghost"
                className={`w-full justify-start h-10 ${
                  isActive 
                    ? "bg-[#3E92CC] text-white hover:bg-[#3E92CC]/80 shadow-lg" 
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                } ${isCollapsed ? 'px-2' : 'px-3'} rounded-lg transition-all duration-200`}
                onClick={() => onNavigate?.(item.view)}
              >
                <Icon className={`h-4 w-4 ${isCollapsed ? '' : 'mr-3'} flex-shrink-0`} />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-2 bg-white/20 text-white text-xs border-0">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            );
          })}
        </nav>
      </ScrollArea>
    </div>
  );
}