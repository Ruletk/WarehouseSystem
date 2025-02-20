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
    logger.debug(`Returning newly created user with id: ${savedAuth.id}, email: ${savedAuth.email}`);
    return savedAuth;
  }

  async findByEmail(email: string): Promise<Auth | undefined> {
    logger.info(`Retrieving user with email: ${email}`);
    const foundUser = await this.authRepository.findOne({ where: { email } });
    logger.debug(`Returning user found by email ${email}: ${foundUser ? 'found' : 'not found'}`);
    return foundUser;
  }

  async findById(id: number): Promise<Auth | undefined> {
    logger.info(`Retrieving user by ID: ${id}`);
    const foundUser = await this.authRepository.findOne({ where: { id } });
    logger.debug(`Returning user found by ID ${id}: ${foundUser ? 'found' : 'not found'}`);
    return foundUser;
  }

  async updatePassword(id: number, password_hash: string): Promise<boolean> {
    logger.info(`Updating password for user with ID: ${id}`);
    const updateRes = await this.authRepository.update(id, {
      password_hash,
      updated_at: new Date(),
    });
    const success = updateRes.affected === 1;
    logger.debug(`Returning result of updatePassword for ID ${id}: ${success ? 'success' : 'failed'}`);
    return success;
  }

  async activateAccount(id: number): Promise<boolean> {
    logger.info(`Activating account with ID: ${id}`);
    const updateRes = await this.authRepository.update(id, {
      is_active: true,
      updated_at: new Date(),
    });
    const success = updateRes.affected === 1;
    logger.debug(`Returning result of activateAccount for ID ${id}: ${success ? 'success' : 'failed'}`);
    return success;
  }

  async deactivateAccount(id: number): Promise<boolean> {
    logger.info(`Deactivating account with ID: ${id}`);
    const updateRes = await this.authRepository.update(id, {
      is_active: false,
      updated_at: new Date(),
    });
    const success = updateRes.affected === 1;
    logger.debug(`Returning result of deactivateAccount for ID ${id}: ${success ? 'success' : 'failed'}`);
    return success;
  }

  async deleteAccount(id: number): Promise<boolean> {
    logger.info(`Marking account as deleted with ID: ${id}`);
    const updateRes = await this.authRepository.update(id, {
      deleted_at: new Date(),
    });
    const success = updateRes.affected === 1;
    logger.debug(`Returning result of deleteAccount for ID ${id}: ${success ? 'success' : 'failed'}`);
    return success;
  }

  async hardDeleteAccount(id: number): Promise<boolean> {
    logger.info(`Hard deleting account with ID: ${id}`);
    const deleteRes = await this.authRepository.delete(id);
    const success = deleteRes.affected === 1;
    logger.debug(`Returning result of hardDeleteAccount for ID ${id}: ${success ? 'success' : 'failed'}`);
    return success;
  }
}
