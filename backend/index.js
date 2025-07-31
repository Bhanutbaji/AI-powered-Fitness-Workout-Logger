import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import admin from "firebase-admin";
import serviceAccount from "./firebaseServiceAccount.json" assert { type: "json" };
import { generateWorkoutPlan } from "./openaihandler.js";

dotenv.config();

// Initialize Firebase Admin
if (!admin.apps || admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("OpenAI fitness workout generator backend is running!");
});

// Generate basic workout plan without OpenAI
const generateBasicWorkoutPlan = (planData) => {
  const { goal = "Build muscle and strength", fitness_level = "Beginner", frequency = 4 } = planData;
  
  // Define workout templates for different goals
  const workoutTemplates = {
    "Build muscle and strength": [
      {
        title: "Upper Body Strength",
        activities: [
          "Push-ups: 3 sets of 10-15 reps",
          "Dumbbell rows: 3 sets of 12 reps each arm",
          "Shoulder press: 3 sets of 10 reps",
          "Bicep curls: 3 sets of 12 reps",
          "Tricep dips: 3 sets of 8-12 reps"
        ]
      },
      {
        title: "Lower Body & Core",
        activities: [
          "Squats: 3 sets of 15 reps",
          "Lunges: 3 sets of 10 reps each leg",
          "Glute bridges: 3 sets of 15 reps",
          "Plank: 3 sets of 30 seconds",
          "Mountain climbers: 3 sets of 20 reps"
        ]
      },
      {
        title: "Full Body Circuit",
        activities: [
          "Burpees: 3 sets of 10 reps",
          "Jump squats: 3 sets of 15 reps",
          "Push-ups: 3 sets of 10 reps",
          "Plank to downward dog: 3 sets of 8 reps",
          "High knees: 3 sets of 30 seconds"
        ]
      },
      {
        title: "Cardio & Flexibility",
        activities: [
          "Jogging or brisk walking: 20 minutes",
          "Jump rope: 3 sets of 2 minutes",
          "Stretching routine: 10 minutes",
          "Yoga poses: 5 minutes",
          "Cool down: 5 minutes"
        ]
      },
      {
        title: "Full Body Strength",
        activities: [
          "Deadlifts: 3 sets of 8 reps",
          "Bench press: 3 sets of 10 reps",
          "Pull-ups: 3 sets of 5-8 reps",
          "Leg press: 3 sets of 12 reps",
          "Core circuit: 3 rounds"
        ]
      },
      {
        title: "Active Recovery",
        activities: [
          "Light stretching: 15 minutes",
          "Foam rolling: 10 minutes",
          "Yoga: 20 minutes",
          "Walking: 30 minutes",
          "Meditation: 10 minutes"
        ]
      },
      {
        title: "HIIT Training",
        activities: [
          "Burpees: 30 seconds",
          "Mountain climbers: 30 seconds",
          "Jump squats: 30 seconds",
          "Push-ups: 30 seconds",
          "Rest: 30 seconds between exercises"
        ]
      }
    ],
    "Weight loss": [
      {
        title: "High Intensity Cardio",
        activities: [
          "Jumping jacks: 3 sets of 30 seconds",
          "Burpees: 3 sets of 10 reps",
          "Mountain climbers: 3 sets of 30 seconds",
          "High knees: 3 sets of 30 seconds",
          "Rest: 1 minute between sets"
        ]
      },
      {
        title: "Strength Training",
        activities: [
          "Squats: 3 sets of 15 reps",
          "Push-ups: 3 sets of 10 reps",
          "Lunges: 3 sets of 10 reps each leg",
          "Plank: 3 sets of 30 seconds",
          "Wall sit: 3 sets of 30 seconds"
        ]
      },
      {
        title: "Circuit Training",
        activities: [
          "Jump squats: 3 sets of 15 reps",
          "Push-ups: 3 sets of 10 reps",
          "Mountain climbers: 3 sets of 30 seconds",
          "Plank: 3 sets of 30 seconds",
          "Rest: 1 minute between circuits"
        ]
      },
      {
        title: "Endurance Cardio",
        activities: [
          "Brisk walking: 30 minutes",
          "Cycling: 20 minutes",
          "Swimming: 15 minutes (if available)",
          "Stretching: 10 minutes",
          "Cool down: 5 minutes"
        ]
      },
      {
        title: "Full Body Burn",
        activities: [
          "Burpees: 3 sets of 10 reps",
          "Squats: 3 sets of 15 reps",
          "Push-ups: 3 sets of 10 reps",
          "Lunges: 3 sets of 12 reps",
          "Plank: 3 sets of 30 seconds"
        ]
      },
      {
        title: "Active Recovery",
        activities: [
          "Light walking: 30 minutes",
          "Stretching: 15 minutes",
          "Yoga: 20 minutes",
          "Foam rolling: 10 minutes"
        ]
      },
      {
        title: "HIIT Blast",
        activities: [
          "High knees: 30 seconds",
          "Push-ups: 30 seconds",
          "Squat jumps: 30 seconds",
          "Plank: 30 seconds",
          "Rest: 30 seconds between rounds"
        ]
      }
    ]
  };

  // Get the appropriate workout templates for the goal
  const templates = workoutTemplates[goal] || workoutTemplates["Build muscle and strength"];
  
  // Create days array based on frequency
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const workoutDays = [];
  
  for (let i = 0; i < frequency; i++) {
    const template = templates[i % templates.length]; // Cycle through templates
    workoutDays.push({
      day: days[i],
      title: template.title,
      activities: template.activities
    });
  }

  return { days: workoutDays };
};

