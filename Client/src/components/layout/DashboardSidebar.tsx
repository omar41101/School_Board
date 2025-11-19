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
  icon: React.ComponentType<any>;
  href: string;
  badge?: string;
  children?: SidebarItem[];
}

interface DashboardSidebarProps {
  userRole: 'admin' | 'teacher' | 'student' | 'parent' | 'direction';
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export function DashboardSidebar({ userRole, currentPath = '/dashboard', onNavigate }: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const getMenuItems = (role: string): SidebarItem[] => {
    const commonItems = [
      { label: "Dashboard", icon: Home, href: "/dashboard" },
      { label: "Messages", icon: MessageSquare, href: "/messages", badge: "3" }
    ];

    const roleSpecificItems = {
      admin: [
        ...commonItems,
        { label: "User Management", icon: Users, href: "/users" },
        { label: "Teachers", icon: UserCheck, href: "/teachers" },
        { label: "Students", icon: GraduationCap, href: "/students" },
        { label: "Parents", icon: User, href: "/parents" },
        { label: "Analytics", icon: BarChart3, href: "/analytics" },
        { label: "Payments", icon: CreditCard, href: "/payments" },
        { label: "Planning", icon: Calendar, href: "/planning" },
        { label: "Courses & Classes", icon: Calendar, href: "/courses" },
        { label: "Documents", icon: FileText, href: "/documents" },
        { label: "Cantine", icon: Utensils, href: "/cantine" },
        { label: "Events", icon: PartyPopper, href: "/events" },
        { label: "Psychology Reports", icon: Brain, href: "/psychology" },
        { label: "Settings", icon: Settings, href: "/settings" }
      ],
      teacher: [
        ...commonItems,
        { label: "My Classes", icon: GraduationCap, href: "/my-classes" },
        { label: "Students", icon: Users, href: "/students" },
        { label: "Grades & Homework", icon: FileText, href: "/grades" },
        { label: "Schedule", icon: Calendar, href: "/schedule" },
        { label: "Parent Communication", icon: MessageSquare, href: "/parent-chat" },
        { label: "Psychology Reports", icon: Brain, href: "/psychology" }
      ],
      student: [
        ...commonItems,
        { label: "My Grades", icon: BarChart3, href: "/grades" },
        { label: "Homework", icon: FileText, href: "/homework" },
        { label: "Schedule", icon: Calendar, href: "/schedule" },
        { label: "Payments", icon: CreditCard, href: "/payments" },
        { label: "Events", icon: PartyPopper, href: "/events" },
        { label: "Cantine Orders", icon: Utensils, href: "/cantine" }
      ],
      parent: [
        ...commonItems,
        { label: "Child Progress", icon: BarChart3, href: "/child-progress" },
        { label: "Payments", icon: CreditCard, href: "/payments" },
        { label: "Teacher Communication", icon: MessageSquare, href: "/teacher-chat" },
        { label: "Events", icon: PartyPopper, href: "/events" },
        { label: "Psychology Reports", icon: Brain, href: "/psychology" }
      ],
      direction: [
        ...commonItems,
        { label: "School Analytics", icon: BarChart3, href: "/school-analytics" },
        { label: "Bulletins", icon: FileText, href: "/bulletins" },
        { label: "Exam Approvals", icon: Search, href: "/exam-approvals", badge: "5" },
        { label: "School Reports", icon: FileText, href: "/reports" },
        { label: "Surveys", icon: MessageSquare, href: "/surveys" }
      ]
    };

    return roleSpecificItems[role as keyof typeof roleSpecificItems] || commonItems;
  };

  const menuItems = getMenuItems(userRole);

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
              <p className="text-xs text-[#3E92CC] capitalize">{userRole} Portal</p>
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
            const isActive = currentPath === item.href;
            
            return (
              <Button
                key={index}
                variant="ghost"
                className={`w-full justify-start h-10 ${
                  isActive 
                    ? "bg-[#3E92CC] text-white hover:bg-[#3E92CC]/80 shadow-lg" 
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                } ${isCollapsed ? 'px-2' : 'px-3'} rounded-lg transition-all duration-200`}
                onClick={() => onNavigate?.(item.href)}
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