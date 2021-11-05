import { container, inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType, Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { BalanceError, ReceiverError, SenderError } from "./CreateTransferError";
import { ICreateTransferDTO } from "./ICreateTransferDTO";

@injectable()
class CreateTransferUseCase {

  constructor(
    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository,
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ){}

  async execute({amount, description, sender_id, receiver_id}: ICreateTransferDTO): Promise<Statement> {

    if(amount <= 0) {
      throw new AppError("The value entered must be greater than 0.00")
    }

    const sender = await this.usersRepository.findById(sender_id);

    if(!sender) {
      throw new SenderError()
    }

    const receiver = await this.usersRepository.findById(receiver_id);

    if(!receiver) {
      throw new ReceiverError();
    }

    const senderTransfer = await this.statementsRepository.getUserBalance({
      user_id: sender_id,
    });

    if(amount > senderTransfer.balance) {
      throw new BalanceError();
    }

    await this.statementsRepository.create({
      user_id: sender_id,
      type: OperationType.WITHDRAW,
      amount,
      description: `Transfer to ${receiver.name} of ${description}`
    });

    const transfer_statement = await this.statementsRepository.create({
      user_id: receiver_id,
      sender_id: sender_id,
      type: OperationType.TRANSFER,
      amount,
      description
    });

    return transfer_statement;

  }
}

export {CreateTransferUseCase};
