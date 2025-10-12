Task Management API
A simple and efficient RESTful API for managing tasks, built with NestJS and TypeScript.

Features
Create a new task

Retrieve a list of all tasks

Get a specific task by its ID

Update an existing task (e.g., change its status or description)

Delete a task

Getting Started
Follow these instructions to get the project up and running on your local machine for development and testing.

Prerequisites
Make sure you have Node.js (v18 or higher) and npm installed.

Installation
Clone the repository:

git clone [https://github.com/ARES11430/task-management.git]
cd your-repo-name

Install dependencies:

npm install

Running the App
You can run the application in different modes:

# Development mode with file watching
$ npm run start:dev

# Production mode
$ npm run start:prod

# Simple start (without watch)
$ npm run start

Once started, the application will be running on http://localhost:3000.

Running Tests
This project uses Jest for testing. You can run the tests with the following commands:

# Run all unit tests
$ npm run test

# Run end-to-end (e2e) tests
$ npm run test:e2e

# Generate a test coverage report
$ npm run test:cov

API Endpoints
The following table lists the available API endpoints for managing tasks.

| Method | Endpoint      | Description                  |
| :----- | :------------ | :--------------------------- |
| `POST` | `/tasks`      | Create a new task.           |
| `GET`  | `/tasks`      | Get a list of all tasks.     |
| `GET`  | `/tasks/:id`  | Get a single task by its ID. |
| `PATCH`| `/tasks/:id`  | Update a task's details.     |
| `DELETE`| `/tasks/:id` | Delete a task.               |

License
This project is licensed under the MIT License. See the LICENSE file for details.