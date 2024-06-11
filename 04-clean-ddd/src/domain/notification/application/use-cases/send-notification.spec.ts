import { InMemoryNotificationsRepository } from '@/test/repositories/in-memory-notifications-repository'
import { beforeEach, describe, expect, test } from 'vitest'
import { SendNotificationUseCase } from './send-notification'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryNotificationRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('Send Notification Use Case', () => {
    beforeEach(() => {
        inMemoryNotificationRepository = new InMemoryNotificationsRepository()
        sut = new SendNotificationUseCase(inMemoryNotificationRepository)
    })

    test('should send a notification', async () => {
        const notification = {
            recipientId: '1',
            title: 'Hello',
            content: 'World',
        }

        const result = await sut.execute(notification)

        expect(result.isRight()).toBeTruthy()
        expect(inMemoryNotificationRepository.notifications).toHaveLength(1)
        expect(inMemoryNotificationRepository.notifications[0]).toMatchObject({
            ...notification,
            recipientId: new UniqueEntityID('1'),
        })
    })
})
