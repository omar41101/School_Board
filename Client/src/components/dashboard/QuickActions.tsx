import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { UserPlus, Calendar, Megaphone, FileText, CreditCard, BookOpen } from "lucide-react";

interface QuickActionsProps {
  onAction?: (action: string) => void;
}

export function QuickActions({ onAction }: QuickActionsProps) {
  const handleAction = (actionType: string) => {
    if (onAction) {
      onAction(actionType);
    } else {
      console.log(`Action: ${actionType}`);
    }
  };

  const quickActions = [
    {
      label: "Add Student",
      icon: UserPlus,
      color: 'primary' as const,
      action: 'add-student'
    },
    {
      label: "Schedule Exam",
      icon: Calendar,
      color: 'secondary' as const,
      action: 'schedule-exam'
    },
    {
      label: "Publish Event",
      icon: Megaphone,
      color: 'accent' as const,
      action: 'publish-event'
    },
    {
      label: "Generate Report",
      icon: FileText,
      color: 'primary' as const,
      action: 'generate-report'
    },
    {
      label: "Manage Payments",
      icon: CreditCard,
      color: 'secondary' as const,
      action: 'manage-payments'
    },
    {
      label: "Course Setup",
      icon: BookOpen,
      color: 'accent' as const,
      action: 'course-setup'
    }
  ];

  const getButtonClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return 'bg-[#0D1B2A] hover:bg-[#1B2B3A] text-white';
      case 'secondary':
        return 'bg-[#3E92CC] hover:bg-[#5BA3D4] text-white';
      case 'accent':
        return 'bg-[#E0E1DD] hover:bg-[#D5D6D1] text-[#0D1B2A]';
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className={`h-20 flex-col gap-2 border-0 ${getButtonClasses(action.color)}`}
                onClick={() => handleAction(action.action)}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}