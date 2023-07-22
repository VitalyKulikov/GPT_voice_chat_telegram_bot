import {Telegraf} from "telegraf";
import config from 'config'
import {message} from "telegraf/filters";
import {ogg} from "./ogg.js";

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'))

bot.on(message('voice'), async ctx => {
  try {
    // await ctx.reply(JSON.stringify(ctx.message.voice, null, 2))
    const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id)
    const userId = String(ctx.message.from.id)
    const oggPath = await ogg.create(link.href, userId)
    const mp3Path = await ogg.toMp3(oggPath, userId)
    await ctx.reply(mp3Path)
  } catch (e) {
    console.log('Error while voice message', e.message)
  }
})

bot.command('start', async (ctx) => {
  await ctx.reply(JSON.stringify(ctx.message, null, 2))
})

bot.launch()
//process.once('SIGINT', () => bot.stop('SIGINT'))
//process.once('SIGTERM', () => bot.stop('SIGTERM'))('working...')