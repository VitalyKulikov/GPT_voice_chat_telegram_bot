import {session, Telegraf} from "telegraf";
import config from 'config'
import {message} from "telegraf/filters";
import {ogg} from "./ogg.js";
import {openai} from "./openai.js";
import {code} from "telegraf/format";
import {removeFile} from "./utils.js";
import { initCommand, processTextToChat, INITIAL_SESSION } from "./openai.js"

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'))

bot.use(session())

bot.command('new', initCommand)
bot.command('start', initCommand)

// голосовые сообщения
bot.on(message('voice'), async ctx => {
  ctx.session ??=INITIAL_SESSION
  try {
    await ctx.reply(code('Сообщение получил. Жду ответ от сервера...'))
    const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id)
    const userId = String(ctx.message.from.id)
    const oggPath = await ogg.create(link.href, userId)
    const mp3Path = await ogg.toMp3(oggPath, userId)
    await removeFile(oggPath)
    const text = await openai.transcription(mp3Path)
    await ctx.reply(code(`Ваш запрос ${text}`))
    await processTextToChat(ctx, text)
  } catch (e) {
    console.log('Error while voice message', e.message)
  }
})

//текстовые сообщения

bot.on(message('text'), async (ctx) => {
  ctx.session ??= INITIAL_SESSION
  try {
    await ctx.reply(code('Сообщение принял. Жду ответ от сервера...'))
    await processTextToChat(ctx, ctx.message.text)
  } catch (e) {
    console.log(`Error while text message`, e.message)
  }
})

bot.launch()
