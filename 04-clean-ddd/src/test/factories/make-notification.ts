import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { faker } from '@faker-js/faker'
import {
    Notification,
    type NotificationProps,
} from '@/domain/notification/enterprise/entities/notification'

export function makeNotification(
    override: Partial<NotificationProps> = {},
    id?: UniqueEntityID,
): Notification {
    const notification = Notification.create(
        {
            title: faker.lorem.sentence(),
            recipientId: new UniqueEntityID(),
            content: faker.lorem.text(),
            ...override,
        },
        id,
    )

    return notification
}
