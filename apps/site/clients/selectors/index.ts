import { ModelContextType } from '../context/model-context';

export const getLoginUser = (ctx: ModelContextType) => ctx.model.user;
