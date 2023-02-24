import http from 'node:http'
import { json } from './midllewares/json.js'
import { Database } from './database.js'

const database = new Database();

// HTTP status
// Endpoint e resource

const server = http.createServer(async (request, response) => {
	const { method, url } = request

	await json(request, response)

	if (url === '/users') {
		if (method === 'POST') {
			const { name, email } = request.body

			const user = {
				id: Math.round(Math.random() * 100),
				name,
				email
			}

			database.insert('users', user)

			return response.writeHead(201).end()
		}

		if (method === 'GET') {
			const users = database.select('users')
			return response.end(JSON.stringify(users))
		}
	}

	return res.writeHead(404).end('Route Not Found')
})

server.listen(3333, () => console.log('-> listening on port 3333'))