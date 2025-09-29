
export interface AttendanceForm {
    student_id: string;
    date: string;
    time: string;
    remarks?: string;
}

export interface Attendance {
    student_id: string;
    date: string;
    time: string;
    remarks: string;
}
