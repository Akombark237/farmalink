// app/dashboard/page.jsx
"use client";

import {
  Activity,
  Bell,
  Calendar,
  FileText,
  Heart,
  MessageSquare,
  PieChart,
  Pill,
  Settings,
  TrendingUp,
  User
} from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart as RechartPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

// Sample data for charts
const healthData = [
  { name: 'Jan', bp: 120, glucose: 95, weight: 75 },
  { name: 'Feb', bp: 125, glucose: 100, weight: 74 },
  { name: 'Mar', bp: 118, glucose: 92, weight: 73 },
  { name: 'Apr', bp: 122, glucose: 97, weight: 74 },
  { name: 'May', bp: 120, glucose: 94, weight: 72 },
  { name: 'Jun', bp: 118, glucose: 90, weight: 71 },
];

const medicationData = [
  { name: 'Morning', adherence: 90 },
  { name: 'Afternoon', adherence: 75 },
  { name: 'Evening', adherence: 85 },
  { name: 'Night', adherence: 95 },
];

const appointmentTypeData = [
  { name: 'Check-up', value: 45 },
  { name: 'Specialist', value: 25 },
  { name: 'Lab Test', value: 20 },
  { name: 'Vaccination', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Upcoming appointments data
const appointments = [
  { id: 1, doctor: "Dr. Sarah Johnson", specialty: "Cardiologist", date: "May 24, 2025", time: "10:30 AM" },
  { id: 2, doctor: "Dr. Michael Lee", specialty: "General Physician", date: "June 2, 2025", time: "2:15 PM" },
  { id: 3, doctor: "Dr. Emily Watson", specialty: "Neurologist", date: "June 15, 2025", time: "11:00 AM" },
];

// Medications data
const medications = [
  { id: 1, name: "Lisinopril", dosage: "10mg", frequency: "Once daily", time: "Morning" },
  { id: 2, name: "Metformin", dosage: "500mg", frequency: "Twice daily", time: "Morning & Evening" },
  { id: 3, name: "Atorvastatin", dosage: "20mg", frequency: "Once daily", time: "Evening" },
];

// Recent test results
const testResults = [
  { id: 1, test: "Complete Blood Count", date: "May 10, 2025", status: "Normal" },
  { id: 2, test: "Lipid Panel", date: "May 10, 2025", status: "Review" },
  { id: 3, test: "Kidney Function", date: "May 10, 2025", status: "Normal" },
];

// Component for the dashboard header
const DashboardHeader = ({ patientName }: { patientName: string }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4 md:mb-0">
        <div className="bg-blue-100 p-3 rounded-full">
          <User size={24} className="text-blue-600" />
        </div>
        <div className="ml-4">
          <h1 className="text-2xl font-bold">Welcome, {patientName}</h1>
          <p className="text-gray-600">Here&apos;s your health at a glance</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
          <Bell size={18} className="mr-2" />
          <span>Notifications</span>
        </button>
        <button className="bg-gray-200 p-2 rounded-md">
          <Settings size={20} className="text-gray-700" />
        </button>
      </div>
    </div>
  );
};

// Component for key health metrics
const KeyMetrics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <div className="bg-red-100 p-4 rounded-full">
          <Heart size={24} className="text-red-600" />
        </div>
        <div className="ml-4">
          <p className="text-gray-600 text-sm">Blood Pressure</p>
          <h3 className="text-xl font-bold">120/80 mmHg</h3>
          <p className="text-green-600 text-xs">Normal range</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <div className="bg-purple-100 p-4 rounded-full">
          <Activity size={24} className="text-purple-600" />
        </div>
        <div className="ml-4">
          <p className="text-gray-600 text-sm">Heart Rate</p>
          <h3 className="text-xl font-bold">72 BPM</h3>
          <p className="text-green-600 text-xs">Normal range</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <div className="bg-blue-100 p-4 rounded-full">
          <TrendingUp size={24} className="text-blue-600" />
        </div>
        <div className="ml-4">
          <p className="text-gray-600 text-sm">Glucose</p>
          <h3 className="text-xl font-bold">94 mg/dL</h3>
          <p className="text-green-600 text-xs">Normal range</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <div className="bg-green-100 p-4 rounded-full">
          <PieChart size={24} className="text-green-600" />
        </div>
        <div className="ml-4">
          <p className="text-gray-600 text-sm">BMI</p>
          <h3 className="text-xl font-bold">24.2</h3>
          <p className="text-green-600 text-xs">Healthy weight</p>
        </div>
      </div>
    </div>
  );
};

