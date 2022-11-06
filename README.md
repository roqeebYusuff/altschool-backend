# Blog API
This is a blog API

## :telescope: Table of Content <a href="#table-of-content" id="table-of-content"/>

- [Blog API](#blog-api)
  - [:telescope: Table of Content](#table-of-content)
  - [:gear: Requirements](#requirements)
  - [:rocket: Deployment](#deployment)
  - [:earth_africa: Base URL](#base-url)
  - [:sparkles: Getting Started](#getting-started)
  - [:lollipop: Models](#models)
    - [:sunglasses: User](#user)
    - [:book: Blog](#blog)
  - [:flags: API Routes](#api-routes)
  - [:zap: APIs ](#apis)
    - [:tada: Signup User](#signup-user)
    - [:crystal_ball: Signin User ](#signin-user)
    - [:ferris_wheel: Get a Blog (Published Only)](#get-a-blog-published-only)
    - [:sparkler: Get All Blogs(Published Only)](#get-all-blogspublished-only)
    - [:necktie: Get All Author Blogs](#get-all-author-blogs)
    - [:art: Create Blog](#create-blog)
    - [:pencil: Update/Edit Blog](#updateedit-blog)
    - [:wastebasket: Delete Blog](#delete-blog)
  - [:test_tube: Testing](#testing)
  - [:construction_worker: Contributors ](#contributors)

## :gear: Requirements <a href="#requirements" id="requirements"/>

1. User should be able to sign up and sign in
2. Implement basic auth
3. User should be able to get all blogs
4. User should be able to get single blog
5. User should be able to create blog
6. Blog Owner should be able to update blog state
7. Blog owner should be able to delete blog
8. Test application

## :rocket: Deployment <a href="#deployment" id="deployment"/>
The API is hosted live [here](https://alstschool-blog-api.herokuapp.com/)

## :earth_africa: Base URL <a href="#base-url" id="base-url"/>
[Base URL](https://alstschool-blog-api.herokuapp.com/v1)

## :sparkles: Getting Started <a href="#getting-started" id="getting-started"/>

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

## :lollipop: Models <a href="#models" id="models"/>

### :sunglasses: User <a href="#user" id="user"/>

| field      | Data Type | Constraint             |
| ---------- | --------- | ---------------------- |
| first_name | string    | required               |
| last_name  | string    | required               |
| email      | string    | required               |
| username   | string    | required, unique, trim |
| password   | string    | required               |

### :book: Blog <a href="#blog" id="blog"/>

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

## :flags: API Routes <a href="#api-routes" id="api-routes"/>

<!-- The route prefix is `/api` by default. -->

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

## :zap: APIs <a href="#apis" id="apis"/>

### :tada: Signup User <a href="#signup-user" id="signup-user"/>

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

### :crystal_ball: Signin User <a href="#signin-user" id="signin-user"/>
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

### :ferris_wheel: Get a Blog (Published Only) <a href="#get-a-blogpublished-only" id="get-a-blogpublished-only"/>
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

### :sparkler: Get All Blogs(Published Only) <a href="#get-all-blogspublished-only" id="get-all-blogspublished-only"/>
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

### :necktie: Get All Author Blogs <a href="#get-all-author-blogs" id="get-all-author-blogs"/>
- Route: /blog/myBlogs
- Method: GET
- Header
  - Authorization: Bearer {token}
- Query Params
  - author
  - title
  - tags (default[])
  - page (default: 1)
  - read_count (options: asc | desc, default:desc)
  - reading_time (options: asc | desc, default:desc)
  - timestamp (options: asc | desc, default:desc)
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

### :art: Create Blog <a href="#create-blog" id="create-blog"/>
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

### :pencil: Update/Edit Blog <a href="#updateedit-blog" id="updateedit-blog"/>
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

### :wastebasket: Delete Blog <a href="#delete-blog" id="delete-blog"/>
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


## :test_tube: Testing <a href="#testing" id="testing"/>
 ```bash
  yarn test
```
or
```bash
npm test
```

## :construction_worker: Contributors <a href="#contributors" id="contributors"/>

- Roqeeb Yusuff
