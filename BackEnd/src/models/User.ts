import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  BaseEntity,
  OneToMany,
  Check
} from 'typeorm';
import argon2 from 'argon2';
import { Post } from './Post';
import { IsEmail, Length, Matches } from 'class-validator';

@Entity()
@Check(`"username" ~ '^[a-zA-Z0-9_]+$'`)
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

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
  password!: string;

  @OneToMany(() => Post, post => post.user)
  posts!: Post[];

  // Flag interno para detectar cambios manuales en la contraseña
  private isPasswordDirty = false;

  setPassword(password: string) {
    this.password = password;
    this.isPasswordDirty = true;
  }

  @BeforeInsert()
  @BeforeUpdate()
  private async hashPassword() {
    if (this.isPasswordDirty || !this.id) {
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
