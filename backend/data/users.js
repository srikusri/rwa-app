let users = [
  { id: '1', mobile: '1234567890', role: 'superAdmin', name: 'Admin User', apartmentId: 'apt1', isApproved: true, tenantId: 'default-tenant', password: 'superadminpass' },
  { id: '2', mobile: '0987654321', role: 'resident', name: 'Resident User', apartmentId: 'apt1', isApproved: false, tenantId: 'default-tenant', password: 'residentpass' },
  { id: '3', mobile: '1122334455', role: 'tenantAdmin', name: 'Default Tenant Admin', apartmentId: 'apt1', isApproved: true, tenantId: 'default-tenant', password: 'tenantadminpass' }
];

module.exports = { users };
