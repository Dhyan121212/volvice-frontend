import React, { useEffect, useState, useContext } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import { AuthContext } from '../../signIns/AuthContext';
import './Holidays.css'; // make sure this filename matches exactly

const Holidays = () => {
  const [holidays, setHolidays] = useState([]);
  const { token } = useContext(AuthContext);

  console.log("🔓 Holiday fetch token:", token);


  useEffect(() => {
  // Wait until AuthContext finishes loading
  if (token === null) return;

  if (!token || token === 'undefined') {
    message.error('You are not logged in. Please login.');
    return;
  }

  console.log('🔓 Holiday fetch token:', token);

  fetch('http://localhost:8081/api/v1/holiday', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error('Unauthorized');
      return res.json();
    })
    .then(setHolidays)
    .catch((err) => {
      console.error('Fetch error:', err);
      message.error('Failed to fetch holidays. Please check your login.');
    });
}, [token]);


  return (
    <div style={{ padding: '2rem' }}>
      <h1>Holiday List</h1>
      <ol className="ol-days">
        {holidays.map((holiday, index) => (
          <li key={holiday.id} style={{ '--month': `'${dayjs(holiday.date).format('MMM')}'` }}>
            <span style={{ gridColumn: 3 }}>
              {holiday.name} — <strong>{holiday.type}</strong>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Holidays;
