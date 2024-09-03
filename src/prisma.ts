
import { PrismaClient } from '@prisma/client';

const dbClient = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'stdout',
      level: 'error',
    },
    {
      emit: 'stdout',
      level: 'info',
    },
    {
      emit: 'stdout',
      level: 'warn',
    },
  ],
});

/* dbClient.$on('query', (e) => {
  console.log(
    '=====================================START=========================================',
  );
  console.info('Query: ' + e.query);
  console.log(
    '-----------------------------------------------------------------------------',
  );
  console.info('Params: ' + e.params);
  console.log(
    '-----------------------------------------------------------------------------',
  );
  console.info('Duration: ' + e.duration + 'ms');
  console.log(
    '======================================END=======================================',
  );
}); */

export default dbClient;
