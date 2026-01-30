import { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import {
  useGetPaymentsQuery,
  useGetStudentMeQuery,
  useGetParentMeQuery,
} from '../../services/api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { PaymentCard, Payment } from '../payments/PaymentCard';
import {
  Plus,
  Filter,
  Search,
  CreditCard,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Download,
  Send,
  Loader2,
} from 'lucide-react';
import type { Payment as ApiPayment } from '../../types';

function toPaymentCardFormat(p: ApiPayment): Payment {
  const studentName =
    p.student?.user?.firstName && p.student?.user?.lastName
      ? `${p.student.user.firstName} ${p.student.user.lastName}`
      : 'Student';
  return {
    id: String(p.id),
    invoiceNumber: p.receiptNumber || `INV-${p.id}`,
    student: {
      id: String(p.studentId),
      name: studentName,
      matricule: p.student?.matricule || '-',
      className: p.student?.className || '-',
    },
    type: p.type as Payment['type'],
    amount: Number(p.amount),
    currency: p.currency || 'USD',
    status: p.status as Payment['status'],
    dueDate: new Date(p.dueDate).toISOString().split('T')[0],
    paidDate: p.paidDate
      ? new Date(p.paidDate).toISOString().split('T')[0]
      : undefined,
    paymentMethod: p.paymentMethod as Payment['paymentMethod'],
    description: p.remarks || `${p.type} - ${p.academicYear}`,
    semester: p.semester || 'Fall',
    academicYear: p.academicYear,
  };
}

export function PaymentsPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const role = (user as { role?: string })?.role;
  const { data: studentMeData } = useGetStudentMeQuery(undefined, {
    skip: role !== 'student',
  });
  const { data: parentMeData } = useGetParentMeQuery(undefined, {
    skip: role !== 'parent',
  });

  const studentId = role === 'student' ? studentMeData?.data?.student?.id : undefined;
  const parentId = role === 'parent' ? parentMeData?.data?.parent?.id : undefined;

  const { data: paymentsData, isLoading, error } = useGetPaymentsQuery(
    studentId ? { student: studentId } : parentId ? { parent: parentId } : {},
  );

  const apiPayments = (paymentsData?.data?.payments || []) as ApiPayment[];
  const allPayments = apiPayments;
  const payments = allPayments.map(toPaymentCardFormat);

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.student.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || payment.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const stats = {
    total: payments.length,
    paid: payments.filter((p) => p.status === 'paid').length,
    pending: payments.filter((p) => p.status === 'pending').length,
    overdue: payments.filter((p) => p.status === 'overdue').length,
    partial: payments.filter((p) => p.status === 'partial').length,
    cancelled: payments.filter((p) => p.status === 'cancelled').length,
    totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
    paidAmount: payments
      .filter((p) => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0),
    pendingAmount: payments
      .filter((p) => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0),
    overdueAmount: payments
      .filter((p) => p.status === 'overdue')
      .reduce((sum, p) => sum + p.amount, 0),
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const handleViewPayment = (payment: Payment) => {
    console.log('View payment:', payment.invoiceNumber);
  };

  const handleDownloadPayment = (payment: Payment) => {
    console.log('Download invoice:', payment.invoiceNumber);
  };

  const handleSendReminder = (payment: Payment) => {
    console.log('Send reminder for:', payment.invoiceNumber);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading payments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-gray-600 mb-4">Failed to load payments</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1B2A] dark:text-white">
            Payments & Billing
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage student fees and track payment status
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Send className="mr-2 h-4 w-4" />
            Send Reminders
          </Button>
          <Button className="bg-[#0D1B2A] hover:bg-[#1B2B3A] dark:bg-[#3E92CC] dark:hover:bg-[#3E92CC]/80">
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Revenue</p>
                <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">
                  {formatCurrency(stats.paidAmount)}
                </p>
                <p className="text-xs text-green-600 mt-1">Paid</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Pending Amount</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {formatCurrency(stats.pendingAmount)}
                </p>
                <p className="text-xs text-gray-500 mt-1">{stats.pending} invoices</p>
              </div>
              <CreditCard className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Overdue Amount</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(stats.overdueAmount)}
                </p>
                <p className="text-xs text-red-500 mt-1">{stats.overdue} overdue</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Collection Rate</p>
                <p className="text-2xl font-bold text-[#3E92CC]">
                  {stats.totalAmount > 0
                    ? Math.round((stats.paidAmount / stats.totalAmount) * 100)
                    : 0}
                  %
                </p>
                <p className="text-xs text-[#3E92CC] mt-1">{stats.paid} paid</p>
              </div>
              <TrendingUp className="h-8 w-8 text-[#3E92CC]" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by student, invoice number, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Advanced Filters
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6 max-w-2xl">
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          <TabsTrigger value="paid">Paid ({stats.paid})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({stats.overdue})</TabsTrigger>
          <TabsTrigger value="partial">Partial ({stats.partial})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({stats.cancelled})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredPayments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPayments.map((payment) => (
                <PaymentCard
                  key={payment.id}
                  payment={payment}
                  onView={handleViewPayment}
                  onDownload={handleDownloadPayment}
                  onSendReminder={handleSendReminder}
                />
              ))}
            </div>
          ) : (
            <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
              <CardContent className="p-12 text-center">
                <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#0D1B2A] dark:text-white mb-2">
                  No payments found
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {searchTerm
                    ? 'Try adjusting your search criteria.'
                    : 'Get started by creating your first invoice.'}
                </p>
                {!searchTerm && (
                  <Button className="bg-[#0D1B2A] hover:bg-[#1B2B3A] dark:bg-[#3E92CC] dark:hover:bg-[#3E92CC]/80">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Invoice
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
