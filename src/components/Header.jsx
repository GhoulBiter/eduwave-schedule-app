import React from "react"
import { SunIcon, MoonIcon } from "./SVGIcons"

function Header({ theme, toggleTheme, showHeader }) {
  return (
    <header className={`header ${showHeader ? "" : "hidden"}`}>
      <div className="header-content">
        <h1>EduWave Scheduler</h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? <MoonIcon /> : <SunIcon />}
        </button>
      </div>
    </header>
  )
}

export default Header
