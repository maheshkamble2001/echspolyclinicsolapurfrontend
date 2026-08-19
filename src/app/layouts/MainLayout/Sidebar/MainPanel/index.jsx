// Import Dependencies
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router";
import clsx from "clsx";

// Local Imports
import Logo from "/public/srlogo.png";
import { Menu } from "./Menu";
import { Item } from "./Menu/Item";
import { Profile } from "../../Profile";
import { useThemeContext } from "app/contexts/theme/context";
import { settings } from "app/navigation/settings";
import { useAuthContext } from "app/contexts/auth/context";

// ----------------------------------------------------------------------

export function MainPanel({ nav, setActiveSegment, activeSegment }) {
  const { cardSkin } = useThemeContext();
    const navigate = useNavigate(); // ✅ Add navigation
   const {role} = useAuthContext();
  return (
    <div className="main-panel">
      <div
        className={clsx(
          " bg-[#1E1E2D] to-black/10 flex h-full w-full flex-col items-center  border-gray-150  dark:border-dark-600/80 ltr:border-r rtl:border-l",
          cardSkin === "shadow" ? "dark:bg-dark-750" : "dark:bg-dark-900",
        )}
      >
        {/* Application Logo */}
        <div className="flex h-15 w-full items-center justify-center bg-white  border-black rounded-b-xl">
          <Link to="/">
            <img src={Logo} alt="App Logo"  className="size-12 text-primary-600 dark:text-primary-400" />
          </Link>
        </div>

     <Menu
      
          // nav={nav}
          nav={nav.filter(n => role.includes(n.role))}
          activeSegment={activeSegment}
             setActiveSegment={(path) => {
            setActiveSegment(path); // Update active segment
            navigate(path);         // ✅ Navigate to clicked route
          }}
          
        />

        {/* Bottom Links */}
        {/* <div className="flex flex-col items-center space-y-3 py-2.5">
          <Item
            id={settings.id}
            component={Link}
            to="/settings/appearance"
            title={"Settings"}
            isActive={activeSegment === settings.path}
            Icon={settings.Icon}
          />
          <Profile />
        </div> */}
      </div>
    </div>
  );
}

MainPanel.propTypes = {
  nav: PropTypes.array,
  setActiveSegment: PropTypes.func,
  activeSegment: PropTypes.string,
};

