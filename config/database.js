import mongoose from 'mongoose';

const connectDB = async() => {
    const connect = await mongoose.connect(process.env.DB)
    console.log(`database running on: ${connect.connection.host}`)
}

export default connectDB