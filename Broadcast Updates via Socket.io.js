const { io } = require("socket.io-client")

const SOCKET_IO_SERVER = process.env.SOCKET_IO_SERVER

;(async () => {
  let socket
  try {
    if (!SOCKET_IO_SERVER) throw new Error("Missing SOCKET_IO_SERVER env variable")
    const occupancyData = getContext("occupancyData")
    const alertTriggered = getContext("alertTriggered")
    if (!occupancyData) throw new Error("No occupancyData found in context")
    // Detailed logs for broadcast transparency
    console.log("Broadcasting occupancy update...")
    console.log("Passenger Count:", occupancyData.passengerCount)
    console.log("Occupancy:", occupancyData.occupancyPercentage)
    console.log("Alert Triggered:", alertTriggered)
    socket = io(SOCKET_IO_SERVER, { transports: ["websocket"] })

    // Wait for connection
    await new Promise(resolve => socket.on("connect", resolve))
    socket.emit("bus-occupancy-update", occupancyData)
    if (alertTriggered) socket.emit("bus-alert", { ...occupancyData, alertTriggered: true })
    console.log("Broadcast simulated successfully.")
    socket.disconnect()
  } catch (e) {
    if (socket) socket.disconnect()
    console.error(e)
    process.exit(1)
  }
})()
