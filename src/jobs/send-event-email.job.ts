import { Worker } from 'bullmq'
import { sendEventEmailQueueName } from '@/queues/send-event-email.queue'
import { UserRepository } from '@/repositories/user.repository'
import { prisma } from '@/config/database'
import { redis } from '@/config/redis'
import { EventRepository } from '@/repositories/event.repository'

const worker = new Worker(
    sendEventEmailQueueName,
    async (job) => {
        console.log(`Processing job ${job.id} for user ID ${job.data.userId}`)

        const userRepository = new UserRepository(prisma)
        const user = await userRepository.getById(job.data.userId)
        if (!user) {
            console.error(`User with ID ${job.data.userId} not found`)
            return
        }

        const body = {
            email: user.email,
            message: `Hello ${user.firstName} ${user.lastName}, it's your ${job.data.eventType}!`,
        }

        const response = await fetch(
            'https://email-service.digitalenvision.com.au/send-email',
            {
                method: 'post',
                body: JSON.stringify(body),
                headers: { 'Content-Type': 'application/json' },
            }
        )
        if (!response.ok) {
            const errMessage = `Failed to send email for user ID ${job.data.userId}: ${response.statusText}`
            console.error(errMessage)
            throw new Error(errMessage)
        }

        console.log(`Email sent for user ID ${job.data.userId}`)

        //     TODO: update next reminder
    },
    { connection: redis }
)

worker.on('completed', (job) => {
    console.log(`Job completed: ${job.id}`)
})

worker.on('failed', (job, error) => {
    console.warn(
        `Job failed: ${job.id}. Reason: ${job.failedReason}. Error: ${error.message}`
    )
})

worker.on('error', (err) => {
    console.error('Worker error:', err)
})
