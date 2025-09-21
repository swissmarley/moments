import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const guestName = formData.get('guestName') as string
    const eventId = formData.get('eventId') as string

    if (!file || !guestName || !eventId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify event exists and is active
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
        isActive: true
      }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found or inactive' },
        { status: 404 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads', eventId)
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split('.').pop()
    const filename = `${timestamp}-${randomString}.${fileExtension}`
    const filepath = join(uploadsDir, filename)

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Process image with Sharp (resize if too large, optimize)
    const processedBuffer = await sharp(buffer)
      .resize(2048, 2048, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .jpeg({ quality: 85 })
      .toBuffer()

    // Save file
    await writeFile(filepath, processedBuffer)

    // Save to database
    const photo = await prisma.photo.create({
      data: {
        filename,
        originalName: file.name,
        mimeType: 'image/jpeg',
        size: processedBuffer.length,
        url: `/uploads/${eventId}/${filename}`,
        uploadedBy: guestName,
        eventId,
      }
    })

    return NextResponse.json({ 
      message: 'Photo uploaded successfully',
      photo: {
        id: photo.id,
        filename: photo.filename,
        uploadedBy: photo.uploadedBy,
        uploadedAt: photo.uploadedAt
      }
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}





