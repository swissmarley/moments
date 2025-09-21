# Moments

A beautiful, self-hosted photo sharing platform for special events. Create magical events, share QR codes with guests, and collect all photos in one stunning gallery with sophisticated gradient animations and visual effects.

## Features

- 🎉 **Event Creation**: Create magical events with details, date, and location
- 📱 **QR Code Sharing**: Generate QR codes for easy guest access
- 📸 **Photo Upload**: Guests can upload photos with their names
- 🖼️ **Photo Gallery**: Beautiful grid view of all collected photos
- ✨ **Visual Effects**: Sophisticated gradient animations and glassmorphism
- 🔒 **Secure**: Self-hosted with user authentication
- 📱 **Responsive**: Works perfectly on mobile and desktop
- ⚡ **Fast**: Optimized image processing and storage

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Image Processing**: Sharp
- **UI Components**: Radix UI with custom glassmorphism effects
- **File Upload**: React Dropzone
- **Animations**: Custom CSS animations and gradient effects

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/swissmarley/moments.git
   cd moments
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/moments"
   
   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # File Upload
   UPLOAD_DIR="./uploads"
   MAX_FILE_SIZE=10485760  # 10MB in bytes
   
   # App Configuration
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### For Event Organizers

1. **Sign Up**: Create an account at `/auth/signup`
2. **Create Event**: Go to dashboard and click "Create New Event"
3. **Share Event**: Get QR code and share link to distribute to guests
4. **View Photos**: Access your event dashboard to see all uploaded photos

### For Guests

1. **Scan QR Code**: Use phone camera to scan the QR code
2. **Enter Name**: Provide your name for photo attribution
3. **Upload Photos**: Select and upload photos from your device
4. **Done**: Photos are automatically added to the event gallery

## API Endpoints

- `POST /api/auth/register` - User registration
- `GET /api/events` - Get user's events
- `POST /api/events` - Create new event
- `GET /api/events/[id]` - Get event details
- `GET /api/events/[id]/public` - Get public event info
- `GET /api/events/[id]/photos` - Get event photos
- `POST /api/upload` - Upload photo

## File Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── event/             # Guest upload pages
│   └── globals.css        # Global styles with animations
├── components/            # React components
│   ├── ui/               # UI components with glassmorphism
│   └── providers/        # Context providers
├── lib/                  # Utility functions
├── prisma/               # Database schema
├── uploads/              # Photo storage
└── public/               # Static assets
```

## Production Deployment

### Environment Setup

1. **Database**: Set up PostgreSQL database
2. **Environment Variables**: Configure production environment variables
3. **File Storage**: Ensure uploads directory is writable
4. **Domain**: Update `NEXT_PUBLIC_APP_URL` with your domain

### Build and Deploy

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Docker Deployment (Optional)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## Security Considerations

- Change default `NEXTAUTH_SECRET`
- Use HTTPS in production
- Regularly backup your database
- Monitor file upload sizes and types
- Consider implementing rate limiting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on GitHub or contact the maintainers.

---

Built with ❤️ for capturing life's beautiful moments.



