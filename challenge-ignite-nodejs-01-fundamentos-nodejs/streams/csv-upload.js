import { parse } from 'csv-parse'
import fetch from 'node-fetch'
import fs from 'node:fs'

const csvPath = new URL('./tasks.csv', import.meta.url)

const stream = fs.createReadStream(csvPath)

const csvParse = parse({
	delimiter: ',',
	skipEmptyLines: true,
	fromLine: 2 // skip the header line
})

async function run() {
	const linesParse = stream.pipe(csvParse)

	for await (const line of linesParse) {
		const [title, description] = line

		console.log('Importing -> ' + title)

		await fetch('http://localhost:3333/tasks', {
			method: 'POST',
			duplex: 'half',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				title,
				description,
			})
		})

		// Uncomment this line to see the import working in slow motion (open the db.json)
		// await wait(1000)
	}

}

run()