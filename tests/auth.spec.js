const request = require("supertest");
const { connect } = require("./db");
const UserModel = require("../src/api/v1/models/user");
const app = require("../index");

describe("Authentication", () => {
  let conn;

  beforeAll(async () => {
    conn = await connect();
  });

  afterEach(async () => {
    await conn.cleanup();
  });

  afterAll(async () => {
    await conn.disconnect();
  });

  it("should signup a user", async () => {
    const response = await request(app)
      .post("/user/signup")
      .set("content-type", "application/json")
      .send({
        first_name: "Roqeeb",
        last_name: "Yusuff",
        username: "roqeeb",
        email: "roqeebyusuff@gmail.com",
        password: "password",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("success");
    expect(response.body).toHaveProperty("user");
  });

  it("should login a user", async () => {
    // create user in out db
    const user = await UserModel.create({
      email: "roqeebyusuff@gmail.com",
      password: "password",
    });

    // login user
    const response = await request(app)
      .post("/user/signin")
      .set("content-type", "application/json")
      .send({
        username: "roqeebyusuff@gmail.com",
        password: "password",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("success");
    expect(response.body).toHaveProperty("user");
    expect(response.body).toHaveProperty("token");
  });
});
