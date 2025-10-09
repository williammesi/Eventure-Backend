import cors from 'cors';
import express from 'express';

import sequelize from './core/database.js';
import './models/index.js';
import errors from './middlewares/errors.js';
import securesRoutes from './routes/secures.routes.js';
import limitRoute from './routes/limits.routes.js';
import eventsRoutes from './routes/events.routes.js';
import usersRoutes from './routes/users.routes.js';
import sessionsRoutes from './routes/sessions.routes.js';
import securityQuestionsRoutes from "./routes/securityQuestion.routes.js"



const app = express();

app.use(cors());
app.use(express.json());

// Test database connection
sequelize.authenticate()
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection error:', err));

  // Home route - HTML
app.get('/', (req, res) => {
  res.type('html').send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>Express on Vercel</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/api-data">API Data</a>
          <a href="/healthz">Health</a>
        </nav>
        <h1>Welcome to Express on Vercel 🚀</h1>
        <p>This is a minimal example without a database or forms.</p>
        <img src="/logo.png" alt="Logo" width="120" />
      </body>
    </html>
  `)
})

app.get('/status', (req, res) => { res.status(200).end(); });
app.head('/status', (req, res) => { res.status(200).end(); });

app.use('/events', eventsRoutes);
app.use('/security-questions', securityQuestionsRoutes);

app.use('/users', usersRoutes);
app.use('/sessions', sessionsRoutes);


app.use('/secures', securesRoutes);

app.use(limitRoute);
app.use(errors);

export default app;