import { DataSource, Repository } from 'typeorm';
import { Auth } from '../models/auth';

export class AuthRepository {
  private dataSource: DataSource;
  private authRepository: Repository<Auth>;

  constructor(dataSource: DataSource) {
    console.log('INFO: Creating AuthRepository instance');
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
    const auth = this.authRepository.create({
      email,
      password_hash,
      is_active: false,
      created_at: now,
      updated_at: now,
    });

    return this.authRepository.save(auth);
  }

  /**
   * Finds an authentication record by email.
   *
   * @param email - The email address to search for.
   * @returns A promise that resolves to the authentication record if found, otherwise undefined.
   */
  async findByEmail(email: string): Promise<Auth | undefined> {
    return this.authRepository.findOne({ where: { email } });
  }

  /**
   * Finds an authentication record by its ID.
   *
   * @param id - The ID of the authentication record to find.
   * @returns A promise that resolves to the authentication record if found, or undefined if not found.
   */
  async findById(id: number): Promise<Auth | undefined> {
    return this.authRepository.findOne({ where: { id } });
  }

  /**
   * Updates the password hash for a given user.
   *
   * @param id - The unique identifier of the user.
   * @param password_hash - The new password hash to be set.
   * @returns A promise that resolves to a boolean indicating whether the update was successful.
   */
  async updatePassword(id: number, password_hash: string): Promise<boolean> {
    // Don't need to get entity, just update the password_hash
    const updateRes = await this.authRepository.update(id, {
      password_hash,
      updated_at: new Date(),
    });
    return updateRes.affected === 1;
  }

  /**
   * Activates a user account by setting the `is_active` flag to true and updating the `updated_at` timestamp.
   *
   * @param id - The unique identifier of the user account to activate.
   * @returns A promise that resolves to a boolean indicating whether the account was successfully activated.
   */
  async activateAccount(id: number): Promise<boolean> {
    const updateRes = await this.authRepository.update(id, {
      is_active: true,
      updated_at: new Date(),
    });
    return updateRes.affected === 1;
  }

  /**
   * Deactivates an account by setting its `is_active` status to false and updating the `updated_at` timestamp.
   *
   * @param id - The unique identifier of the account to deactivate.
   * @returns A promise that resolves to a boolean indicating whether the account was successfully deactivated.
   */
  async deactivateAccount(id: number): Promise<boolean> {
    const updateRes = await this.authRepository.update(id, {
      is_active: false,
      updated_at: new Date(),
    });
    return updateRes.affected === 1;
  }

  /**
   * Marks an account as deleted by setting the `deleted_at` timestamp.
   *
   * @param id - The unique identifier of the account to be deleted.
   * @returns A promise that resolves to a boolean indicating whether the account was successfully marked as deleted.
   */
  async deleteAccount(id: number): Promise<boolean> {
    // Keep updated_at for audit purposes, not updating it here
    const updateRes = await this.authRepository.update(id, {
      deleted_at: new Date(),
    });
    return updateRes.affected === 1;
  }

  /**
   * Permanently deletes an account from the repository.
   *
   * @param id - The unique identifier of the account to be deleted.
   * @returns A promise that resolves to a boolean indicating whether the account was successfully deleted.
   */
  async hardDeleteAccount(id: number): Promise<boolean> {
    const deleteRes = await this.authRepository.delete(id);
    return deleteRes.affected === 1;
  }
}
