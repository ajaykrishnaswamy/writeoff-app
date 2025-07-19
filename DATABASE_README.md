# Database Setup & Management Guide

## 🚀 Quick Start

Get your database up and running in 3 simple steps:

# 1. Install dependencies
npm install

# 2. Set up the database
npm run db:setup

# 3. Start the development server
npm run dev
Your database is now ready at `http://localhost:3000`

## 📊 Database Schema

### `waitlist_users` Table

Our primary table stores user waitlist signups with the following structure:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique identifier for each user |
| `email` | TEXT | NOT NULL, UNIQUE | User's email address |
| `referral_code` | TEXT | UNIQUE | User's unique referral code |
| `referred_by` | TEXT | FOREIGN KEY | Referral code of referring user |
| `referral_count` | INTEGER | DEFAULT 0 | Number of successful referrals |
| `position` | INTEGER | NOT NULL | Position in waitlist |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Registration timestamp |

### Indexes

- **Primary Index**: `id` (automatic)
- **Email Index**: `email` (unique constraint)
- **Referral Code Index**: `referral_code` (unique constraint)
- **Position Index**: `position` (for efficient ranking queries)

## 🛠 Available Scripts

### Database Management
# Initialize database with schema
npm run db:setup

# Reset database (drops all data)
npm run db:reset

# Create database backup
npm run db:backup

# Restore from backup
npm run db:restore

# View database statistics
npm run db:stats
### Development
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
## 🔌 API Endpoints

### POST `/api/waitlist`
Add a new user to the waitlist.

**Request Body:**
{
  "email": "user@example.com",
  "referralCode": "ABC123" // optional
}
**Success Response (201):**
{
  "success": true,
  "data": {
    "id": 123,
    "email": "user@example.com",
    "referralCode": "DEF456",
    "position": 1042,
    "referralCount": 0,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
**Error Response (400):**
{
  "success": false,
  "error": "Email already registered"
}
### GET `/api/waitlist/position/:email`
Get user's current position and referral stats.

**Success Response (200):**
{
  "success": true,
  "data": {
    "position": 1042,
    "referralCount": 3,
    "referralCode": "DEF456"
  }
}
### GET `/api/waitlist/stats`
Get overall waitlist statistics.

**Success Response (200):**
{
  "success": true,
  "data": {
    "totalUsers": 5247,
    "totalReferrals": 1832,
    "avgReferralsPerUser": 0.35
  }
}
## 📁 File Structure

project-root/
├── lib/
│   ├── database/
│   │   ├── sqlite.ts         # Database connection & queries
│   │   └── schema.sql        # Database schema definition
│   └── utils/
│       └── referral.ts       # Referral code generation
├── app/
│   └── api/
│       └── waitlist/
│           ├── route.ts      # Main waitlist API
│           ├── position/
│           │   └── [email]/route.ts
│           └── stats/route.ts
├── data/
│   ├── waitlist.db          # SQLite database file
│   └── backups/             # Database backup files
└── scripts/
    ├── setup-db.js          # Database setup script
    └── backup-db.js         # Backup utility
## 🔧 Troubleshooting

### Common Issues

**Database file not found**
Error: SQLITE_CANTOPEN: unable to open database file
**Solution:** Run `npm run db:setup` to initialize the database.

**Permission denied errors**
Error: EACCES: permission denied
**Solution:** Check file permissions on the `data/` directory:
chmod 755 data/
chmod 664 data/waitlist.db
**Duplicate email errors**
Error: UNIQUE constraint failed: waitlist_users.email
**Solution:** This is expected behavior. Handle gracefully in your frontend.

**Database locked**
Error: SQLITE_BUSY: database is locked
**Solution:** Restart the server. For production, implement connection pooling.

### Debug Mode

Enable detailed database logging:
# Set environment variable
DB_DEBUG=true npm run dev
## 🏗 Development vs Production

### Development Setup
- Uses SQLite file database
- Database file: `data/waitlist.db`
- Auto-creates database on first run
- No connection pooling

### Production Setup
- Consider PostgreSQL or MySQL for scale
- Implement connection pooling
- Set up regular backups
- Use environment variables for database config

### Environment Variables
# Development (optional)
DATABASE_URL="file:./data/waitlist.db"

# Production (recommended)
DATABASE_URL="postgresql://user:pass@host:5432/db"
DB_POOL_SIZE=10
DB_TIMEOUT=30000
## 💾 Backup and Recovery

### Automatic Backups
# Create timestamped backup
npm run db:backup
# Creates: data/backups/waitlist-2024-01-15-10-30-00.db
### Manual Backup
# Copy database file
cp data/waitlist.db data/backups/manual-backup-$(date +%Y%m%d).db
### Restore from Backup
# Restore specific backup
npm run db:restore data/backups/waitlist-2024-01-15-10-30-00.db
### Production Backup Strategy
# Set up cron job for daily backups
0 2 * * * /path/to/project && npm run db:backup
## ⚡ Performance

### Indexing Strategy
The database includes optimized indexes for common queries:

-- Existing indexes (automatically created)
CREATE INDEX idx_email ON waitlist_users(email);
CREATE INDEX idx_referral_code ON waitlist_users(referral_code);
CREATE INDEX idx_position ON waitlist_users(position);
### Query Optimization Tips

**Efficient position lookup:**
-- Good: Uses position index
SELECT * FROM waitlist_users WHERE position = ?

-- Avoid: Full table scan
SELECT * FROM waitlist_users ORDER BY created_at LIMIT 1 OFFSET ?
**Batch operations:**
-- Insert multiple users efficiently
INSERT INTO waitlist_users (email, referral_code, position) 
VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?);
### Monitoring Performance
# Analyze query performance
sqlite3 data/waitlist.db "EXPLAIN QUERY PLAN SELECT * FROM waitlist_users WHERE email = 'test@example.com'"
## 🔒 Security

### Best Practices

**Input Validation:**
- Always validate email format
- Sanitize referral codes
- Use parameterized queries (already implemented)

**Data Protection:**
# Secure file permissions
chmod 600 data/waitlist.db        # Owner read/write only
chmod 700 data/                   # Owner access only
**API Security:**
- Implement rate limiting
- Add CORS protection
- Validate request origins
- Use HTTPS in production

**Example Rate Limiting:**
// lib/rateLimit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 h"), // 5 requests per hour
});
### Environment Security
# Never commit sensitive data
echo "data/*.db" >> .gitignore
echo ".env.local" >> .gitignore

# Use environment variables
DATABASE_ENCRYPTION_KEY=your-secret-key
API_SECRET_KEY=your-api-secret
### Database Encryption (Advanced)
For sensitive production data, consider SQLite encryption:
# Using SQLCipher
npm install sqlite3-sqlcipher
## 🎯 Ready to Go!

Your database system is now fully configured and documented. For additional help:

- Check the `/app/api/waitlist/route.ts` file for implementation details
- Review the schema in `/lib/database/schema.sql`
- Test the API endpoints using the provided examples

Happy coding! 🚀