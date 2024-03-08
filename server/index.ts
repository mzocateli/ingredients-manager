import express from 'express';
import ingredientsRouter from './routes/ingredients';

const app = express();
app.use(express.json());
app.use('/api/ingredients', ingredientsRouter);

app.listen(3000, () => console.log('Server running on port 3000'));
