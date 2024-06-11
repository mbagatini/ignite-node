import { type Either, right } from '@/core/either'
import { type NotificationsRepository } from '../repositories/notifications-repository'
import { Notification } from '../../enterprise/entities/notification'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface SendNotificationUseCaseRequest {
    recipientId: string
    title: string
    content: string
}

type SendNotificationUseCaseResponse = Either<
    null,
    { notification: Notification }
>

export class SendNotificationUseCase {
    constructor(
        private readonly notificationRepository: NotificationsRepository,
    ) {}

    async execute(
        params: SendNotificationUseCaseRequest,
    ): Promise<SendNotificationUseCaseResponse> {
        const notification = Notification.create({
            recipientId: new UniqueEntityID(params.recipientId),
            title: params.title,
            content: params.content,
        })

        await this.notificationRepository.create(notification)

        return right({ notification })
    }
}
