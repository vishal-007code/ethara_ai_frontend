import React from 'react';
import './EmployeeList.css';

const EmployeeList = ({ employees, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading employees...</p>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">👥</div>
        <h3>No Employees Found</h3>
        <p>Start by adding your first employee to the system.</p>
      </div>
    );
  }

  return (
    <div className="employee-list">
      <div className="table-container">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id}>
                <td className="employee-id">{employee.employeeId}</td>
                <td>{employee.fullName}</td>
                <td>{employee.email}</td>
                <td>
                  <span className="department-badge">{employee.department}</span>
                </td>
                <td>
                  <button
                    className="btn-delete"
                    onClick={() => onDelete(employee._id)}
                    title="Delete employee"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
