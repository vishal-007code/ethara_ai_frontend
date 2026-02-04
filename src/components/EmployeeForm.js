import React, { useState } from 'react';
import './EmployeeForm.css';

const EmployeeForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    fullName: '',
    email: '',
    department: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

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
    
    if (!formData.employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required';
    }
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
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
      await onSubmit(formData);
      // If successful, the form will be closed by the parent component
      // Reset form state in case of any issues
      setFormData({
        employeeId: '',
        fullName: '',
        email: '',
        department: '',
      });
    } catch (err) {
      // Handle server-side errors
      const errorMessage = err?.formattedMessage || err?.message || 'Failed to add employee. Please try again.';
      setServerError(errorMessage);
      
      // If error message contains field-specific info, try to map it to form fields
      const errorLower = errorMessage.toLowerCase();
      if (errorLower.includes('employee id') || errorLower.includes('employeeid')) {
        setErrors((prev) => ({ ...prev, employeeId: errorMessage }));
      } else if (errorLower.includes('email')) {
        setErrors((prev) => ({ ...prev, email: errorMessage }));
      } else if (errorLower.includes('name')) {
        setErrors((prev) => ({ ...prev, fullName: errorMessage }));
      } else if (errorLower.includes('department')) {
        setErrors((prev) => ({ ...prev, department: errorMessage }));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-overlay" onClick={onCancel}>
      <div className="form-container" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h2>Add New Employee</h2>
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
            <label htmlFor="employeeId">Employee ID *</label>
            <input
              type="text"
              id="employeeId"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              className={errors.employeeId ? 'error' : ''}
              placeholder="e.g., EMP001"
            />
            {errors.employeeId && <span className="error-message">{errors.employeeId}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="fullName">Full Name *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={errors.fullName ? 'error' : ''}
              placeholder="Enter full name"
            />
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="employee@example.com"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="department">Department *</label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={errors.department ? 'error' : ''}
              placeholder="e.g., Engineering, HR, Sales"
            />
            {errors.department && <span className="error-message">{errors.department}</span>}
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
              {submitting ? 'Adding...' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
