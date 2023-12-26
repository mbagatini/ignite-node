import { app } from "./app";

app.listen({
	port: 3333
}).then(() => {
	console.log('🚀 App running on port 3333')
})