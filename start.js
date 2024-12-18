require('./settings')
const fs = require('fs') 
const pino = require('pino') 
const readline = require('readline') 
const { Boom } = require('@hapi/boom') 
const NodeCache = require('node-cache') 
const { parsePhoneNumber } = require('awesome-phonenumber') 
const { default: CexzasConnect, useMultiFileAuthState, Browsers, DisconnectReason, makeInMemoryStore, makeCacheableSignalKeyStore, fetchLatestBaileysVersion, proto, getAggregateVotesInPollMessage } = require('@whiskeysockets/baileys') 

const pairingCode = process.argv.includes('--qr') ? false : process.argv.includes('--pairing-code') || global.pairing_code 
const rl = readline.createInterface({ input: process.stdin, output: process.stdout }) 
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })
const question = (text) => new Promise((resolve) => rl.question(text, resolve)) 

const { MessagesUpsert, farling } = require('./Database/function') 

const DataBase = require('./Database/database') 
const database = new DataBase(global.tempatDB) 

async function startCexzasBot() {
  const { state, saveCreds } = await useMultiFileAuthState('CexzasSession') 
  const { version, isLatest } = await fetchLatestBaileysVersion() 
  const level = pino({ level: 'silent' }) 
  
  const getMessage = async (key) => {
    if (store) {
      const msg = await store.loadMessage(key.remoteJid, key.id) 
      return msg?.message || ''
    } 
    return {
      conversation: 'Halo Saya Cexzas'
    }
  } 
  
  const cexzas = CexzasConnect({
    isLatest, 
    logger: level, 
    printQRInTerminal: !pairingCode, 
    browser: Browsers.macOS('Desktop'), 
    transactionOpts: {
      maxCommitRetries: 10, 
      delayBetweenTriesMs: 10, 
    }, 
    appStateMacVerification: {
      patch: true, 
      snapshot: true, 
    }, 
    auth: {
      creds: state.creds, 
      keys: makeCacheableSignalKeyStore(state.keys, level), 
    }, 
  }) 
  
  if (pairingCode && !cexzas.authState.creds.registered) {
    let phoneNumber
    async function getPhoneNumber() {
      phoneNumber = await question('Please type your WhatsApp number : ') 
      phoneNumber = phoneNumber.replace(/[^0-9]/g, '') 
      
      if (!parsePhoneNumber(phoneNumber).valid && phoneNumber.length < 6) {
        console.log(`Example: 628`) 
        await getPhoneNumber()
      }
    } 
    
    await getPhoneNumber() 
    let code = await cexzas.requestPairingCode(phoneNumber) 
    console.log(`Kode pairing kamu: ${code}`)
  } 
  
  store.bind(cexzas.ev) 
  await farling(cexzas, store) 
  cexzas.ev.on('creds.update', saveCreds) 
  
  cexzas.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update 
    if(connection === 'close') {
      startCexzasBot()
    } else if(connection === 'open') {
      console.log(`Berhasil terhubung`)
    }
  }) 
  
  cexzas.ev.on('contacts.update', (update) => {
    for (let contact of update) {
      let id = cexzas.decodeJid(contact.id) 
      if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
    }
  }) 
  
  cexzas.ev.on('messages.upsert', async (message) => {
    await MessagesUpsert(cexzas, message, store)
  }) 
  
  return cexzas
} 

startCexzasBot() 

let file = require.resolve(__filename) 
fs.watchFile(file, () => {
  fs.unwatchFile(file) 
  delete require.cache[file] 
  require(file)
})