import React, { useState, useEffect } from "react";
import { Table, Input, Button, DatePicker, Card, message } from "antd";
import axios from "axios";
import moment from "moment";

const Timesheet = () => {
  const [form, setForm] = useState({
    date: null,
    project: "",
    hoursWorked: "",
    description: ""
  });

  const [timesheets, setTimesheets] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchTimesheets = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/v1/timesheets/me", config);
      setTimesheets(res.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch timesheets");
    }
  };

  const fetchWeeklyReport = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/v1/timesheets/weekly", config);
      const formatted = Object.entries(res.data).map(([weekStart, totalHours]) => ({
        weekStart,
        weekEnd: moment(weekStart).add(6, "days").format("YYYY-MM-DD"),
        totalHours
      }));
      setWeeklyData(formatted);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch weekly summary");
    }
  };

  const handleSubmit = async () => {
    const { date, project, hoursWorked, description } = form;
    if (!date || !project || !hoursWorked) return message.warning("Please fill all fields");

    try {
      await axios.post(
        "http://localhost:8081/api/v1/timesheets",
        {
          date: date.format("YYYY-MM-DD"),
          project,
          hoursWorked,
          description
        },
        config
      );
      message.success("Timesheet submitted");
      setForm({ date: null, project: "", hoursWorked: "", description: "" });
      fetchTimesheets();
      fetchWeeklyReport();
    } catch (err) {
      console.error(err);
      message.error("Submission failed");
    }
  };

  useEffect(() => {
    fetchTimesheets();
    fetchWeeklyReport();
  }, []);

  const dailyColumns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => text ? moment(text).format("YYYY-MM-DD") : "-"
    },
    { title: "Project", dataIndex: "project", key: "project" },
    { title: "Hours", dataIndex: "hoursWorked", key: "hoursWorked" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Submitted At",
      dataIndex: "submittedAt",
      key: "submittedAt",
      render: (text) => text ? moment(text).format("YYYY-MM-DD HH:mm") : "-"
    },
    {
      title: "Week Start",
      dataIndex: "date",
      key: "weekStart",
      render: (text) => text ? moment(text).startOf("isoWeek").format("YYYY-MM-DD") : "-"
    }
  ];

  const weeklyColumns = [
    { title: "Week Start", dataIndex: "weekStart", key: "weekStart" },
    { title: "Week End", dataIndex: "weekEnd", key: "weekEnd" },
    { title: "Total Hours", dataIndex: "totalHours", key: "totalHours" }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4">
      <Card title="Log Timesheet Entry">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DatePicker
            value={form.date}
            onChange={(value) => setForm({ ...form, date: value })}
            placeholder="Date"
            style={{ width: "100%" }}
          />
          <Input
            value={form.project}
            onChange={(e) => setForm({ ...form, project: e.target.value })}
            placeholder="Project"
          />
          <Input
            type="number"
            value={form.hoursWorked}
            onChange={(e) => setForm({ ...form, hoursWorked: e.target.value })}
            placeholder="Hours Worked"
          />
          <Input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
          />
        </div>
        <Button type="primary" className="mt-4" onClick={handleSubmit}>
          Submit Timesheet
        </Button>
      </Card>

      <Card title="Daily Timesheet Entries">
        <Table
          dataSource={timesheets}
          columns={dailyColumns}
          rowKey={(record) => record.id || record.date + record.project}
          pagination={{ pageSize: 5 }}
        />
      </Card>

      <Card title="Weekly Timesheet Summary">
        <Table
          dataSource={weeklyData}
          columns={weeklyColumns}
          rowKey="weekStart"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default Timesheet;
