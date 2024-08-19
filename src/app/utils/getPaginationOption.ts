export interface IPaginationOptions {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: 'desc' | 'asc';
}

const getPaginationOptions = (
  query: Record<string, unknown>,
): IPaginationOptions => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy = (query.sortBy || 'createdAt') as string;
  const sortOrder = (query.sortOrder || 'desc') as 'desc' | 'asc';

  return { page, limit, skip, sortBy, sortOrder };
};

export default getPaginationOptions;
