import { DataSource, Repository } from 'typeorm';
import { Auth } from '../models/auth';
import { logger } from '../../logger';

export class AuthRepository {
  private dataSource: DataSource;
  private authRepository: Repository<Auth>;

  constructor(dataSource: DataSource) {
    logger.info('Creating AuthRepository instance');
    this.dataSource = dataSource;
    this.authRepository = dataSource.getRepository(Auth);
  }

  /**
   * Creates a new Auth entity with the given email and password hash.
   * Sets the created_at and updated_at timestamps to the current date and time.
   * Throws an error if the email address is already in use. Error code: '23505'.
   *
   * @param email - The email address of the user.
   * @param password_hash - The hashed password of the user.
   * @returns A promise that resolves to the created Auth entity.
   */

  async create(email: string, password_hash: string): Promise<Auth> {
    const now = new Date();
    logger.info(`Creating user ${email} at time ${now.toISOString()}`);
    const auth = this.authRepository.create({
      email,
      password_hash,
      is_active: false,
      created_at: now,
      updated_at: now,
    });
    const savedAuth = await this.authRepository.save(auth);
    logger.debug(
      `Returning newly created user with id: ${savedAuth.id}, email: ${savedAuth.email}`
    );
    return savedAuth;
  }

  /**
   * Finds an authentication record by email.
   *
   * @param email - The email address to search for.
   * @returns A promise that resolves to the authentication record if found, otherwise undefined.
   */

  async findByEmail(email: string): Promise<Auth | undefined> {
    logger.info(`Retrieving user with email: ${email}`);
    const foundUser = await this.authRepository.findOne({ where: { email } });
    logger.debug(
      `Returning user found by email ${email}: ${
        foundUser ? 'found' : 'not found'
      }`
    );
    return foundUser;
  }

  /**
   * Finds an authentication record by its ID.
   *
   * @param id - The ID of the authentication record to find.
   * @returns A promise that resolves to the authentication record if found, or undefined if not found.
   */

  async findById(id: number): Promise<Auth | undefined> {
    logger.info(`Retrieving user by ID: ${id}`);
    const foundUser = await this.authRepository.findOne({ where: { id } });
    logger.debug(
      `Returning user found by ID ${id}: ${foundUser ? 'found' : 'not found'}`
    );
    return foundUser;
  }

  /**
   * Updates the password hash for a given user.
   *
   * @param id - The unique identifier of the user.
   * @param password_hash - The new password hash to be set.
   * @returns A promise that resolves to a boolean indicating whether the update was successful.
   */

  async updatePassword(id: number, password_hash: string): Promise<boolean> {
    logger.info(`Updating password for user with ID: ${id}`);
    const updateRes = await this.authRepository.update(id, {
      password_hash,
      updated_at: new Date(),
    });
    const success = updateRes.affected === 1;
    logger.debug(
      `Returning result of updatePassword for ID ${id}: ${
        success ? 'success' : 'failed'
      }`
    );
    return success;
  }

  /**
   * Activates a user account by setting the `is_active` flag to true and updating the `updated_at` timestamp.
   *
   * @param id - The unique identifier of the user account to activate.
   * @returns A promise that resolves to a boolean indicating whether the account was successfully activated.
   */

  async activateAccount(id: number): Promise<boolean> {
    logger.info(`Activating account with ID: ${id}`);
    const updateRes = await this.authRepository.update(id, {
      is_active: true,
      updated_at: new Date(),
    });
    const success = updateRes.affected === 1;
    logger.debug(
      `Returning result of activateAccount for ID ${id}: ${
        success ? 'success' : 'failed'
      }`
    );
    return success;
  }

  async deactivateAccount(id: number): Promise<boolean> {
    logger.info(`Deactivating account with ID: ${id}`);
    const updateRes = await this.authRepository.update(id, {
      is_active: false,
      updated_at: new Date(),
    });
    const success = updateRes.affected === 1;
    logger.debug(
      `Returning result of deactivateAccount for ID ${id}: ${
        success ? 'success' : 'failed'
      }`
    );
    return success;
  }

  /**
   * Marks an account as deleted by setting the `deleted_at` timestamp.
   *
   * @param id - The unique identifier of the account to be deleted.
   * @returns A promise that resolves to a boolean indicating whether the account was successfully marked as deleted.
   */

  async deleteAccount(id: number): Promise<boolean> {
    logger.info(`Marking account as deleted with ID: ${id}`);
    const updateRes = await this.authRepository.update(id, {
      deleted_at: new Date(),
    });
    const success = updateRes.affected === 1;
    logger.debug(
      `Returning result of deleteAccount for ID ${id}: ${
        success ? 'success' : 'failed'
      }`
    );
    return success;
  }

  /**
   * Permanently deletes an account from the repository.
   *
   * @param id - The unique identifier of the account to be deleted.
   * @returns A promise that resolves to a boolean indicating whether the account was successfully deleted.
   */

  async hardDeleteAccount(id: number): Promise<boolean> {
    logger.info(`Hard deleting account with ID: ${id}`);
    const deleteRes = await this.authRepository.delete(id);
    const success = deleteRes.affected === 1;
    logger.debug(
      `Returning result of hardDeleteAccount for ID ${id}: ${
        success ? 'success' : 'failed'
      }`
    );
    return success;
  }
}
