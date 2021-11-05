import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";


let usersRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create a user", () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  })

  it("Should be able to create a user", async () => {
    const user = await createUserUseCase.execute({
      name: "user1",
      email: "user1@email.com",
      password: "123456"
    })

    expect(user).toHaveProperty("id");
  });

  it("Should does not be able to create a double equals user", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "user2",
        email: "user2@email.com",
        password: "123456"
      });

      await createUserUseCase.execute({
        name: "user2",
        email: "user2@email.com",
        password: "123456"
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
