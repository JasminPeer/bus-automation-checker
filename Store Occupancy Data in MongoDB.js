const mongoose = require("mongoose")

// Env: connection and DB names
const MONGODB_URI = process.env.MONGODB_URI

const occupancySchema = new mongoose.Schema({
  bus: String,
  route: String,
  passengerCount: Number,
  capacity: Number,
  occupancyPercentage: Number,
  crowdLevel: String,
  timestamp: String,
  alertTriggered: Boolean
})

;(async () => {
  let conn
  try {
    if (!MONGODB_URI) throw new Error("Missing MONGODB_URI env variable")
    const occupancyData = getContext("occupancyData")
    if (!occupancyData) throw new Error("No occupancyData found in context")
    await mongoose.connect(MONGODB_URI)
    const OccupancyLog = mongoose.model("OccupancyLog", occupancySchema, "OccupancyLog")
    const result = await OccupancyLog.create(occupancyData)
    console.log("Occupancy data logged to MongoDB:", result._id)
    setContext("dbResult", result.toObject())
    await mongoose.disconnect()
  } catch (e) {
    if (conn) await mongoose.disconnect()
    console.error(e)
    process.exit(1)
  }
})()
