import { left, right, type Either } from '@/core/either'
import { NotFoundError } from '@/core/errors/not-found-error'
import { type Notification } from '../../enterprise/entities/notification'
import { type NotificationsRepository } from '../repositories/notifications-repository'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'

interface ReadNotificationUseCaseRequest {
    recipientId: string
    notificationId: string
}

type ReadNotificationUseCaseResponse = Either<
    NotFoundError | UnauthorizedError,
    { notification: Notification }
>

export class ReadNotificationUseCase {
    constructor(
        private readonly notificationRepository: NotificationsRepository,
    ) {}

    async execute(
        params: ReadNotificationUseCaseRequest,
    ): Promise<ReadNotificationUseCaseResponse> {
        const notification = await this.notificationRepository.getById(
            params.notificationId,
        )

        if (!notification) {
            return left(new NotFoundError('Notification not found'))
        }

        if (notification.recipientId.toString() !== params.recipientId) {
            return left(
                new UnauthorizedError(
                    'You are not allowed to perform this action',
                ),
            )
        }

        notification.read()

        await this.notificationRepository.update(notification)

        return right({ notification })
    }
}
