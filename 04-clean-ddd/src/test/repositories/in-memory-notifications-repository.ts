import { type NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { type Notification } from '@/domain/notification/enterprise/entities/notification'

export class InMemoryNotificationsRepository
    implements NotificationsRepository
{
    public readonly notifications: Notification[] = []

    async create(notification: Notification): Promise<void> {
        this.notifications.push(notification)
    }

    async update(notification: Notification): Promise<void> {
        const index = this.notifications.findIndex(
            (n) => n.id.toString() === notification.id.toString(),
        )

        this.notifications[index] = notification
    }

    async getById(id: string): Promise<Notification | null> {
        const notification = this.notifications.find(
            (n) => n.id.toString() === id,
        )

        return notification ?? null
    }
}
