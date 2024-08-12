import { Prisma } from "@prisma/client";

/* --------------->> Generate Search Condition <<----------- */
export const generateSearchCondition = (
  searchTerm: string,
  searchAbleFields: string[]
) => {
  const searchCondition: Prisma.AdminWhereInput[] = searchAbleFields.map(
    (field) => ({
      [field]: {
        contains: searchTerm,
        mode: "insensitive",
      },
    })
  );

  return searchCondition;
};

/* --------------->> Generate Filter Condition <<----------- */
export const generateFilterCondition = <T extends Record<string, unknown>>(
  filterQuery: T
) => {
  const filterCondition: Prisma.AdminWhereInput[] = Object.keys(
    filterQuery
  ).map((field) => ({
    [field]: {
      equals: filterQuery[field],
    },
  }));

  return filterCondition;
};
