import moment from "moment"

export const extractEventData = (schedule) => {
  const lines = schedule.split("\n")
  const parsedData = {}

  lines.forEach((line) => {
    const dateMatch = line.match(/^(\w{3})\((\d{2}\/\d{2}\/\d{4})\)/)
    const timeMatch = line.match(
      /:: (\d{2}:\d{2} [APM]{2}) - (\d{2}:\d{2} [APM]{2})::/
    )

    if (dateMatch && timeMatch) {
      const [_, dayOfWeek, date, startTime, endTime] = [
        ...dateMatch,
        ...timeMatch,
      ]

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

  return parsedData
}

export const transformToFullCalendarEvents = (data, generateColor) => {
  const titleColorMapping = {}

  return data.flatMap((eventItem) => {
    return Object.entries(eventItem.data).flatMap(([date, times]) => {
      return times.map((time) => {
        const startDateTime = moment(
          `${date} ${time.startTime}`,
          "DD/MM/YYYY hh:mm A"
        ).toDate()
        const endDateTime = moment(
          `${date} ${time.endTime}`,
          "DD/MM/YYYY hh:mm A"
        ).toDate()

        if (!titleColorMapping[eventItem.name]) {
          titleColorMapping[eventItem.name] = generateColor()
        }

        return {
          title: eventItem.name,
          start: startDateTime,
          end: endDateTime,
          backgroundColor: titleColorMapping[eventItem.name],
          display: "block",
        }
      })
    })
  })
}
