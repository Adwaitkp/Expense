# Expense Tracker

A comprehensive expense tracking application built with Next.js, React, and MongoDB. Track your daily expenses, set monthly budgets, and gain insights into your spending patterns.

## 🚀 Features

### Stage 1: Basic Transaction Tracking
- ✅ Add, edit, and delete transactions
- ✅ Transaction list view with sorting
- ✅ Monthly expenses bar chart
- ✅ Basic form validation
- ✅ Responsive design with error states

### Stage 2: Categories
- ✅ Predefined categories for transactions
- ✅ Category-wise pie chart
- ✅ Dashboard with summary cards
- ✅ Total expenses, category breakdown, recent transactions

### Stage 3: Budgeting
- ✅ Set monthly category budgets
- ✅ Budget vs actual comparison chart
- ✅ Spending insights and alerts
- ✅ Month selector for historical data
- ✅ Tabbed interface for better organization

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript
- **UI Components:** shadcn/ui, Tailwind CSS
- **Charts:** Recharts
- **Database:** MongoDB with Mongoose
- **Deployment:** Vercel

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/expense-tracker.git
   cd expense-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)

1. **Create a MongoDB Atlas account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account

2. **Create a new cluster**
   - Choose the free tier (M0)
   - Select your preferred cloud provider and region

3. **Set up database access**
   - Create a database user with read/write permissions
   - Remember the username and password

4. **Set up network access**
   - Add your IP address or use `0.0.0.0/0` for all IPs

5. **Get your connection string**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Replace `<dbname>` with `expense-tracker`

## 🚀 Deployment

### Deploy to Vercel

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Sign up with your GitHub account
   - Click "New Project"
   - Import your repository
   - Add environment variable: `MONGODB_URI`
   - Deploy!

## 📱 Usage

### Adding Transactions
1. Navigate to the "Transactions" tab
2. Fill in the transaction form:
   - Amount
   - Date
   - Category
   - Description
3. Click "Add Transaction"

### Setting Budgets
1. Navigate to the "Budgets" tab
2. Select a category and month
3. Enter your budget amount
4. Click "Set Budget"

### Viewing Insights
- Check the "Spending Insights" section for budget alerts
- Use the month selector to view historical data
- Explore charts for visual spending analysis

## 🎨 Customization

### Adding New Categories
Edit `lib/categories.ts` to add or modify categories:

```typescript
export const CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  // Add your categories here
] as const;
```

### Styling
The app uses Tailwind CSS and shadcn/ui components. You can customize the theme in `tailwind.config.js`.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Recharts](https://recharts.org/) for chart components
- [Next.js](https://nextjs.org/) for the React framework
- [MongoDB](https://www.mongodb.com/) for the database

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Live Demo:** [Your Vercel URL here]  
**GitHub Repository:** [Your GitHub URL here]
