const app = require("./config/app.config");
const PORT = process.env.PORT || 8082;
const DATABASE_URL = process.env.DATABASE_URL;
const connectDB = require("./config/db.config");
// connect database
connectDB(DATABASE_URL);
// server Connectivity
app.listen(PORT, (error) => {
  if (!error) {
    console.log(`Server is connected to http://localhost:${PORT}`);
  } else {
    console.log(error);
  }
});
