export const mockEmployees = [
  { id: '1', name: 'Ben', role: 'Barista' },
  { id: '2', name: 'Chloe', role: 'Manager' },
];

export const mockShifts = [
  { id: 1, employeeId: '1', start: new Date(), duration: 8, role: 'Barista' },
];

export const mockTimesheets = [
  { id: 1, employeeName: 'Chloe', hours: 8.5, date: new Date(), status: 'pending' as const },
];