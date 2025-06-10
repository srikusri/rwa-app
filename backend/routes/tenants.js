const express = require('express');
const router = express.Router();
let { tenants } = require('../data/tenants'); // Use 'let' if tenants array might be modified (e.g. by future DELETE)
let { users } = require('../data/users'); // Required for assigning/updating tenant admins

// Middleware to check for SuperAdmin role (conceptual)
const isSuperAdmin = (req, res, next) => {
  // In a real app, req.user would be populated by auth middleware
  if (req.user && req.user.role === 'superAdmin') {
    next();
  } else {
    // If req.user is not available for testing, temporarily allow access
    // This should be removed or secured properly with actual auth
    if (process.env.NODE_ENV === 'test' || !req.user) { // Example temporary bypass for dev without auth
        console.warn('Bypassing SuperAdmin check in tenants API for dev/test');
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Requires SuperAdmin role' });
    }
  }
};

// Apply SuperAdmin check to all routes in this router
router.use(isSuperAdmin);

// GET /api/tenants - List all tenants
router.get('/', (req, res) => {
  res.json(tenants);
});

// GET /api/tenants/:id - Get a specific tenant by ID
router.get('/:id', (req, res) => {
  const tenant = tenants.find(t => t.id === req.params.id);
  if (!tenant) {
    return res.status(404).json({ message: 'Tenant not found' });
  }
  res.json(tenant);
});

// POST /api/tenants - Create a new tenant
router.post('/', (req, res) => {
  const { name, description, initialAdminUserId } = req.body;

  if (!name || !description || !initialAdminUserId) {
    return res.status(400).json({ message: 'Missing required fields: name, description, initialAdminUserId' });
  }

  // Check if initialAdminUserId is valid
  const adminUser = users.find(u => u.id === initialAdminUserId);
  if (!adminUser) {
    return res.status(404).json({ message: `User with id ${initialAdminUserId} not found to be made tenant admin.` });
  }
  if (adminUser.role === 'superAdmin') {
    return res.status(400).json({ message: 'SuperAdmin cannot be assigned as a TenantAdmin.' });
  }
  // Potentially check if user is already a tenant admin for another active tenant etc. (omitted for brevity)

  const newTenantId = 'tenant-' + Math.random().toString(36).substr(2, 9);
  const newTenant = {
    id: newTenantId,
    name,
    description,
    status: 'active' // Default status
  };
  tenants.push(newTenant);

  // Update the user to be tenantAdmin for this new tenant
  adminUser.role = 'tenantAdmin';
  adminUser.tenantId = newTenantId;
  adminUser.isApproved = true; // Ensure tenant admin is approved

  res.status(201).json(newTenant);
});

// PATCH /api/tenants/:id - Update a tenant
router.patch('/:id', (req, res) => {
  const tenantId = req.params.id;
  const { name, description, status, initialAdminUserId } = req.body;

  const tenantIndex = tenants.findIndex(t => t.id === tenantId);
  if (tenantIndex === -1) {
    return res.status(404).json({ message: 'Tenant not found' });
  }

  const updatedTenant = { ...tenants[tenantIndex] };

  if (name) updatedTenant.name = name;
  if (description) updatedTenant.description = description;
  if (status && ['active', 'inactive'].includes(status)) {
    updatedTenant.status = status;
  } else if (status) {
    return res.status(400).json({ message: "Invalid status value. Must be 'active' or 'inactive'." });
  }

  if (initialAdminUserId) {
    // Find the old tenantAdmin for this tenant (if any) and demote them to resident
    const oldAdmin = users.find(u => u.tenantId === tenantId && u.role === 'tenantAdmin');
    if (oldAdmin && oldAdmin.id !== initialAdminUserId) {
        oldAdmin.role = 'resident'; // Or some other default/unassigned role
    }

    // Assign the new tenantAdmin
    const newAdminUser = users.find(u => u.id === initialAdminUserId);
    if (!newAdminUser) {
      return res.status(404).json({ message: `User with id ${initialAdminUserId} not found to be made tenant admin.` });
    }
    if (newAdminUser.role === 'superAdmin') {
        return res.status(400).json({ message: 'SuperAdmin cannot be assigned as a TenantAdmin.' });
    }
    newAdminUser.role = 'tenantAdmin';
    newAdminUser.tenantId = tenantId; // Assign to the current tenant
    newAdminUser.isApproved = true;
  }

  tenants[tenantIndex] = updatedTenant;
  res.json(updatedTenant);
});

module.exports = router;
