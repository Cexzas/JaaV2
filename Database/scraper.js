const fs = require('fs') 
const path = require('path') 
const https = require('https') 
const axios = require('axios');

async function yanzGpt(query, prompt = '') {
	return new Promise(async (resolve, reject) => {
		try { // Ai by Yanz-Gpt > https://whatsapp.com/channel/0029Vai7FxK5Ui2TkgHi1P0I
			const { data } = await axios.post('https://yanzgpt.my.id/chat', {
				messages: [{ role: 'system', content: prompt }, { role: 'user', content: query }],
				model: 'yanzgpt-revolution-25b-v3.0'
			}, {
				headers: {
					authorization: 'Bearer yzgpt-sc4tlKsMRdNMecNy',
					'content-type': 'application/json'
				}
			})
			resolve(data)
		} catch (e) {
			reject(e)
		}
	})
} 

async function bk9Ai(query) {
	const teks = encodeURIComponent(query);
	const urls = ['https://bk9.fun/ai/gemini?q=','https://bk9.fun/ai/jeeves-chat?q=','https://bk9.fun/ai/jeeves-chat2?q=','https://bk9.fun/ai/mendable?q=','https://bk9.fun/ai/Aoyo?q='];
	for (let url of urls) {
		try {
			const { data } = await axios.get(url + teks);
			return data
		} catch (e) {
		}
	}
}

async function simi(query) {
	return new Promise(async (resolve, reject) => {
		try {
			const isi = new URLSearchParams();
			isi.append('text', query);
			isi.append('lc', 'id');
			isi.append('=', '');
			const { data } = await axios.post('https://simsimi.vn/web/simtalk', isi, {
				headers: {
					'Accept': 'application/json, text/javascript, */*; q=0.01',
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
					'X-Requested-With': 'XMLHttpRequest'
				}
			});
			resolve(data)
		} catch (e) {
			reject(e)
		}
	})
}

module.exports = { yanzGpt, bk9Ai, simi }

let file = require.resolve(__filename) 
fs.watchFile(file, () => {
  fs.unwatchFile(file) 
  console.log(`Update ${__filename}`) 
  delete require.cache[file] 
  require(file)
})