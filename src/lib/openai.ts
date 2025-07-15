
const OPENAI_API_KEY = "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";

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  console.log("Starting audio transcription...");
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.wav');
  formData.append('model', 'whisper-1');

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Transcription failed: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  console.log("Transcription result:", result);
  return result.text;
}

export async function generateInterviewFeedback(question: string, answer: string): Promise<string> {
  console.log("Generating interview feedback...");
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        {
          role: 'system',
          content: 'You are an experienced HR interviewer providing constructive feedback on interview responses. Analyze the candidate\'s answer for clarity, relevance, structure, and professionalism. Provide specific, actionable feedback to help them improve.'
        },
        {
          role: 'user',
          content: `Question: "${question}"\n\nCandidate's Answer: "${answer}"\n\nPlease provide detailed feedback on this interview response.`
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`Feedback generation failed: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  console.log("Feedback result:", result);
  return result.choices[0].message.content;
}

export async function generateDSAProblem(difficulty: string): Promise<any> {
  console.log("Generating DSA problem with difficulty:", difficulty);
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        {
          role: 'system',
          content: 'You are a coding interview expert. Generate a unique DSA problem with the specified difficulty. Return a JSON object with title, description, examples, constraints, and hints. Make sure the JSON is valid and well-formatted.'
        },
        {
          role: 'user',
          content: `Generate a ${difficulty} level DSA problem. Make it unique and interesting. Return only valid JSON with this structure:
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
          }`
        }
      ],
      max_tokens: 500,
      temperature: 0.8,
    }),
  });

  if (!response.ok) {
    throw new Error(`Problem generation failed: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  console.log("Problem generation result:", result);
  
  try {
    return JSON.parse(result.choices[0].message.content);
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
      ]
    };
  }
}
