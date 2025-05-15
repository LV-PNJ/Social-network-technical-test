import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity
} from 'typeorm';
import { Length } from 'class-validator';
import { User } from './User';

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ 
    type: 'text',
    nullable: false,
    default: ''
  })
  @Length(1, 280, {
    message: 'Post content must be between 1 and 280 characters long'
  })
  content!: string;

  @Column({ default: 0 })
  likes!: number;

  @ManyToOne(() => User, user => user.posts, { 
    nullable: false,
    onDelete: 'CASCADE' 
  })
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
