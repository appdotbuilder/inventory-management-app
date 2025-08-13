import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas and handlers
import { loginInputSchema } from './schema';
import { login } from './handlers/login';
import { logout } from './handlers/logout';
import { verifySession } from './handlers/verify_session';
import { getCurrentUser } from './handlers/get_current_user';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check endpoint
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),
  
  // Login endpoint - only login, no registration
  login: publicProcedure
    .input(loginInputSchema)
    .mutation(({ input }) => login(input)),
  
  // Logout endpoint
  logout: publicProcedure
    .input(z.object({ sessionToken: z.string() }))
    .mutation(({ input }) => logout(input.sessionToken)),
  
  // Verify session endpoint
  verifySession: publicProcedure
    .input(z.object({ sessionToken: z.string() }))
    .query(({ input }) => verifySession(input.sessionToken)),
  
  // Get current user endpoint
  getCurrentUser: publicProcedure
    .input(z.object({ sessionToken: z.string() }))
    .query(({ input }) => getCurrentUser(input.sessionToken)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();