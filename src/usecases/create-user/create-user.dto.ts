import { z } from 'zod/v4'
import { isValidTimezone } from '@/utils/timezone'
import { EventType } from '@/types'

export const createUserDTO = z.object({
    firstName: z
        .string()
        .min(1, 'First name is required')
        .max(50, 'First name must be less than 50 characters'),
    lastName: z
        .string()
        .min(1, 'Last name is required')
        .max(50, 'Last name must be less than 50 characters'),
    email: z.email(),
    timezone: z
        .string()
        .min(1, 'Timezone is required')
        .refine(isValidTimezone, {
            message:
                'Invalid timezone format. Use valid formats e.g Asia/Jakarta, EST, UTC+1',
        }),
    eventDate: z.iso.date(),
    eventType: z.enum(EventType),
})

export interface CreateUserDTO {
    firstName: string
    lastName: string
    email: string
    timezone: string
    eventType: string
    eventDate: string
}

export interface CreateUserResponseDTO {
    id: number
    firstName: string
    lastName: string
    email: string
    eventType: string
    eventDate: string
    timezone: string
    createdAt: string
    updatedAt: string
}
