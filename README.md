# Loan Management System

A complete, production-ready loan management system with real data, no dummy data, and full working features.

## Features

✅ **User Authentication & Authorization**
- JWT-based authentication
- Role-based access (Admin, Lender, Borrower)
- Secure password hashing with bcrypt
- User profile management

✅ **Loan Application & Management**
- Loan application workflow
- Admin approval system
- Loan disbursement tracking
- Real EMI calculations using compound interest formula
- Complete loan schedule generation
- Loan status tracking (applied → approved → disbursed → active → closed)

✅ **Payment Processing**
- EMI payment recording
- Interest and principal breakdown
- Late payment penalties
- Payment history tracking
- Automatic loan closure on full payment

✅ **Dashboard & Analytics**
- Payment statistics
- Upcoming EMI tracking
- Overdue payment detection
- Loan completion percentage
- Remaining balance calculation

✅ **Real Data**
- PostgreSQL database
- No dummy/mock data
- Proper relationships and constraints
- Data validation and integrity

## Technology Stack

- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT
- **ORM**: Sequelize
- **Security**: bcryptjs, helmet, CORS
- **Validation**: express-validator
- **Calculation**: Decimal.js (for precise financial calculations)

## Installation

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/pushkarvishal003/loan-management-system.git
cd loan-management-system
```

2. **Install dependencies**
```bash
npm install
```

3. **Create PostgreSQL database**
```sql
CREATE DATABASE loan_management;
```

4. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=loan_management
DB_USER=postgres
DB_PASSWORD=your_password
PORT=5000
JWT_SECRET=your_secret_key
```

5. **Start the server**
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (requires auth)

### Loan Management (Borrower)
- `POST /api/loans/apply` - Apply for loan
- `GET /api/loans/my-loans` - Get all borrower's loans
- `GET /api/loans/:loanId` - Get loan details

### Loan Management (Admin)
- `GET /api/loans` - Get all loans
- `POST /api/loans/:loanId/approve` - Approve loan
- `POST /api/loans/:loanId/disburse` - Disburse loan

### Payment Management
- `POST /api/payments/make-payment` - Record payment
- `GET /api/payments/:loanId/history` - Payment history
- `GET /api/payments/:loanId/upcoming` - Upcoming EMIs
- `GET /api/payments/:loanId/stats` - Payment statistics

## Example API Usage

### 1. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "9876543210",
    "role": "borrower"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 3. Apply for Loan
```bash
curl -X POST http://localhost:5000/api/loans/apply \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "loanAmount": 500000,
    "loanTenureMonths": 60,
    "interestRate": 8.5,
    "loanPurpose": "Home Purchase"
  }'
```

### 4. Make Payment
```bash
curl -X POST http://localhost:5000/api/payments/make-payment \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "loanId": "loan-uuid",
    "emiNumber": 1,
    "amount": 10000,
    "transactionId": "TXN123456",
    "paymentMethod": "online"
  }'
```

## Database Schema

### Users Table
- Stores user information (borrowers, lenders, admins)
- Includes KYC fields (PAN, Aadhar)
- Credit score tracking

### Loans Table
- Loan application and tracking
- EMI calculations
- Status management
- Document storage

### Payments Table
- Payment recording
- Interest/Principal breakdown
- Late payment penalties
- Transaction tracking

### Loan Schedule Table
- EMI schedule for each loan
- Payment due dates
- Outstanding balance tracking
- Overdue tracking

## EMI Calculation Formula

Used the standard EMI formula:
```
EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]

Where:
P = Principal Loan Amount
R = Monthly Interest Rate (Annual Rate / 12 / 100)
N = Number of Months
```

## Features Included

1. **User Management**
   - Registration and login with JWT tokens
   - Role-based access control
   - User profile management
   - KYC verification tracking

2. **Loan Processing**
   - Complete loan application workflow
   - Admin approval system
   - Real-time EMI calculations
   - Automatic schedule generation
   - Loan status tracking

3. **Payment Processing**
   - EMI payment recording
   - Interest calculation breakdown
   - Late payment penalties
   - Multiple payment methods
   - Transaction tracking

4. **Analytics & Reports**
   - Payment statistics
   - Overdue tracking
   - Completion percentage
   - Balance calculation
   - Payment history

5. **Security**
   - Password hashing with bcrypt
   - JWT authentication
   - Role-based authorization
   - CORS protection
   - Helmet security headers

## Decimal Precision

All financial calculations use `decimal.js` for precise decimal arithmetic to avoid floating-point errors common in financial systems.

## Production Deployment

When deploying to production:
1. Set `NODE_ENV=production`
2. Update database credentials
3. Generate strong JWT secret
4. Use environment-specific .env file
5. Enable HTTPS
6. Set up database backups
7. Configure proper logging

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
