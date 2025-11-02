import logger from '#config/logger.js';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '#services/users.service.js';
import {
  userIdSchema,
  updateUserSchema,
} from '#validations/users.validations.js';
import { formatValidationError } from '#utils/format.js';
import { AppError } from '#errors/AppError.js';

export const fetchAllUsers = async (req, res, next) => {
  try {
    logger.info('Getting users...');

    const allUsers = await getAllUsers();

    res.json({
      message: 'Successfully retrieved users',
      users: allUsers,
      count: allUsers.length,
    });
  } catch (e) {
    logger.error(e);
    next(e);
  }
};

export const fetchUserById = async (req, res, next) => {
  try {
    logger.info(`Getting user by id: ${req.params.id}`);

    // Validate the user ID parameter
    const validationResult = userIdSchema.safeParse({ id: req.params.id });

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const { id } = validationResult.data;
    const user = await getUserById(id);

    logger.info(`User ${user.email} retrieved successfully`);
    res.json({
      message: 'User retrieved successfully',
      user,
    });
  } catch (e) {
    logger.error(`Error fetching user: ${req.params.id}`, e);
    if (e instanceof AppError) {
      return res.status(e.statusCode).json({ error: e.message });
    }
    next(e);
  }
};

export const updateUserById = async (req, res, next) => {
  try {
    logger.info(`Updating user: ${req.params.id}`);

    // Validate the user ID parameter
    const idValidationResult = userIdSchema.safeParse({ id: req.params.id });

    if (!idValidationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(idValidationResult.error),
      });
    }

    // Validate the update data
    const updateValidationResult = updateUserSchema.safeParse(req.body);

    if (!updateValidationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(updateValidationResult.error),
      });
    }

    const { id } = idValidationResult.data;
    const updates = updateValidationResult.data;

    const updatedUser = await updateUser(req.user, id, updates);

    logger.info(`User ${updatedUser.email} updated successfully`);
    res.json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (e) {
    logger.error(`Error updating user: ${req.params.id}`, e);
    if (e instanceof AppError) {
      return res.status(e.statusCode).json({ error: e.message });
    }
    next(e);
  }
};

export const deleteUserById = async (req, res, next) => {
  try {
    logger.info(`Deleting user: ${req.params.id}`);

    // Validate the user ID parameter
    const validationResult = userIdSchema.safeParse({ id: req.params.id });

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const { id } = validationResult.data;

    const deletedUser = await deleteUser(req.user, id);

    logger.info(`User ${deletedUser.email} deleted successfully`);
    res.json({
      message: 'User deleted successfully',
      user: deletedUser,
    });
  } catch (e) {
    logger.error(`Error deleting user: ${req.params.id}`, e);
    if (e instanceof AppError) {
      return res.status(e.statusCode).json({ error: e.message });
    }
    next(e);
  }
};
