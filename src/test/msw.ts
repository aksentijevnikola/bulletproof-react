import { setupServer } from "msw/node";

import { handlers, resetMockData } from "@/shared/mocks";

export const server = setupServer(...handlers);

export { resetMockData };
