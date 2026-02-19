import { MongoClient, Db } from "mongodb";

const options: Record<string, unknown> = {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000,
  maxPoolSize: 10,
  minPoolSize: 1,
  retryWrites: true,
  w: "majority",
};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

function getMongoClient(): Promise<MongoClient> {
  if (!process.env.MONGODB_URI) {
    throw new Error("Please add your Mongo URI to .env.local");
  }
  const uri = process.env.MONGODB_URI;

  if (process.env.NODE_ENV === "development") {
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };
    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    return globalWithMongo._mongoClientPromise;
  } else {
    if (!clientPromise) {
      client = new MongoClient(uri, options);
      clientPromise = client.connect();
    }
    return clientPromise;
  }
}

export default getMongoClient;

export async function getDb(): Promise<Db> {
  const client = await getMongoClient();
  return client.db("shan_portfolio");
}
