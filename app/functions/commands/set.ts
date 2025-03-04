/**
 * Set
 * =====================
 *
 * @contributors: Patryk Rzucidło [@ptkdev] <support@ptkdev.io> (https://ptk.dev)
 *                Alì Shadman [@AliShadman95] (https://github.com/AliShadman95)
 *
 * @license: MIT License
 *
 */
import { InlineKeyboard } from "grammy";
import bot from "@app/core/token";
import translate from "@translations/translate";
import db from "@routes/api/database";
import telegram from "@routes/api/telegram";
import logger from "@app/functions/utils/logger";

/**
 * command: /set
 * =====================
 * Change buttons value
 *
 */
const set = async (): Promise<void> => {
	bot.command("set", async (ctx) => {
		logger.info("command: /set", "set.ts:set()");
		const lang = await db.settings.get({
			group_id: telegram.api.message.getChatID(ctx),
		});
		// is group
		if (telegram.api.message.getChatID(ctx) < 0) {
			await telegram.api.message.send(
				ctx,
				telegram.api.message.getChatID(ctx),
				translate(lang.language, "start_command_intro_group", {
					bot_nickname: telegram.api.bot.getUsername(ctx),
				}),
			);
		} else {
			const about = await db.about.get({
				id: telegram.api.message.getUserID(ctx),
			});
			about.username = telegram.api.message.getUsername(ctx);
			await db.about.update({ id: about.id }, about);

			const buttons = new InlineKeyboard();

			buttons.text(translate(lang.language, "about_command_button_x"), "set_x");
			buttons.text(translate(lang.language, "about_command_button_facebook"), "set_facebook");
			buttons.text(translate(lang.language, "about_command_button_instagram"), "set_instagram");

			buttons.row();

			buttons.text(translate(lang.language, "about_command_button_tiktok"), "set_tiktok");
			buttons.text(translate(lang.language, "about_command_button_linkedin"), "set_linkedin");
			buttons.text(translate(lang.language, "about_command_button_onlyfans"), "set_onlyfans");

			buttons.row();

			buttons.text(translate(lang.language, "about_command_button_github"), "set_github");
			buttons.text(translate(lang.language, "about_command_button_gitlab"), "set_gitlab");
			buttons.text(translate(lang.language, "about_command_button_mastodon"), "set_mastodon");

			buttons.row();

			buttons.text(translate(lang.language, "about_command_button_psn"), "set_psn");
			buttons.text(translate(lang.language, "about_command_button_steam"), "set_steam");
			buttons.text(translate(lang.language, "about_command_button_discord"), "set_discord");

			buttons.row();

			buttons.text(translate(lang.language, "about_command_button_twitch"), "set_twitch");
			buttons.text(translate(lang.language, "about_command_button_spotify"), "set_spotify");
			buttons.text(translate(lang.language, "about_command_button_youtube"), "set_youtube");

			buttons.row();

			buttons.text(translate(lang.language, "about_command_button_amazon"), "set_amazon");
			buttons.text(translate(lang.language, "about_command_button_website"), "set_website");

			const options: any = {};
			options.reply_markup = buttons;
			const thread_id = telegram.api.message.getThreadID(ctx);
			if (thread_id) {
				options.message_thread_id = thread_id;
			}

			await ctx.reply(translate(lang.language, "set_select_button"), options);
		}
	});

	bot.callbackQuery(/^(set_\w*)$/, async (ctx) => {
		const lang = await db.settings.get({
			group_id: telegram.api.message.getChatID(ctx),
		});

		const about = await db.about.get({
			id: telegram.api.message.getUserID(ctx),
		});

		about.step = ctx?.match?.[0] ?? "done";

		await db.about.update({ id: about.id }, about);

		if (about.step.startsWith("set_")) {
			await telegram.api.message.send(
				ctx,
				telegram.api.message.getChatID(ctx),
				translate(lang.language, `set_command_${about.step.replace("set_", "")}`),
			);
		}
	});
};

export { set };
export default set;
