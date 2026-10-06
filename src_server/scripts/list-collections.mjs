/**
 * Lists collections and document counts in the DB from DB_URI (read-only).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootEnv = path.resolve(__dirname, '../../.env');

if (fs.existsSync(rootEnv)) dotenv.config({ path: rootEnv });

const uri = process.env.DB_URI;
if (!uri) {
	console.error('DB_URI not found');
	process.exit(1);
}

try {
	await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	const dbName = mongoose.connection.db.databaseName;
	console.log('Database:', dbName);

	const collections = await mongoose.connection.db.listCollections().toArray();
	if (!collections.length) {
		console.log('(no collections)');
	}
	for (const c of collections) {
		const count = await mongoose.connection.db.collection(c.name).countDocuments();
		console.log(`  ${c.name} — ${count} docs`);
	}
} catch (error) {
	console.error('Failed:', error.message);
	process.exitCode = 1;
} finally {
	await mongoose.disconnect();
}
