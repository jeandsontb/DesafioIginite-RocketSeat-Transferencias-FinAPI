import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";


let usersRepository: IUsersRepository;
let getStatementRepository: IStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;


describe("Get Balances", () => {

  enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    getStatementRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      getStatementRepository,
      usersRepository,
    );
  });

  it("Should be able to get balance", async () => {
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

    const withdrawCredit = await getStatementRepository.create({
      description: "withdraw one",
      amount: 50,
      type: OperationType.WITHDRAW,
      user_id: user.id as string
    });

    const result = await getBalanceUseCase.execute({
      user_id: user.id as string
    });

    expect(result).toStrictEqual({
      statement: [addCredit, withdrawCredit],
      balance: 30,
    });
  });


  it("should not balance with a non-existent user", async () => {
    expect(async () => {
      await getStatementRepository.create({
        description: "create one",
        amount: 80,
        type: OperationType.DEPOSIT,
        user_id: "user_inexistent"
      });

      await getBalanceUseCase.execute({
        user_id: "user_inexistent"
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
