export interface Employee {
  id: string;
  name: string;
  role: string;
}

export interface Shift {
  id: number;
  employeeId: string;
  start: Date;
  duration: number;
  role: string;
}

export interface Timesheet {
  id: number;
  employeeName: string;
  hours: number;
  date: Date;
  status: 'pending' | 'approved';
}