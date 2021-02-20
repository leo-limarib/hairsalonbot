import App from "../../src/app";
import authController from "../../src/authentication/auth.controller";
import userModel from "../../src/authentication/user.model";
const request = require("supertest");

let app = new App([new authController()], 34523);

afterAll(() => {
  userModel.deleteOne({ email: "leoteste@gmail.com" });
});

describe("Authentication", () => {
  it("should return a token and refresh token on success", async () => {
    const response = await request(app.app).post("/auth/signup").send({
      name: "Leonardo Lima Ribeiro",
      email: "leoteste@gmail.com",
      password: "leo160897",
    });
    expect(response.status).toBe(200);
  });

  it("should login with sucess", async () => {
    const response = await request(app.app).post("/auth/login").send({
      email: "leoteste@gmail.com",
      password: "leo160897",
    });
    expect(response.status).toBe(200);
  });
});
