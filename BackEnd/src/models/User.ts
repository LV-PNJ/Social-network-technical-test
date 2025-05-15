import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  BaseEntity,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import argon2 from 'argon2';
import { Post } from './Post';
// import { Comment } from './Comment'; // Comment import removed
import { IsEmail, Length, Matches, IsUrl, IsOptional, IsArray, IsString } from 'class-validator';

@Entity()
// @Check(\`"username" ~ '^[a-zA-Z0-9_]+$'\`) // Regex check can be handled by @Matches or a DB-level check if preferred
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ 
    unique: true,
    length: 30 
  })
  @Length(3, 30, { 
    message: 'Username must be between 3 and 30 characters long'
  })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers and underscores'
  })
  username!: string;

  @Column({ 
    unique: true,
    length: 100 
  })
  @IsEmail({}, {
    message: 'Invalid email format'
  })
  email!: string;

  @Column()
  @Length(6, 100, {
    message: 'Password must be between 6 and 100 characters long'
  })
  // Consider adding regex for password complexity if needed, e.g.,
  // @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d\\w\\W]{6,}$/, { message: 'Password is too weak' })
  password!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsOptional()
  @Length(1, 50, { message: 'Display name must be between 1 and 50 characters' })
  displayName?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @IsUrl({}, { message: 'Avatar must be a valid URL' })
  avatar?: string | null;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @Length(0, 160, { message: 'Bio must be at most 160 characters' })
  bio?: string | null;

  @Column({ type: 'simple-array', default: '' }) // Store as comma-separated string, or use jsonb for more complex arrays in Postgres
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  following!: string[];

  @Column({ type: 'simple-array', default: '' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  followers!: string[];
  
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt!: Date;

  @OneToMany(() => Post, post => post.user)
  posts!: Post[];

  // @OneToMany(() => Comment, comment => comment.user) // Comment relation removed
  // comments!: Comment[]; // Comment relation removed

  private isPasswordDirty = false;

  setPassword(password: string) {
    this.password = password;
    this.isPasswordDirty = true;
  }

  @BeforeInsert()
  @BeforeUpdate()
  private async hashPassword() {
    if (this.isPasswordDirty || !this.id) { // Hash if password changed or new user
      this.password = await User.hashPassword(this.password);
      this.isPasswordDirty = false;
    }
  }

  static async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  async verifyPassword(plainPassword: string): Promise<boolean> {
    return await argon2.verify(this.password, plainPassword);
  }
}
