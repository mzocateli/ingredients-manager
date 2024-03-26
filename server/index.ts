import express from 'express';
import cors from 'cors';
import ingredientsRouter from './routes/ingredients';
import recipesRouter from './routes/recipes';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use('/api/ingredients', ingredientsRouter);
app.use('/api/recipes', recipesRouter);

app.listen(3001, () => console.log('Server running on port 3001'));
