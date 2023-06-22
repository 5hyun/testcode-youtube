import { MemoryRouter, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { YoutubeApiContext } from "../context/YoutubeApiContext";

export function withRouter(routes, initialEntries = "/") {
  return (
    <MemoryRouter initialEntries={[initialEntries]}>
      <Routes>{routes}</Routes>
    </MemoryRouter>
  );
}

// React Query 테스트를 위한 util
export function withAllContexts(children, youtube) {
  const testClient = createTestQueryClient();
  return (
    <YoutubeApiContext.Provider value={{ youtube }}>
      <QueryClientProvider client={testClient}>{children}</QueryClientProvider>
    </YoutubeApiContext.Provider>
  );
}

// createTestQueryClient는 자신의 개발 환경에 맞게 적절히 세팅할 수 있다.
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {},
    },
  });
}
