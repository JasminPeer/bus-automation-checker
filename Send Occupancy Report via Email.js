;(async () => {
  try {
    const userEmail = process.env.USER_EMAIL
    if (!userEmail) throw new Error("USER_EMAIL environment variable not set.")

    // Prefer the most up-to-date occupancy record from context, fallback if needed
    const occupancy = getContext("dbResult") || getContext("occupancyData")
    if (!occupancy) throw new Error("Occupancy summary data not found in context.")

    // Compose email summary content
    const subject = `Bus Occupancy Report for ${occupancy.bus || "Unknown Bus"}`
    let html = `<h2>Bus Occupancy / Crowd Level Report</h2>`
    html += `<ul>`
    html += `<li><strong>Bus:</strong> ${occupancy.bus}</li>`
    html += `<li><strong>Route:</strong> ${occupancy.route}</li>`
    html += `<li><strong>Passenger Count:</strong> ${occupancy.passengerCount}</li>`
    html += `<li><strong>Capacity:</strong> ${occupancy.capacity}</li>`
    html += `<li><strong>Occupancy (%):</strong> ${occupancy.occupancyPercentage}%</li>`
    html += `<li><strong>Crowd Level:</strong> ${occupancy.crowdLevel}</li>`
    html += `<li><strong>Alert:</strong> ${occupancy.alertTriggered ? "YES (Over 90%)" : "No"}</li>`
    html += `<li><strong>Timestamp:</strong> ${occupancy.timestamp}</li>`
    html += `</ul>`

    const text = `Bus Occupancy Report\n\n` + `Bus: ${occupancy.bus}\n` + `Route: ${occupancy.route}\n` + `Passenger count: ${occupancy.passengerCount}\n` + `Capacity: ${occupancy.capacity}\n` + `Occupancy: ${occupancy.occupancyPercentage}%\n` + `Crowd level: ${occupancy.crowdLevel}\n` + `Alert: ${occupancy.alertTriggered ? "YES (Over 90%)" : "No"}\n` + `Timestamp: ${occupancy.timestamp}`

    const emailResult = await sendEmailViaTurbotic({
      to: userEmail,
      subject,
      html,
      text
    })

    if (emailResult && emailResult.success) {
      console.log(`Occupancy report sent to ${userEmail}`)
    } else {
      throw new Error(`Failed to send occupancy email: ${emailResult?.message || "Unknown error"}`)
    }
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
})()
