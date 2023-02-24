import http from 'node:http';

const users = [];

// HTTP status
// Endpoint e resource

const server = http.createServer(async (request, response) => {
	const { method, url } = request;

	const buffers = [];

	// used to read all the stream
	for await (const chunk of request) {
		buffers.push(chunk)
	}

	try {
		request.body = JSON.parse(Buffer.concat(buffers).toString())
	} catch (error) {
		request.body = null
	}

	if (url === '/users') {
		if (method === 'POST') {
			const { name, email } = request.body

			users.push({
				id: Math.round(Math.random() * 100),
				name,
				email
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

server.listen(3333, () => console.log('-> listening on port 3333'));