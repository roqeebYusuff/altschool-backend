# Blog API
This is a blog API

## Table of Content

- [Blog API](#blog-api)
  - [Table of Content](#table-of-content)
  - [Requirements](#requirements)
  - [URLs](#urls)
    - [Live URL](#live-url)
    - [Base URL](#base-url)
  - [:sparkles: Getting Started](#sparkles-getting-started)
  - [Models](#models)
    - [User](#user)
    - [Blog](#blog)
  - [API Routes](#api-routes)
  - [APIs](#apis)
    - [Signup User](#signup-user)
    - [Signin User](#signin-user)
    - [Get a Blog (Published Only)](#get-a-blog-published-only)
    - [Get All Blogs(Published Only)](#get-all-blogspublished-only)
    - [Get All Author Blogs](#get-all-author-blogs)
    - [Create Blog](#create-blog)
    - [Update/Edit Blog](#updateedit-blog)
    - [Delete Blog](#delete-blog)
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
   

## URLs

### Live URL
The API is hosted live [here](https://google.com)

### Base URL
[https://google.com](https://google.com)

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

## Models

### User

| field      | Data Type | Constraint             |
| ---------- | --------- | ---------------------- |
| first_name | string    | required               |
| last_name  | string    | required               |
| email      | string    | required               |
| username   | string    | required, unique, trim |
| password   | string    | required               |

### Blog

| field        | Data Type | Constraint                                             |
| ------------ | --------- | ------------------------------------------------------ |
| title        | string    | required, unique                                       |
| description  | string    | required                                               |
| author       | ObjectId  | required                                               |
| state        | string    | required, default: draft, enum: ['draft', 'published'] |
| read_count   | number    | required, default: 0                                   |
| reading_time | number    | required                                               |
| tags         | array     | required                                               |
| body         | string    | required                                               |

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

### Signup User

- Route: /user/signup
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
- Response
  Success
  ```
  {
      success: true,
      user: {
          "first_name": "User First Name",
          "last_name": "User Last Name",
          "username": "user",
          "email": "email@mail.com",
          "password": "password"
      }
  }
  ```

### Signin User
- Route: /user/signin
- Method: POST
- Body:
  ```
  {
    "email": "email@mail.com",
    "password": "password"
  }
  ```
- Response
  Success
  ```
  {
      success: true,
      user,
      token
  }
  ```

### Get a Blog (Published Only)
- Route: /blog/listOne/:id
- Method: GET
- Response
  Success
  ```
  {
    success: true
    blog
  }
  ```

### Get All Blogs(Published Only)
- Route: /blog/list
- Method: GET
- Query Params
    - page (default: 1)
    - timestamp (options: asc | desc, default:desc)
    - read_count (options: asc | desc, default:desc)
    - timestamp (options: asc | desc, default:desc)
    - author
    - title
    - tags
- Response
  Success
  ```
  {
    success: true,
    blogs,
    totalBlogs: 51,
    totalPages: 3,
    page: 1,
    perPage: 20,
    hasPrevPage: false,
    hasNexPage: true
  }
  ```

### Get All Author Blogs
- Route: /blog/myBlogs
- Method: GET
- Header
  - Authorization: Bearer {token}
- Query Params
  - state (options: draft | published)
- Response
  Success
  ```
  {
    success: true,
    blogs,
    totalBlogs: 51,
    totalPages: 3,
    page: 1,
    perPage: 20,
    hasPrevPage: false,
    hasNexPage: true
  }
  ```

### Create Blog
- Route: /blog/create
- Method: POST
- Header
  - Authorization: Bearer {token}
- Body:
  ```
  {
    "title": "A title",
    "description": "The description",
    "tags": [],
    "body": "The blog body"
  }
  ```
- Response
  Success
  ```
  {
    success: true,
    blog: {
        "title": "A title",
        "description": "The description",
        "state": "draft",
        "read_count": 0,
        "reading_time": 1,
        "tags": [],
        "body": "The blog body",
        "createdAt": "2022-11-02T14:02:56.585Z",
        "updatedAt": "2022-11-02T14:02:56.585Z",
    }
  }
  ```

### Update/Edit Blog
- Route: /blog/edit/:id
- Method: PATCH
- Header
  - Authorization: Bearer {token}
- Body
  ```
  {
    state: '',
    title: '',
    description: '',
    body: '',
    tags: []
  }
  ```
- Response
   Success
  ```
  {
    success: true,
    blog
  }
  ```

### Delete Blog
- Route: /blog/delete/:id
- Method: DELETE
- Header
  - Authorization: Bearer {token}
- Response
  ```
  {
    success: true,
    blog
  }
  ```


## Testing

## Contributors

- Roqeeb Yusuff
