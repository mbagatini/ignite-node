import { randomUUID } from 'node:crypto'

export class UniqueEntityID {
    private readonly value: string

    constructor(id?: string) {
        this.value = id ?? randomUUID()
    }

    public toString() {
        return this.value
    }

    public equals(id: UniqueEntityID) {
        return id.toString() === this.value
    }
}
