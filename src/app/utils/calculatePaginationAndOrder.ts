interface IOptions {
  page?: number;
  limit?: number;
  sortOrder?: string;
  sortBy?: string;
}

interface IOptionsResult {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}

const calculatePaginationAndOrder = (options: IOptions): IOptionsResult => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;

  const sortBy: string = options.sortBy || "createdAt";
  const sortOrder: string = options.sortOrder || "desc";

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export default calculatePaginationAndOrder;
