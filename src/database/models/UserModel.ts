import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleModel } from './RoleModel';

@Entity({ name: 'master_users' })
export class UserModel {
  @PrimaryGeneratedColumn('uuid')
  user_id!: string;

  @Column({ name: 'role_id', type: 'uuid', default: null, nullable: true })
  role_id!: string;

  @OneToOne(() => RoleModel, (value) => value.user)
  @JoinColumn({ name: 'role_id' })
  role!: RoleModel;

  @Column({ type: 'varchar', length: 255, name: 'name' })
  name!: string;

  @Column({ type: 'varchar', length: 255, name: 'email', unique: true, nullable: false })
  email!: string;

  @Column({ type: 'varchar', name: 'password', nullable: false })
  password!: string;

  @Column({ type: 'text', name: 'refresh_token', nullable: true, default: null })
  refresh_token!: string;

  @Column({ type: 'jsonb', name: 'photo', nullable: true, default: null })
  photo!: string;

  @Column({ type: 'text', name: 'phone', nullable: true, default: null })
  phone!: string;

  @Column({ type: 'text', nullable: true, default: null })
  otp_code!: string | null;

  @Column({ type: 'timestamp', nullable: true, default: null })
  otp_expired!: Date | null;

  @Column({ type: 'bool', nullable: true, default: false })
  has_verified!: Boolean;

  @Column({ type: 'text', nullable: true, default: null })
  last_ip!: string;

  @Column({ type: 'text', nullable: true, default: null })
  last_hostname!: string;

  @Column({ type: 'timestamp', nullable: true, default: null })
  last_login!: Date;

  @Column({ type: 'timestamp', nullable: true, default: null })
  registered_at!: Date;

  @Column({ type: 'timestamp', nullable: true, default: null, name: 'verified_at' })
  verified_at!: Date;

  @Column({ type: 'timestamp', nullable: true, default: null, name: 'password_change_at' })
  password_change_at!: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  created_at!: Date;

  @Column({ name: 'created_by', type: 'uuid', select: false })
  created_by!: string;

  @UpdateDateColumn({ type: 'timestamp', nullable: true, name: 'updated_at' })
  updated_at!: Date;

  @Column({ name: 'updated_by', type: 'uuid', select: false })
  updated_by!: string;

  @DeleteDateColumn({ type: 'timestamp', nullable: true, name: 'deleted_at', select: false })
  deleted_at!: Date;

  @Column({ name: 'deleted_by', type: 'uuid', select: false })
  deleted_by!: string;
}
