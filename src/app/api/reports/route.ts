import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

interface StaffMember {
  id: string;
  name: string;
  role: string;
  hourly_rate: number;
  business_id?: string;
}

interface Shift {
  id: string;
  staff_id: string;
  business_id: string;
  start_time: string;
  end_time: string;
  unpaid_break_minutes?: number;
  staff?: StaffMember;
}

interface Timesheet {
  id: string;
  shift_id: string;
  staff_id: string;
  business_id: string;
  status: string;
  actual_hours?: number;
  variance_minutes?: number;
  staff?: StaffMember;
}

interface LaborData {
  totalHours: number;
  totalCost: number;
  approvedTimesheets: number;
  pendingTimesheets: number;
  shifts: Shift[];
  timesheets: Timesheet[];
  staff: StaffMember[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId') || 'default';
    const period = searchParams.get('period') || 'weekly';

    const client = await clientPromise;
    const db = client.db('aumvia');

    const inventoryItems = await db.collection('inventory_items').find({ businessId }).toArray();
    const totalInventoryValue = inventoryItems.reduce((sum, item) => sum + ((item.unitCost || 0) * (item.quantity || 0)), 0);

    const wasteLogs = await db.collection('waste_logs').find({ businessId }).toArray();
    const totalWasteCost = wasteLogs.reduce((sum, log) => sum + (log.wasteCost || 0), 0);

    const employees = await db.collection('employees').find({ businessId }).toArray();
    const activeEmployees = employees.filter(e => e.status === 'active').length;

    const compliance = await db.collection('compliance_scores').findOne({ businessId });
    const complianceScore = compliance?.score || 85;

    const performanceNotes = await db.collection('performance_notes').find({ businessId }).toArray();

    const laborData: LaborData = {
      totalHours: 0,
      totalCost: 0,
      approvedTimesheets: 0,
      pendingTimesheets: 0,
      shifts: [],
      timesheets: [],
      staff: []
    };

    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data: staffData } = await supabase
          .from('staff')
          .select('*')
          .eq('business_id', businessId);
        
        laborData.staff = (staffData || []) as StaffMember[];

        const { data: shiftsData } = await supabase
          .from('shifts')
          .select(`
            *,
            staff:staff_id (
              id,
              name,
              role,
              hourly_rate
            )
          `)
          .eq('business_id', businessId);

        laborData.shifts = (shiftsData || []) as Shift[];

        const { data: timesheetsData } = await supabase
          .from('timesheets')
          .select(`
            *,
            staff:staff_id (
              id,
              name,
              role,
              hourly_rate
            )
          `)
          .eq('business_id', businessId);

        laborData.timesheets = (timesheetsData || []) as Timesheet[];

        if (timesheetsData) {
          const typedTimesheets = timesheetsData as Timesheet[];
          laborData.approvedTimesheets = typedTimesheets.filter(t => t.status === 'approved').length;
          laborData.pendingTimesheets = typedTimesheets.filter(t => t.status === 'pending' || t.status === 'requires_review').length;

          for (const timesheet of typedTimesheets) {
            if (timesheet.status === 'approved') {
              laborData.totalHours += timesheet.actual_hours || 0;
              const staffMember = timesheet.staff;
              if (staffMember) {
                laborData.totalCost += (timesheet.actual_hours || 0) * (staffMember.hourly_rate || 0);
              }
            }
          }
        }

