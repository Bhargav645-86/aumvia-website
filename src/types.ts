// src/types.ts
export interface Staff {
  id: string;
  name: string;
  role: string;
  color: string; // e.g., '#4CAF50' for visual differentiation
}

export interface Shift {
  id: string;
  staffId: string;
  start: Date;
  end: Date;
  title: string; // e.g., "John Doe - Shift"
  color: string;
  status: 'draft' | 'published' | 'approved';
}

export interface Timesheet {
  id: string;
  shiftId: string;
  staffId: string;
  clockIn: Date;
  clockOut: Date;
  submittedAt: Date;
  status: 'pending' | 'auto-approved' | 'requires-review' | 'approved';
  variance: number; // Minutes difference from published shift
}

export interface Rota {
  weekStart: Date;
  shifts: Shift[];
  totalHours: { [staffId: string]: number }; // Calculated weekly total
}

export interface Conflict {
  type: 'double-booking' | 'leave-clash' | 'understaffed';
  message: string;
  severity: 'red' | 'amber';
}