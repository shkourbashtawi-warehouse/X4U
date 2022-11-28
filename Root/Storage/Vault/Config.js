require('dotenv').config();
module.exports = {
	prefix: [`${process.env.prefix}`],
	developers: [`685868171755913293`],
	Token: process.env.Token,
	MongoDB: process.env.MongoDB,
	PORT: process.env.PORT,

	// Webhooks
	WebhookError: process.env.WebhookError,
        GuildID: process.env.GuildID,
};
