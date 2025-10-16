
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(cors()); 
app.use(express.json()); 


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connection successful!');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running in development mode on port ${PORT}`);
    });

  } catch (err) {
    console.error(`MongoDB connection failed: ${err.message}`);
    process.exit(1); 
  }
};

app.get('/', (req, res) => {
    res.send('API is running...');
});


connectDB();