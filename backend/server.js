import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import session from 'express-session';
import passport from './config/passport.js';
import connectDB from './config/db.js';

dotenv.config();

// Connect to database
connectDB();

const app = express();
const httpServer = createServer(app);

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

app.set('io', io);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(helmet());
app.use(morgan('dev'));

// Session and Passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'disasterlink_session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

import authRoutes from './routes/authRoutes.js';
import emergencyRoutes from './routes/emergencyRoutes.js';
import shelterRoutes from './routes/shelterRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/emergencies', emergencyRoutes);
app.use('/api/shelters', shelterRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
  res.send('DisasterLink API is running...');
});

// Setup socket connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
