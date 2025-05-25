import React, { useState } from 'react';
import { Card, Input, Button, Select, DatePicker, message } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri','Sat', 'Sun'];
const workTypes = ['Regular', 'Overtime', 'Leave', 'Holiday'];

const TimeSheet = () => {
  const [weekRange, setWeekRange] = useState([]);
  const [entries, setEntries] = useState(
    days.map(day => ({
      day,
      workType: 'Regular',
      time: '',
      comments: ''
    }))
  );

  const handleChange = (index, field, value) => {
    const updated = [...entries];
    updated[index][field] = value;
    setEntries(updated);
  };

  const handleSubmit = () => {
  if (!weekRange.length) {
    message.warning('Please select a week range.');
    return;
  }

  const submittedTimesheet = {
    week: `${weekRange[0].format('D MMM YYYY')} - ${weekRange[1].format('D MMM YYYY')}`,
    entries,
    submittedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
  };

  // Retrieve old timesheets from localStorage
  const existing = JSON.parse(localStorage.getItem('timesheets') || '[]');
  existing.push(submittedTimesheet);
  localStorage.setItem('timesheets', JSON.stringify(existing));

  message.success('Timesheet submitted successfully!');
};


  return (
    <Card title="Time Sheet" style={{ maxWidth: 600, margin: '2rem auto' }}>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>Week:</span>




     <RangePicker
    value={weekRange}
    onChange={(dates) => {
        if (dates && dates.length === 2) {
        const diff = dates[1].diff(dates[0], 'day');
        if (diff !== 6) {
            message.warning('Please select a full 7-day week (6 days difference).');
            setWeekRange([]);
            setWeek('');
        } else {
            setWeekRange(dates);
            setWeek(`${dates[0].format('D MMM YYYY')} - ${dates[1].format('D MMM YYYY')}`);
        }
        } else {
        setWeekRange([]);
        setWeek('');
        }
    }}
    style={{ flex: 1 }}
/>


      </div>

      {entries.map((entry, index) => (
        <div
          key={entry.day}
          style={{
            display: 'flex',
            gap: 8,
            marginBottom: 12,
            alignItems: 'center'
          }}
        >
          <span style={{ width: 40 }}>{entry.day}</span>

          <Select
            value={entry.workType}
            onChange={(value) => handleChange(index, 'workType', value)}
            style={{ width: 120 }}
          >
            {workTypes.map((type) => (
              <Option key={type} value={type}>
                {type}
              </Option>
            ))}
          </Select>

          <Input
            type="number"
            min="0"
            max="24"
            step="0.25"
            placeholder="Hours"
            value={entry.time}
            onChange={(e) => handleChange(index, 'time', e.target.value)}
            style={{ width: 120 }}
          />

          <Input
            placeholder="Comments"
            value={entry.comments}
            onChange={(e) => handleChange(index, 'comments', e.target.value)}
            style={{ flex: 1 }}
          />
        </div>
      ))}

      <Button type="primary" onClick={handleSubmit} block>
        Submit Timesheet
      </Button>
    </Card>
  );
};

export default TimeSheet;
