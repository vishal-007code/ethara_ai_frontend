import React, { useState, useEffect } from 'react';
import { employeesAPI, attendanceAPI, getErrorMessage } from './services/api';
import EmployeeForm from './components/EmployeeForm';
import EmployeeList from './components/EmployeeList';
import AttendanceForm from './components/AttendanceForm';
import AttendanceList from './components/AttendanceList';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('employees');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [notification, setNotification] = useState(null);
  const [attendanceRefreshKey, setAttendanceRefreshKey] = useState(0);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await employeesAPI.getAll();
      setEmployees(response.data);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleAddEmployee = async (employeeData) => {
    const response = await employeesAPI.create(employeeData);
    setEmployees([...employees, response.data]);
    setShowEmployeeForm(false);
    showNotification('Employee added successfully!', 'success');
    // Return the response so the form knows it succeeded
    return response;
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    try {
      await employeesAPI.delete(id);
      setEmployees(employees.filter(emp => emp._id !== id));
      showNotification('Employee deleted successfully!', 'success');
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      showNotification(errorMessage, 'error');
    }
  };

  const handleMarkAttendance = async (attendanceData) => {
    await attendanceAPI.create({
      ...attendanceData,
      status: attendanceData?.status || 'Present',
    });
    setShowAttendanceForm(false);
    showNotification('Attendance marked successfully!', 'success');
    // Reload employees to refresh any stats
    loadEmployees();
    // Force AttendanceList to reload for the currently selected employee
    setAttendanceRefreshKey((k) => k + 1);
    // Return success so the form knows it succeeded
    return { success: true };
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="container">
          <h1>HRMS Lite</h1>
          <p className="subtitle">Human Resource Management System</p>
        </div>
      </header>

      <nav className="app-nav">
        <div className="container">
          <button
            className={`nav-button ${activeTab === 'employees' ? 'active' : ''}`}
            onClick={() => setActiveTab('employees')}
          >
            👥 Employees
          </button>
          <button
            className={`nav-button ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            📋 Attendance
          </button>
        </div>
      </nav>

      <main className="app-main">
        <div className="container">
          {notification && (
            <div className={`notification ${notification.type}`}>
              {notification.message}
            </div>
          )}

          {error && activeTab === 'employees' && (
            <div className="error-banner">
              <p>⚠️ {error}</p>
              <button onClick={loadEmployees}>Retry</button>
            </div>
          )}

          {activeTab === 'employees' && (
            <div className="page-section">
              <div className="page-header">
                <h2>Employee Management</h2>
                <button
                  className="btn-primary"
                  onClick={() => setShowEmployeeForm(true)}
                >
                  + Add Employee
                </button>
              </div>
              <EmployeeList
                employees={employees}
                onDelete={handleDeleteEmployee}
                loading={loading}
              />
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="page-section">
              <div className="page-header">
                <h2>Attendance Management</h2>
                <button
                  className="btn-primary"
                  onClick={() => setShowAttendanceForm(true)}
                  disabled={employees.length === 0}
                >
                  + Mark Attendance
                </button>
              </div>
              <AttendanceList
                employees={employees}
                loading={loading}
                refreshKey={attendanceRefreshKey}
              />
            </div>
          )}
        </div>
      </main>

      {showEmployeeForm && (
        <EmployeeForm
          onSubmit={handleAddEmployee}
          onCancel={() => setShowEmployeeForm(false)}
        />
      )}

      {showAttendanceForm && (
        <AttendanceForm
          employees={employees}
          onSubmit={handleMarkAttendance}
          onCancel={() => setShowAttendanceForm(false)}
        />
      )}
    </div>
  );
}

export default App;
