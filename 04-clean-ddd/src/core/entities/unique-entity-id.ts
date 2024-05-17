import { randomUUID } from 'node:crypto'

export class UniqueEntityID {
    private readonly value: string

    toString() {
        return this.value
    }

    constructor(id?: string) {
        this.value = id ?? randomUUID()
    }
}
