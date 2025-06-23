import React, { useEffect, useState } from "react";
import { DatePicker, Input, TimePicker, Button, message, Card } from "antd";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import weekday from "dayjs/plugin/weekday";
import isoWeek from "dayjs/plugin/isoWeek";
import "./Timesheet.css";

dayjs.extend(duration);
dayjs.extend(weekday);
dayjs.extend(isoWeek);

const TimeSheet = () => {
  const [weekStart, setWeekStart] = useState(dayjs().startOf("week").add(1, "day")); // Monday
  const [weekDates, setWeekDates] = useState([]);
  const [times, setTimes] = useState([]);
  const employee = JSON.parse(localStorage.getItem("employee"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const days = Array(7)
      .fill(0)
      .map((_, i) => weekStart.add(i, "day"));
    setWeekDates(days);
    setTimes(
      days.map((d) => ({
        date: d.format("YYYY-MM-DD"),
        day: d.format("dddd"),
        start: null,
        end: null,
        break: "",
        total: ""
      }))
    );
  }, [weekStart]);

  const handleChange = (index, type, value) => {
    const updated = [...times];
    updated[index][type] = value;
    updated[index].total = calculateTotal(
      updated[index].start,
      updated[index].end,
      updated[index].break
    );
    setTimes(updated);
  };

  const calculateTotal = (start, end, breakStr) => {
    if (!start || !end) return "";
    const diff = dayjs(end).diff(dayjs(start), "minute");
    let breakMin = 0;

    if (breakStr.includes("hour")) {
      const hr = parseInt(breakStr);
      breakMin += hr * 60;
    } else if (breakStr.includes("min")) {
      breakMin += parseInt(breakStr);
    } else if (!isNaN(parseFloat(breakStr))) {
      breakMin += parseFloat(breakStr);
    }

    const totalMin = diff - breakMin;
    if (totalMin <= 0) return "";
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return `${h}:${m.toString().padStart(2, "0")}`;
  };

  const save = async () => {
    const payload = {
      employeeId: employee?.empId,
      weekStart: weekStart.format("YYYY-MM-DD"),
      entries: times.map((row) => ({
        date: row.date,
        startTime: row.start ? dayjs(row.start).format("HH:mm") : "",
        endTime: row.end ? dayjs(row.end).format("HH:mm") : "",
        breakDuration: row.break,
        hoursWorked: row.total
      }))
    };

    try {
      await fetch("http://localhost:8081/api/v1/timesheets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      message.success("Timesheet saved successfully!");
    } catch (err) {
      console.error(err);
      message.error("Failed to save.");
    }
  };

  return (
    <div className="styled-timesheet">
      <h2>Employee Timesheet</h2>
      <div className="top-header">
        <div>
          <strong>Project Name</strong>
          <p>Lorem ipsum dolor (Project description goes here)</p>
        </div>
        <div className="employee-card">
          <div>👤 Name: {employee?.name}</div>
          <div>⏱ Hourly Rate: $20</div>
        </div>
      </div>

      <div className="week-picker">
        Week starting:
        <DatePicker
          picker="week"
          value={weekStart}
          onChange={(val) => setWeekStart(val.startOf("week").add(1, "day"))}
        />
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Day</th>
            <th>Start</th>
            <th>Finish</th>
            <th>Breaks</th>
            <th>Total Hours</th>
          </tr>
        </thead>
        <tbody>
          {times.map((row, index) => (
            <tr key={index}>
              <td>{row.date}</td>
              <td>{row.day}</td>
              <td>
                <TimePicker
                  value={row.start}
                  onChange={(val) => handleChange(index, "start", val)}
                  format="h:mm a"
                />
              </td>
              <td>
                <TimePicker
                  value={row.end}
                  onChange={(val) => handleChange(index, "end", val)}
                  format="h:mm a"
                />
              </td>
              <td>
                <Input
                  placeholder="e.g. 30 mins / 1 hour"
                  value={row.break}
                  onChange={(e) =>
                    handleChange(index, "break", e.target.value)
                  }
                />
              </td>
              <td>{row.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button type="primary" onClick={save} style={{ marginTop: "20px" }}>
        Save Timesheet
      </Button>
    </div>
  );
};

export default TimeSheet;
