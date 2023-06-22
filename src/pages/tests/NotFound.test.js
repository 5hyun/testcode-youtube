import { withRouter } from "../../tests/utils";
import { Route } from "react-router-dom";
import renderer from "react-test-renderer";
import NotFound from "../NotFound";

describe("NotFound", () => {
  it("renders correctly", () => {
    const component = renderer.create(
      withRouter(<Route path={"/"} element={<NotFound />} />)
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
