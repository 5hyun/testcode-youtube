import { render, screen, waitFor } from "@testing-library/react";
import { Route } from "react-router-dom";
import { fakeVideo, fakeVideos } from "../../tests/videos";
import { withAllContexts, withRouter } from "../../tests/utils";
import Videos from "../Videos";

describe("Videos component", () => {
  // mock 함수
  const fakeYoutube = {
    search: jest.fn(),
  };

  //Videos에서는 사용자가 검색을 하면 검색한 결과를 보여주고, 아니면 인기 동영상들을 보여주고 있다.
  // 따라서 keyword가 있냐 없냐에 따라서 원하는 데이터를 리턴하도록 해놨다.
  beforeEach(() => {
    fakeYoutube.search.mockImplementation((keyword) => {
      return keyword ? [fakeVideo] : fakeVideos;
    });
  });

  afterEach(() => {
    fakeYoutube.search.mockReset();
  });

  // 키워드가 없을 때 모든 데이터를 보여주는지
  // 이 부분도 스냅샷 테스트로 대체가 가능하다.
  it("renders all videos when keyword is not specified", async () => {
    // 키워드 없이 최상위 경로로 들어감
    renderWithPath("/");

    // 아무런 인자가 없이 호출되어야됨
    expect(fakeYoutube.search).toHaveBeenCalledWith(undefined);
    await waitFor(() =>
      expect(screen.getAllByRole("listitem")).toHaveLength(fakeVideos.length)
    );
  });

  // 키워드가 있을 때는 검색한 결과를 보여줘야 한다.
  it("when keyword is specified, renders search results", async () => {
    const searchKeyword = "fake-keyword";
    // 키워드가 있는 경로를 렌더링 해준다.
    renderWithPath(`/${searchKeyword}`);

    // search api가 키워드를 가지고 호출이 되어야 한다.
    expect(fakeYoutube.search).toHaveBeenCalledWith(searchKeyword);
    await waitFor(() => {
      expect(screen.getAllByRole("listitem")).toHaveLength(1);
    });
  });

  it("renders loading state when items are being fetched", async () => {
    renderWithPath("/");

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it("renders error state when fetching items fails", async () => {
    fakeYoutube.search.mockImplementation(async () => {
      throw new Error("error");
    });

    renderWithPath("/");

    await waitFor(() => {
      expect(screen.getByText(/Something is wrong/i)).toBeInTheDocument();
    });
  });

  function renderWithPath(path) {
    return render(
      withAllContexts(
        withRouter(
          <>
            <Route path="/" element={<Videos />} />
            <Route path="/:keyword" element={<Videos />} />
          </>,
          path
        ),
        fakeYoutube
      )
    );
  }
});
