import { withRouter } from "../../tests/utils";
import { Route } from "react-router-dom";
import renderer from "react-test-renderer";
import SearchHeader from "../SearchHeader";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("SearchHeader", () => {
  // 스냅샷 테스트
  it("renders correctly", () => {
    const component = renderer.create(
      withRouter(<Route path="/" element={<SearchHeader />} />)
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  //  bts를 입력하면 잘 검색이 되는지 테스트
  it("renders with keyword correctly", async () => {
    render(
      withRouter(
        <Route path={"/:keyword"} element={<SearchHeader />} />,
        "/bts"
      )
    );
    // 입력 폼에서 표시되는 value가 bts인지 확인
    expect(screen.getByDisplayValue("bts")).toBeInTheDocument();
  });

  // 입력 폼에 키워드를 넣고 클릭한 경우 테스트
  it("navigates to results page on search button click", () => {
    const searchKeyword = "fake-keyword";

    render(
      withRouter(
        <>
          <Route path={"/home"} element={<SearchHeader />} />
          <Route
            path={`/videos/${searchKeyword}`}
            // 임의의 element가 보여지도록 만듬
            element={<p>{`Search result for ${searchKeyword}`}</p>}
          />
        </>,
        "/home"
      )
    );

    // button과 입력 폼을 가지고온다.
    const searchButton = screen.getByRole("button");
    const searchInput = screen.getByRole("textbox");

    //  입력폼에 searchKeyword를 넣고 버튼을 클릭한다.
    userEvent.type(searchInput, searchKeyword);
    userEvent.click(searchButton);

    //  다 되면 위에서 임의로 설정한 element가 보여지는지 확인한다.
    expect(
      screen.getByText(`Search result for ${searchKeyword}`)
    ).toBeInTheDocument();
  });
});
