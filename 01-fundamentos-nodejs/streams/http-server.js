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

const server = http.createServer((request, response) => {
	return request
		.pipe(new ReverseNumberStream())
		.pipe(response)
});

server.listen(3334);