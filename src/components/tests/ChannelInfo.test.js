import { render, screen, waitFor } from "@testing-library/react";
import { withAllContexts, withRouter } from "../../tests/utils";
import { Route } from "react-router-dom";
import ChannelInfo from "../ChannelInfo";

describe("ChannelInfo", () => {
  const fakeYoutube = {
    // jest에서 제공해주는 mocking 함수
    channelImageURL: jest.fn(),
  };

  // 테스트가 끝날때 마다 Mock 함수를 깨끗하게 정리
  afterEach(() => fakeYoutube.channelImageURL.mockReset());

  it("renders correctly", async () => {
    // 이미지는 통신으로 받아오는거라서 render를 먼저한다. render를 하면 asFragment를 반환해준다.
    const { asFragment } = renderChannelInfoWithCallback(() => "url");

    //  react query는 비동기라서 waitFor을 사용해서 기다려줘야한다. 즉, 이미지나 타나날 때 까지 기다림
    await waitFor(() => screen.getByRole("img"));
    // 반환받은 fragment를 통해 스냅샷을 만든다.
    expect(asFragment()).toMatchSnapshot();
  });

  //  url을 가지고 오지 못한 경우
  it("renders without URL", () => {
    renderChannelInfoWithCallback(() => {
      throw new Error("error");
    });

    //
    expect(screen.queryByRole("img")).toBeNull();
  });

  //  URL이 있으면 이미지가 반드시 보여야 한다는 테스트
  // 이 부분은 스냅샷 테스트를 하기 때문에 굳이 안해도 되지만 테스트를 좀 더 명시적으로 하고싶을때 하면 된다.
  it("renders with URL", async () => {
    renderChannelInfoWithCallback(() => "url");

    await screen.findByRole("img");
  });

  // 반복되는 render 줄이기 + mockImplementation 반복 줄이기
  function renderChannelInfoWithCallback(callback) {
    fakeYoutube.channelImageURL.mockImplementation(callback);

    return render(
      withAllContexts(
        withRouter(
          <Route
            path={"/"}
            element={<ChannelInfo id={"id"} name={"channel"} />}
          />
        ),
        fakeYoutube
      )
    );
  }
});
