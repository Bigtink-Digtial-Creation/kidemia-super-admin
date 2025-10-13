import { NavLink } from "react-router";
import { AuthRoutes } from "../../routes";

export default function ErrorPage() {
  return (
    <section className="text-center h-screen flex items-center justify-center flex-col">
      <div className="space-y-6">
        <h1 className="text-6xl font-semibold text-enita-red">404</h1>
        <p className="text-lg text-kidemia-grey">
          Oops! Looks like you're lost.
        </p>

        <div className="animate-bounce">
          <svg
            className="mx-auto h-16 w-16 text-red"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#BF4C20"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            ></path>
          </svg>
        </div>

        <p className="text-kidemia-grey">
          Let's get you back{" "}
          <NavLink
            to={AuthRoutes.login}
            className="text-kidemia-primary font-bold underline"
          >
            home
          </NavLink>
          .
        </p>
      </div>
    </section>
  );
}
