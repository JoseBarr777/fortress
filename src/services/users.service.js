import logger from '#config/logger.js';
import { db } from '#config/database.js';
import { users } from '#models/user.model.js';
import { eq } from 'drizzle-orm';
import { NotFoundError, ConflictError } from '#errors/AppError.js';
import {
  canUpdateUser,
  canDeleteUser,
  sanitizeUserUpdates,
} from '#policies/userPolicy.js';

export const getAllUsers = async () => {
  try {
    return await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users);
  } catch (e) {
    logger.error('Error getting users', e);
    throw e;
  }
};

export const getUserById = async id => {
  try {
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  } catch (e) {
    logger.error(`Error getting user by id ${id}:`, e);
    throw e;
  }
};

export const updateUser = async (currentUser, id, updates) => {
  try {
    // Authorization check
    canUpdateUser(currentUser, id, updates);

    // First check if user exists
    const existingUser = await getUserById(id);

    // Sanitize updates based on user role
    const sanitizedUpdates = sanitizeUserUpdates(currentUser, updates);

    // Check if email is being updated and if it already exists
    if (
      sanitizedUpdates.email &&
      sanitizedUpdates.email !== existingUser.email
    ) {
      const [emailExists] = await db
        .select()
        .from(users)
        .where(eq(users.email, sanitizedUpdates.email))
        .limit(1);
      if (emailExists) {
        throw new ConflictError('Email already exists');
      }
    }

    // Add updated_at timestamp
    const updateData = {
      ...sanitizedUpdates,
      updated_at: new Date(),
    };

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      });

    logger.info(`User ${updatedUser.email} updated successfully`);
    return updatedUser;
  } catch (e) {
    logger.error(`Error updating user ${id}:`, e);
    throw e;
  }
};

export const deleteUser = async (currentUser, id) => {
  try {
    // Authorization check
    canDeleteUser(currentUser, id);

    // First check if user exists
    await getUserById(id);

    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
      });

    logger.info(`User ${deletedUser.email} deleted successfully`);
    return deletedUser;
  } catch (e) {
    logger.error(`Error deleting user ${id}:`, e);
    throw e;
  }
};
