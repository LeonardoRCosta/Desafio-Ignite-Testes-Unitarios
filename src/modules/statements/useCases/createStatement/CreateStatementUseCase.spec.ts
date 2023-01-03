import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

describe("Create Statement", () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let createStatementUseCase: CreateStatementUseCase;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to create a deposit statement", async () => {
    const { id } = await inMemoryUsersRepository.create({
      name: "TestUser",
      password: "test",
      email: "test@test.com",
    });

    const statementOperation = await createStatementUseCase.execute({
      user_id: id!,
      type: OperationType.DEPOSIT,
      amount: 500,
      description: "Test deposit description",
    });

    expect(statementOperation).toBeTruthy();
    expect(statementOperation).toHaveProperty("id");
  });

  it("should not be able to create a withdraw statement without sufficient balance", async () => {
    const { id } = await inMemoryUsersRepository.create({
      name: "TestUser",
      password: "test",
      email: "test@test.com",
    });

    expect(async () => {
      await createStatementUseCase.execute({
        user_id: id!,
        type: OperationType.WITHDRAW,
        amount: 150,
        description: "Test withdraw description",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

  it("should not be able to create a statement without an existent user", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "invalidUserId",
        type: OperationType.WITHDRAW,
        amount: 150,
        description: "Test withdraw description",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });
});
