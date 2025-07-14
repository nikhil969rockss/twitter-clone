import mongoose from "mongoose";

const connectToDB = async (callback) => {
    try {
        const result = await mongoose.connect(process.env.MONGO_URI);
        console.log(
            `connection to database established ${result.connection.host}`,
        );
        callback();
    } catch (error) {
        console.error(`Error connecting to database ${error}`);
        process.exit(1);
    }
};

export default connectToDB;
