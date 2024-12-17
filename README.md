Smart Delivery Management System 🚚
Overview
The Smart Delivery Management System is a modern dashboard for managing delivery partners, optimizing order assignments, and tracking performance metrics. This system focuses on partner management, real-time order processing, and smart order assignments.

Features 📋
1. Partner Management
Partner registration and profile editing
Area and shift scheduling
Partner list view with availability status
2. Order Processing
Orders dashboard with status tracking
Assignment history
Order performance metrics
3. Assignment System
Smart order assignments to partners based on availability and load
Assignment success/failure tracking
Partner performance evaluation
Pages & Data Types
Dashboard (/)
Key metrics summary
Active orders map
Partner availability status
Recent assignments
Partners (/partners)
List and metrics of delivery partners.
typescript
Copy code
type DeliveryPartner = {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  currentLoad: number; // max: 3
  areas: string[];
  shift: {
    start: string; // HH:mm
    end: string;   // HH:mm
  };
  metrics: {
    rating: number;
    completedOrders: number;
    cancelledOrders: number;
  };
};
Orders (/orders)
View, filter, and manage all orders.
typescript
Copy code
type Order = {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  area: string;
  items: { name: string; quantity: number; price: number; }[];
  status: 'pending' | 'assigned' | 'picked' | 'delivered';
  scheduledFor: string; // HH:mm
  assignedTo?: string;  // Partner ID
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
};
Assignment Dashboard (/assignments)
View assignment metrics and active assignments.
typescript
Copy code
type Assignment = {
  orderId: string;
  partnerId: string;
  timestamp: Date;
  status: 'success' | 'failed';
  reason?: string;
};
API Routes 🚀
Partner Routes
GET /api/partners - Retrieve all partners
POST /api/partners - Register a new partner
PUT /api/partners/[id] - Update partner details
DELETE /api/partners/[id] - Delete a partner
Order Routes
GET /api/orders - Retrieve all orders
POST /api/orders/assign - Assign an order to a partner
PUT /api/orders/[id]/status - Update order status
Assignment Routes
GET /api/assignments/metrics - View assignment metrics
POST /api/assignments/run - Run the assignment algorithm
Tech Stack 🛠️
Frontend: React + TypeScript
Backend: Node.js + Express
Database: MongoDB
State Management: React Context API / Redux
UI Framework: TailwindCSS / Material-UI
Setup Instructions ⚙️
Clone the Repository

bash
Copy code
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
Install Dependencies

bash
Copy code
npm install
Run the Application

bash
Copy code
npm start
Run the Backend

bash
Copy code
npm run server
Access the Application

Frontend: http://localhost:3000
Backend: http://localhost:5000
Submission Links ✅
GitHub Repository: Repo Link
Live Demo: Live App Link
Evaluation Criteria 🏆
TypeScript implementation
Component organization
State management
Error handling and loading states
Mobile responsiveness
Assignment algorithm efficiency
Author ✨
ROSHAN JOHN
roshanjohnrj12@gmail.com

