import { AppDataSource } from '../config/db';
import { User } from '../models/User';
import { Post } from '../models/Post';
import bcrypt from 'bcrypt';

(async () => {
  await AppDataSource.initialize();
  const userRepo = AppDataSource.getRepository(User);
  const postRepo = AppDataSource.getRepository(Post);

  for (let i = 1; i <= 5; i++) {
    const user = new User();
    user.username = `user${i}`;
    user.password = await bcrypt.hash('password', 10);
    await userRepo.save(user);

    const post = new Post();
    post.content = `Hello from user${i}`;
    post.user = user;
    await postRepo.save(post);
  }

  console.log('Seeding completed.');
  process.exit();
})();
