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
    // fakeYoutube에 channelImageURL이 호출되면 mockImplementation을 설정해서 url을 리턴하도록 만든다.
    fakeYoutube.channelImageURL.mockImplementation(() => "url");

    render(
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

    //  react query는 비동기라서 waitFor을 사용해서 기다려줘야한다.
    await waitFor(() => screen.getByText("channel"));
  });
});
