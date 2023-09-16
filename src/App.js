import React, { useState, useEffect } from "react"
import "./App.css"
// import CalendarView from './components/calendar';
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import moment from "moment"
import generateRandomColor from "./utils/generateRandomColors"

function App() {
  const [numberOfEvents, setNumberOfEvents] = useState(0)
  const [events, setEvents] = useState([])
  const [processedData, setProcessedData] = useState([])
  const [calendarEvents, setCalendarEvents] = useState([])

  useEffect(() => {
    setCalendarEvents(transformToFullCalendarEvents(processedData))
  }, [processedData])

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
      const lines = event.schedule.split("\n")
      const parsedData = {}

      lines.forEach((line) => {
        const dateMatch = line.match(/^(\w{3})\((\d{2}\/\d{2}\/\d{4})\)/)
        const timeMatch = line.match(
          /:: (\d{2}:\d{2} [APM]{2}) - (\d{2}:\d{2} [APM]{2})::/
        )

        if (dateMatch && timeMatch) {
          const dayOfWeek = dateMatch[1]
          const date = dateMatch[2]
          const startTime = timeMatch[1]
          const endTime = timeMatch[2]

          if (!parsedData[date]) {
            parsedData[date] = []
          }

          parsedData[date].push({
            dayOfWeek,
            startTime,
            endTime,
          })
        }
      })

      return {
        name: event.name,
        data: parsedData,
      }
    })

    setProcessedData(newProcessedData)
    console.log(newProcessedData)
  }

  const transformToFullCalendarEvents = (data) => {
    const events = []
    const titleColorMapping = {}

    data.forEach((eventItem) => {
      Object.entries(eventItem.data).forEach(([date, times]) => {
        // console.log(date)
        // console.log(times)
        times.forEach((time) => {
          const startDateTime = moment(
            `${date} ${time.startTime}`,
            "DD/MM/YYYY hh:mm A"
          ).toDate()
          const endDateTime = moment(
            `${date} ${time.endTime}`,
            "DD/MM/YYYY hh:mm A"
          ).toDate()

          // console.log(time)
          // console.log(typeof(date))
          // console.log(startDateTime)
          // console.log(endDateTime)
          if (startDateTime === "Invalid date") {
            console.log("Start date is invalid, " + startDateTime)
          }
          if (endDateTime === "Invalid date") {
            console.log("End date is invalid, " + endDateTime)
          }

          // Assign a color if not already assigned
          if (!titleColorMapping[eventItem.name]) {
            titleColorMapping[eventItem.name] = generateRandomColor()
          }

          events.push({
            title: eventItem.name,
            start: startDateTime,
            end: endDateTime,
            backgroundColor: titleColorMapping[eventItem.name],
            display: "block",
          })
        })
      })
    })

    // console.log(events)

    return events
  }

  return (
    <div className="App">
      <div className="inputs-container">
        <label>
          Number of Events:
          <input
            name="numberOfCourses"
            type="number"
            value={numberOfEvents}
            onChange={(e) => {
              const numOfEvents = Number(e.target.value)
              const newEvents = Array.from({ length: numOfEvents }, () => ({
                name: "",
                schedule: "",
              }))
              setEvents(newEvents)

              setNumberOfEvents(e.target.value)
              // setEvents(
              //   new Array(Number(e.target.value)).fill({
              //     name: "",
              //     schedule: "",
              //   })
              // )
            }}
          />
        </label>
        {events.map((event, index) => (
          <div key={index}>
            {/* <label>
              Event Name:
            </label>
            <input 
              name={`course-${index + 1}-name`}
              type="text" 
              value={event.name} 
              onChange={(e) => handleEventChange(index, 'name', e.target.value)}
            /> */}

            <div className="input-group">
              <label>Event Name:</label>
              <input
                name={`course-${index + 1}-name`}
                type="text"
                value={event.name}
                onChange={(e) =>
                  handleEventChange(index, "name", e.target.value)
                }
              />
            </div>

            <textarea
              name={`course-${index + 1}-schedule`}
              value={event.schedule}
              onChange={(e) =>
                handleEventChange(index, "schedule", e.target.value)
              }
              rows={10}
              cols={50}
            />
          </div>
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
