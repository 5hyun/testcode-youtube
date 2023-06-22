// 이 페이지에서는 ChannelInfo, RelatedVideos 컴포넌트를 사용하기 때문에 이런식으로 불러온다.
import ChannelInfo from "../../components/ChannelInfo";
import RelatedVideos from "../../components/RelatedVideos";
import { render, screen } from "@testing-library/react";
import { withRouter } from "../../tests/utils";
import { Route } from "react-router-dom";
import VideoDetail from "../VideoDetail";
import { fakeVideo } from "../../tests/videos";

jest.mock("../../components/ChannelInfo");
jest.mock("../../components/RelatedVideos");

describe("VideoDetail", () => {
  //    테스트가 각각 끝날 때 마다 mock을 reset한다.
  afterEach(() => {
    ChannelInfo.mockReset();
    RelatedVideos.mockReset();
  });

  it("renders video item details", () => {
    render(
      withRouter(<Route path={"/"} element={<VideoDetail />} />, {
        pathname: "/",
        state: { video: fakeVideo },
        key: "fake-key",
      })
    );

    const { title, channelId, channelTitle } = fakeVideo.snippet;
    expect(screen.getByText(title)).toBeInTheDocument();

    // VideoDetail에서 사용하는 이 2개의 컴포넌트에 데이터가 잘 전달되는지 테스트
    //  toStrictEqual은 객체의 내용까지 비교한다.
    expect(RelatedVideos.mock.calls[0][0]).toStrictEqual({
      id: fakeVideo.id,
    });
    expect(ChannelInfo.mock.calls[0][0]).toStrictEqual({
      id: channelId,
      name: channelTitle,
    });
  });
});