// Component for upcoming appointments
const AppointmentList = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Upcoming Appointments</h2>
        <button className="text-blue-600 text-sm font-medium">View All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td className="px-4 py-4 whitespace-nowrap">{appointment.doctor}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.specialty}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.date}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.time}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">Reschedule</button>
                  <button className="text-red-600 hover:text-red-900">Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-center">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md">
          Schedule New Appointment
        </button>
      </div>
    </div>
  );
};

// Component for medication tracker
const MedicationTracker = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Medication Tracker</h2>
        <button className="text-blue-600 text-sm font-medium">View All</button>
      </div>
      <div className="overflow-hidden">
        {medications.map((medication) => (
          <div key={medication.id} className="flex items-center justify-between p-3 border-b last:border-b-0">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-full">
                <Pill size={18} className="text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="font-medium">{medication.name}</h3>
                <p className="text-sm text-gray-500">{medication.dosage} - {medication.frequency}</p>
              </div>
            </div>
            <div className="flex items-center">
              <p className="text-sm text-gray-600 mr-4">{medication.time}</p>
              <button className="bg-green-100 text-green-600 py-1 px-3 rounded-full text-xs font-medium">
                Take Now
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={medicationData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="adherence" fill="#6366F1" name="Adherence %" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Component for health trends
const HealthTrends = () => {
  const [metric, setMetric] = useState<'bp' | 'glucose' | 'weight'>('bp');

  const metrics = {
    bp: { name: 'Blood Pressure', dataKey: 'bp', color: '#EF4444' },
    glucose: { name: 'Glucose', dataKey: 'glucose', color: '#3B82F6' },
    weight: { name: 'Weight', dataKey: 'weight', color: '#10B981' }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Health Trends</h2>
        <div className="flex space-x-2">
          {Object.entries(metrics).map(([key, { name }]) => (
            <button
              key={key}
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                metric === key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
              onClick={() => setMetric(key as 'bp' | 'glucose' | 'weight')}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-2">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={healthData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey={metrics[metric].dataKey}
              stroke={metrics[metric].color}
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Component for test results
const TestResults = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Recent Test Results</h2>
        <button className="text-blue-600 text-sm font-medium">View All</button>
      </div>
      <div>
        {testResults.map((result) => (
          <div key={result.id} className="flex items-center justify-between p-3 border-b last:border-b-0">
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${
                result.status === 'Normal' ? 'bg-green-100' : 'bg-yellow-100'
              }`}>
                <FileText size={18} className={
                  result.status === 'Normal' ? 'text-green-600' : 'text-yellow-600'
                } />
              </div>
              <div className="ml-3">
                <h3 className="font-medium">{result.test}</h3>
                <p className="text-sm text-gray-500">{result.date}</p>
              </div>
            </div>
            <div>
              <span className={`py-1 px-3 rounded-full text-xs font-medium ${
                result.status === 'Normal'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {result.status}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-center">
          <ResponsiveContainer width={200} height={200}>
            <RechartPieChart>
              <Pie
                data={appointmentTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {appointmentTypeData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RechartPieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mt-2">
          {appointmentTypeData.map((entry, index) => (
            <div key={`legend-${index}`} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-1"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-xs text-gray-600">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Component for quick actions
const QuickActions = () => {
  const actions = [
    { icon: <Calendar size={24} />, name: "Schedule Appointment" },
    { icon: <MessageSquare size={24} />, name: "Message Doctor" },
    { icon: <FileText size={24} />, name: "Request Records" },
    { icon: <Pill size={24} />, name: "Refill Prescription" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      {actions.map((action, index) => (
        <button key={index} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center hover:bg-blue-50 transition-colors">
          <div className="text-blue-600 mb-2">
            {action.icon}
          </div>
          <span className="font-medium text-gray-800">{action.name}</span>
        </button>
      ))}
    </div>
  );
};

// Main Dashboard Component
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50/95 backdrop-blur-sm content-over-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader patientName="Alex Johnson" />

        <QuickActions />

        <KeyMetrics />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <HealthTrends />
          <MedicationTracker />
        </div>

        <AppointmentList />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <TestResults />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4">Health Tips</h2>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-800">Stay Hydrated</h3>
                <p className="text-sm text-blue-600">Remember to drink at least 8 glasses of water daily.</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-800">Physical Activity</h3>
                <p className="text-sm text-green-600">Aim for 30 minutes of moderate activity most days.</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <h3 className="font-medium text-purple-800">Sleep Well</h3>
                <p className="text-sm text-purple-600">Try to get 7-8 hours of quality sleep each night.</p>
              </div>
            </div>
            <button className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md">
              View More Tips
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}