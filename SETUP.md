# Setup & Installation Guide

## Project Structure
```
loan-management-system/
├── server.js
├── package.json
├── config/
│   └── database.js
├── models/
│   ├── User.js
│   ├── Loan.js
│   ├── Payment.js
│   ├── LoanSchedule.js
│   └── index.js
├── controllers/
│   ├── authController.js
│   ├── loanController.js
│   └── paymentController.js
├── routes/
│   ├── index.js
│   ├── authRoutes.js
│   ├── loanRoutes.js
│   └── paymentRoutes.js
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
├── .env.example
├── .gitignore
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── context/
        │   └── AuthContext.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   └── PrivateRoute.jsx
        └── pages/
            ├── Home.jsx
            ├── Login.jsx
            ├── Register.jsx
            ├── Dashboard.jsx
            ├── ApplyLoan.jsx
            ├── MyLoans.jsx
            └── MakePayment.jsx
```

## Backend Setup

### Prerequisites
- Node.js v14+
- PostgreSQL v12+

### Installation

1. **Create PostgreSQL Database**
```sql
CREATE DATABASE loan_management;
```

2. **Install Backend Dependencies**
```bash
npm install
```

3. **Configure Environment Variables**
```bash
cp .env.example .env
```

Update `.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=loan_management
DB_USER=postgres
DB_PASSWORD=your_password
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRY=7d
```

4. **Start Backend Server**
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## Frontend Setup

### Installation

1. **Navigate to Frontend Directory**
```bash
cd frontend
```

2. **Install Frontend Dependencies**
```bash
npm install
```

3. **Start Frontend Development Server**
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## Testing the System

### 1. Register a New User
1. Go to `http://localhost:3000`
2. Click "Register"
3. Fill in details:
   - Email: user@example.com
   - Password: password123
   - First Name: John
   - Last Name: Doe
   - Phone: 9876543210
4. Click Register

### 2. Apply for Loan
1. After login, click "Apply Loan"
2. Fill in loan details:
   - Loan Amount: 500000
   - Tenure: 60 months
   - Interest Rate: 8.5%
   - Purpose: Home Purchase
3. Review the EMI calculation
4. Click "Apply for Loan"

### 3. View Loans (Admin)
- For admin access, create another user and change role in database:
```sql
UPDATE users SET role='admin' WHERE email='admin@example.com';
```

### 4. Make Payment
1. Go to "My Loans"
2. Click on a loan
3. Click "Make Payment"
4. Select EMI, enter amount, and confirm

## Database Queries

### View All Users
```sql
SELECT id, email, first_name, last_name, role, account_status FROM users;
```

### View All Loans
```sql
SELECT id, borrower_id, loan_amount, monthly_emi, status FROM loans;
```

### View Payments
```sql
SELECT id, loan_id, emi_number, total_payment, payment_date, status FROM payments;
```

### Change User Role to Admin
```sql
UPDATE users SET role='admin' WHERE email='your_email@example.com';
```

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Loans (Borrower)
- `POST /api/loans/apply` - Apply for loan
- `GET /api/loans/my-loans` - Get user's loans
- `GET /api/loans/:loanId` - Get loan details

### Loans (Admin)
- `GET /api/loans?status=applied` - Get all loans by status
- `POST /api/loans/:loanId/approve` - Approve loan
- `POST /api/loans/:loanId/disburse` - Disburse loan

### Payments
- `POST /api/payments/make-payment` - Record payment
- `GET /api/payments/:loanId/history` - Get payment history
- `GET /api/payments/:loanId/upcoming` - Get upcoming EMIs
- `GET /api/payments/:loanId/stats` - Get payment statistics

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "phone": "9999999999"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Apply for Loan
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

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Verify credentials in .env file
- Check database exists: `createdb loan_management`

### CORS Error
- Ensure `frontend` proxy is configured correctly in `vite.config.js`
- Check backend CORS is enabled

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

## Production Deployment

1. **Backend**
   - Set NODE_ENV=production
   - Use strong JWT_SECRET
   - Enable HTTPS
   - Set up database backups

2. **Frontend**
   - Run `npm run build`
   - Deploy dist folder to static hosting
   - Update API endpoints

## Features Implemented

✅ User Authentication (JWT)
✅ Role-based Access Control
✅ Loan Application Workflow
✅ EMI Calculation (Compound Interest Formula)
✅ Auto Loan Schedule Generation
✅ Payment Recording & Tracking
✅ Penalty Calculation
✅ Overdue Detection
✅ Payment History
✅ Real-time Balance Calculation
✅ Loan Status Management
✅ Complete Dashboard
✅ Responsive Design
✅ Real Database (No Dummy Data)

## Support

For issues or questions, please create a GitHub issue.
