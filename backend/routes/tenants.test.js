// backend/routes/tenants.test.js

// Mock data - In a real test setup, you might reset this before each test
let mockTenants = [];
let mockUsers = [];

// Mock the data modules tenants.js and users.js
jest.mock('../data/tenants', () => ({
  get tenants() { return mockTenants; },
  // Allows tests to push to mockTenants if the routes modify it directly (as they do)
  __esModule: true, // if your project uses ES modules for data files
}));
jest.mock('../data/users', () => ({
  get users() { return mockUsers; },
  __esModule: true,
}));


// Mock express app setup for testing routes
const express = require('express');
const tenantRoutes = require('./tenants'); // The router we are testing

const app = express();
app.use(express.json()); // To parse request bodies

// Middleware to set req.user for testing
app.use((req, res, next) => {
  if (req.headers['x-mock-user-role']) {
    req.user = {
      id: req.headers['x-mock-user-id'] || 'test-user',
      role: req.headers['x-mock-user-role'],
      tenantId: req.headers['x-mock-user-tenantid'] || null
    };
  }
  next();
});

app.use('/tenants', tenantRoutes); // Mount the tenant routes under /tenants for testing

const request = require('supertest'); // HTTP assertion library

describe('Tenant API Routes (/tenants)', () => {
  beforeEach(() => {
    // Reset mock data before each test
    mockTenants.length = 0; // Clear the array while keeping the reference
    mockUsers.length = 0;
    mockUsers.push(
      { id: 'superadmin1', role: 'superAdmin', name: 'Super Admin', tenantId: null, isApproved: true },
      { id: 'user1', role: 'resident', name: 'Test User 1', tenantId: 'tenant1', isApproved: true },
      { id: 'user2', role: 'resident', name: 'Test User 2', tenantId: 'tenant2', isApproved: true },
      { id: 'userToBeAdmin', role: 'resident', name: 'Future Admin', tenantId: null, isApproved: true }
    );
    mockTenants.push(
      { id: 'tenant1', name: 'Tenant One', description: 'First Tenant', status: 'active' },
      { id: 'tenant2', name: 'Tenant Two', description: 'Second Tenant', status: 'inactive' }
    );
  });

  // --- Middleware: isSuperAdmin ---
  describe('Authorization Middleware', () => {
    it('should allow access if user is superAdmin', async () => {
      const res = await request(app)
        .get('/tenants')
        .set('x-mock-user-role', 'superAdmin');
      expect(res.statusCode).not.toBe(403);
    });

    it('should deny access if user is not superAdmin', async () => {
      const res = await request(app)
        .get('/tenants')
        .set('x-mock-user-role', 'tenantAdmin'); // or 'resident'
      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe('Forbidden: Requires SuperAdmin role');
    });

    it('should allow access if req.user is not defined (dev/test bypass)', async () => {
      // Note: This tests the bypass. In production, this bypass should be removed.
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development'; // Simulate dev environment
      const res = await request(app).get('/tenants'); // No x-mock-user-role header
      expect(res.statusCode).not.toBe(403);
      process.env.NODE_ENV = originalNodeEnv; // Reset NODE_ENV
    });
  });

  // --- GET /tenants ---
  describe('GET /tenants', () => {
    it('should return all tenants for a superAdmin', async () => {
      const res = await request(app)
        .get('/tenants')
        .set('x-mock-user-role', 'superAdmin');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].name).toBe('Tenant One');
    });
  });

  // --- GET /tenants/:id ---
  describe('GET /tenants/:id', () => {
    it('should return a specific tenant for a superAdmin', async () => {
      const res = await request(app)
        .get('/tenants/tenant1')
        .set('x-mock-user-role', 'superAdmin');
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Tenant One');
    });

    it('should return 404 if tenant not found', async () => {
      const res = await request(app)
        .get('/tenants/nonexistent')
        .set('x-mock-user-role', 'superAdmin');
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Tenant not found');
    });
  });

  // --- POST /tenants ---
  describe('POST /tenants', () => {
    const newTenantData = {
      name: 'New Awesome Tenant',
      description: 'A great new place to be.',
      initialAdminUserId: 'userToBeAdmin'
    };

    it('should create a new tenant and assign tenantAdmin for a superAdmin', async () => {
      const res = await request(app)
        .post('/tenants')
        .set('x-mock-user-role', 'superAdmin')
        .send(newTenantData);
      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe(newTenantData.name);
      expect(res.body.status).toBe('active');
      expect(mockTenants).toHaveLength(3);

      const assignedAdmin = mockUsers.find(u => u.id === 'userToBeAdmin');
      expect(assignedAdmin.role).toBe('tenantAdmin');
      expect(assignedAdmin.tenantId).toBe(res.body.id);
      expect(assignedAdmin.isApproved).toBe(true);
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/tenants')
        .set('x-mock-user-role', 'superAdmin')
        .send({ name: 'Only Name' });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('Missing required fields');
    });

    it('should return 404 if initialAdminUserId does not exist', async () => {
      const res = await request(app)
        .post('/tenants')
        .set('x-mock-user-role', 'superAdmin')
        .send({ ...newTenantData, initialAdminUserId: 'nonexistentuser' });
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toContain('User with id nonexistentuser not found');
    });

    it('should return 400 if trying to assign a superAdmin as tenantAdmin', async () => {
      const res = await request(app)
        .post('/tenants')
        .set('x-mock-user-role', 'superAdmin')
        .send({ ...newTenantData, initialAdminUserId: 'superadmin1' });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('SuperAdmin cannot be assigned as a TenantAdmin.');
    });
  });

  // --- PATCH /tenants/:id ---
  describe('PATCH /tenants/:id', () => {
    it('should update tenant name, description, and status for a superAdmin', async () => {
      const updates = { name: 'Updated Tenant One', status: 'inactive' };
      const res = await request(app)
        .patch('/tenants/tenant1')
        .set('x-mock-user-role', 'superAdmin')
        .send(updates);
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe(updates.name);
      expect(res.body.status).toBe(updates.status);
      expect(mockTenants.find(t=>t.id === 'tenant1').name).toBe(updates.name);
    });

    it('should update tenant admin for a superAdmin', async () => {
      // First, make user1 a tenantAdmin for tenant1
      const initialAdmin = mockUsers.find(u=>u.id === 'user1');
      initialAdmin.role = 'tenantAdmin';
      initialAdmin.tenantId = 'tenant1';

      const res = await request(app)
        .patch('/tenants/tenant1')
        .set('x-mock-user-role', 'superAdmin')
        .send({ initialAdminUserId: 'userToBeAdmin' });

      expect(res.statusCode).toBe(200);
      const newAdmin = mockUsers.find(u => u.id === 'userToBeAdmin');
      expect(newAdmin.role).toBe('tenantAdmin');
      expect(newAdmin.tenantId).toBe('tenant1');
      // Check if old admin (user1) was demoted
      expect(initialAdmin.role).toBe('resident');
    });

    it('should return 404 if tenant to update is not found', async () => {
      const res = await request(app)
        .patch('/tenants/nonexistent')
        .set('x-mock-user-role', 'superAdmin')
        .send({ name: 'Does not matter' });
      expect(res.statusCode).toBe(404);
    });

    it('should return 400 for invalid status value', async () => {
      const res = await request(app)
        .patch('/tenants/tenant1')
        .set('x-mock-user-role', 'superAdmin')
        .send({ status: 'invalidStatus' });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('Invalid status value');
    });

    it('should return 404 if new initialAdminUserId for PATCH does not exist', async () => {
        const res = await request(app)
          .patch('/tenants/tenant1')
          .set('x-mock-user-role', 'superAdmin')
          .send({ initialAdminUserId: 'ghostuser' });
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toContain('User with id ghostuser not found');
    });

    it('should return 400 if trying to assign a superAdmin as tenantAdmin via PATCH', async () => {
        const res = await request(app)
          .patch('/tenants/tenant1')
          .set('x-mock-user-role', 'superAdmin')
          .send({ initialAdminUserId: 'superadmin1' });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('SuperAdmin cannot be assigned as a TenantAdmin.');
    });
  });
});
