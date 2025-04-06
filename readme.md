# Video Management System

## Overview
This project is a Video Management System built using Node.js, Express, and MongoDB. It allows users to perform CRUD operations on video data, including publishing, updating, and deleting videos. The project also includes user authentication and authorization using JWT.

## Features
- User Authentication and Authorization
- CRUD Operations on Videos
- Publish and Unpublish Videos
- Middleware for JWT Verification
- Error Handling and Validation

## Technologies Used
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)
- Multer (for file uploads)
- Busboy (for handling multipart form data)

## Project Structure


. ├── src │ ├── controllers │ │ └── video.controllers.js │ ├── middleware │ │ └── auth.js │ ├── models │ │ └── video.model.js │ ├── routes │ │ └── user.routes.js │ └── app.js ├── .env ├── package.json └── README.md


## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/videomanagementsystem.git
    cd videomanagementsystem
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add your MongoDB URI and JWT secret:
    ```
    MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/database
    JWT_SECRET=your_jwt_secret
    ```

4. Start the development server:
    ```bash
    npm run dev
    ```

## API Endpoints
- **GET /videos**: Get all videos
- **POST /videos**: Publish a new video
- **GET /videos/:id**: Get a video by ID
- **PUT /videos/:id**: Update a video by ID
- **DELETE /videos/:id**: Delete a video by ID
- **POST /videos/:id/toggle-publish**: Toggle publish status of a video

## Learning Outcomes
Through this project, I learned the following backend development concepts:
- **Setting up a Node.js and Express.js server**: I learned how to create a server using Express.js and handle different routes.
- **Connecting to MongoDB using Mongoose**: I learned how to connect to a MongoDB database and perform CRUD operations using Mongoose.
- **User Authentication and Authorization**: I implemented user authentication and authorization using JWT, learning how to protect routes and handle user sessions.
- **File Uploads**: I learned how to handle file uploads using Multer and Busboy, ensuring that files are correctly processed and stored.
- **Middleware**: I created custom middleware for JWT verification, learning how to intercept and process requests before they reach the route handlers.
- **Error Handling and Validation**: I implemented error handling and validation to ensure that the API responds with appropriate error messages and status codes.

## Contributing
If you would like to contribute to this project, please fork the repository and submit a pull request.

## License
This project is licensed under the Chai aur Code License.
