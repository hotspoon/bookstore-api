// // db.providers.ts
// import { neon } from '@neondatabase/serverless';
// import { drizzle } from 'drizzle-orm/neon-http';
// import { Provider } from '@nestjs/common';

// export const dbProvider: Provider = {
//   provide: 'DATABASE_CONNECTION',
//   useFactory: () => {
//     const sql = neon(process.env.DATABASE_URL!);
//     return drizzle(sql);
//   },
// };
