import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

describe("Create User", () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create an user", async () => {
    const user = await createUserUseCase.execute({
      name: "TestUser",
      email: "test@test.com",
      password: "test",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create an user that is already registered", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "TestUser",
        email: "test@test.com",
        password: "test",
      });

      await createUserUseCase.execute({
        name: "TestUser",
        email: "test@test.com",
        password: "test",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
