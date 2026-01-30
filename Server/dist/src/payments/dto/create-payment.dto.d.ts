export declare class CreatePaymentDto {
    studentId: number;
    type: string;
    amount: number;
    currency?: string;
    status?: string;
    dueDate: string;
    paidDate?: string;
    paymentMethod?: string;
    transactionId?: string;
    remarks?: string;
    academicYear: string;
    semester?: string;
}
