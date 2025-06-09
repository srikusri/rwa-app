const express = require('express');
const router = express.Router();
let { users } = require('../data/users'); // Use let for reassignment

// GET / (List items)
router.get('/', (req, res) => {
  if (req.user.role === 'superAdmin') {
    res.json(users);
  } else {
    // tenantAdmin and residents can see users of their own tenant
    res.json(users.filter(user => user.tenantId === req.user.tenantId));
  }
});

// GET /:id (Get single item)
router.get('/:id', (req, res) => {
  const item = users.find(u => u.id === req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'User not found' });
  }
  if (req.user.role === 'superAdmin' || item.tenantId === req.user.tenantId) {
    // Further check: A resident should not be able to see other user's details by id unless it's themselves.
    // However, the current requirement is based on tenantId, which is simpler.
    // For enhanced privacy, one might add: (req.user.role !== 'resident' || item.id === req.user.id)
    res.json(item);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// POST / (Create new item - User creation)
router.post('/', (req, res) => {
  let tenantIdForNewUser;
  let roleForNewUser = req.body.role;
  const { tenantId, ...newItemData } = req.body;

  if (req.user.role === 'superAdmin') {
    if (!tenantId) {
      return res.status(400).json({ message: 'tenantId is required for superAdmin when creating a user' });
    }
    tenantIdForNewUser = tenantId;
    if (!roleForNewUser) {
        return res.status(400).json({ message: 'User role is required for superAdmin when creating a user' });
    }
    // superAdmin can create any role
  } else if (req.user.role === 'tenantAdmin') {
    tenantIdForNewUser = req.user.tenantId;
    if (!roleForNewUser || (roleForNewUser !== 'resident' && roleForNewUser !== 'tenantAdmin')) {
      return res.status(400).json({ message: 'tenantAdmin can only create users with role "resident" or "tenantAdmin"' });
    }
  } else {
    // Residents cannot create users
    return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
  }

  const newUser = {
    id: Math.random().toString(),
    ...newItemData,
    role: roleForNewUser,
    tenantId: tenantIdForNewUser,
    isApproved: req.body.isApproved === undefined ? (roleForNewUser === 'resident' ? false : true) : req.body.isApproved, // Residents default to not approved
    createdAt: new Date()
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// PATCH /:id (Update item - User update)
router.patch('/:id', (req, res) => {
  const itemIndex = users.findIndex(u => u.id === req.params.id);
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  const userToUpdate = users[itemIndex];
  const updateData = { ...req.body };

  // Prevent tenantId change and id change
  delete updateData.tenantId;
  delete updateData.id;

  if (req.user.role === 'superAdmin') {
    // SuperAdmin can update any user and any attribute (except tenantId, id)
    users[itemIndex] = { ...userToUpdate, ...updateData };
  } else if (req.user.role === 'tenantAdmin') {
    if (userToUpdate.tenantId !== req.user.tenantId) {
      return res.status(404).json({ message: 'User not found (or not authorized to update)' });
    }
    // TenantAdmin can update users in their tenant.
    // They can approve/disapprove (isApproved).
    // They can change role between 'resident' and 'tenantAdmin' for users in their tenant.
    if (updateData.role && (updateData.role === 'superAdmin')) {
        return res.status(403).json({ message: 'tenantAdmin cannot escalate role to superAdmin.' });
    }
    if (updateData.role && (userToUpdate.role === 'superAdmin' && updateData.role !== 'superAdmin')) {
        return res.status(403).json({ message: 'tenantAdmin cannot change role of a superAdmin.'});
    }
     // Allow tenantAdmin to change roles only for residents or other tenantAdmins within their tenant
    if (updateData.role && (userToUpdate.role !== 'resident' && userToUpdate.role !== 'tenantAdmin')) {
        return res.status(403).json({ message: 'tenantAdmin can only change roles for residents or other tenantAdmins.' });
    }


    users[itemIndex] = { ...userToUpdate, ...updateData };
  } else if (req.user.role === 'resident') {
    // Residents can only update their own profile (and not their role or approval status)
    if (userToUpdate.id !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden: Residents can only update their own profile.' });
    }
    delete updateData.role; // Residents cannot change their role
    delete updateData.isApproved; // Residents cannot change their approval status
    users[itemIndex] = { ...userToUpdate, ...updateData };
  } else {
    return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
  }

  res.json(users[itemIndex]);
});

// DELETE /:id (Delete item - User deletion)
router.delete('/:id', (req, res) => {
  const itemIndex = users.findIndex(u => u.id === req.params.id);
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  const userToDelete = users[itemIndex];

  if (req.user.role === 'superAdmin') {
    // SuperAdmin can delete any user, but perhaps not themselves? (Add check if needed: userToDelete.id !== req.user.id)
  } else if (req.user.role === 'tenantAdmin') {
    if (userToDelete.tenantId !== req.user.tenantId) {
      return res.status(404).json({ message: 'User not found (or not authorized to delete)' });
    }
    if (userToDelete.role === 'superAdmin') {
        return res.status(403).json({ message: 'tenantAdmin cannot delete a superAdmin.' });
    }
    // tenantAdmin cannot delete another tenantAdmin if that admin is not themselves
    if (userToDelete.role === 'tenantAdmin' && userToDelete.id !== req.user.id) {
        // This check might be too restrictive depending on exact requirements
        // For now, let's assume a tenantAdmin can delete other tenantAdmins in their tenant.
    }
  } else {
    // Residents cannot delete users
    return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
  }

  if (userToDelete.id === req.user.id && userToDelete.role !== 'superAdmin') { // Prevent self-deletion unless superAdmin
     // Actually, superAdmin self-deletion might also be problematic.
     // For now, let's prevent all self-deletion via API for simplicity.
     // return res.status(403).json({ message: 'Cannot delete yourself.' });
  }


  users = users.filter(u => u.id !== req.params.id);
  res.status(204).send();
});

module.exports = router;
