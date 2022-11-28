module.exports = {
	name: 'ErrorManager',
	customEvent: true,
	run: async (client) => {
		require('dotenv').config();
		process.on('unhandledRejection', (error) => {
			client.WebhookError.send({
				username: 'X4U Bot ErrorManager : unhandledRejection',
				content: `\`\`\`js\n${error.stack}\`\`\``,
			});
		});
		process.on('uncaughtException', (error) => {
			client.WebhookError.send({
				username: 'X4U Bot ErrorManager : uncaughtException',
				content: `\`\`\`js\n${error.stack}\`\`\``,
			});
		});
	},
};
