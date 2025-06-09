# Admin Guide

This guide provides instructions for SuperAdmins to manage the RWA application.

## Tenant Management (Manual Process)

Onboarding a new tenant currently involves a manual process of editing data files directly. This process should only be performed by a SuperAdmin with direct access to the backend codebase.

**Important:** Always ensure data consistency and make backups before manual edits if operating in a critical environment.

### Step 1: Add Tenant Record

To introduce a new tenant into the system, the SuperAdmin must add a new tenant object to the `tenants` array within the `backend/data/tenants.js` file.

1.  **Open the file:** Navigate to and open `backend/data/tenants.js`.
2.  **Edit the `tenants` array:** Add a new JavaScript object representing the new tenant. This object must include:
    *   `id`: A unique string identifier for the tenant (e.g., 'sunset-valley-hoa'). This ID will be used to link users and resources to this tenant.
    *   `name`: A human-readable name for the tenant (e.g., 'Sunset Valley HOA').
    *   `description`: A brief description of the tenant.

**Example of adding a new tenant:**

If `tenants.js` currently contains:
```javascript
let tenants = [
  { id: 'default-tenant', name: 'Default Community Tenant', description: 'The initial default tenant for existing users and data.' },
  { id: 'tenant-alpha', name: 'Alpha Residences', description: 'A newly onboarded premium tenant.' }
];

module.exports = { tenants };
```

To add "Emerald Gardens Community", you would modify it to:
```javascript
let tenants = [
  { id: 'default-tenant', name: 'Default Community Tenant', description: 'The initial default tenant for existing users and data.' },
  { id: 'tenant-alpha', name: 'Alpha Residences', description: 'A newly onboarded premium tenant.' },
  { id: 'emerald-gardens', name: 'Emerald Gardens Community', description: 'A peaceful residential community with lush gardens.' } // New tenant added
];

module.exports = { tenants };
```

### Step 2: Create Initial TenantAdmin User

After defining the new tenant, a primary administrative user (TenantAdmin) must be created for that tenant. This user will manage their specific tenant's affairs (e.g., approving residents, managing announcements for their tenant).

1.  **Open the file:** Navigate to and open `backend/data/users.js`.
2.  **Edit the `users` array:** Add a new JavaScript object for the TenantAdmin user. This object must include:
    *   `id`: A unique string identifier for the user (e.g., 'user-emg-admin').
    *   `mobile`: A unique mobile number for login (e.g., '555000111').
    *   `password`: A placeholder password (e.g., 'newtenantadminpass'). Remember, in a real system, this should be handled securely.
    *   `role`: Must be set to `'tenantAdmin'`.
    *   `name`: The name of the TenantAdmin (e.g., 'Alice Green').
    *   `apartmentId`: Can be a placeholder or a relevant default for the tenant (e.g., 'admin-unit').
    *   `isApproved`: Must be set to `true` for the TenantAdmin to be active.
    *   `tenantId`: **Crucially, this must exactly match the `id` of the tenant created in Step 1** (e.g., 'emerald-gardens').

**Example of adding a TenantAdmin for 'emerald-gardens':**

Assuming `users.js` looks something like this:
```javascript
let users = [
  // ... other users ...
  { id: '3', mobile: '1122334455', role: 'tenantAdmin', name: 'Default Tenant Admin', apartmentId: 'apt1', isApproved: true, tenantId: 'default-tenant', password: 'tenantadminpass' }
];
```

You would add the new TenantAdmin:
```javascript
let users = [
  // ... other users ...
  { id: '3', mobile: '1122334455', role: 'tenantAdmin', name: 'Default Tenant Admin', apartmentId: 'apt1', isApproved: true, tenantId: 'default-tenant', password: 'tenantadminpass' },
  {
    id: 'user-emg-admin', // Unique ID
    mobile: '555000111',  // Unique mobile
    password: 'emeraldpass', // Placeholder password
    role: 'tenantAdmin',     // Role
    name: 'Alice Green - Emerald Admin',
    apartmentId: 'emg-office',
    isApproved: true,        // Must be true
    tenantId: 'emerald-gardens' // Matches tenant ID from tenants.js
  }
];

module.exports = { users };
```

**Verification:** After these changes, ensure the application is restarted (if necessary) to load the updated data. The new TenantAdmin should then be able to log in (once authentication is fully implemented) and manage their designated tenant. Further users for this tenant (e.g., residents) can then be added, typically by this TenantAdmin.
