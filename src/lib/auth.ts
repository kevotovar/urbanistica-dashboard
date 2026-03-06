import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { MongoClient } from "mongodb";
import clientPromise from "./mongo";

// we parse the DB instance to avoid async issues in auth initialization
// Better auth mongodb adapter accepts a resolved db instance.
export const getAuthDb = async () => {
	const client = await clientPromise;
	return client.db("urbanistica");
};

export const auth = betterAuth({
	baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
	database: mongodbAdapter(
		// Hack: better-auth mongo adapter expects a Database object synchronously,
		// but in modern serverless it might be async.
		// Usually it accepts MongoClient.db(name)
		// For now we will connect eagerly or rely on a global.
		new MongoClient(
			process.env.MONGO_URL || "mongodb://admin:password@localhost:27017",
		).db("urbanistica"),
	),
	emailAndPassword: {
		enabled: true,
	},
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24, // 1 day
	},
	plugins: [tanstackStartCookies()],
});
