import {
  render,
  waitForElementToBeRemoved,
  screen,
  waitFor,
} from "@testing-library/react";
import { fakeVideos } from "../../tests/videos";
import { withAllContexts, withRouter } from "../../tests/utils";
import { Route } from "react-router-dom";
import RelatedVideos from "../RelatedVideos";

describe("RelatedVideos", () => {
  const fakeYoutube = {
    relatedVideos: jest.fn(),
  };

  afterEach(() => fakeYoutube.relatedVideos.mockReset());

  it("renders correctly", async () => {
    fakeYoutube.relatedVideos.mockImplementation(() => fakeVideos);
    const { asFragment } = renderRelatedVideos();

    // 데이터를 받아오는 동안은 Loadibg...이 보여져서 로딩이 없어질 때 까지 기다림
    await waitForElementToBeRemoved(screen.queryByText("Loading..."));

    //스냅샷 테스트
    expect(asFragment()).toMatchSnapshot();
  });

  // 관련된 비디오가 나오는지 한번 더 테스트
  it("renders related videos correctly", async () => {
    fakeYoutube.relatedVideos.mockImplementation(() => fakeVideos);
    renderRelatedVideos();

    // video의 id가 같이 전달이 되면서 관련 비디오를 받아왔는지 테스트
    expect(fakeYoutube.relatedVideos).toHaveBeenCalledWith("id");
    // 불러온 데이터 수가 더미 데이터와 동일한지 테스트
    await waitFor(() => {
      expect(screen.getAllByRole("listitem")).toHaveLength(fakeVideos.length);
    });
  });

  it("renders loading", () => {
    fakeYoutube.relatedVideos.mockImplementation(() => fakeVideos);
    renderRelatedVideos();

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders error", async () => {
    fakeYoutube.relatedVideos.mockImplementation(() => {
      throw new Error("error");
    });

    renderRelatedVideos();
    await waitFor(() => {
      expect(screen.getByText("Something is wrong 😖")).toBeInTheDocument();
    });
  });

  function renderRelatedVideos() {
    return render(
      withAllContexts(
        withRouter(<Route path={"/"} element={<RelatedVideos id={"id"} />} />),
        fakeYoutube
      )
    );
  }
});
