import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Auth } from './auth';

@Entity({ name: 'refresh_tokens' })
export class RefreshTokens {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'token', unique: true })
  token: string;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expires: Date;

  @Column({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @Column({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;

  @Column({ name: 'deleted_at', type: 'timestamp' })
  deleted_at: Date;

  @Column({ name: 'last_user_agent' })
  lastUserAgent: string;

  @Column({ name: 'last_ip' })
  lastIP: string;

  @ManyToOne(() => Auth)
  auth: Auth;
}
