import React, { useState, useEffect, useCallback } from 'react';
import { attendanceAPI, getErrorMessage } from '../services/api';
import './AttendanceList.css';

const AttendanceList = ({ employees, loading: employeesLoading, refreshKey = 0 }) => {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const loadAttendance = useCallback(async () => {
    if (!selectedEmployee) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await attendanceAPI.getByEmployeeId(selectedEmployee);
      setAttendance(response.data);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [selectedEmployee]);

  const loadStats = useCallback(async () => {
    if (!selectedEmployee) return;
    
    try {
      const response = await attendanceAPI.getStats(selectedEmployee);
      setStats(response.data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  }, [selectedEmployee]);

  useEffect(() => {
    if (selectedEmployee) {
      loadAttendance();
      loadStats();
    } else {
      setAttendance([]);
      setStats(null);
    }
  }, [selectedEmployee, loadAttendance, loadStats, refreshKey]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (employeesLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📋</div>
        <h3>No Employees Available</h3>
        <p>Please add employees first to view attendance records.</p>
      </div>
    );
  }

  return (
    <div className="attendance-list">
      <div className="attendance-header">
        <div className="filter-section">
          <label htmlFor="employee-select">Select Employee:</label>
          <select
            id="employee-select"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="employee-select"
          >
            <option value="">-- Select an employee --</option>
            {employees.map((employee) => (
              <option key={employee._id} value={employee.employeeId}>
                {employee.employeeId} - {employee.fullName}
              </option>
            ))}
          </select>
          <div className="attendance-actions">
            <button
              type="button"
              className="btn-primary btn-refresh"
              onClick={() => {
                loadAttendance();
                loadStats();
              }}
              disabled={!selectedEmployee || loading}
            >
              Refresh
            </button>
          </div>
        </div>

        {stats && (
          <div className="stats-card">
            <div className="stat-item">
              <span className="stat-label">Total Days:</span>
              <span className="stat-value">{stats.totalDays}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Present:</span>
              <span className="stat-value present">{stats.presentDays}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Absent:</span>
              <span className="stat-value absent">{stats.absentDays}</span>
            </div>
          </div>
        )}
      </div>

      {selectedEmployee && (
        <div className="attendance-content">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading attendance records...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>❌ {error}</p>
            </div>
          ) : attendance.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <h3>No Attendance Records</h3>
              <p>No attendance has been marked for this employee yet.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((record) => (
                    <tr key={record._id}>
                      <td>{formatDate(record.date)}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            record.status === 'Present' ? 'present' : 'absent'
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {!selectedEmployee && (
        <div className="empty-state">
          <div className="empty-icon">👆</div>
          <h3>Select an Employee</h3>
          <p>Choose an employee from the dropdown above to view their attendance records.</p>
        </div>
      )}
    </div>
  );
};

export default AttendanceList;
