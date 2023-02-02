import { Db, MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI as string;

let cachedDb: Db | null = null;

export default async function connectToDatabase() {
  
  if (cachedDb) return cachedDb
  
  const client = await MongoClient.connect(uri)
  const db = client.db("blog")

  cachedDb = db
  return db
}
