import React, { useState } from 'react';
import {
  Card,
  Calendar,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  Button,
  message,
  Row,
  Col,
  Badge,
  Table,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { holidays } from './Holidays'; // adjust path as needed

const { Option } = Select;
const { TextArea } = Input;

const LeaveRequest = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [leaveRecords, setLeaveRecords] = useState([]);

  const onFinish = (values) => {
    const { leaveType, startDate, endDate, reason } = values;

    if (dayjs(endDate).isBefore(dayjs(startDate))) {
      return message.error('End date must be after start date');
    }

    const newRecord = {
      key: leaveRecords.length + 1,
      leaveType,
      startDate: startDate.format('DD-MM-YYYY'),
      endDate: endDate.format('DD-MM-YYYY'),
      reason,
      document: fileList[0]?.name || 'N/A',
    };

    setLeaveRecords([...leaveRecords, newRecord]);
    message.success('Leave request submitted successfully!');
    form.resetFields();
    setFileList([]);
  };

  const cellRender = (current, info) => {
    if (info.type === 'date') {
      const formatted = current.format('YYYY-MM-DD');
      const holiday = holidays.find(h => h.date === formatted);
      if (holiday) {
        return <Badge status="error" text={holiday.name} />;
      }
    }
    return null;
  };

  const columns = [
    { title: 'Leave Type', dataIndex: 'leaveType', key: 'leaveType' },
    { title: 'From', dataIndex: 'startDate', key: 'startDate' },
    { title: 'To', dataIndex: 'endDate', key: 'endDate' },
    { title: 'Reason', dataIndex: 'reason', key: 'reason' },
    { title: 'Document', dataIndex: 'document', key: 'document' },
  ];

  return (
    <div className="p-4 bg-white">
      <Card
        bordered
        style={{
          borderRadius: 10,
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
          maxWidth: 1000,
          margin: '0 auto',
        }}
      >
        <Row gutter={24}>
          <Col xs={24} md={10}>
            <h3 style={{ fontWeight: '600', marginBottom: 16 }}>Leave Request</h3>
            <Calendar fullscreen={false} cellRender={cellRender} />
          </Col>

          <Col xs={24} md={14}>
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item name="leaveType" label="Leave type" rules={[{ required: true }]}>
                    <Select placeholder="Select leave type">
                      <Option value="Leave Without Pay">Leave Without Pay</Option>
                      <Option value="Paid Leave">Paid Leave</Option>
                      <Option value="Work From Home">Work From Home</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={6}>
                  <Form.Item name="startDate" label="From" rules={[{ required: true }]}>
                    <DatePicker format="DD-MM-YYYY" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>

                <Col span={6}>
                  <Form.Item name="endDate" label="To" rules={[{ required: true }]}>
                    <DatePicker format="DD-MM-YYYY" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="reason" label="Reason">
                <TextArea rows={3} placeholder="e.g. I'm traveling to..." maxLength={100} />
              </Form.Item>

              <Form.Item name="document" label="Documents">
                <Upload
                  beforeUpload={() => false}
                  fileList={fileList}
                  onChange={({ fileList }) => setFileList(fileList)}
                >
                  <Button icon={<UploadOutlined />}>Upload a File</Button>
                </Upload>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    backgroundColor: '#1d3557',
                    borderColor: '#1d3557',
                    borderRadius: 4,
                  }}
                >
                  Apply Leave
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>

        {/* Leave Records Table */}
        {leaveRecords.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontWeight: '600', marginBottom: 16 }}>Leave Submissions</h3>
            <Table
              columns={columns}
              dataSource={leaveRecords}
              pagination={{ pageSize: 5 }}
              rowKey="key"
              bordered
              size="middle"
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default LeaveRequest;
