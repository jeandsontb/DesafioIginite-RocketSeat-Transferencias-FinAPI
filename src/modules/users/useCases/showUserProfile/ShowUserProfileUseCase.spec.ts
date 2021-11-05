import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository"
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepository: IUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });

  it("Should be able to show a user", async () => {
    const user = await usersRepository.create({
      name: "jeandson",
      email: "jeandsontb@gmail.com",
      password: "123456"
    });

    const result = await showUserProfileUseCase.execute(user.id as string);

    expect(result).toBe(user);
  })

  it("Should not be able user inexistent", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("id-not-exists");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  })
})
