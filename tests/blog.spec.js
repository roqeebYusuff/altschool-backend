const request = require("supertest");
const { connect } = require("./database");
const app = require("../index");
const BlogModel = require("../src/api/v1/models/blog");
const UserModel = require("../src/api/v1/models/user");

describe("Blog Route", () => {
  let conn;
  let token;

  beforeAll(async () => {
    conn = await connect();

    await UserModel.create({
      first_name: "Roqeeb",
      last_name: "Yusuff",
      username: "roqeeb",
      email: "roqeebyusuff001@gmail.com",
      password: "password",
    });

    const loginResponse = await request(app)
      .post("/login")
      .set("content-type", "application/json")
      .send({
        email: "roqeebyusuff001@gmail.com",
        password: "password",
      });

    token = loginResponse.body.token;
  });

  afterEach(async () => {
    await conn.cleanup();
  });

  afterAll(async () => {
    await conn.disconnect();
  });

  it("should return all blogs", async () => {
    // create blog in database
    await BlogModel.create({
      title: "A title",
      description: "The description",
      tags: [],
      body: "The blog body",
    });

    await BlogModel.create({
      title: "Another title",
      description: "The description",
      tags: [],
      body: "The blog body",
    });

    const response = await request(app)
      .get("/blog/list")
      .set("content-type", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("blogs");
    expect(response.body).toHaveProperty("success", true);
  });

  it("should create a blog", async () => {
    const response = await request(app)
      .get(`/blog/create`)
      .set("content-type", "application/json")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("blog");
    expect(response.body).toHaveProperty("success", true);
  });

  it("should return one blog", async () => {
    // create blog in database
    const blog = await BlogModel.create({
      title: "A title",
      description: "The description",
      tags: [],
      body: "The blog body",
    });

    const response = await request(app)
      .get(`/blog/listOne/${blog._id}`)
      .set("content-type", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("blog");
    expect(response.body).toHaveProperty("success", true);
  });

  it("should return author blog", async () => {
    // create blog in database
    await BlogModel.create({
      title: "A title",
      description: "The description",
      tags: [],
      body: "The blog body",
    });

    const response = await request(app)
      .get("/blog/myBlogs")
      .set("content-type", "application/json")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("blogs");
    expect(response.body).toHaveProperty("success", true);
  });

  it("should Edit one blog", async () => {
    // create blog in database
    const blog = await BlogModel.create({
      title: "A title",
      description: "The description",
      tags: [],
      body: "The blog body",
    });

    const response = await request(app)
      .get(`/blog/update/${blog._id}`)
      .set("content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        state: "published",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("blog");
    expect(response.body).toHaveProperty("success", true);
  });

  it("should delete one blog", async () => {
    // create blog in database
    const blog = await BlogModel.create({
      title: "A title",
      description: "The description",
      tags: [],
      body: "The blog body",
    });

    const response = await request(app)
      .get(`/blog/delete/${blog._id}`)
      .set("content-type", "application/json")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("blog");
    expect(response.body).toHaveProperty("success", true);
  });
});