// Create test plan endpoint
app.post("/api/create-test-plan", async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ 
        error: "Missing required parameter: userId" 
      });
    }

    const testPlanData = {
      goal: "Build muscle and strength",
      fitness_level: "Intermediate",
      duration: 8,
      equipment: "Dumbbells, resistance bands",
      workout_time: "45 minutes",
      frequency: 4,
      created_at: new Date().toISOString()
    };

    const planRef = db.collection("users").doc(userId).collection("workout_plans").doc();
    await planRef.set(testPlanData);

    res.json({ 
      success: true, 
      message: "Test plan created successfully",
      planId: planRef.id,
      plan: testPlanData
    });
  } catch (error) {
    console.error("Error creating test plan:", error);
    res.status(500).json({ 
      error: "Failed to create test plan",
      message: error.message 
    });
  }
});

// Generate basic workout plan (fallback when OpenAI is unavailable)
app.post("/api/generate-basic-plan", async (req, res) => {
  try {
    const { userId, planId } = req.body;
    
    if (!userId || !planId) {
      return res.status(400).json({ 
        error: "Missing required parameters: userId and planId" 
      });
    }

    const docRef = db.collection("users").doc(userId).collection("workout_plans").doc(planId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ 
        error: "Workout plan not found" 
      });
    }

    const planData = docSnap.data();
    const basicPlan = generateBasicWorkoutPlan(planData);

    res.json({ 
      success: true, 
      plan: basicPlan.days,
      message: "Basic workout plan generated (OpenAI unavailable)"
    });
  } catch (error) {
    console.error("Error generating basic workout plan:", error);
    res.status(500).json({ 
      error: "Failed to generate basic workout plan",
      message: error.message 
    });
  }
});

// Test endpoint to list available data
app.get("/api/test-data", async (req, res) => {
  try {
    const usersSnapshot = await db.collection("users").get();
    const users = [];
    
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const plansSnapshot = await userDoc.ref.collection("workout_plans").get();
      const plans = plansSnapshot.docs.map(planDoc => ({
        planId: planDoc.id,
        data: planDoc.data()
      }));
      
      users.push({
        userId,
        plans
      });
    }
    
    res.json({
      success: true,
      message: "Available data in Firestore:",
      users
    });
  } catch (error) {
    console.error("Error fetching test data:", error);
    res.status(500).json({
      error: "Failed to fetch test data",
      message: error.message
    });
  }
});
// Add route to fetch plan details

app.get("/api/plan/:userId/:planId", async (req, res) => {
  console.log("🔍 [GET] /api/plan/:userId/:planId - Request received");

  try {
    const { userId, planId } = req.params;
    console.log(`📥 Extracted Params → userId: ${userId}, planId: ${planId}`);

    if (!userId || !planId) {
      console.warn("⚠️ Missing parameters in request.");
      return res.status(400).json({ 
        error: "Missing required parameters: userId and planId" 
      });
    }

    const docRef = db.collection("workout_plans").doc(planId);
    console.log(`📄 Firestore path → workout_plans/${planId}`);

    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      console.warn(`❌ Plan not found → planId: ${planId}`);
      return res.status(404).json({ 
        error: "Workout plan not found",
        message: `No plan found with planId: ${planId}` 
      });
    }

    const planData = docSnap.data();

    // Check if the plan belongs to the specified user
    if (planData.userId !== userId) {
      console.warn(`🚫 Plan userId mismatch → Expected: ${userId}, Found: ${planData.userId}`);
      return res.status(403).json({ 
        error: "Unauthorized access to workout plan" 
      });
    }

    console.log(`✅ Plan found. Returning data for planId: ${planId}`);
    res.json({ 
      success: true, 
      plan: planData 
    });

  } catch (error) {
    console.error("🔥 Error fetching plan details:", error);
    res.status(500).json({ 
      error: "Failed to fetch plan details",
      message: error.message 
    });
  }
});


// Add the missing API route
app.post("/api/generate-plan", async (req, res) => {
  try {
    const { userId, planId } = req.body;
    
    if (!userId || !planId) {
      return res.status(400).json({ 
        error: "Missing required parameters: userId and planId" 
      });
    }

    // Generate workout plan using OpenAI
    const plan = await generateWorkoutPlan(userId, planId, db);
    
    res.json({ 
      success: true, 
      plan: plan 
    });
  } catch (error) {
    console.error("Error generating workout plan:", error);
    
    // If OpenAI fails, suggest using the basic plan endpoint
    if (error.message.includes("quota") || error.message.includes("429")) {
      res.status(429).json({ 
        error: "OpenAI API quota exceeded",
        message: "Please try the basic workout plan generator instead",
        suggestion: "Use /api/generate-basic-plan endpoint"
      });
    } else {
      res.status(500).json({ 
        error: "Failed to generate workout plan",
        message: error.message 
      });
    }
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
