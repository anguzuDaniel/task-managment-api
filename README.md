# Task Manager API

## Overview

The Task Manager API provides endpoints for managing tasks, including creating, retrieving, updating, and deleting tasks. It also supports advanced features such as searching, analytics, attachments, and comments.

## Base URL

```
http://localhost:3000/api/v1
```

## Authentication

Authentication is required for certain endpoints to ensure data security. Authentication is implemented using sessions and Passport.js with a Local Strategy.

### Endpoints Requiring Authentication

- `/tasks` (POST, DELETE, PUT)
- `/tasks/:id` (DELETE, PUT)

## Endpoints

### GET /tasks

Retrieve paginated list of tasks.

#### Parameters

- `page` (optional, default: 1) - Page number for pagination.
- `limit` (optional, default: 10) - Number of tasks per page.
- `title` (optional) - Filter tasks by title.
- `completed` (optional) - Filter tasks by completion status (true/false).
- `dueDate` (optional) - Filter tasks by due date.
- `tags` (optional) - Filter tasks by tags.

#### Response

```json
{
  "docs": [
    {
      "_id": "task_id",
      "title": "Task title",
      "description": "Task description",
      "completed": false,
      "createdAt": "2024-04-16T12:00:00.000Z",
      "updatedAt": "2024-04-16T12:00:00.000Z",
      "tags": ["tag1", "tag2"],
      "dueDate": "2024-04-20T12:00:00.000Z",
      "reminders": ["2024-04-19T12:00:00.000Z"],
      "notifications": ["2024-04-18T12:00:00.000Z"]
    }
  ],
  "totalDocs": 1,
  "limit": 10,
  "page": 1,
  "totalPages": 1,
  "pagingCounter": 1,
  "hasPrevPage": false,
  "hasNextPage": false,
  "prevPage": null,
  "nextPage": null
}
```

### POST /tasks

Create a new task.

#### Request Body

```json
{
  "title": "Task title",
  "description": "Task description",
  "tags": ["tag1", "tag2"],
  "dueDate": "2024-04-20T12:00:00.000Z",
  "reminders": ["2024-04-19T12:00:00.000Z"],
  "notifications": ["2024-04-18T12:00:00.000Z"]
}
```

#### Response

```json
{
  "_id": "task_id",
  "title": "Task title",
  "description": "Task description",
  "completed": false,
  "createdAt": "2024-04-16T12:00:00.000Z",
  "updatedAt": "2024-04-16T12:00:00.000Z",
  "tags": ["tag1", "tag2"],
  "dueDate": "2024-04-20T12:00:00.000Z",
  "reminders": ["2024-04-19T12:00:00.000Z"],
  "notifications": ["2024-04-18T12:00:00.000Z"]
}
```

### GET /tasks/:id

Retrieve a specific task by its ID.

#### Response

```json
{
  "_id": "task_id",
  "title": "Task title",
  "description": "Task description",
  "completed": false,
  "createdAt": "2024-04-16T12:00:00.000Z",
  "updatedAt": "2024-04-16T12:00:00.000Z",
  "tags": ["tag1", "tag2"],
  "dueDate": "2024-04-20T12:00:00.000Z",
  "reminders": ["2024-04-19T12:00:00.000Z"],
  "notifications": ["2024-04-18T12:00:00.000Z"]
}
```

### DELETE /tasks/:id

Delete a task by its ID.

#### Response

```json
{
  "message": "Task deleted successfully"
}
```

## Running Locally

1. Clone the repository.
2. Install dependencies: `npm install`.
3. Start the server: `npm start`.

## Dependencies

- Express.js
- Mongoose
- Passport.js
- Joi (for validation)
- Connect-Mongo (for session storage)

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License -
=======

## Task Manager API Documentation

### Retrieve Tasks
Retrieve a list of tasks from the server.

- **URL:** `/api/v1/tasks`
- **Method:** `GET`
- **Authentication:** Required (User must be logged in)
- **Response:**
  - **Status Code:** 200 OK
  - **Body:** Array of task objects
    ```json
    [
      {
        "completed": false,
        "_id": "661c63aaad43f26e29842acb",
        "name": "Task 1",
        "description": "Description of task 1",
        "createdAt": "2024-04-16T12:19:15.685Z"
      },
      {
        "completed": false,
        "_id": "661c63aaad43f26e29842acc",
        "name": "Task 2",
        "description": "Description of task 2",
        "createdAt": "2024-04-16T12:19:15.685Z"
      },
      {
        "completed": false,
        "_id": "661d2826206ec49ada047118",
        "name": "Task 1",
        "description": "Description of task 1",
        "createdAt": "2024-04-16T12:19:15.685Z"
      },
      {
        "completed": false,
        "_id": "661d2826206ec49ada047119",
        "name": "Task 2",
        "description": "Description of task 2",
        "createdAt": "2024-04-16T12:19:15.685Z"
      }
    ]
    ```
