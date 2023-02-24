import http from 'node:http'
import { json } from './midllewares/json.js'

const users = [];

// HTTP status
// Endpoint e resource

const server = http.createServer(async (request, response) => {
	const { method, url } = request

	await json(request, response)

	if (url === '/users') {
		if (method === 'POST') {
			const { name, email } = request.body

			users.push({
				id: Math.round(Math.random() * 100),
				name,
				email
			})

			return response.writeHead(201).end()
		}

		if (method === 'GET') {
			return response.end(JSON.stringify(users))
		}
	}

	return res.writeHead(404).end('Route Not Found')
})

server.listen(3333, () => console.log('-> listening on port 3333'))