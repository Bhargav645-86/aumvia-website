interface Shift {
  id: number;
  employeeId: string;
  start: Date;
  duration: number;
  role: string;
}

export const calculateTotalHours = (shifts: Shift[]) => {
  return shifts.reduce((total, shift) => total + shift.duration, 0);
};