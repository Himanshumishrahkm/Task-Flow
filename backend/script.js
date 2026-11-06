require("dotenv").config({ quiet: true });

const app = require("./src/app");
const connectDB = require("./src/config/connectDb");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`TaskFlow server running on port ${PORT}`);
    });
};

startServer().catch((error) => {
    console.error("Server startup failed:", error.message);
    process.exit(1);
});
