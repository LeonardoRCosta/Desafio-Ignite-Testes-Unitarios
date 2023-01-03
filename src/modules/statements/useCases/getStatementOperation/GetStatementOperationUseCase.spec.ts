import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

describe("Get Statement Operation", () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let getStatementOperationUseCase: GetStatementOperationUseCase;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to get the statement operation", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Test User",
      email: "test@test.com",
      password: "test",
    });

    const statement = await inMemoryStatementsRepository.create({
      user_id: user.id!,
      type: OperationType.DEPOSIT,
      amount: 2500,
      description: "test description",
    });

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id!,
      statement_id: statement.id!,
    });

    expect(statementOperation).toHaveProperty("id");
    expect(statementOperation).toHaveProperty("user_id");
    expect(statementOperation.amount).toEqual(2500);
    expect(statementOperation.type).toBe("deposit");
  });

  it("should not be able to get the statement operation if the statement does not exists", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Test User",
      email: "test@test.com",
      password: "test",
    });

    expect(
      async () =>
        await getStatementOperationUseCase.execute({
          user_id: user.id!,
          statement_id: "invalidStatementId",
        })
    ).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });

  it("should not be able to get the statement operation if the user does not exists", async () => {
    expect(
      async () =>
        await getStatementOperationUseCase.execute({
          user_id: "invalidUserId",
          statement_id: "test",
        })
    ).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });
});
