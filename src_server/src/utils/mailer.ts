import chalk from 'chalk';

/**
 * Nodemailer is disabled: the SMTP connection (smtp.gmail.com) is unreachable
 * from the game server machine and produced "Connection timeout" errors on
 * every server start. The public API (init/send) is kept unchanged so call
 * sites don't need edits. Mail is silently dropped.
 */
class Mailer {
	init() {
		console.log(chalk.yellow('[SKIP] ') + 'Email sending is disabled.');
	}

	send(email: string, subject: string, text: string) {
		// no-op
	}
}

const mailer = new Mailer();

export default mailer;
