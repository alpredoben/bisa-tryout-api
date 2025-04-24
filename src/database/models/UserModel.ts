import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { RoleModel } from './RoleModel';

@Entity({ name: 'master_users' })
export class UserModel {
  @PrimaryGeneratedColumn('uuid')
  user_id!: string;

  @Column({ name: 'role_id', type: 'uuid', default: null, nullable: true })
  role_id!: string;

  @OneToOne(() => RoleModel, (value: any) => value.user)
  @JoinColumn({ name: 'role_id' })
  role!: RoleModel;

  @Column({ type: 'varchar', length: 255, name: 'full_name' })
  full_name!: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email!: string;

  @Column({ type: 'varchar', nullable: false })
  password!: string;

  @Column({ type: 'longtext', nullable: true, default: null })
  salt!: string;

  @Column({ type: 'longtext', nullable: true, default: null })
  refresh_token!: string;

  @Column({ type: 'longtext', nullable: true, default: null })
  photo!: string;

  @Column({ type: 'varchar', length: 30, nullable: true, default: null })
  phone_number!: string;

  @Column({ type: 'longtext', nullable: true, default: null })
  email_verified_token!: string | null;

  @Column({ type: 'timestamp', nullable: true, default: null })
  email_verified_expired!: Date | null;

  @Column({ type: 'text', nullable: true, default: null })
  otp_code!: string | any;

  @Column({ type: 'timestamp', nullable: true, default: null })
  otp_expired!: Date | any;

  @Column({ type: 'boolean', default: false })
  is_active!: number;

  @Column({ type: 'text', nullable: true, default: null })
  last_ip!: string;

  @Column({ type: 'text', nullable: true, default: null })
  last_hostname!: string;

  @Column({ type: 'timestamp', nullable: true, default: null })
  last_login_at!: Date;

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
