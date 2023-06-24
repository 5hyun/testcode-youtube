// 이거를 해줘야 type 정보를 확인할 수 있다.
/// <reference types="cypress" />
import "@testing-library/cypress/add-commands";

describe("Youtube App", () => {
  // beforeEach에서 사이트에 접속하도록 만들어준다.
  beforeEach(() => {
    // baseUrl을 설정해서 "/" 이렇게만 해줘도 메인으로 감
    cy.visit("/");
  });

  it("renders", () => {
    //Youtube라는 텍스트가 있는지 확인
    cy.findByText("Youtube").should("exist");
  });
});
