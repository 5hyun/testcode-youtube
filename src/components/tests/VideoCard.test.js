import { render, screen } from "@testing-library/react";
import VideoCard from "../VideoCard";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { format } from "timeago.js";
import userEvent from "@testing-library/user-event";

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

  it("navigates to detailed video page with video state when clicked", () => {
    // Location의 상태를 표현할 수 있는 컴포넌트(테스트용 함수 컴포넌트), 즉 네비게이션을 통해 이동할 때 같이 따라 온 데이터를 임의의 보여주트
    function LocationStateDisplay() {
      //  Router에서 받아온 state를 보여준다.
      return <pre>{JSON.stringify(useLocation().state)}</pre>;
    }

    render(
      //  initialEntries는 처음에 시작하는 경로
      <MemoryRouter initialEntries={["/"]}>
        {/*네비게이션 역할 때문에 Routes 사용*/}
        <Routes>
          <Route path={"/"} element={<VideoCard video={video} />} />
          {/* 클릭했을때 이동 할 라우터 */}
          <Route
            path={`/videos/watch/${video.id}`}
            element={<LocationStateDisplay />}
          />
        </Routes>
      </MemoryRouter>
    );

    // listitem은 li를 의미한다.
    const card = screen.getByRole("listitem");
    //  클릭 이벤트를 발생시킨다.
    userEvent.click(card);

    //  클릭이되면 페이지 경로가 바뀐다. 따라서 video가 화면 안애 있는지 확인하면 된다.
    expect(screen.getByText(JSON.stringify({ video }))).toBeInTheDocument();
  });
});
