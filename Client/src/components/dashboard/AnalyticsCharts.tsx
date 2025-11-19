import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { attendanceApi, gradeApi, paymentApi, normalizeArrayResponse } from '../../lib/api';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';

interface AnalyticsChartsProps {
  studentId?: string;
}

export function AnalyticsCharts({ studentId }: AnalyticsChartsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [gradesData, setGradesData] = useState<any[]>([]);
  const [paymentsData, setPaymentsData] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [studentId]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [attendanceResponse, gradesResponse, paymentsResponse] = await Promise.all([
        attendanceApi.getAll(),
        gradeApi.getAll(),
        paymentApi.getAll()
      ]);

      const allAttendance = normalizeArrayResponse(attendanceResponse);
      const allGrades = normalizeArrayResponse(gradesResponse);
      const allPayments = normalizeArrayResponse(paymentsResponse);

      // Filter by student if provided
      const filteredAttendance = studentId 
        ? allAttendance.filter((a: any) => a.student?._id === studentId || a.student === studentId)
        : allAttendance;
      
      const filteredGrades = studentId
        ? allGrades.filter((g: any) => g.student?._id === studentId || g.student === studentId)
        : allGrades;
      
      const filteredPayments = studentId
        ? allPayments.filter((p: any) => p.student?._id === studentId || p.student === studentId)
        : allPayments;

      // Process attendance data by month
      const attendanceByMonth = processAttendanceByMonth(filteredAttendance);
      setAttendanceData(attendanceByMonth);

      // Process grades data by month
      const gradesByMonth = processGradesByMonth(filteredGrades);
      setGradesData(gradesByMonth);

      // Process payments data
      const paymentStats = processPaymentStats(filteredPayments);
      setPaymentsData(paymentStats);

    } catch (err: any) {
      console.error('Failed to fetch analytics:', err);
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const processAttendanceByMonth = (attendance: any[]) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData: any = {};

    attendance.forEach((record: any) => {
      const date = new Date(record.date);
      const monthKey = monthNames[date.getMonth()];
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { total: 0, present: 0 };
      }
      
      monthlyData[monthKey].total++;
      if (record.status === 'present' || record.status === 'late') {
        monthlyData[monthKey].present++;
      }
    });

    return monthNames.map(month => ({
      month,
      attendance: monthlyData[month] 
        ? Math.round((monthlyData[month].present / monthlyData[month].total) * 100)
        : 0
    })).filter(m => m.attendance > 0).slice(-6);
  };

  const processGradesByMonth = (grades: any[]) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData: any = {};

    grades.forEach((grade: any) => {
      const date = new Date(grade.examDate || grade.createdAt);
      const monthKey = monthNames[date.getMonth()];
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { total: 0, sum: 0 };
      }
      
      monthlyData[monthKey].total++;
      monthlyData[monthKey].sum += grade.percentage || 0;
    });

    return monthNames.map(month => ({
      month,
      average: monthlyData[month] 
        ? Math.round(monthlyData[month].sum / monthlyData[month].total)
        : 0
    })).filter(m => m.average > 0).slice(-6);
  };

  const processPaymentStats = (payments: any[]) => {
    const total = payments.length;
    if (total === 0) {
      return [
        { name: 'Paid', value: 0, color: '#0D1B2A' },
        { name: 'Pending', value: 0, color: '#3E92CC' },
        { name: 'Overdue', value: 0, color: '#EF4444' }
      ];
    }

    const paid = payments.filter(p => p.status === 'paid').length;
    const pending = payments.filter(p => p.status === 'pending').length;
    const overdue = payments.filter(p => p.status === 'overdue').length;

    return [
      { name: 'Paid', value: Math.round((paid / total) * 100), color: '#0D1B2A' },
      { name: 'Pending', value: Math.round((pending / total) * 100), color: '#3E92CC' },
      { name: 'Overdue', value: Math.round((overdue / total) * 100), color: '#EF4444' }
    ];
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-[#3E92CC]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-64 space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchAnalyticsData} variant="outline">Retry</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Attendance Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Rate</CardTitle>
        </CardHeader>
        <CardContent>
          {attendanceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="attendance" fill="#3E92CC" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-400">
              No attendance data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grades Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Average Grades</CardTitle>
        </CardHeader>
        <CardContent>
          {gradesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={gradesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="average" 
                  stroke="#0D1B2A" 
                  strokeWidth={3}
                  dot={{ fill: '#0D1B2A', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-400">
              No grades data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payments Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Status</CardTitle>
        </CardHeader>
        <CardContent>
          {paymentsData.some(p => p.value > 0) ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={paymentsData.filter(p => p.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {paymentsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center mt-4 space-x-4">
                {paymentsData.map((entry, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm">{entry.name}: {entry.value}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-400">
              No payment data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}