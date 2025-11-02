import { UnauthorizedError, ForbiddenError } from '#errors/AppError.js';

export const canUpdateUser = (currentUser, targetUserId, updates) => {
  if (!currentUser) {
    throw new UnauthorizedError(
      'You must be logged in to update user information'
    );
  }

  const isAdmin = currentUser.role === 'admin';
  const isOwnProfile = currentUser.id === targetUserId;

  if (!isAdmin && !isOwnProfile) {
    throw new ForbiddenError('You can only update your own information');
  }

  if (updates.role && !isAdmin) {
    throw new ForbiddenError('Only administrators can change user roles');
  }
};

export const canDeleteUser = (currentUser, targetUserId) => {
  if (!currentUser) {
    throw new UnauthorizedError('You must be logged in to delete users');
  }

  if (currentUser.role !== 'admin') {
    throw new ForbiddenError('Only administrators can delete users');
  }

  if (currentUser.id === targetUserId) {
    throw new ForbiddenError('You cannot delete your own account');
  }
};

export const sanitizeUserUpdates = (currentUser, updates) => {
  const sanitized = { ...updates };

  // Remove role if user is not admin
  if (currentUser.role !== 'admin' && sanitized.role) {
    delete sanitized.role;
  }

  return sanitized;
};
