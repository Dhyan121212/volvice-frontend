import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHolidays } from '../../../Redux/Slices/HolidaySlices'; // ✅ adjust path
import dayjs from 'dayjs';
import './Holidays.css';

const Holidays = () => {
  const dispatch = useDispatch();

  // ✅ Correctly select from "holidays" slice
  const { data: holidays = [], loading, error } = useSelector((state) => state.holidays || {});

  useEffect(() => {
    dispatch(fetchHolidays());
  }, [dispatch]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Holiday List</h1>

      {loading && <p>Loading holidays...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <ol className="responsive-table">
        <li className="table-header">
          <div className="col-1">#</div>
          <div className="col-2">Date</div>
          <div className="col-3">Holiday Name</div>
          <div className="col-4">Type</div>
        </li>
        {holidays.map((holiday, index) => (
          <li className="table-row" key={holiday.id}>
            <div className="col-1" data-label="#"> {index + 1}</div>
            <div className="col-2" data-label="Date">
              {dayjs(holiday.date).format('YYYY-MM-DD')}
            </div>
            <div className="col-3" data-label="Holiday Name">{holiday.name}</div>
            <div className="col-4" data-label="Type">{holiday.holidayType}</div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Holidays;
