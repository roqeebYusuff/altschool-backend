# Blog API
    This is a blog API

## Table of Content
- [Blog API](#blog-api)
  - [Table of Content](#table-of-content)
  - [Requirements](#requirements)
  - [:sparkles: Getting Started](#sparkles-getting-started)
  - [API Routes](#api-routes)
  - [APIs](#apis)
    - [> Signup User](#-signup-user)
  - [Live URL](#live-url)
  - [Testing](#testing)
  - [Contributors](#contributors)


## Requirements
1. User should be able to sign up and sign in
2. Implement basic auth
3. User should be able to get all blogs
4. User should be able to get single blog
5. User should be able to create blog
6. Blog Owner should be able to update blog state
7. Blog owner should be able to delete blog
8. Test application

## :sparkles: Getting Started   
1. Clone Repository
    ```bash
    git clone https://github.com/roqeebYusuff/altschool-backend
    ```
2. Chnage working directory
   ```bash
    cd altschool-backend
   ```
3. Install Dependencies
   ```bash
   yarn add
   ```
   or
   ```bash 
   npm install
   ```
4. Start Server
    ```bash
    yarn start
    ```
    or
    ```bash
    npm start
    ```

    :sparkles: You are all set
## API Routes

The route prefix is `/api` by default.

| Route                | Description                                                        |
| -------------------- | ------------------------------------------------------------------ |
| **/api**             | Shows us the name, description and the version of the package.json |
| **/user**            | User Endpoint                                                      |
| **/user/signin**     | User Login route Endpoint                                          |
| **/user/signup**     | User Signup route Endpoint                                         |
| **/blog**            | Blog Endpoint                                                      |
| **/blog/list**       | Shows all the blog                                                 |
| **/blog/create**     | Blog Create route Endpoint                                         |
| **/blog/update/:id** | Blog Update route Endpoint                                         |
| **/blog/delete/:id** | Blog Delete route Endpoint                                         |

## APIs
### > Signup User
- Route: /signup
- Method: POST
- Body:
    ```
    {
        "first_name": "User First Name",
        "last_name": "User Last Name",
        "username": "user",
        "email": "email@mail.com",
        "password": "password"
    }
    ```
- Response: 
  Success
    ```
    {
        message: 'Signup successful',
        user: {
            "first_name": "User First Name",
            "last_name": "User Last Name",
            "username": "user",
            "email": "email@mail.com",
            "password": "password"
        }
    }
    ```

## Live URL
The API is hosted live [here](https://google.com)

## Testing

## Contributors
- Roqeeb Yusuff