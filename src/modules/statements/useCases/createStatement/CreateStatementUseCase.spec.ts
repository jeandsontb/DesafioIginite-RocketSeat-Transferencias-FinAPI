import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase"

let usersRepository: IUsersRepository;
let createStatementRepository: IStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement", () => {

  enum OperationType {
    DEPOSIT = "deposit",
    WITHDRAW = "withdraw",
  }

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createStatementRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepository,
      createStatementRepository
    );
  });

  it("Should be able to credit statement", async () => {

    const user = await usersRepository.create({
      name: "new user",
      email: "new@user.com.br",
      password: "123456"
    });

    const createStatement = await createStatementUseCase.execute({
      description: "create one",
      amount: 80,
      type: OperationType.DEPOSIT,
      user_id: user.id as string
    });

    expect(createStatement).toHaveProperty("id");
  });

  it("should be able of make a withdraw", async () => {
    const user = await usersRepository.create({
      name: "new user",
      email: "new@user.com.br",
      password: "123456"
    });

    await createStatementUseCase.execute({
      description: "create one",
      amount: 120,
      type: OperationType.DEPOSIT,
      user_id: user.id as string
    });

    const withdrawStatement = await createStatementUseCase.execute({
      description: "withdraw one",
      amount: 80,
      type: OperationType.WITHDRAW,
      user_id: user.id as string
    });

    expect(withdrawStatement).toHaveProperty("id");
  });

  it("should not be able to make a withdrawal without sufficient balance", async () => {
    expect(async () => {
      const user = await usersRepository.create({
        name: "new user",
        email: "new@user.com.br",
        password: "123456"
      });

      await createStatementUseCase.execute({
        description: "withdraw one",
        amount: 80,
        type: OperationType.WITHDRAW,
        user_id: user.id as string
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

  it("Should not be able to make a withdraw  with a non-existent user", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        description: "withdraw one",
        amount: 80,
        type: OperationType.WITHDRAW,
        user_id: "user_inexistent"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });
});
