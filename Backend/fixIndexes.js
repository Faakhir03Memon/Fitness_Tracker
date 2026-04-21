const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const fixIndexes = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fittrack');
        console.log("Connected to MongoDB for index fix");

        const collection = mongoose.connection.collection('dailystats');
        
        try {
            // Drop old unique index on date if it exists
            await collection.dropIndex('date_1');
            console.log("Dropped old 'date_1' index");
        } catch (e) {
            console.log("'date_1' index not found or already dropped");
        }

        console.log("Indices fixed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Error fixing indexes:", err);
        process.exit(1);
    }
};

fixIndexes();
