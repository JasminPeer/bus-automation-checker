require('dotenv').config();

async function runWorkflow() {
    try {
        console.log("🚀 Starting Bus Automation Workflow...");

        // Step 1
        require("./Fetch Passenger Count from AI Microservice.js");

        // Step 2
        require("./Calculate Occupancy, Crowd Level, and Trigger Alerts.js");

        // Step 3
        require("./Store Occupancy Data in MongoDB.js");

        // Step 4
        require("./Broadcast Updates via Socket.io.js");

        // Step 5
        require("./Send Occupancy Report via Email.js");

        console.log("✅ Workflow completed successfully.");
        process.exit(0);

    } catch (error) {
        console.error("❌ Workflow failed:", error);
        process.exit(1);
    }
}

runWorkflow();