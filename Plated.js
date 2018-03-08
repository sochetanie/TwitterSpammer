function(log_path) {
	let returnVal = []
	let fs = require('fs')
	let contents = fs.readFileSync(log_path, 'utf8')
	//console.log(contents.length)
	let inputs = contents.split('\n')
	let log = []

	for (const i of inputs) {
		try {
			log.push(JSON.parse(i))
		}
		catch(e) {
			continue
		}
	}

	let result = {}
	for (const l of log) {
		if (!result[l.user]) {
			result[l.user] = {retweet:0, tweet:0, retweetTime:[]}
		}
		if (l.action === 'retweet') {
			result[l.user].retweet++
			let target = log.filter(x=>x.id === l.target_id)
			//console.log(target)
			result[l.user].retweetTime.push(l.timestamp - target[0].timestamp)
		}
		else if (l.action === 'tweet') {
			result[l.user].tweet++
		}
	}

	let potentials = Object.keys(result).filter(key=>(result[key].tweet))
	for (const p of potentials) {
		//let suspiciousTimestamp = false
		let countSuspicous = 0
		for (let x of result[p].retweetTime) {
			if (x<500) {
				countSuspicous++
			}
		}
		// console.log(countSuspicous)
		// console.log(result[p].retweetTime)
		if (result[p].retweetTime.length === countSuspicous) {
			returnVal.push(p)
		}
	}
	// console.log(returnVal)
	return returnVal
}



