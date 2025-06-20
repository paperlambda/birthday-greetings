import 'dotenv/config'
import app from '@/app'
import { prisma } from '@/config/database'
import { redis } from '@/config/redis'

const appPort = process.env.APP_PORT || 3000

async function testDatabaseConnection() {
    try {
        await prisma.$queryRaw`SELECT 1`
        console.log('Database connected successfully')
    } catch (error) {
        console.error('Failed to connect to the database:', error)
        process.exit(1)
    }
}

async function testRedisConnection() {
    try {
        await redis.ping()
        console.log('Redis connected successfully')
    } catch (error) {
        console.error('Failed to connect to Redis:', error)
        process.exit(1)
    }
}

async function start() {
    try {
        await testDatabaseConnection()
        await testRedisConnection()
        app.listen(appPort, () => {
            console.log(`Server is running on http://localhost:${appPort}`)
        })
    } catch (error) {
        console.error('Failed to start server:', error)
        process.exit(1)
    }
}

start()
