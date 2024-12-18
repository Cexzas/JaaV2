const fs = require('fs') 
const util = require('util') 
const Jimp = require('jimp') 
const axios = require('axios') 
const crypto = require('crypto') 
const FileType = require('file-type') 
const { sizeFormatter } = require('human-readable') 
const { exec, spawn, execSync } = require('child_process') 
const { proto, areJidsSameUser, extractMessageContent, downloadContentFromMessage, getContentType, getDevice } = require('@whiskeysockets/baileys') 

const getBuffer = async (url, options) => {
	try {
		options ? options : {}
		const res = await axios({
			method: "get",
			url,
			headers: {
				'DNT': 1,
				'Upgrade-Insecure-Request': 1
			},
			...options,
			responseType: 'arraybuffer'
		})
		return res.data
	} catch (err) {
		return err
	}
}

const fetchJson = async (url, options) => {
    try {
        options ? options : {}
        const res = await axios({
            method: 'GET',
            url: url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
            },
            ...options
        })
        return res.data
    } catch (err) {
        return err
    }
} 

module.exports = { fetchJson, getBuffer } 

let file = require.resolve(__filename) 
fs.watchFile(file, () => {
  fs.unwatchFile(file) 
  console.log(`Update ${__filename}`) 
  delete require.cache[file] 
  require(file)
})