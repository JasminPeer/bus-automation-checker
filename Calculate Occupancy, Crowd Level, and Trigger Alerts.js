// Environment variable for bus capacity (number of seats)
const BUS_CAPACITY = process.env.BUS_CAPACITY ? Number(process.env.BUS_CAPACITY) : undefined
const BUS_NAME = process.env.BUS_NAME || "Unknown Bus"
const BUS_ROUTE = process.env.BUS_ROUTE || "Unknown Route"

;(async () => {
  try {
    const count = getContext("passengerCount")
    if (typeof count !== "number") {
      setContext("alertTriggered", false) // Always set alertTriggered to ensure availability
      throw new Error("Passenger count not found in context.")
    }
    if (!BUS_CAPACITY || typeof BUS_CAPACITY !== "number" || BUS_CAPACITY <= 0) {
      setContext("alertTriggered", false) // Always set alertTriggered to ensure availability
      throw new Error("Missing or invalid BUS_CAPACITY env variable.")
    }
    const occupancyPercentage = Math.round((count / BUS_CAPACITY) * 100)
    let crowdLevel
    if (occupancyPercentage > 90) {
      crowdLevel = "High"
    } else if (occupancyPercentage > 65) {
      crowdLevel = "Medium"
    } else {
      crowdLevel = "Low"
    }
    const alertTriggered = occupancyPercentage > 90

    const occupancyData = {
      bus: BUS_NAME,
      route: BUS_ROUTE,
      passengerCount: count,
      capacity: BUS_CAPACITY,
      occupancyPercentage,
      crowdLevel,
      timestamp: new Date().toISOString(),
      alertTriggered
    }
    setContext("occupancyData", occupancyData)
    setContext("alertTriggered", alertTriggered)
    console.log(`Calculated occupancy: ${occupancyPercentage}% (${crowdLevel}) - Alert: ${alertTriggered ? "YES" : "no"}`)
  } catch (e) {
    // Set alertTriggered as false on any error path for robust context
    setContext("alertTriggered", false)
    console.error(e)
    process.exit(1)
  }
})()
