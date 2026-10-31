/**
 * ============================================================================
 * MERIDIAN EMPLOYEE HELPDESK - DEPARTMENT CONTACT CONFIGURATION
 * ============================================================================
 * 
 * HACKATHON DEMO — SAMPLE CONTACT DETAILS
 * 
 * DISCLAIMER:
 * These details are fictional and are for demonstration purposes only.
 * They are not real company contacts. The sample email addresses (using example.com)
 * and 555 demo phone numbers are placeholders and are not intended to reach a real
 * department or actual staff.
 */

export const DEPARTMENT_CONTACTS = {
  // Human Resources (HR) Department — Demo Details
  hr: {
    departmentName: 'Human Resources (HR)',
    contactPerson: 'Priya Sharma',
    designation: 'HR Support Executive',
    description:
      'For urgent employee matters, workplace concerns, leave and attendance issues, payroll queries, employee relations, and other HR-related matters.',
    contactPurpose:
      'Leave, attendance, payroll queries, workplace concerns, and employee relations.',
    
    // Sample Demo Phone (RFC / NANPA demo range)
    phoneNumber: '+1-202-555-0101',

    // Sample Demo Email (RFC 2606 reserved example domain)
    emailAddress: 'hr-demo@example.com',

    // Communication URL (empty unless specifically configured)
    communicationUrl: '',
    contactUrl: '',

    // Demo Availability / Hours
    officeHours: 'Monday–Friday, 9:00 AM–6:00 PM',

    location: 'Meridian HR Operations (Demo)'
  },

  // Information Technology (IT Support) — Demo Details
  it: {
    departmentName: 'Information Technology (IT Support)',
    contactPerson: 'Rahul Verma',
    designation: 'IT Support Specialist',
    description:
      'For urgent laptop or computer problems, account lockouts, login failures, network outages, security incidents, and other technical issues.',
    contactPurpose:
      'Laptop issues, login failures, account lockouts, network issues, and technical assistance.',

    // Sample Demo Phone (RFC / NANPA demo range)
    phoneNumber: '+1-202-555-0102',

    // Sample Demo Email (RFC 2606 reserved example domain)
    emailAddress: 'it-support-demo@example.com',

    // Communication URL (empty unless specifically configured)
    communicationUrl: '',
    contactUrl: '',

    // Demo Availability / Hours
    officeHours: 'Demo IT Support — 24/7',

    location: 'Meridian IT Helpdesk Hub (Demo)'
  }
};
