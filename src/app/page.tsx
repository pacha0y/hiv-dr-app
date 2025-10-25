// app/dashboard/page.tsx (Next.js 13+ App Router)
'use client';

import { useState } from 'react';
import { Bar, BarChart, ResponsiveContainer,Tooltip, XAxis, YAxis } from 'recharts';

import Layout from '@/app/components/Layout';

import { Card, CardContent } from './components/ui/Card';

// ----- Mock Data -----
const mockApplications = [
  { id: 'A001', status: 'pending', resistance: { dtg: false }, resultReceived: false, submittedAt: '2025-07-01' },
  { id: 'A002', status: 'approved', resistance: { dtg: true }, resultReceived: true, submittedAt: '2025-07-03' },
  { id: 'A003', status: 'approved', resistance: { dtg: false }, resultReceived: true, submittedAt: '2025-07-10' },
  { id: 'A004', status: 'rejected', resistance: { dtg: false }, resultReceived: false, submittedAt: '2025-07-15' },
  // ...more
];

const DashboardCard = ({ title, value }: { title: string; value: number }) => (
  <Card className="p-4 shadow-md">
    <CardContent>
      <h3 className="text-sm text-gray-500 mb-1">{title}</h3>
      <p className="text-xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

const ApplicationsOverTimeChart = () => {
  const data = [
    { month: 'May', count: 5 },
    { month: 'June', count: 9 },
    { month: 'July', count: 12 },
  ];

  return (
    <Card className="p-4">
  <h3 className="text-md font-semibold mb-2">Applications Cascade Over Time</h3>
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={[
      {
        month: 'May',
        received: 10,
        approved: 8,
        sampleSent: 6,
        resultsReceived: 5,
        amplified: 4,
        resistance: 2,
      },
      {
        month: 'June',
        received: 15,
        approved: 12,
        sampleSent: 10,
        resultsReceived: 9,
        amplified: 8,
        resistance: 3,
      },
      {
        month: 'July',
        received: 20,
        approved: 18,
        sampleSent: 15,
        resultsReceived: 14,
        amplified: 13,
        resistance: 6,
      },
    ]}>
      <XAxis dataKey="month" />
      <YAxis allowDecimals={false} />
      <Tooltip />
      <Bar dataKey="received" fill="#1e40af" name="Received" />
      <Bar dataKey="approved" fill="#2563eb" name="Approved" />
      <Bar dataKey="sampleSent" fill="#3b82f6" name="Sample Sent" />
      <Bar dataKey="resultsReceived" fill="#60a5fa" name="Results Received" />
      <Bar dataKey="amplified" fill="#93c5fd" name="Amplified" />
      <Bar dataKey="resistance" fill="#bfdbfe" name="Resistance" />
    </BarChart>
  </ResponsiveContainer>
</Card>


  );
};

export default function DashboardPage() {
  const [applications, setApplications] = useState(mockApplications);

  const total = applications.length;
  const pending = applications.filter((a) => a.status === 'pending').length;
  const resultsReceived = applications.filter((a) => a.resultReceived).length;
  const dtgResistance = applications.filter((a) => a.resistance.dtg).length;

  return (
    <Layout>
      <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <DashboardCard title="Total Applications" value={total} />
        <DashboardCard title="Pending Review" value={pending} />
        <DashboardCard title="Results Received" value={resultsReceived} />
        <DashboardCard title="DTG Resistance" value={dtgResistance} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ApplicationsOverTimeChart />
        {/* Add another chart here, e.g., ResistanceTrendChart */}
      </div>
    </div>
    </Layout>
  );
}
