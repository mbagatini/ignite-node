import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotFoundError } from '@/core/errors/not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import { makeNotification } from '@/test/factories/make-notification'
import { InMemoryNotificationsRepository } from '@/test/repositories/in-memory-notifications-repository'
import { beforeEach, describe, expect, test } from 'vitest'
import { ReadNotificationUseCase } from './read-notification'

let inMemoryNotificationRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('Read Notification Use Case', () => {
    beforeEach(() => {
        inMemoryNotificationRepository = new InMemoryNotificationsRepository()
        sut = new ReadNotificationUseCase(inMemoryNotificationRepository)
    })

    test('should not read a notification that does not exist', async () => {
        const result = await sut.execute({
            notificationId: 'non-existing-slug',
            recipientId: '1',
        })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(NotFoundError)
    })

    test('should not read a notification that does not belong to the recipient', async () => {
        const notification = makeNotification({
            recipientId: new UniqueEntityID('1'),
        })

        await inMemoryNotificationRepository.create(notification)

        const result = await sut.execute({
            recipientId: '2',
            notificationId: notification.id.toString(),
        })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(UnauthorizedError)
    })

    test('should read a notification', async () => {
        const notification = makeNotification({
            recipientId: new UniqueEntityID('1'),
            title: 'Hello',
            content: 'World',
        })

        await inMemoryNotificationRepository.create(notification)

        const result = await sut.execute({
            recipientId: '1',
            notificationId: notification.id.toString(),
        })

        const { notification: updatedNotification } = result.rightValue()

        expect(result.isRight()).toBeTruthy()
        expect(updatedNotification.readAt).toEqual(expect.any(Date))
    })
})
