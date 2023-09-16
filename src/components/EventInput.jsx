import React from "react"

function EventInput({ index, event, handleEventChange }) {
  return (
    <div>
      <div className="input-group">
        <label>Event Name:</label>
        <input
          name={`course-${index + 1}-name`}
          type="text"
          value={event.name}
          onChange={(e) => handleEventChange(index, "name", e.target.value)}
        />
      </div>

      <textarea
        name={`course-${index + 1}-schedule`}
        value={event.schedule}
        onChange={(e) => handleEventChange(index, "schedule", e.target.value)}
        rows={10}
        cols={50}
      />
    </div>
  )
}

export default EventInput
