import express from 'express';
import { AppDataSource } from './config/dbConfig';
import routes from './routes';
import { setupSwagger } from './swagger';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use('/api', routes);
app.use(cors({
  origin: '*', // or '*', but more secure to specify origin
}));
const PORT = 8876;

AppDataSource.initialize().then(() => {
  setupSwagger(app); // <--- Agregar Swagger
  app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
});
