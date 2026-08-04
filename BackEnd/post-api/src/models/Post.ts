import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity
} from 'typeorm';
import { Length, IsUrl, IsOptional, IsArray, IsString } from 'class-validator';
import { User } from './User';

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ 
    type: 'text'
  })
  @Length(1, 280, {
    message: 'Post content must be between 1 and 280 characters long'
  })
  content!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  imageUrl?: string | null;

  @Column({ type: 'simple-array', default: '' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  likedBy!: string[];

  @ManyToOne(() => User, user => user.posts, { 
    nullable: false,
    onDelete: 'CASCADE' 
  })
  user!: User;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt!: Date;
}
