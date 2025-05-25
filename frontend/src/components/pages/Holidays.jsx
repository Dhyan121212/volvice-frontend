import React from 'react';

export const holidays = [
  { date: '2025-01-01', name: 'New Year\'s Day' },
  { date: '2025-01-26', name: 'Republic Day' },
  { date: '2025-02-14', name: 'Valentine\'s Day' },
  { date: '2025-03-17', name: 'Holi' },
  { date: '2025-04-14', name: 'Ambedkar Jayanti' },
  { date: '2025-05-01', name: 'Labour Day' },
  { date: '2025-08-15', name: 'Independence Day' },
  { date: '2025-10-02', name: 'Gandhi Jayanti' },
  { date: '2025-10-23', name: 'Diwali' },
  { date: '2025-12-25', name: 'Christmas' },
];

const Holidays = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Holiday List - 2025</h1>
      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-blue-700 text-white">
          <tr>
            <th className="text-left px-6 py-3">Date</th>
            <th className="text-left px-6 py-3">Holiday Name</th>
          </tr>
        </thead>
        <tbody>
          {holidays.map((holiday, index) => (
            <tr key={index} className="border-b hover:bg-gray-100">
              <td className="px-6 py-3">{holiday.date}</td>
              <td className="px-6 py-3">{holiday.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Holidays;

