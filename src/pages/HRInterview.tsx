import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mic, MicOff, Play, Square, Volume2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { transcribeAudio, generateInterviewFeedback } from "@/lib/google";

const HRInterview = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();

  const hrQuestions = [
    "Tell me about yourself and your background.",
    "Why are you interested in this position?",
    "What are your greatest strengths and weaknesses?",
    "Describe a challenging situation you faced and how you handled it.",
    "Where do you see yourself in 5 years?",
    "Why should we hire you?",
    "Do you have any questions for us?"
  ];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        await processAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Microphone access error:", error);
      toast({
        title: "Error",
        description: "Could not access microphone. Please allow microphone access.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsLoading(true);
    try {
      console.log("Processing audio blob:", audioBlob.size, "bytes");
      
      // Transcribe audio using Google Gemini
      const transcription = await transcribeAudio(audioBlob);
      console.log("Transcription received:", transcription);
      setTranscript(transcription);
      
      // Generate feedback using Google Gemini
      const currentQuestionText = hrQuestions[currentQuestion];
      const feedbackText = await generateInterviewFeedback(currentQuestionText, transcription);
      console.log("Feedback received:", feedbackText);
      setFeedback(feedbackText);
      
      toast({
        title: "Success!",
        description: "Your response has been processed and analyzed.",
      });
    } catch (error) {
      console.error("Audio processing error:", error);
      toast({
        title: "Error",
        description: "Failed to process audio. Please check your Google API key and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < hrQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTranscript("");
      setFeedback("");
    }
  };

  const speakQuestion = (question: string) => {
    const utterance = new SpeechSynthesisUtterance(question);
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
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
              <Mic className="h-5 w-5 text-purple-600" />
              <span className="font-semibold text-gray-900">HR Interview Simulator</span>
            </div>
          </div>
          
          <Badge variant="outline" className="capitalize">
            Question {currentQuestion + 1} of {hrQuestions.length}
          </Badge>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {!isInterviewStarted ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">AI-Powered HR Interview</CardTitle>
              <CardDescription>
                Practice your interview skills with our AI interviewer. Answer questions naturally and get real-time feedback on your responses.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">How it works:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• AI will ask you common HR interview questions</li>
                  <li>• Record your audio responses using the microphone</li>
                  <li>• Get instant AI feedback on your answers</li>
                  <li>• Improve your communication and interview skills</li>
                </ul>
              </div>
              <Button 
                onClick={() => setIsInterviewStarted(true)}
                size="lg"
                className="bg-purple-600 hover:bg-purple-700"
              >
                Start Interview
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Question Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Interview Question
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => speakQuestion(hrQuestions[currentQuestion])}
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    Listen
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-lg">{hrQuestions[currentQuestion]}</p>
                </div>
                
                <div className="flex items-center justify-center gap-4">
                  {!isRecording ? (
                    <Button
                      onClick={startRecording}
                      size="lg"
                      className="bg-green-600 hover:bg-green-700"
                      disabled={isLoading}
                    >
                      <Mic className="h-5 w-5 mr-2" />
                      Start Recording
                    </Button>
                  ) : (
                    <Button
                      onClick={stopRecording}
                      size="lg"
                      variant="destructive"
                    >
                      <Square className="h-5 w-5 mr-2" />
                      Stop Recording
                    </Button>
                  )}
                </div>

                {isRecording && (
                  <div className="text-center mt-4">
                    <div className="flex items-center justify-center gap-2 text-red-600">
                      <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                      Recording in progress...
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Response & Feedback Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Your Response & AI Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading && (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p>AI is analyzing your response...</p>
                  </div>
                )}

                {transcript && (
                  <div>
                    <h4 className="font-semibold mb-2">Your Response:</h4>
                    <div className="bg-blue-50 p-3 rounded-lg text-sm">
                      {transcript}
                    </div>
                  </div>
                )}

                {feedback && (
                  <div>
                    <h4 className="font-semibold mb-2">AI Feedback:</h4>
                    <div className="bg-green-50 p-3 rounded-lg text-sm">
                      {feedback}
                    </div>
                  </div>
                )}

                {(transcript || feedback) && currentQuestion < hrQuestions.length - 1 && (
                  <Button onClick={nextQuestion} className="w-full">
                    Next Question
                  </Button>
                )}

                {currentQuestion === hrQuestions.length - 1 && feedback && (
                  <div className="text-center">
                    <p className="text-green-600 font-semibold mb-4">Interview Complete!</p>
                    <Button 
                      onClick={() => {
                        setIsInterviewStarted(false);
                        setCurrentQuestion(0);
                        setTranscript("");
                        setFeedback("");
                      }}
                    >
                      Start New Interview
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default HRInterview;
