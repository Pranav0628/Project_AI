
const GOOGLE_API_KEY = "AIzaSyAdFWorCzzS89ViU59d29msH6-t2gE5Sqw";

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to retry API calls with better error handling
async function retryApiCall<T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error: any) {
      console.log(`Attempt ${attempt} failed:`, error.message);
      
      // If it's a 503 error (model overloaded), wait longer
      if (error.message.includes('503') || error.message.includes('overloaded')) {
        if (attempt === maxRetries) {
          throw new Error("Google AI service is currently overloaded. Please try again in a few minutes.");
        }
        // Wait longer for 503 errors
        await delay(delayMs * attempt * 2);
      } else {
        if (attempt === maxRetries) {
          throw error;
        }
        await delay(delayMs * attempt);
      }
    }
  }
  throw new Error("Max retries exceeded");
}

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  console.log("Starting audio transcription with Google API...");
  
  const makeTranscriptionCall = async () => {
    // Convert audio blob to base64
    const base64Audio = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.readAsDataURL(audioBlob);
    });

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: "Please transcribe the following audio content. Only return the transcribed text, nothing else."
            },
            {
              inline_data: {
                mime_type: "audio/wav",
                data: base64Audio
              }
            }
          ]
        }]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Transcription failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log("Transcription result:", result);
    return result.candidates[0].content.parts[0].text;
  };

  return retryApiCall(makeTranscriptionCall, 5, 3000); // Increased retries and delay
}

export async function generateInterviewFeedback(question: string, answer: string): Promise<string> {
  console.log("Generating interview feedback with Google Gemini...");
  
  const makeFeedbackCall = async () => {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are an experienced HR interviewer providing constructive feedback on interview responses. Analyze the candidate's answer for clarity, relevance, structure, and professionalism. Provide specific, actionable feedback to help them improve.

Question: "${question}"

Candidate's Answer: "${answer}"

Please provide detailed feedback on this interview response in 2-3 sentences. Focus on what they did well and what they can improve.`
          }]
        }],
        generationConfig: {
          maxOutputTokens: 300,
          temperature: 0.7,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Feedback generation failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log("Feedback result:", result);
    return result.candidates[0].content.parts[0].text;
  };

  return retryApiCall(makeFeedbackCall, 5, 3000); // Increased retries and delay
}

export async function generateDSAProblem(difficulty: string): Promise<any> {
  console.log("Generating DSA problem with Google Gemini, difficulty:", difficulty);
  
  const makeProblemCall = async () => {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Generate a unique DSA problem with ${difficulty} difficulty level. Return ONLY a valid JSON object with this exact structure (no markdown formatting, no code blocks, just the JSON):

{
  "title": "Problem Title",
  "description": "Problem description",
  "difficulty": "${difficulty}",
  "examples": [
    {
      "input": "example input",
      "output": "example output", 
      "explanation": "explanation"
    }
  ],
  "constraints": ["constraint1", "constraint2"],
  "hints": ["hint1", "hint2"]
}

Make sure the JSON is valid and well-formatted. Do not include any text before or after the JSON.`
          }]
        }],
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.8,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Problem generation failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log("Problem generation result:", result);
    
    try {
      let jsonText = result.candidates[0].content.parts[0].text;
      
      // Clean up the response - remove markdown code blocks if present
      jsonText = jsonText.replace(/```json\s*/, '').replace(/```\s*$/, '').trim();
      
      return JSON.parse(jsonText);
    } catch (parseError) {
      console.error("Failed to parse generated problem JSON:", parseError);
      // Return a fallback problem if JSON parsing fails
      return {
        title: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Array Problem`,
        description: "Find the solution to this array-based problem using optimal time and space complexity.",
        difficulty: difficulty,
        examples: [
          {
            input: "arr = [1, 2, 3, 4, 5]",
            output: "result",
            explanation: "Process the array according to the problem requirements."
          }
        ],
        constraints: ["1 <= arr.length <= 1000", "Values are integers"],
        hints: ["Consider using two pointers", "Think about time complexity"]
      };
    }
  };

  return retryApiCall(makeProblemCall, 5, 3000); // Increased retries and delay
}
