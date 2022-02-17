import { MongoClient } from 'mongodb';

export async function ConnectToDatabase() {
    
    const client = await MongoClient.connect('mongodb+srv://m001-student:m001-mongodb-basics@sandbox.iljuu.mongodb.net/NextAuth?retryWrites=true&w=majority');

    return client;
}