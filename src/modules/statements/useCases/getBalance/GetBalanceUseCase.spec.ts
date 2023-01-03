import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

describe("Get User Balance", () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let getBalanceUseCase: GetBalanceUseCase;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it("should be able to return the user balance", async () => {
    const { id } = await inMemoryUsersRepository.create({
      name: "Test User",
      email: "test@test.com",
      password: "test",
    });

    await inMemoryStatementsRepository.create({
      user_id: id!,
      type: OperationType.DEPOSIT,
      amount: 5000,
      description: "test description",
    });

    const user = await getBalanceUseCase.execute({ user_id: id! });

    expect(user.balance).toEqual(5000);
    expect(user.statement[0]).toHaveProperty("amount");
    expect(user.statement[0].amount).toEqual(5000);
  });

  it("should not be able to return the user balance if the user does not exists", async () => {
    const id = "inexistentUserId";

    expect(
      async () => await getBalanceUseCase.execute({ user_id: id })
    ).rejects.toBeInstanceOf(GetBalanceError);
  });
});
