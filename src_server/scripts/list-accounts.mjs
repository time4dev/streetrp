/**
 * Prints all accounts from MongoDB.
 * Usage: node scripts/list-accounts.mjs   (from src_server/)
 * Read-only: uses find(), never writes.
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
	console.error('DB_URI not found (expected in .env at the repo root)');
	process.exit(1);
}

const userSchema = new mongoose.Schema({}, { strict: false, collection: 'users' });
const User = mongoose.model('User', userSchema);

const fmtDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '—');
const pad = (s, n) => String(s ?? '').slice(0, n).padEnd(n);

try {
	await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

	const users = await User.find({}).sort({ registrationAt: 1 }).lean();

	console.log(`Accounts: ${users.length}\n`);
	console.log(
		pad('#', 5) +
			pad('email', 28) +
			pad('socialName', 20) +
			pad('admin', 6) +
			pad('donate', 7) +
			pad('banned', 12) +
			pad('registered', 12) +
			pad('lastLogin', 12)
	);
	console.log('-'.repeat(102));

	users.forEach((u, i) => {
		const ban = u.ban ? (u.ban.permanent ? 'perm' : fmtDate(u.ban.expires)) : '—';
		console.log(
			pad(i + 1, 5) +
				pad(u.email, 28) +
				pad(u.socialName, 20) +
				pad(u.adminLvl ?? 0, 6) +
				pad(u.donate ?? 0, 7) +
				pad(ban, 12) +
				pad(fmtDate(u.registrationAt), 12) +
				pad(fmtDate(u.loginAt), 12)
		);
	});
} catch (error) {
	console.error('Failed:', error.message);
	process.exitCode = 1;
} finally {
	await mongoose.disconnect();
}
