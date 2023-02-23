import { Readable, Writable, Transform } from 'node:stream'

// Creates a readable stream that counts from 1 to 100

class OneToHundredStream extends Readable {
	index = 1

	_read() {
		const i = this.index++

		setTimeout(() => {
			if (i > 100) {
				this.push(null) // end of stream
			} else {
				const buf = Buffer.from(String(i))

				this.push(buf) // send chunk
			}
		}, 500)
	}
}

// Creates a writable stream to multiply a number by 10

class MultiplyByTenStream extends Writable {
	_write(chunk, encoding, callback) {
		const num = Number(chunk.toString()) * 10
		console.log(num)
		callback()
	}
}

// Creates a transform stream to reverse number sign
// this stream need to read data from one stream, and write data to another

class ReverseNumberStream extends Transform {
	_transform(chunk, encoding, callback) {
		const transformed = Number(chunk.toString()) * -1
		const buf = Buffer.from(String(transformed))
		callback(null, buf)
	}
}

new OneToHundredStream()
	.pipe(new ReverseNumberStream())
	.pipe(new MultiplyByTenStream())