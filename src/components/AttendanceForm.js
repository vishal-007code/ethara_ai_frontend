import React, { useState, useEffect } from 'react';
import './AttendanceForm.css';

const AttendanceForm = ({ employees, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (employees.length > 0 && !formData.employeeId) {
      setFormData((prev) => ({
        ...prev,
        employeeId: employees[0].employeeId,
      }));
    }
  }, [employees, formData.employeeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
    // Clear server error when user starts typing
    if (serverError) {
      setServerError('');
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.employeeId) {
      newErrors.employeeId = 'Please select an employee';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    if (!formData.status) {
      newErrors.status = 'Status is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setServerError('');
    setErrors({});
    
    // Client-side validation
    if (!validate()) {
      return;
    }
    
    // Prevent multiple submissions
    if (submitting) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      const payload = {
        employeeId: formData.employeeId,
        date: formData.date,
        status: formData.status || 'Present',
      };
      await onSubmit(payload);
      // If successful, the form will be closed by the parent component
    } catch (err) {
      // Handle server-side errors
      const errorMessage = err?.formattedMessage || err?.message || 'Failed to mark attendance. Please try again.';
      setServerError(errorMessage);
      
      // If error message contains field-specific info, try to map it to form fields
      const errorLower = errorMessage.toLowerCase();
      if (errorLower.includes('employee')) {
        setErrors((prev) => ({ ...prev, employeeId: errorMessage }));
      } else if (errorLower.includes('date')) {
        setErrors((prev) => ({ ...prev, date: errorMessage }));
      } else if (errorLower.includes('status')) {
        setErrors((prev) => ({ ...prev, status: errorMessage }));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-overlay" onClick={onCancel}>
      <div className="form-container" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h2>Mark Attendance</h2>
          <button className="close-btn" onClick={onCancel}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          {serverError && (
            <div className="server-error-message">
              <span className="error-icon">⚠️</span>
              <span>{serverError}</span>
            </div>
          )}
          <div className="form-group">
            <label htmlFor="employeeId">Employee *</label>
            <select
              id="employeeId"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              className={errors.employeeId ? 'error' : ''}
            >
              <option value="">Select an employee</option>
              {employees.map((employee) => (
                <option key={employee._id} value={employee.employeeId}>
                  {employee.employeeId} - {employee.fullName}
                </option>
              ))}
            </select>
            {errors.employeeId && <span className="error-message">{errors.employeeId}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={errors.date ? 'error' : ''}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.date && <span className="error-message">{errors.date}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={errors.status ? 'error' : ''}
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
            {errors.status && <span className="error-message">{errors.status}</span>}
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={onCancel}
              disabled={submitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={submitting}
            >
              {submitting ? 'Marking...' : 'Mark Attendance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttendanceForm;