        if (shiftsData) {
          const typedShifts = shiftsData as Shift[];
          for (const shift of typedShifts) {
            const start = new Date(shift.start_time);
            const end = new Date(shift.end_time);
            const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
            const actualHours = Math.max(0, hours - (shift.unpaid_break_minutes || 0) / 60);
            
            if (!laborData.timesheets.find(t => t.shift_id === shift.id)) {
              laborData.totalHours += actualHours;
              if (shift.staff) {
                laborData.totalCost += actualHours * (shift.staff.hourly_rate || 0);
              }
            }
          }
        }
      } catch (supabaseError) {
        console.error('Supabase error:', supabaseError);
      }
    }

    const simulatedRevenue = 15000;
    const laborCostPercentage = simulatedRevenue > 0 ? (laborData.totalCost / simulatedRevenue) * 100 : 0;
    const salesPerLaborHour = laborData.totalHours > 0 ? simulatedRevenue / laborData.totalHours : 0;

    const hourlyBreakdown: Record<string, number> = {};
    for (const shift of laborData.shifts) {
      const hour = new Date(shift.start_time).getHours();
      const hourKey = `${hour.toString().padStart(2, '0')}:00`;
      hourlyBreakdown[hourKey] = (hourlyBreakdown[hourKey] || 0) + 1;
    }

    const peakHours = Object.entries(hourlyBreakdown)
      .map(([hour, count]) => ({ hour, shifts: count, estimatedSales: count * 150 }))
      .sort((a, b) => b.shifts - a.shifts)
      .slice(0, 8);

    const staffPerformance = laborData.staff.map(staff => {
      const staffTimesheets = laborData.timesheets.filter(t => t.staff_id === staff.id);
      const totalApprovedHours = staffTimesheets
        .filter(t => t.status === 'approved')
        .reduce((sum, t) => sum + (t.actual_hours || 0), 0);
      const totalVariance = staffTimesheets.reduce((sum, t) => sum + (t.variance_minutes || 0), 0);
      
      const perfNotes = performanceNotes.filter(n => n.employeeId === staff.id);
      const avgRating = perfNotes.length > 0 
        ? perfNotes.filter(n => n.rating).reduce((sum, n) => sum + (n.rating || 0), 0) / perfNotes.filter(n => n.rating).length
        : null;

      return {
        id: staff.id,
        name: staff.name,
        role: staff.role,
        totalHours: totalApprovedHours,
        averageVariance: staffTimesheets.length > 0 ? totalVariance / staffTimesheets.length : 0,
        timesheetCount: staffTimesheets.length,
        performanceRating: avgRating,
        hourlyRate: staff.hourly_rate
      };
    });

    const aiSuggestions = [];
    
    if (laborCostPercentage > 30) {
      aiSuggestions.push({
        type: 'cost',
        priority: 'high',
        suggestion: `Labor cost is ${laborCostPercentage.toFixed(1)}% of revenue. Consider optimizing shift schedules to reduce by 5-10%.`
      });
    }
    
    if (laborData.pendingTimesheets > 5) {
      aiSuggestions.push({
        type: 'efficiency',
        priority: 'medium',
        suggestion: `${laborData.pendingTimesheets} timesheets pending review. Regular approval improves staff satisfaction.`
      });
    }

    const wastePercentage = totalInventoryValue > 0 ? (totalWasteCost / totalInventoryValue) * 100 : 0;
    if (wastePercentage > 5) {
      aiSuggestions.push({
        type: 'inventory',
        priority: 'high',
        suggestion: `Inventory waste at ${wastePercentage.toFixed(1)}%. Implement FIFO tracking to reduce waste by 10-15%.`
      });
    }

    if (peakHours.length > 0 && peakHours[0].shifts < 3) {
      aiSuggestions.push({
        type: 'staffing',
        priority: 'medium',
        suggestion: `Peak hours may be understaffed. Consider adding shifts during ${peakHours[0].hour}.`
      });
    }

    if (complianceScore < 80) {
      aiSuggestions.push({
        type: 'compliance',
        priority: 'high',
        suggestion: 'Compliance score below target. Review outstanding compliance tasks in the Compliance Hub.'
      });
    }

    return NextResponse.json({
      kpis: {
        revenue: simulatedRevenue,
        laborCost: laborData.totalCost,
        laborCostPercentage: laborCostPercentage.toFixed(2),
        complianceScore,
        salesPerLaborHour: salesPerLaborHour.toFixed(2),
        inventoryValue: totalInventoryValue,
        wasteCost: totalWasteCost,
        wastePercentage: wastePercentage.toFixed(2)
      },
      labor: {
        totalHours: laborData.totalHours.toFixed(1),
        totalCost: laborData.totalCost.toFixed(2),
        approvedTimesheets: laborData.approvedTimesheets,
        pendingTimesheets: laborData.pendingTimesheets,
        activeEmployees
      },
      inventory: {
        totalValue: totalInventoryValue,
        wasteCost: totalWasteCost,
        wastePercentage: wastePercentage.toFixed(2),
        itemCount: inventoryItems.length
      },
      operational: {
        peakHours,
        staffPerformance,
        totalShifts: laborData.shifts.length,
        totalTimesheets: laborData.timesheets.length
      },
      aiSuggestions,
      period,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating reports:', error);
    return NextResponse.json({ error: 'Failed to generate reports' }, { status: 500 });
  }
}
