import { FilterQuery } from "mongoose";

import { IActionToken } from "../interfaces/action-token.interface";
import { ActionToken } from "../models/action-token.model";

//Репозиторій містить методи для створення, пошуку та видалення токенів дій (action tokens)9
class ActionTokenRepository {
  public async create(dto: IActionToken): Promise<IActionToken> {
    return await ActionToken.create(dto);
  }

  public async findByParams(
    params: FilterQuery<IActionToken>,
  ): Promise<IActionToken> {
    return await ActionToken.findOne(params);
  }

  public async deleteByParams(
    params: FilterQuery<IActionToken>,
  ): Promise<void> {
    await ActionToken.deleteMany(params);
  }
}

export const actionTokenRepository = new ActionTokenRepository();
