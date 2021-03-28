import React, { useContext } from "react";
import {
  GlobalDispatchContext,
  GlobalStateContext,
} from "./Context/GlobalContext";
import ThemeCard from "./Components/ThemeCard";
import Themes from "./themes";

const Theme = () => {
  const { theme: currentTheme } = useContext(GlobalStateContext);
  const dispatch = useContext(GlobalDispatchContext);
  return (
    <div>
      {Object.keys(Themes).map((theme) => (
        <ThemeCard
          themeName={theme}
          selected={currentTheme === theme}
          onClick={() => dispatch({ type: "CHANGE_THEME", payload: theme })}
          themePalette={Themes[theme]}
          key={theme}
        />
      ))}
    </div>
  );
};

export default Theme;
