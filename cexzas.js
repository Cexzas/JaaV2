process.on('uncaughtException', console.error)
process.on('unhandledRejection', console.error) 

require('./settings') 
const fs = require('fs') 
const os = require('os') 
const util = require('util') 
const jimp = require('jimp') 
const path = require('path') 
const https = require('https') 
const axios = require('axios') 
const FileType = require('file-type') 
const webp = require('node-webpmux') 
const ffmpeg = require('fluent-ffmpeg') 
const { BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, proto, getBinaryNodeChildren, generateWAMessageContent, generateWAMessage, prepareWAMessageMedia, areJidsSameUser, getContentType } = require('@whiskeysockets/baileys') 

const { getBuffer, fetchJson } = require('./Database/function2') 
const { yanzGpt, bk9Ai, simi } = require('./Database/scraper')

module.exports = cexzas = async (cexzas, m, chatUpdate, store) => {
  try {
    const botNumber = await cexzas.decodeJid(cexzas.user.id) 
    const body = (m.type === 'conversation') ? m.message.conversation : (m.type == 'imageMessage') ? m.message.imageMessage.caption : (m.type == 'videoMessage') ? m.message.videoMessage.caption : (m.type == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.type == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.type == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.type == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.type === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : (m.type === 'editedMessage') ? (m.message.editedMessage.message.protocolMessage.editedMessage.extendedTextMessage ? m.message.editedMessage.message.protocolMessage.editedMessage.extendedTextMessage.text : m.message.editedMessage.message.protocolMessage.editedMessage.conversation) : '' 
    const budy = (typeof m.text == 'string' ? m.text : '') 
    const isCreator = isOwner = [botNumber, ...owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender) 
    const prefix = isCreator ? (/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@()#,'"*+÷/\%^&.©^]/gi.test(body) ? body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@()#,'"*+÷/\%^&.©^]/gi)[0] : /[\uD800-\uDBFF][\uDC00-\uDFFF]/gi.test(body) ? body.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/gi)[0] : listprefix.find(a => body.startsWith(a)) || '') : [botNumber].multiprefix ? (/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@()#,'"*+÷/\%^&.©^]/gi.test(body) ? body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@()#,'"*+÷/\%^&.©^]/gi)[0] : /[\uD800-\uDBFF][\uDC00-\uDFFF]/gi.test(body) ? body.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/gi)[0] : listprefix.find(a => body.startsWith(a)) || '¿') : listprefix.find(a => body.startsWith(a)) || '¿' 
    const isCmd = body.startsWith(prefix) 
    const args = body.trim().split(/ +/).slice(1) 
    const quoted = m.quoted ? m.quoted : m 
    const command = isCreator ? body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase() : isCmd ? body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase() : '' 
    const text = q = args.join(' ') 
    const mime = (quoted.msg || quoted).mimetype || '' 
    const qmsg = (quoted.msg || quoted) 
    const chatType = m.key.remoteJid.endsWith("@s.whatsapp.net") ? "private" : "group"; 
    const sender = m.key.remoteJid
    
    cexzas.readMessages([m.key]);
    await cexzas.sendPresenceUpdate('composing', m.chat) 
    
    switch(command) { 
      case 'rvo': {
        if (!m.quoted) return m.reply(`Reply view once message\nExample: ${prefix + command}`) 
        try {
          if (m.quoted.msg.viewOnce) {
            m.quoted.msg.viewOnce = false 
            await cexzas.sendMessage(m.chat, { forward: m.quoted }, { quoted: m }) 
          } else if (m.quoted.msg.message && m.quoted.msg.message.audioMessage && m.quoted.msg.message.audioMessage.viewOnce) {
            m.quoted.msg.message.audioMessage.viewOnce = false 
            m.quoted.msg.message.audioMessage.contextInfo = { forwardingScore: 1, isForwarded: true, mentionedJid: [m.sender] } 
            await cexzas.relayMessage(m.chat, m.quoted.msg.message, {}) 
          } else {
            m.reply(`Reply view once message\nExample: ${prefix + command}`)
          }
        } catch (e) {
          m.reply(`Media tidak valid`)
        }
      } 
      break 
      case 'ai': {
        if (!text) return m.reply(`Example: ${prefix}ai Hai`) 
        try {
          let hasil = await yanzGpt(text) 
          m.reply(hasil.choices[0].message.content)
        } catch (e) {
          try {
            let hasil = await bk9Ai(text) 
            m.reply(hasil.BK9)
          } catch (e) {
            m.reply(`*Fitur eror, silahkan lapor ke owner*`)
          }
        }
      } 
      break 
    } 
  } catch (err) {
    await cexzas.sendMessage('6283854545783@s.whatsapp.net', { text: `*Ada eror nih!!!*\n\n${util.format(err)}`})
  }
} 

let file = require.resolve(__filename) 
fs.watchFile(file, () => {
  fs.unwatchFile(file) 
  delete require.cache[file] 
  require(file)
})