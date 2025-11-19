import { useState } from 'react';
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
  Upload,
  Send
} from 'lucide-react';

export function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Mock data for payments
  const mockPayments: Payment[] = [
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      student: {
        id: '1',
        name: 'Alice Johnson',
        matricule: 'STU2024001',
        className: '10-A'
      },
      type: 'tuition',
      amount: 1200,
      currency: 'USD',
      status: 'paid',
      dueDate: '2024-10-15',
      paidDate: '2024-10-10',
      paymentMethod: 'bank_transfer',
      description: 'Semester 1 Tuition Fee',
      semester: 'Fall 2024',
      academicYear: '2024-2025'
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      student: {
        id: '2',
        name: 'Bob Smith',
        matricule: 'STU2024002',
        className: '11-B'
      },
      type: 'transport',
      amount: 300,
      currency: 'USD',
      status: 'pending',
      dueDate: '2024-11-01',
      description: 'Monthly Transport Fee',
      semester: 'Fall 2024',
      academicYear: '2024-2025'
    },
    {
      id: '3',
      invoiceNumber: 'INV-2024-003',
      student: {
        id: '3',
        name: 'Carol Davis',
        matricule: 'STU2024003',
        className: '9-C'
      },
      type: 'tuition',
      amount: 1500,
      currency: 'USD',
      status: 'overdue',
      dueDate: '2024-09-30',
      description: 'Semester 1 Tuition Fee (Advanced Program)',
      discount: 150,
      semester: 'Fall 2024',
      academicYear: '2024-2025'
    },
    {
      id: '4',
      invoiceNumber: 'INV-2024-004',
      student: {
        id: '4',
        name: 'David Wilson',
        matricule: 'STU2024004',
        className: '12-A'
      },
      type: 'meals',
      amount: 250,
      currency: 'USD',
      status: 'partial',
      dueDate: '2024-10-20',
      paidDate: '2024-10-18',
      paidAmount: 150,
      remainingAmount: 100,
      paymentMethod: 'cash',
      description: 'Monthly Meal Plan',
      semester: 'Fall 2024',
      academicYear: '2024-2025'
    },
    {
      id: '5',
      invoiceNumber: 'INV-2024-005',
      student: {
        id: '5',
        name: 'Emma Brown',
        matricule: 'STU2024005',
        className: '10-B'
      },
      type: 'materials',
      amount: 180,
      currency: 'USD',
      status: 'cancelled',
      dueDate: '2024-10-05',
      description: 'Science Lab Materials',
      semester: 'Fall 2024',
      academicYear: '2024-2025'
    }
  ];

  const filteredPayments = mockPayments.filter(payment => {
    const matchesSearch = payment.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.student.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === 'all' || payment.status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const getPaymentStats = () => {
    const total = mockPayments.reduce((sum, p) => sum + p.amount, 0);
    const paid = mockPayments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);
    const pending = mockPayments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);
    const overdue = mockPayments
      .filter(p => p.status === 'overdue')
      .reduce((sum, p) => sum + p.amount, 0);
    const partial = mockPayments
      .filter(p => p.status === 'partial')
      .reduce((sum, p) => sum + (p.paidAmount || 0), 0);

    return {
      total: mockPayments.length,
      paid: mockPayments.filter(p => p.status === 'paid').length,
      pending: mockPayments.filter(p => p.status === 'pending').length,
      overdue: mockPayments.filter(p => p.status === 'overdue').length,
      partial: mockPayments.filter(p => p.status === 'partial').length,
      cancelled: mockPayments.filter(p => p.status === 'cancelled').length,
      totalAmount: total,
      paidAmount: paid + partial,
      pendingAmount: pending,
      overdueAmount: overdue
    };
  };

  const stats = getPaymentStats();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleViewPayment = (payment: Payment) => {
    console.log('View payment:', payment.invoiceNumber);
    // Implementation for viewing payment details
  };

  const handleDownloadPayment = (payment: Payment) => {
    console.log('Download invoice:', payment.invoiceNumber);
    // Implementation for downloading invoice
  };

  const handleSendReminder = (payment: Payment) => {
    console.log('Send reminder for:', payment.invoiceNumber);
    // Implementation for sending payment reminder
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1B2A] dark:text-white">Payments & Billing</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage student fees and track payment status</p>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Revenue</p>
                <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">
                  {formatCurrency(stats.paidAmount)}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  +12% from last month
                </p>
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
                <p className="text-xs text-gray-500 mt-1">
                  {stats.pending} invoices
                </p>
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
                <p className="text-xs text-red-500 mt-1">
                  {stats.overdue} overdue
                </p>
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
                  {Math.round((stats.paidAmount / stats.totalAmount) * 100)}%
                </p>
                <p className="text-xs text-[#3E92CC] mt-1">
                  {stats.paid} paid
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-[#3E92CC]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
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

      {/* Payments List */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6 max-w-2xl">
          <TabsTrigger value="all">
            All ({stats.total})
          </TabsTrigger>
          <TabsTrigger value="paid">
            Paid ({stats.paid})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({stats.pending})
          </TabsTrigger>
          <TabsTrigger value="overdue">
            Overdue ({stats.overdue})
          </TabsTrigger>
          <TabsTrigger value="partial">
            Partial ({stats.partial})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({stats.cancelled})
          </TabsTrigger>
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
                  {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by creating your first invoice.'}
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