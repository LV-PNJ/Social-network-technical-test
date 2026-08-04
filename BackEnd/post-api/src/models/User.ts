import {
  Entity,
  PrimaryColumn,
  Column,
  BaseEntity,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from './Post';

/**
 * Local projection of an Identity user for post ownership and likes.
 * Credentials live only in Identity — this table has no password.
 */
@Entity()
export class User extends BaseEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ unique: true, length: 30 })
  username!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  displayName?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar?: string | null;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt!: Date;

  @OneToMany(() => Post, (post) => post.user)
  posts!: Post[];
}
