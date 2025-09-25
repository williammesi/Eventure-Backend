import cors from 'cors';
import express from 'express';

import sequelize from './core/database.js';
import './models/index.js';
import errors from './middlewares/errors.js';
import securesRoutes from './routes/secures.routes.js';
import limitRoute from './routes/limits.routes.js';
import eventsRoutes from './routes/events.routes.js';


const app = express();

app.use(cors());
app.use(express.json());

// Test database connection
sequelize.authenticate()
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection error:', err));

app.get('/status', (req, res) => { res.status(200).end(); });
app.head('/status', (req, res) => { res.status(200).end(); });

app.use('/events', eventsRoutes);

app.use('/secures', securesRoutes);

app.use(limitRoute);
app.use(errors);

export default app;