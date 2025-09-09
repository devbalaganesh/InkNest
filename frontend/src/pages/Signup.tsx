import { Auth } from "../components/Auth";
import { Quote } from "../components/Quote";

export const Signup = () => {
  return (
    <div>
      <div className="grid grid-cols-2">
        <Auth />
        <div className="invisible md:visible ">
          <Quote />
        </div>
      </div>
    </div>
  );
};
