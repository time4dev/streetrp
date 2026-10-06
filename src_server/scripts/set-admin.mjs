/**
 * Sets the admin level of an account.
 * Usage: node scripts/set-admin.mjs <email> <level>
 * Levels: helper=1, admin=2, gm=3, owner=4
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootEnv = path.resolve(__dirname, '../../.env');
if (fs.existsSync(rootEnv)) dotenv.config({ path: rootEnv });

const [email, levelArg] = process.argv.slice(2);
const levels = { helper: 1, admin: 2, gm: 3, owner: 4 };
const level = levels[levelArg] ?? Number(levelArg);

if (!email || !Number.isInteger(level) || level < 0 || level > 4) {
	console.error('Usage: node scripts/set-admin.mjs <email> <level>');
	console.error('Levels: helper=1, admin=2, gm=3, owner=4');
	process.exit(1);
}

const userSchema = new mongoose.Schema({}, { strict: false, collection: 'users' });
const User = mongoose.model('User', userSchema);

try {
	await mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

	const user = await User.findOne({ email });
	if (!user) {
		console.error(`Account not found: ${email}`);
		process.exitCode = 1;
	} else {
		const old = user.get('adminLvl') ?? 0;
		user.set('adminLvl', level);
		await user.save();

		console.log(`OK: ${email}  adminLvl ${old} -> ${level}`);
		console.log(`   socialName: ${user.get('socialName')}`);
		console.log(`   serial: ${user.get('serial')}`);
	}
} catch (error) {
	console.error('Failed:', error.message);
	process.exitCode = 1;
} finally {
	await mongoose.disconnect();
}
