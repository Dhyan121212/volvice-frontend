import React, { useState } from 'react';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import './CuustomCalender.css';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const StyledCalendar = ({ holidays = [], leaves = [] }) => {
  const today = dayjs();
  const [viewDate, setViewDate] = useState(dayjs());

  const startOfMonth = viewDate.startOf('month');
  const endOfMonth = viewDate.endOf('month');
  const startDay = startOfMonth.day(); // 0 (Sun) to 6 (Sat)
  const daysInMonth = endOfMonth.date();

  const prevMonth = () => setViewDate(viewDate.subtract(1, 'month'));
  const nextMonth = () => setViewDate(viewDate.add(1, 'month'));

  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < startDay; i++) {
      dates.push(null); // Empty cells
    }
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push(dayjs(viewDate).date(i));
    }
    return dates;
  };

  const isHoliday = (date) =>
    holidays.some((h) => dayjs(h.date).isSame(date, 'day'));

  const isLeave = (date) =>
    leaves.some(
      (l) =>
        date.isSameOrAfter(dayjs(l.startDate), 'day') &&
        date.isSameOrBefore(dayjs(l.endDate), 'day')
    );

  return (
    <div className="custom-calendar">
      <div className="calendar-header">
        <button onClick={prevMonth}>{'<'}</button>
        <strong>
          {viewDate.format('MMMM YYYY')}
        </strong>
        <button onClick={nextMonth}>{'>'}</button>
      </div>

      <div className="calendar-days">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="calendar-dates">
        {generateDates().map((date, index) => {
          let className = 'calendar-cell';
          if (!date) return <div key={index} />;

          if (date.isSame(today, 'day')) className += ' today';
          if (isHoliday(date)) className += ' leave';
          if (isLeave(date)) className += ' range';

          return (
            <div key={index} className={className}>
              {date.date()}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StyledCalendar;
