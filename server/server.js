require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes =require('./routes/auth');
const mediaRoutes =require('./routes/admin-routes/mediaRoutes');
const courseRoutes =require('./routes/admin-routes/courseRoutes');
const studentCourseRoutes =require('./routes/student-routes/courseRoutes');
const studentOrderRoutes =require('./routes/student-routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

  //router connfigration
  app.use('/auth', authRoutes)
  app.use('/media', mediaRoutes)
  app.use('/admin/course', courseRoutes);
  app.use('/student/course', studentCourseRoutes);
  app.use('/student/order', studentOrderRoutes);

//database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Database is connected successfully"))
  .catch(() => console.log("Database connection failed"));


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
