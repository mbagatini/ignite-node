import { UniqueEntityID } from './unique-entity-id'

export abstract class Entity<T> {
    private readonly _id: UniqueEntityID
    protected props: T

    protected constructor(props: T, id?: UniqueEntityID) {
        this._id = id ?? new UniqueEntityID(id)
        this.props = props
    }

    get id() {
        return this._id
    }

    public equals(entity: Entity<any>) {
        if (entity === this) {
            return true
        }

        if (entity.id === this._id) {
            return true
        }

        return false
    }
}
