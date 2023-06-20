import { MemoryRouter, Routes } from "react-router-dom";

export function withRouter(routes, initialEntries = "/") {
  return (
    <MemoryRouter initialEntries={[initialEntries]}>
      <Routes>{routes}</Routes>
    </MemoryRouter>
  );
}
