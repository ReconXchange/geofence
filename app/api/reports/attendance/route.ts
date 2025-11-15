import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth/middleware';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await authenticateRequest(request);

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin or manager
    if (user.role !== 'ADMIN' && user.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const format = searchParams.get('format'); // 'json' or 'csv'

    // Default to last 30 days
    const endDate = to ? new Date(to) : new Date();
    const startDate = from
      ? new Date(from)
      : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);

    const shifts = await prisma.shift.findMany({
      where: {
        status: 'COMPLETED',
        actualStart: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        actualStart: 'desc',
      },
    });

    // Calculate statistics
    const report = shifts.map((shift) => {
      const duration = shift.actualEnd && shift.actualStart
        ? (new Date(shift.actualEnd).getTime() -
            new Date(shift.actualStart).getTime()) /
          (1000 * 60 * 60)
        : 0;

      return {
        employeeName: shift.user.name,
        employeeEmail: shift.user.email,
        date: shift.actualStart?.toISOString().split('T')[0] || '',
        clockIn: shift.actualStart?.toISOString() || '',
        clockOut: shift.actualEnd?.toISOString() || '',
        hoursWorked: duration.toFixed(2),
        scheduledStart: shift.scheduledStart?.toISOString() || '',
        scheduledEnd: shift.scheduledEnd?.toISOString() || '',
      };
    });

    // Return CSV format
    if (format === 'csv') {
      const headers = [
        'Employee Name',
        'Email',
        'Date',
        'Clock In',
        'Clock Out',
        'Hours Worked',
        'Scheduled Start',
        'Scheduled End',
      ];

      const csvRows = [
        headers.join(','),
        ...report.map((row) =>
          [
            `"${row.employeeName}"`,
            row.employeeEmail,
            row.date,
            row.clockIn,
            row.clockOut,
            row.hoursWorked,
            row.scheduledStart,
            row.scheduledEnd,
          ].join(',')
        ),
      ];

      const csv = csvRows.join('\n');

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="attendance-report-${startDate.toISOString().split('T')[0]}-to-${endDate.toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    // Return JSON format
    const totalHours = report.reduce(
      (sum, shift) => sum + parseFloat(shift.hoursWorked),
      0
    );

    return NextResponse.json({
      success: true,
      report,
      summary: {
        totalShifts: report.length,
        totalHours: totalHours.toFixed(2),
        dateRange: {
          from: startDate.toISOString(),
          to: endDate.toISOString(),
        },
      },
    });
  } catch (error) {
    console.error('Get attendance report error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
