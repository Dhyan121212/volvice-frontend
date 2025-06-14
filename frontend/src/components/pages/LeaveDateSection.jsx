import React, { useState } from 'react';
import { Form, DatePicker, message } from 'antd';
import dayjs from 'dayjs';

const MAX_DURATION = 10; // days

const LeaveDateSection = ({ form }) => {
  const [duration, setDuration] = useState(0);

  const handleStartDateChange = (start) => {
    if (start) {
      const autoEnd = dayjs(start).add(1, 'day');
      form.setFieldsValue({ endDate: autoEnd });
      setDuration(2); // Start + 1 day
    } else {
      form.setFieldsValue({ endDate: null });
      setDuration(0);
    }
  };

  const handleEndDateChange = (end) => {
    const start = form.getFieldValue('startDate');
    if (start && end) {
      const days = dayjs(end).diff(start, 'day') + 1;
      if (days > MAX_DURATION) {
        message.error(`Leave cannot exceed ${MAX_DURATION} days`);
        form.setFieldsValue({ endDate: null });
        setDuration(0);
      } else if (days <= 0) {
        message.error('End date must be after start date');
        form.setFieldsValue({ endDate: null });
        setDuration(0);
      } else {
        setDuration(days);
      }
    }
  };

  return (
    <>
      <Form.Item label="Leave Duration" style={{ marginBottom: 0 }}>
        <Form.Item
          name="startDate"
          rules={[{ required: true, message: 'Start date required' }]}
          style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
        >
          <DatePicker
            style={{ width: '100%' }}
            placeholder="Start Date"
            onChange={handleStartDateChange}
          />
        </Form.Item>
        <span style={{ display: 'inline-block', width: '16px', textAlign: 'center' }}>–</span>
        <Form.Item
          name="endDate"
          rules={[{ required: true, message: 'End date required' }]}
          style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
        >
          <DatePicker
            style={{ width: '100%' }}
            placeholder="End Date"
            onChange={handleEndDateChange}
          />
        </Form.Item>
      </Form.Item>

      {duration > 0 && (
        <div style={{ marginBottom: 16, fontWeight: 500 }}>
          📅 Leave duration: {duration} day{duration > 1 ? 's' : ''}
        </div>
      )}
    </>
  );
};

export default LeaveDateSection;

