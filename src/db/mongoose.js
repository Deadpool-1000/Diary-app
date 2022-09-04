const mongoose = require('mongoose');
const dbName = process.env.DBNAME;
mongoose.connect(`mongodb://localhost:27017/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true });

