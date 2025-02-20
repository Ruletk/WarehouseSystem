import { DataSource, Repository } from 'typeorm';
import { Auth } from '../models/auth';
import { getLogger } from '@warehouse/logging';

const logger = getLogger('authRepository');

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
    logger.debug('Creating new auth record', { email });

    const now = new Date();
    const auth = this.authRepository.create({
      email,
      password_hash,
      is_active: false,
      created_at: now,
      updated_at: now,
    });

    const savedAuth = await this.authRepository.save(auth);
    logger.info('Auth record created successfully', {
      userId: savedAuth.id,
      email: savedAuth.email
    });

    return savedAuth;
  }

  /**
   * Finds an authentication record by email.
   *
   * @param email - The email address to search for.
   * @returns A promise that resolves to the authentication record if found, otherwise undefined.
   */
  async findByEmail(email: string): Promise<Auth | undefined> {
    logger.debug('Looking up auth record by email', { email });

    const foundUser = await this.authRepository.findOne({ where: { email } });
    logger.info('Auth lookup by email completed', {
      email,
      found: !!foundUser
    });

    return foundUser;
  }

  /**
   * Finds an authentication record by its ID.
   *
   * @param id - The ID of the authentication record to find.
   * @returns A promise that resolves to the authentication record if found, or undefined if not found.
   */
  async findById(id: number): Promise<Auth | undefined> {
    logger.debug('Looking up auth record by ID', { userId: id });

    const foundUser = await this.authRepository.findOne({ where: { id } });
    logger.info('Auth lookup by ID completed', {
      userId: id,
      found: !!foundUser
    });

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
    logger.debug('Updating password hash', { userId: id });

    const updateRes = await this.authRepository.update(id, {
      password_hash,
      updated_at: new Date(),
    });

    const success = updateRes.affected === 1;
    logger.info('Password update completed', {
      userId: id,
      success
    });

    return success;
  }

  /**
   * Activates a user account by setting the `is_active` flag to true.
   *
   * @param id - The unique identifier of the user account to activate.
   * @returns A promise that resolves to a boolean indicating whether the account was successfully activated.
   */
  async activateAccount(id: number): Promise<boolean> {
    logger.debug('Activating account', { userId: id });

    const updateRes = await this.authRepository.update(id, {
      is_active: true,
      updated_at: new Date(),
    });

    const success = updateRes.affected === 1;
    logger.info('Account activation completed', {
      userId: id,
      success
    });

    return success;
  }

  /**
   * Deactivates a user account by setting the `is_active` flag to false.
   *
   * @param id - The unique identifier of the user account to deactivate.
   * @returns A promise that resolves to a boolean indicating whether the account was successfully deactivated.
   */
  async deactivateAccount(id: number): Promise<boolean> {
    logger.debug('Deactivating account', { userId: id });

    const updateRes = await this.authRepository.update(id, {
      is_active: false,
      updated_at: new Date(),
    });

    const success = updateRes.affected === 1;
    logger.info('Account deactivation completed', {
      userId: id,
      success
    });

    return success;
  }

  /**
   * Marks an account as deleted by setting the `deleted_at` timestamp.
   *
   * @param id - The unique identifier of the account to be deleted.
   * @returns A promise that resolves to a boolean indicating whether the account was successfully marked as deleted.
   */
  async deleteAccount(id: number): Promise<boolean> {
    logger.warn('Soft deleting account', { userId: id });

    const updateRes = await this.authRepository.update(id, {
      deleted_at: new Date(),
    });

    const success = updateRes.affected === 1;
    logger.info('Account soft deletion completed', {
      userId: id,
      success
    });

    return success;
  }

  /**
   * Permanently deletes an account from the repository.
   *
   * @param id - The unique identifier of the account to be deleted.
   * @returns A promise that resolves to a boolean indicating whether the account was successfully deleted.
   */
  async hardDeleteAccount(id: number): Promise<boolean> {
    logger.warn('Permanently deleting account', { userId: id });

    const deleteRes = await this.authRepository.delete(id);

    const success = deleteRes.affected === 1;
    logger.info('Account permanent deletion completed', {
      userId: id,
      success
    });

    return success;
  }
}
