import http from 'node:http';

const users = [];

// HTTP status
// Endpoint e resource

const server = http.createServer((request, response) => {
	const { method, url } = request;

	if (url === '/users') {
		if (method === 'POST') {
			users.push({
				id: Math.random() * 100,
				name: 'John',
				email: 'john@example.com'
			});

			return response.writeHead(201).end();
		}

		if (method === 'GET') {
			return response
				.setHeader('Content-Type', 'application/json')
				.end(JSON.stringify(users));
		}
	}

	return res.writeHead(404).end('Route Not Found');
});

server.listen(3333);