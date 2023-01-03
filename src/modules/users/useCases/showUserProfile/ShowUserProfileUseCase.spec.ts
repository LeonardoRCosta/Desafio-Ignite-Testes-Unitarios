import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

describe("Show User Profile", () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let showUserProfileUseCase: ShowUserProfileUseCase;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able to show the user profile", async () => {
    const { id } = await inMemoryUsersRepository.create({
      name: "test",
      email: "test@test.com",
      password: "test",
    });

    const userProfile = await showUserProfileUseCase.execute(id!);

    expect(userProfile).toHaveProperty("name");
    expect(userProfile).toHaveProperty("id");
  });
});
