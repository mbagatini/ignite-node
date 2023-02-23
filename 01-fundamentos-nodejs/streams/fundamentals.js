import { Readable } from 'node:stream'

// Creates a readable stream that counts from 1 to 100

class OneToHundredStream extends Readable {
	index = 1;

	_read() {
		const i = this.index++;

		setTimeout(() => {
			if (i > 100) {
				this.push(null); // end of stream
			} else {
				const buf = Buffer.from(String(i))

				this.push(buf); // send chunk
			}
		}, 1000);
	}
}

new OneToHundredStream().pipe(process.stdout)