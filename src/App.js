import React, { useState, useEffect } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import generateRandomColor from "./utils/generateRandomColors"
import {
  extractEventData,
  transformToFullCalendarEvents,
} from "./utils/eventUtils"
import EventInput from "./components/EventInput"
import { useTheme } from "./components/ThemeContext"
import Header from "./components/Header"
import "./App.css"

function App() {
  const [numberOfEvents, setNumberOfEvents] = useState(0)
  const [events, setEvents] = useState([])
  const [processedData, setProcessedData] = useState([])
  const [calendarEvents, setCalendarEvents] = useState([])
  const { theme, toggleTheme } = useTheme()
  const [showHeader, setShowHeader] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    // This will apply the theme attribute to the body, which controls the CSS theming.
    document.body.setAttribute("data-theme", theme)
  }, [theme])

  useEffect(() => {
    setCalendarEvents(
      transformToFullCalendarEvents(processedData, generateRandomColor)
    )
  }, [processedData])

  // Header bar interaction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY) {
        // Scrolling down
        setShowHeader(false)
      } else {
        // Scrolling up
        setShowHeader(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [lastScrollY])

  const handleNumberOfEventsChange = (value) => {
    const numOfEvents = Number(value)
    setEvents(
      Array.from({ length: numOfEvents }, () => ({ name: "", schedule: "" }))
    )
    setNumberOfEvents(value)
  }

  const handleEventChange = (index, key, value) => {
    const newEvents = [...events]
    newEvents[index] = {
      ...newEvents[index],
      [key]: value,
    }
    setEvents(newEvents)
  }

  const processSchedules = () => {
    const newProcessedData = events.map((event) => {
      const parsedData = extractEventData(event.schedule)
      return {
        name: event.name,
        data: parsedData,
      }
    })
    setProcessedData(newProcessedData)
  }

  return (
    <div className="App">
      <Header theme={theme} toggleTheme={toggleTheme} showHeader={showHeader} />

      <div className="num-courses-input-group">
        <label>Number of Events:</label>
        <input
          name="numberOfCourses"
          type="number"
          value={numberOfEvents}
          onChange={(e) => handleNumberOfEventsChange(e.target.value)}
        />
      </div>

      <div className="inputs-container">
        {events.map((event, index) => (
          <EventInput
            key={index}
            index={index}
            event={event}
            handleEventChange={handleEventChange}
          />
        ))}

        <button onClick={processSchedules}>Process Schedules</button>
      </div>

      {processedData.length > 0 && (
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={calendarEvents}
          headerToolbar={{
            start: "today prev,next",
            center: "title",
            end: "dayGridMonth,dayGridWeek,dayGridDay",
          }}
          height={"calc(100vh - 40px)"}
        />
      )}
    </div>
  )
}

export default App
