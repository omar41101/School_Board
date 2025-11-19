import { Card, CardContent, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { 
  CreditCard, 
  Calendar,
  DollarSign,
  User,
  MoreVertical,
  Eye,
  Download,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export interface Payment {
  id: string;
  invoiceNumber: string;
  student: {
    id: string;
    name: string;
    matricule: string;
    avatar?: string;
    className: string;
  };
  type: 'tuition' | 'transport' | 'meals' | 'materials' | 'extra' | 'registration';
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled' | 'partial';
  dueDate: string;
  paidDate?: string;
  paymentMethod?: 'cash' | 'bank_transfer' | 'card' | 'cheque' | 'online';
  description: string;
  discount?: number;
  paidAmount?: number;
  remainingAmount?: number;
  semester: string;
  academicYear: string;
}

interface PaymentCardProps {
  payment: Payment;
  onView: (payment: Payment) => void;
  onDownload: (payment: Payment) => void;
  onSendReminder?: (payment: Payment) => void;
}

export function PaymentCard({ payment, onView, onDownload, onSendReminder }: PaymentCardProps) {
  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'partial':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'overdue':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'partial':
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeColor = (type: Payment['type']) => {
    switch (type) {
      case 'tuition':
        return 'bg-[#3E92CC]/10 text-[#3E92CC] border-[#3E92CC]/20';
      case 'transport':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'meals':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'materials':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'registration':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: payment.currency || 'USD'
    }).format(amount);
  };

  const isOverdue = payment.status === 'overdue' || (payment.status === 'pending' && new Date(payment.dueDate) < new Date());

  return (
    <Card className={`hover:shadow-lg transition-all duration-300 border-0 bg-white dark:bg-[#1B2B3A] shadow-md hover:shadow-[#3E92CC]/20 group ${
      isOverdue ? 'ring-2 ring-red-200 dark:ring-red-800' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <Badge className={`text-xs px-2 py-1 ${getStatusColor(payment.status)}`}>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(payment.status)}
                  <span className="capitalize">{payment.status}</span>
                </div>
              </Badge>
              <Badge variant="outline" className={`text-xs px-2 py-1 ${getTypeColor(payment.type)}`}>
                {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)}
              </Badge>
            </div>
            <h3 className="font-semibold text-[#0D1B2A] dark:text-white mb-1">
              {payment.description}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Invoice #{payment.invoiceNumber}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg text-[#0D1B2A] dark:text-white">
              {formatCurrency(payment.amount)}
            </p>
            {payment.discount && payment.discount > 0 && (
              <p className="text-xs text-green-600">
                -{formatCurrency(payment.discount)} discount
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Student Info */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-[#0D1B2A]/50 rounded-lg">
          <Avatar className="h-10 w-10">
            <AvatarImage src={payment.student.avatar} />
            <AvatarFallback className="bg-[#3E92CC] text-white">
              {payment.student.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-[#0D1B2A] dark:text-white truncate">
              {payment.student.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {payment.student.matricule} • {payment.student.className}
            </p>
          </div>
        </div>

        {/* Payment Details */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Due Date:</span>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4 text-[#3E92CC]" />
              <span className={`font-medium ${isOverdue ? 'text-red-600' : 'text-[#0D1B2A] dark:text-white'}`}>
                {payment.dueDate}
              </span>
            </div>
          </div>

          {payment.paidDate && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Paid Date:</span>
              <span className="font-medium text-green-600">{payment.paidDate}</span>
            </div>
          )}

          {payment.paymentMethod && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Payment Method:</span>
              <div className="flex items-center space-x-1">
                <CreditCard className="h-4 w-4 text-[#3E92CC]" />
                <span className="font-medium text-[#0D1B2A] dark:text-white capitalize">
                  {payment.paymentMethod.replace('_', ' ')}
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Academic Period:</span>
            <span className="font-medium text-[#0D1B2A] dark:text-white">
              {payment.semester} - {payment.academicYear}
            </span>
          </div>
        </div>

        {/* Partial Payment Info */}
        {payment.status === 'partial' && payment.paidAmount && payment.remainingAmount && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-blue-700 dark:text-blue-300">Paid Amount:</span>
              <span className="font-medium text-blue-700 dark:text-blue-300">
                {formatCurrency(payment.paidAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-700 dark:text-blue-300">Remaining:</span>
              <span className="font-medium text-blue-700 dark:text-blue-300">
                {formatCurrency(payment.remainingAmount)}
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(payment)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownload(payment)}
          >
            <Download className="h-4 w-4" />
          </Button>
          {onSendReminder && (payment.status === 'pending' || payment.status === 'overdue') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSendReminder(payment)}
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}