import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

describe("Authenticate User", () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let createUserUseCase: CreateUserUseCase;
  let authenticateUserUseCase: AuthenticateUserUseCase;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able to authenticate an user", async () => {
    await createUserUseCase.execute({
      name: "Test",
      email: "test@test.com",
      password: "test",
    });

    const authenticatedUser = await authenticateUserUseCase.execute({
      email: "test@test.com",
      password: "test",
    });

    expect(authenticatedUser).toHaveProperty("user");
    expect(authenticatedUser).toHaveProperty("token");
  });

  it("should not be able to authenticate an non registered user", async () => {
    expect(
      async () =>
        await authenticateUserUseCase.execute({
          email: "example@example.com",
          password: "test",
        })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate an user with the wrong email", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "Test",
        email: "test@test.com",
        password: "test",
      });

      await authenticateUserUseCase.execute({
        email: "invalidEmail@email.com",
        password: "test",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate an user with the wrong password", async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "Test",
        email: "test@test.com",
        password: "test",
      });

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "invalidPassword",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
