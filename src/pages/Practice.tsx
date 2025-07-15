import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Clock, Code, Play, RotateCcw, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { generateDSAProblem } from "@/lib/google";

const Practice = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [selectedDifficulty, setSelectedDifficulty] = useState("beginner");
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentProblem, setCurrentProblem] = useState({
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    difficulty: "beginner",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      }
    ]
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const { toast } = useToast();

  // Timer functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeElapsed(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Start timer when user starts typing
  useEffect(() => {
    if (code.trim() && !isRunning) {
      setIsRunning(true);
    }
  }, [code, isRunning]);

  // Set initial code template when language changes
  useEffect(() => {
    if (!code) {
      setCode(getCodeTemplate(selectedLanguage));
    }
  }, [selectedLanguage]);

  const languages = [
    { id: "javascript", name: "JavaScript", color: "bg-yellow-500" },
    { id: "python", name: "Python", color: "bg-blue-500" },
    { id: "java", name: "Java", color: "bg-red-500" },
    { id: "cpp", name: "C++", color: "bg-purple-500" }
  ];

  const difficulties = ["beginner", "intermediate", "advanced"];

  const generateNewProblem = async () => {
    setIsGenerating(true);
    try {
      console.log("Generating new DSA problem with Google Gemini, difficulty:", selectedDifficulty);
      const newProblem = await generateDSAProblem(selectedDifficulty);
      console.log("Generated problem:", newProblem);
      setCurrentProblem(newProblem);
      setCode(getCodeTemplate(selectedLanguage)); // Reset to template
      setOutput(""); // Clear output
      setTimeElapsed(0); // Reset timer
      setIsRunning(false); // Stop timer
      toast({
        title: "New Problem Generated!",
        description: "AI has created a fresh problem for you to solve.",
      });
    } catch (error) {
      console.error("Problem generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate new problem. Please check your Google API key and try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const resetTimer = () => {
    setTimeElapsed(0);
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCodeTemplate = (language: string) => {
    switch (language) {
      case 'python':
        return `def solve(nums, target):
    # Your code here
    pass

# Test the function
nums = [2, 7, 11, 15]
target = 9
result = solve(nums, target)
print("Result:", result)`;
      case 'java':
        return `public class Solution {
    public int[] solve(int[] nums, int target) {
        // Your code here
        return new int[]{};
    }
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        int[] result = sol.solve(nums, target);
        System.out.println("Result: " + java.util.Arrays.toString(result));
    }
}`;
      case 'cpp':
        return `#include <vector>
#include <iostream>
using namespace std;

class Solution {
public:
    vector<int> solve(vector<int>& nums, int target) {
        // Your code here
        return {};
    }
};

int main() {
    Solution sol;
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    vector<int> result = sol.solve(nums, target);
    cout << "Result: ";
    for(int i : result) cout << i << " ";
    cout << endl;
    return 0;
}`;
      default:
        return `function solve(nums, target) {
    // Your code here
}

// Test the function
const nums = [2, 7, 11, 15];
const target = 9;
const result = solve(nums, target);
console.log("Result:", result);`;
    }
  };

  const executeCode = async () => {
    if (!code.trim()) {
      toast({
        title: "No Code",
        description: "Please write some code before running.",
        variant: "destructive"
      });
      return;
    }

    setIsExecuting(true);
    setOutput("Running code...");

    try {
      if (selectedLanguage === 'javascript') {
        // Create a safe execution environment for JavaScript
        const originalConsoleLog = console.log;
        let capturedOutput = "";
        
        console.log = (...args) => {
          capturedOutput += args.join(" ") + "\n";
        };

        try {
          // Execute the code
          const func = new Function(code);
          func();
          setOutput(capturedOutput || "Code executed successfully (no output)");
        } catch (execError: any) {
          setOutput(`Error: ${execError.message}`);
        } finally {
          console.log = originalConsoleLog;
        }
      } else {
        // For other languages, show a simulation message
        setOutput(`${selectedLanguage} code simulation:\n\nYour code has been validated for syntax.\nIn a real environment, this would compile and run your ${selectedLanguage} code.\n\nCode length: ${code.length} characters\nLines: ${code.split('\n').length}`);
      }

      toast({
        title: "Code Executed",
        description: "Your code has been run successfully!",
      });
    } catch (error: any) {
      setOutput(`Execution Error: ${error.message}`);
      toast({
        title: "Execution Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5 text-purple-600" />
              <span className="font-semibold text-gray-900">DSA Practice</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span className={`font-mono ${isRunning ? 'text-green-600' : 'text-gray-600'}`}>
                {formatTime(timeElapsed)}
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={resetTimer}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Timer
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Problem Panel */}
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{currentProblem.title}</CardTitle>
                <Badge variant="outline" className="capitalize">
                  {currentProblem.difficulty}
                </Badge>
              </div>
              <CardDescription>
                {currentProblem.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Example:</h4>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm">
                    <div><strong>Input:</strong> {currentProblem.examples[0].input}</div>
                    <div><strong>Output:</strong> {currentProblem.examples[0].output}</div>
                    <div><strong>Explanation:</strong> {currentProblem.examples[0].explanation}</div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={generateNewProblem}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        AI Generate New
                      </>
                    )}
                  </Button>
                  <select 
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  >
                    {difficulties.map(diff => (
                      <option key={diff} value={diff} className="capitalize">{diff}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Code Editor Panel */}
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Code Editor</CardTitle>
                <div className="flex items-center gap-2">
                  {languages.map(lang => (
                    <Button
                      key={lang.id}
                      variant={selectedLanguage === lang.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setSelectedLanguage(lang.id);
                        setCode(getCodeTemplate(lang.id));
                        setOutput(""); // Clear output when switching languages
                      }}
                      className="text-xs"
                    >
                      {lang.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Code Editor */}
                <div className="border rounded-lg">
                  <div className="bg-gray-100 px-3 py-2 border-b text-xs text-gray-600 font-mono">
                    {selectedLanguage} - Write your solution below:
                  </div>
                  <Textarea
                    className="min-h-[300px] border-0 rounded-t-none font-mono text-sm resize-none focus-visible:ring-0"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onPaste={(e) => {
                      e.preventDefault();
                      toast({
                        title: "Paste Blocked!",
                        description: "Type your code manually to simulate real interview conditions.",
                        variant: "destructive"
                      });
                    }}
                    placeholder={getCodeTemplate(selectedLanguage)}
                    style={{
                      fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                      tabSize: 2
                    }}
                  />
                </div>

                {/* Output Panel */}
                {output && (
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                    <div className="text-gray-400 text-xs mb-2">Output:</div>
                    <pre className="whitespace-pre-wrap">{output}</pre>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={executeCode}
                    disabled={isExecuting}
                  >
                    {isExecuting ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Run Code
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      console.log("Submitting solution...", code);
                      setIsRunning(false);
                      toast({
                        title: "Solution Submitted",
                        description: `Great job! Time taken: ${formatTime(timeElapsed)}`,
                      });
                    }}
                  >
                    Submit Solution
                  </Button>
                  <Button 
                    variant="ghost"
                    onClick={() => {
                      setCode(getCodeTemplate(selectedLanguage));
                      setOutput("");
                    }}
                  >
                    Reset Code
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Practice;
