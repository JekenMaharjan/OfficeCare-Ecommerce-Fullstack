# OfficeCare – E-commerce Platform (MERN Stack)

## Overview

**OfficeCare** is a full-stack e-commerce platform built using the **MERN** stack.  
It allows users to browse office products, manage carts, place orders, and enables admins to manage products efficiently.

---

## Live Demo

> https://officecare-ecommerce-fullstack-frontend.onrender.com/

---

## Tech Stack

### Frontend

- React
- Next.js
- Tailwind CSS

### Backend

- Node.js
- Express.js
- JWT Authentication

### Database

- MongoDB (Mongoose)

---

## Features

### User Features

- User Registration & Login
- Browse Products
- Add to Cart
- Place Orders
- Wishlist

### Admin Features

- Add/Edit Products
- Manage Orders

### Upcoming

- Reviews
- Recommendations
- Order Tracking
- Bulk Orders

---

## Project Architecture

```bash
officecare-ecommerce-fullstack/
│
├── client/      → Next.js frontend  
├── server/      → Express backend  
└── README.md
```

---

## Getting Started (Setup Instructions)

To run the project locally, follow the instructions below:

### Prerequisites

- [Node.js](https://nodejs.org/en)
- [MongoDB](https://www.mongodb.com/)
- [Git](https://git-scm.com/)

### Clone Repository

Open your terminal and clone the repository:

```bash
git clone <repository-url>
```

Replace <repository-url> with the GitHub repository URL.

### Setup Frontend

Navigate to the client folder.

```bash
cd client
```

Install client dependencies for the React/Next.js frontend.

```bash
npm install
```

### Setup Backend

Navigate to the server folder.  
Return to the root directory and navigate to the server folder.

```bash
cd ../server
```

Install server dependencies.  
Install the required `Node.js` and `Express.js` packages.

```bash
npm install mongoose nodemon
```

### Environment Variables

Create a .env file in the server folder with the following keys:

```bash
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<jwt-secret-key>
PORT=5000
```

Replace <your-mongodb-connection-string> with the URL of your MongoDB database. Also, replace <jwt-secret-key>.

### Run Application

Start the client side.

```bash
npm run dev
```

Start the server side.

```bash
npm run dev
```

This will start the back-end server with **nodemon** for auto-restart during development.

### Access the Application

- Frontend: The React.js/Next.js app will typically be available at http://localhost:3000.
- Backend: The Express.js server will run on http://localhost:5000 or the port specified in your .env file.

---

## Development Phases & Progess

The development of **OfficeCare** is organized into structured phases to ensure scalability, maintainability, and incremental delivery of features.

### Phase 1 – Core E-commerce Functionality (Completed / In Progress)

**Objective:**  
Deliver a fully functional e-commerce foundation where users can register, browse products, manage carts, and place orders.

**Frontend Implementation**
- User Authentication (Register, Login, Logout)
- Product Listing Page
- Product Detail Page
- Shopping Cart (Add / Remove Items, Total Calculation)
- Checkout & Order Confirmation Page

**Backend Implementation**
- User Registration API (Email validation + bcrypt hashing)
- JWT-based Authentication System
- Product Management API (Admin access)
- Product Retrieval API
- Cart Management API
- Order Creation API (with order status management)

### Phase 2 – Advanced & Business Features (In Progress)

**Objective:**  
Enhance user engagement and introduce business-oriented capabilities for scalability and improved user experience.

**Frontend Implementation**
- Product Review Interface
- Product Recommendation Component
- Real-Time Order Tracking UI
- Bulk Order Interface for Business Accounts

**Backend Implementation**
- Product Review API
- Recommendation Logic Implementation
- Real-Time Order Tracking API
- Bulk Order Discount & Pricing Logic

### Future Enhancements (Planned)

- Payment Gateway Integration
- Role-Based Access Control (RBAC)
- Admin Dashboard Analytics
- Performance Optimization
- Deployment & CI/CD Integration

---

## Contributing

Contributions are welcome and appreciated. To maintain code quality and consistency, please follow the steps below:

1. **Fork the Repository**  
    Click the Fork button on GitHub to create your own copy of the repository.

2. **Clone Your Fork**  
    ```bash
    git clone https://github.com/your-username/officecare.git
    cd officecare
    ```

3. **Create a Feature Branch**  
    Always create a new branch from main for your feature or fix:
    ```bash
    git checkout -b feature/your-feature-name
    ```

4. **Make Your Changes**  
    Follow the existing project structure and coding conventions.

5. **Commit Your Changes**  
    Write meaningful commit messages:
    ```bash
    git commit -m "Add product review API endpoint"
    ```

6. **Push to Your Branch**  
    ```bash
    git push origin feature/your-feature-name
    ```

7. **Open a Pull Request**  
    Go to the original repository and open a Pull Request.  
    Provide a clear description of:  
    - What you implemented
    - Why it was needed
    - Any screenshots (if UI changes)

---

## License

This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/).

---

## Contact

For any inquiries, reach out to us at:
- **Email:** [JekenMaharjan](maharjanjeken@gmail.com)
- **Github:** [Jekode](https://github.com/JekenMaharjan)

---

## Connect with Me

> Email: [maharjanjeken@gmail.com](mailto:maharjanjeken@gmail.com)

> Portfolio: [**jekenmaharjan.com.np**](https://jekenmaharjan.com.np)

> [![LinkedIn](https://img.shields.io/badge/-LinkedIn-blue?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/jekenmaharjan/)  [![GitHub](https://img.shields.io/badge/-GitHub-black?style=flat-square&logo=github)](https://github.com/JekenMaharjan)  [![Twitter](https://img.shields.io/badge/-Twitter-1DA1F2?style=flat-square&logo=twitter)](https://x.com/JekenMaharjan)  [![Linktree](https://img.shields.io/badge/-Connect-43E660?style=flat-square&logo=linktree&logoColor=white)](https://linktr.ee/JekenMaharjan)
