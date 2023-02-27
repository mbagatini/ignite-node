import { randomUUID } from 'node:crypto'

import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database();

// HTTP status
// Endpoint e resource
export const routes = [
	{
		method: 'POST',
		path: buildRoutePath('/tasks'),
		handler: (request, response) => {
			const { title, description } = request.body

			if (!title) {
				return response.writeHead(400).end(JSON.stringify({ message: 'title is required' }))
			}

			if (!description) {
				return response.writeHead(400).end(JSON.stringify({ message: 'description is required' }))
			}

			const task = {
				id: randomUUID(),
				title,
				description,
				completed_at: null,
				created_at: new Date(),
				updated_at: new Date(),
			}

			database.insert('tasks', task)

			return response.writeHead(201).end()
		}
	}, {
		method: 'GET',
		path: buildRoutePath('/tasks'),
		handler: (request, response) => {
			const { search } = request.query

			const tasks = database.select('tasks', {
				title: search,
				description: search
			})

			return response.end(JSON.stringify(tasks));
		}
	}, {
		method: 'PUT',
		path: buildRoutePath('/tasks/:id'),
		handler: (request, response) => {
			const { id } = request.params
			const { title, description } = request.body

			if (!title && !description) {
				return response.writeHead(400).end(JSON.stringify({ message: 'Title or description must be provided' }))
			}

			const taskExists = database.select('tasks', null).find(task => task.id === id);

			if (!taskExists) {
				return response.writeHead(404).end(JSON.stringify({ message: 'Task not found' }))
			}

			database.update('tasks', id, {
				title,
				description
			})

			return response.writeHead(204).end()
		}
	}, {
		method: 'DELETE',
		path: buildRoutePath('/tasks/:id'),
		handler: (request, response) => {
			const { id } = request.params

			const taskExists = database.select('tasks', null).find(task => task.id === id);

			if (!taskExists) {
				return response.writeHead(404).end(JSON.stringify({ message: 'Task not found' }))
			}

			database.delete('tasks', id)

			return response.writeHead(204).end()
		}
	}, {
		method: 'PATCH',
		path: buildRoutePath('/tasks/:id/complete'),
		handler: (request, response) => {
			const { id } = request.params

			const taskExists = database.select('tasks', null).find(task => task.id === id);

			if (!taskExists) {
				return response.writeHead(404).end(JSON.stringify({ message: 'Task not found' }))
			}

			database.update('tasks', id, {
				completed_at: new Date()
			})

			return response.writeHead(204).end()
		}
	}
]