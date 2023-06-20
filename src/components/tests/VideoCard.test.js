import { render, screen } from "@testing-library/react";
import VideoCard from "../VideoCard";
import { MemoryRouter } from "react-router-dom";
import { format } from "timeago.js";

describe("VideoCard", () => {
  const video = {
    id: 1,
    snippet: {
      title: "title",
      channelId: "1",
      channelTitle: "channelTitle",
      publishedAt: new Date(),
      thumbnails: {
        medium: {
          url: "http://image/",
        },
      },
    },
  };

  const { title, channelTitle, publishedAt, thumbnails } = video.snippet;

  it("renders video item", () => {
    // render를 통해 테스트하고자 하는 컴포넌트를 불러온다
    render(
      //  VideoCard 컴포넌트에서 Router가 사용되고 있어서 MemoryRouter를 사용한다
      <MemoryRouter>
        <VideoCard video={video} />
      </MemoryRouter>
    );
    //  렌더링을 시키고 확인을 해보면된다.

    // img 역할을 하는 태그를 가져온다.
    const image = screen.getByRole("img");
    //  가져온 태그의 src가 video.snippet.thumbnails.medium.url과 같은지 확인한다.
    expect(image.src).toBe(thumbnails.medium.url);
    //  가져온 태그의 alt가 video.snippet.title과 같은지 확인한다.
    expect(image.alt).toBe(title);

    //  글자들이 잘 있는지 toBeInTheDocument()를 통해 확인한다.
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(channelTitle)).toBeInTheDocument();
    expect(screen.getByText(format(publishedAt))).toBeInTheDocument();
  });
});
