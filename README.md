# Restaurant Management Backend API

## Project Overview

The Restaurant Management Backend API is a RESTful backend application developed using Node.js, Express.js, and MySQL. It allows customers to browse food items, search and filter the menu, and place orders. Administrators can manage menu items and monitor and update customer orders.

## Features

### Authentication and Authorization
- Customer signup and login
- Password hashing using bcrypt
- JWT-based authentication
- Role-based access control for customers and administrators

### Menu Management
- View all available menu items
- Search menu items by name
- Filter items by category and availability
- Add, update, and delete menu items (Admin only)

### Order Management
- Place food orders
- Automatically calculate order totals
- View personal order history
- Allow administrators to view all orders
- Update order status
- Validate food availability and order quantities

## Technologies Used

- Node.js
- Express.js
- MySQL
- JavaScript
- JSON Web Token (JWT)
- bcrypt
- dotenv
- Postman

## Database

Database name: `restaurant_db`

Main tables:
- `users` — stores customer and administrator accounts
- `menu_items` — stores food items and availability
- `orders` — stores order information and status
- `order_items` — stores individual food items within orders

## Installation and Setup

### 1. Install dependencies

Make sure Node.js and MySQL are installed.

Open a terminal in the project folder and run:

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root and configure the values used by your application:

```env
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=restaurant_db
JWT_SECRET=your_long_random_secret
```

Use the exact environment variable names expected by your project's database configuration. Never publish real passwords or JWT secrets.

### 3. Set up the database

Create the `restaurant_db` database in MySQL and create the required tables: `users`, `menu_items`, `orders`, and `order_items`.

Import your project's SQL setup file if one is available.

### 4. Start the server

Run the command configured for your project. If the entry point is `src/server.js`, use:

```bash
node src/server.js
```

The server should run at:

`http://localhost:5000`

## API Endpoints

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| POST | `/signup` | Register a customer | Public |
| POST | `/login` | Log in | Public |
| GET | `/menu` | View, search, and filter menu | Public |
| POST | `/menu` | Add a menu item | Admin |
| PUT | `/menu/:id` | Update a menu item | Admin |
| DELETE | `/menu/:id` | Delete a menu item | Admin |
| POST | `/order` | Place an order | Authenticated user |
| GET | `/order/my-orders` | View personal order history | Authenticated user |
| GET | `/order` | View all orders | Admin |
| PUT | `/order/:id/status` | Update an order status | Admin |

## Testing

The API has been tested using Postman for:
- Signup and login
- JWT authentication and role-based access
- Menu creation, retrieval, updating, and deletion
- Menu search and filtering
- Order creation and order history
- Invalid order status and quantity validation
- Unavailable food item validation
- Unauthorized access rejection

A Postman collection can be included with the project for API testing.

## Project Structure

```text
RestaurantManagementAPI/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   └── server.js
├── documentation/
│   └── RestaurantManagementAPI.postman_collection.json
├── .env
├── package.json
└── README.md
```

## Future Enhancements

- Online payment integration
- Order cancellation functionality
- Pagination for menu and order lists
- Automated API testing
- Deployment to a cloud server

## Author

Developed as a backend API project for learning and internship purposes.