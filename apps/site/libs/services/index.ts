import { FileService } from './file';

export * as PostService from './post';
export * as UserService from './user';

export * from './post';
export * from './user';

export const fileService = new FileService();
