import dotenv from 'dotenv';
dotenv.config();

import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { ICreateUserDTO } from '../createUser/ICreateUserDTO';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';
import { IncorrectEmailOrPasswordError } from './IncorrectEmailOrPasswordError';

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;


describe("Authenticate User", () => {

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  })

  it("Should be able to authenticate an user", async () => {
    const user: ICreateUserDTO = {
      name: 'jeandson',
      email: 'jeandsonbraz@gmail.com',
      password: '123456'
    }

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })

    expect(result).toHaveProperty("token");
    expect(result).toHaveProperty("user");
  });

  it("Should not be able to authenticate an none exists user", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "inexistent@email.com.br",
        password: "123456"
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("Should not be able to authenticate with incorrect email", () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "jeandsontb",
        email: "jeandsontb@gmail.com",
        password: "123456"
      }

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: "incorrect@email.com.br",
        password: user.password
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("Should not be able to authenticate with incorrect password", () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "jeandsontb",
        email: "jeandsontb@gmail.com",
        password: "123456"
      }

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "incorrectPassword"
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
