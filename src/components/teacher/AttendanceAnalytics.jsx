import React, { useState, useEffect } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import Card from '../common/Card';

export default function AttendanceAnalytics({ classId }) {
  const [attendanceData, setAttendanceData] = useState([]);
  
  useEffect(() => {
    const records = JSON.parse(localStorage.getItem('attendance') || '[]');
    const classRecords = records.filter((r) => r.classId === classId);
    setAttendanceData(classRecords);
  }, [classId]);

  const getAttendanceByDate = () => {
    const grouped = attendanceData.reduce((acc, record) => {
      const date = record.date;
      if (!acc[date]) {
        acc[date] = { present: 0, absent: 0 };
      }
      record.present ? acc[date].present++ : acc[date].absent++;
      return acc;
    }, {});

    return Object.entries(grouped).map(([date, data]) => ({
      date,
      present: data.present,
      absent: data.absent
    }));
  };

  const getPresentAbsentRatio = () => {
    const total = attendanceData.length;
    const present = attendanceData.filter(r => r.present).length;
    return [
      { id: 'Present', value: present },
      { id: 'Absent', value: total - present }
    ];
  };

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold mb-4">Attendance Over Time</h3>
        <div className="h-80">
          <ResponsiveLine
            data={[
              {
                id: 'Attendance',
                data: getAttendanceByDate().map(d => ({
                  x: d.date,
                  y: (d.present / (d.present + d.absent)) * 100
                }))
              }
            ]}
            margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 0, max: 100 }}
            axisBottom={{
              tickRotation: -45
            }}
            axisLeft={{
              legend: 'Attendance %',
              legendOffset: -40
            }}
            pointSize={8}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Daily Breakdown</h3>
          <div className="h-80">
            <ResponsiveBar
              data={getAttendanceByDate()}
              keys={['present', 'absent']}
              indexBy="date"
              groupMode="grouped"
              margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
              padding={0.3}
              colors={{ scheme: 'nivo' }}
              axisBottom={{
                tickRotation: -45
              }}
            />
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Overall Attendance</h3>
          <div className="h-80">
            <ResponsivePie
              data={getPresentAbsentRatio()}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              colors={{ scheme: 'nivo' }}
              borderWidth={1}
              borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}