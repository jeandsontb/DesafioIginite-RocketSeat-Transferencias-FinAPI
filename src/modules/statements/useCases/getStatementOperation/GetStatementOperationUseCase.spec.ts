import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";


let usersRepository: IUsersRepository;
let getStatementRepository: IStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation", () => {

  enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    getStatementRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepository,
      getStatementRepository,
    );
  });

  it("Should be able to get the  operation", async () => {
    const user = await usersRepository.create({
      name: "new user",
      email: "new@user.com.br",
      password: "123456"
    });

    const addCredit = await getStatementRepository.create({
      description: "create one",
      amount: 80,
      type: OperationType.DEPOSIT,
      user_id: user.id as string
    });

    const result = await getStatementOperationUseCase.execute({
      statement_id: addCredit.id as string,
      user_id: user.id as string
    });

    expect(result).toBe(addCredit);
  });

  it("Should be able refuse an operation when the user is non-existent", async () => {
    expect(async () => {
      const addCredit = await getStatementRepository.create({
        description: "create one",
        amount: 80,
        type: OperationType.DEPOSIT,
        user_id: "user_inexistent"
      });

      await getStatementOperationUseCase.execute({
        statement_id: addCredit.id as string,
        user_id: "user_inexistent"
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  })


  it("Should be able refuse an operation when the statement is non-existent", async () => {
    expect(async () => {
      const user = await usersRepository.create({
        name: "new user",
        email: "new@user.com.br",
        password: "123456"
      });

      await getStatementOperationUseCase.execute({
        statement_id: "statement_inexistent",
        user_id: user.id as string
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  })
})
