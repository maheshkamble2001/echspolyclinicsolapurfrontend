// Local Imports
import Logo from "/public/vishwalogo.png";
import { Progress } from "components/ui";

// ----------------------------------------------------------------------

export function SplashScreen() {
  return (
    <div className="fixed grid h-full w-full place-content-center">
      <div className="flex items-center gap-3">
        <div className="h-8 w-1 bg-[#F11D1F] rounded-full" />
        <span className="text-lg font-semibold text-black">
          My Application
        </span>
      </div>
      <Progress
        color="primary"
        isIndeterminate
        animationDuration="1s"
        className="mt-2 h-1"
      />
    </div>
  );
}
