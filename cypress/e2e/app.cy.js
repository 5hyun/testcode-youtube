// 이거를 해줘야 type 정보를 확인할 수 있다.
/// <reference types="cypress" />
import "@testing-library/cypress/add-commands";

describe("Youtube App", () => {
  // beforeEach에서 사이트에 접속하도록 만들어준다.
  beforeEach(() => {
    //  intercept은 방문전에 해야한다.
    //  mostPopular이라는 키워드가 들어가면 mock 데이터를 사용하도록 한다.
    cy.intercept("GET", /(mostPopular)/g, {
      fixture: "popular.json",
    });
    // search 키워드 들어가면 mock 데이터를 사용하도록 한다.
    cy.intercept("GET", /(search)/g, {
      fixture: "search.json",
    });

    // 해상도 설정이 가능해서 모바일이냐 컴퓨터나를 구분할 수 있다.
    cy.viewport(1200, 800);

    // baseUrl을 설정해서 "/" 이렇게만 해줘도 메인으로 감
    cy.visit("/");
  });

  it("renders", () => {
    //Youtube라는 텍스트가 있는지 확인
    cy.findByText("Youtube").should("exist");
  });

  //  메인화면에서 비디오들 불러오는거 테스트(popular.json을 받아오는 통신)
  it("shows popular video first", () => {
    cy.findByText("Popular Video").should("exist");
  });

  //  사용자들이 검색하는거 테스트(search.json을 받아오는 통신)
  it("searches by keyword", () => {
    // placeholder에 "Search..."가 있는 input을 받아와서 "bts"를 입력
    cy.findByPlaceholderText("Search...").type("bts");
    //   button 역할을 하는 것을 받아와서 클릭을 발생 시킴
    cy.findByRole("button").click();
    cy.findByText("Search Result1").should("exist");
  });

  //  detail 페이지로 잘 이동하는지 테스트
  it("goes to detail page", () => {
    // listitem의 첫번째 것을 가져와서 클릭
    cy.findAllByRole("listitem").first().click();

    cy.findByTitle("Popular Video").should("exist");
    cy.findByText("Popular Video").should("exist");
    cy.findByText("Search Result1").should("exist");
  });
});
