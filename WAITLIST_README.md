# Waitlist System

A comprehensive waitlist management system built with Next.js, PostgreSQL, and modern web technologies. This system provides a seamless way to collect and manage user waitlist signups with an admin panel for monitoring and management.

## Table of Contents

1. [System Overview](#system-overview)
2. [Database Setup](#database-setup)
3. [Installation & Setup](#installation--setup)
4. [Running the Application](#running-the-application)
5. [Admin Panel Access](#admin-panel-access)
6. [Managing Waitlist Entries](#managing-waitlist-entries)
7. [Database Schema](#database-schema)
8. [API Endpoints](#api-endpoints)
9. [Security Considerations](#security-considerations)
10. [Troubleshooting](#troubleshooting)
11. [Usage Examples](#usage-examples)

## System Overview

The waitlist system consists of three main components:

### 1. **User-Facing Waitlist Form**
- Clean, responsive form for collecting user information
- Real-time validation and error handling
- Success confirmation with position tracking
- Professional design aligned with your brand

### 2. **Admin Panel**
- Secure admin interface for managing waitlist entries
- Real-time statistics and analytics
- Export functionality for data management
- Search and filter capabilities

### 3. **Backend API**
- RESTful API endpoints for waitlist management
- Database integration with PostgreSQL
- Input validation and sanitization
- Error handling and logging

## Database Setup

### Prerequisites
- PostgreSQL 14 or higher
- Database connection string (local or cloud)

### 1. Environment Configuration

Create a `.env` file in the project root:

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/waitlist_db"

# Admin Authentication
ADMIN_SECRET="your-secure-admin-secret-here"

# Application Settings
NEXT_PUBLIC_APP_URL="http://localhost:3000"
### 2. Database Initialization

The database schema is automatically created when you run the application. The system uses the following table structure:

CREATE TABLE waitlist_entries (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    company VARCHAR(200),
    position INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_waitlist_email ON waitlist_entries(email);
CREATE INDEX idx_waitlist_position ON waitlist_entries(position);
CREATE INDEX idx_waitlist_created_at ON waitlist_entries(created_at);
### 3. Manual Database Setup (Optional)

If you prefer to set up the database manually:

1. **Connect to PostgreSQL:**
   psql -U your_username -d your_database
   2. **Create the table:**
   CREATE TABLE waitlist_entries (
       id SERIAL PRIMARY KEY,
       email VARCHAR(255) UNIQUE NOT NULL,
       first_name VARCHAR(100) NOT NULL,
       last_name VARCHAR(100) NOT NULL,
       company VARCHAR(200),
       position INTEGER NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   
   CREATE INDEX idx_waitlist_email ON waitlist_entries(email);
   CREATE INDEX idx_waitlist_position ON waitlist_entries(position);
   CREATE INDEX idx_waitlist_created_at ON waitlist_entries(created_at);
   ## Installation & Setup

### 1. Clone and Install Dependencies

# Clone the repository
git clone <repository-url>
cd waitlist-system

# Install dependencies
npm install
### 2. Environment Configuration

Copy the example environment file and configure:

cp .env.example .env
Edit `.env` with your specific configuration:

# Database - Replace with your PostgreSQL connection string
DATABASE_URL="postgresql://username:password@localhost:5432/waitlist_db"

# Admin Secret - Use a strong, unique secret
ADMIN_SECRET="your-very-secure-admin-secret-key"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
### 3. Database Connection Test

Test your database connection:

# This will attempt to connect and create the table if it doesn't exist
npm run db:test
## Running the Application

### Development Mode

# Start the development server
npm run dev

# The application will be available at:
# - Waitlist form: http://localhost:3000
# - Admin panel: http://localhost:3000/admin
### Production Mode

# Build the application
npm run build

# Start the production server
npm start
### Docker Deployment (Optional)

# Build the Docker image
docker build -t waitlist-system .

# Run with environment variables
docker run -p 3000:3000 -e DATABASE_URL="your-db-url" -e ADMIN_SECRET="your-secret" waitlist-system
## Admin Panel Access

### 1. Access the Admin Panel

Navigate to: `http://localhost:3000/admin`

### 2. Authentication

Enter your admin secret key (configured in `ADMIN_SECRET` environment variable)

### 3. Admin Features

Once authenticated, you'll have access to:

- **Dashboard Overview**: Real-time statistics and recent signups
- **Waitlist Management**: View, search, and filter all entries
- **Export Functionality**: Download waitlist data as CSV
- **Analytics**: Signup trends and growth metrics

### 4. Admin Panel Navigation

Admin Panel Features:
├── Dashboard
│   ├── Total signups counter
│   ├── Recent signups timeline
│   └── Growth statistics
├── Waitlist Management
│   ├── Search by email/name
│   ├── Filter by date range
│   ├── Sort by position/date
│   └── Export to CSV
└── Settings
    ├── Admin authentication
    └── System configuration
## Managing Waitlist Entries

### Viewing Entries

1. **Access Admin Panel**: Go to `/admin` and authenticate
2. **View Dashboard**: See overview statistics and recent signups
3. **Browse Entries**: Use the waitlist management section

### Search and Filter

// Search capabilities:
- Search by email address
- Search by first name or last name
- Filter by signup date range
- Sort by position or signup date
### Export Data

1. **Navigate to Admin Panel**
2. **Click "Export CSV"**
3. **Choose date range** (optional)
4. **Download** the generated CSV file

### CSV Export Format

Position,Email,First Name,Last Name,Company,Signup Date
1,john@example.com,John,Doe,Acme Corp,2024-01-15T10:30:00Z
2,jane@example.com,Jane,Smith,Tech Inc,2024-01-15T11:45:00Z
## Database Schema

### waitlist_entries Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique identifier |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | User's email address |
| `first_name` | VARCHAR(100) | NOT NULL | User's first name |
| `last_name` | VARCHAR(100) | NOT NULL | User's last name |
| `company` | VARCHAR(200) | NULL | User's company (optional) |
| `position` | INTEGER | NOT NULL | Position in waitlist |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Signup timestamp |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

### Indexes

- `idx_waitlist_email`: Fast email lookups
- `idx_waitlist_position`: Efficient position queries
- `idx_waitlist_created_at`: Date-based sorting

### Database Relationships

-- Future enhancements could include:
-- User preferences, notifications, etc.
## API Endpoints

### Public Endpoints

#### POST /api/waitlist
**Submit waitlist entry**

// Request
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "company": "Acme Corp" // optional
}

// Response - Success
{
  "success": true,
  "message": "Successfully joined the waitlist!",
  "position": 42
}

// Response - Error
{
  "success": false,
  "message": "Email already exists in waitlist"
}
### Admin Endpoints

#### GET /api/admin/waitlist
**Get all waitlist entries (requires admin auth)**

// Headers
{
  "Authorization": "Bearer your-admin-secret"
}

// Response
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "company": "Acme Corp",
      "position": 1,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1
}
#### GET /api/admin/stats
**Get waitlist statistics**

// Response
{
  "success": true,
  "data": {
    "totalSignups": 150,
    "todaySignups": 12,
    "weeklyGrowth": 25,
    "averageDaily": 8.5
  }
}
#### GET /api/admin/export
**Export waitlist data as CSV**

// Query parameters
?startDate=2024-01-01&endDate=2024-01-31

// Response
Content-Type: text/csv
Content-Disposition: attachment; filename="waitlist-export.csv"

// CSV data stream
## Security Considerations

### 1. Admin Authentication

- **Secret Key**: Use a strong, unique admin secret
- **Environment Variables**: Never commit secrets to version control
- **Session Management**: Admin sessions expire after inactivity

### 2. Input Validation

// All inputs are validated:
- Email format validation
- Name length limits (100 chars)
- Company name limits (200 chars)
- SQL injection prevention
- XSS protection
### 3. Rate Limiting

- **API Rate Limiting**: Prevent spam submissions
- **IP-based Limits**: Protect against abuse
- **Email Validation**: Prevent duplicate signups

### 4. Database Security

- **Prepared Statements**: Prevent SQL injection
- **Connection Encryption**: Use SSL/TLS for database connections
- **Access Control**: Limit database permissions

### 5. Production Recommendations

# Use strong admin secrets
ADMIN_SECRET="$(openssl rand -hex 32)"

# Enable HTTPS in production
NEXT_PUBLIC_APP_URL="https://yourapp.com"

# Use connection pooling
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
## Troubleshooting

### Common Issues

#### 1. Database Connection Failed

**Symptoms**: "Database connection failed" error

**Solutions**:
# Check database connection
psql -U username -d database_name

# Verify environment variables
echo $DATABASE_URL

# Test connection
npm run db:test
#### 2. Admin Panel Access Denied

**Symptoms**: "Invalid admin secret" error

**Solutions**:
# Check admin secret
echo $ADMIN_SECRET

# Clear browser cache
# Try incognito/private browsing
#### 3. Duplicate Email Errors

**Symptoms**: "Email already exists" error

**Solutions**:
-- Check for existing email
SELECT * FROM waitlist_entries WHERE email = 'user@example.com';

-- Remove duplicate if needed
DELETE FROM waitlist_entries WHERE email = 'user@example.com';
#### 4. Position Numbering Issues

**Symptoms**: Incorrect position numbers

**Solutions**:
-- Reset position numbers
UPDATE waitlist_entries 
SET position = subquery.row_number
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) AS row_number
  FROM waitlist_entries
) AS subquery
WHERE waitlist_entries.id = subquery.id;
### Debugging Steps

1. **Check Logs**: Review application logs for errors
2. **Database Status**: Verify database connectivity
3. **Environment Variables**: Confirm all variables are set
4. **Port Availability**: Ensure port 3000 is available
5. **Dependencies**: Run `npm install` to ensure all packages are installed

### Performance Issues

// Monitor database performance
SELECT * FROM pg_stat_activity WHERE datname = 'waitlist_db';

// Check index usage
SELECT * FROM pg_stat_user_indexes WHERE relname = 'waitlist_entries';
## Usage Examples

### Basic Implementation

// Submit to waitlist
const response = await fetch('/api/waitlist', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    company: 'Acme Corp'
  })
});

const result = await response.json();
if (result.success) {
  console.log(`Position in waitlist: ${result.position}`);
}
### Admin Integration

// Get admin data
const response = await fetch('/api/admin/waitlist', {
  headers: {
    'Authorization': `Bearer ${adminSecret}`
  }
});

const data = await response.json();
console.log(`Total signups: ${data.total}`);
### Custom Styling

/* Override default styles */
.waitlist-form {
  --color-primary: #your-brand-color;
  --color-background: #your-bg-color;
}
### Integration with Your App

// pages/signup.js
import WaitlistForm from '../components/WaitlistForm';

export default function SignupPage() {
  return (
    <div className="container">
      <h1>Join Our Waitlist</h1>
      <WaitlistForm 
        onSuccess={(position) => {
          console.log(`Welcome! You're #${position} in line.`);
        }}
      />
    </div>
  );
}
## Support

For additional support or questions:

1. **Check the troubleshooting section** above
2. **Review the logs** for error messages
3. **Verify your environment setup** 
4. **Test with the provided examples**

## Contributing

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Last Updated**: January 2024
**Version**: 1.0.0

This README provides comprehensive documentation for setting up, running, and managing the waitlist system. Follow the sections in order for the best setup experience.