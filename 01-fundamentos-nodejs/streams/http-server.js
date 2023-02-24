import http from 'node:http';
import { Transform } from 'node:stream'


class ReverseNumberStream extends Transform {
	_transform(chunk, encoding, callback) {
		const transformed = Number(chunk.toString()) * -1
		console.log(transformed)
		const buf = Buffer.from(String(transformed))
		callback(null, buf)
	}
}

const server = http.createServer(async (request, response) => {
	const buffers = [];

	// used to read all the stream
	for await (const chunk of request) {
		console.log('Recieving chunk...')
		buffers.push(chunk)
	}

	const fullStreamContent = Buffer.concat(buffers).toString()

	console.log(fullStreamContent)

	return response.end(fullStreamContent)

	// return request
	// 	.pipe(new ReverseNumberStream())
	// 	.pipe(response)
});

server.listen(3334);