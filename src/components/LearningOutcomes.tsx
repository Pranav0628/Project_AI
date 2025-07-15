
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Brain, 
  Code, 
  Mic2, 
  Globe,
  CheckCircle
} from "lucide-react";

const LearningOutcomes = () => {
  const outcomes = [
    {
      icon: Brain,
      area: "Google Gemini AI",
      skills: "AI-powered audio transcription, interview feedback generation, and DSA problem creation",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: Code,
      area: "React & TypeScript", 
      skills: "Modern React with TypeScript, Vite build tool, and component-based architecture",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Mic2,
      area: "Web APIs",
      skills: "MediaRecorder API for audio recording, Speech Synthesis for text-to-speech",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Globe,
      area: "Frontend Technologies",
      skills: "Tailwind CSS for styling, Shadcn/UI components, React Router for navigation",
      color: "from-green-500 to-teal-500"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-6 text-sm font-medium px-4 py-2">
            🛠️ Technologies Used
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Built With 
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"> Modern Tech</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Core technologies that power the CodeSpeak360 interview preparation platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {outcomes.map((outcome, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-300 border-0 bg-white hover:-translate-y-1"
            >
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${outcome.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <outcome.icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="space-y-3 flex-1">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                      {outcome.area}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {outcome.skills}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Value Proposition */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            Why CodeSpeak360?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-300 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold mb-2">Complete Interview Prep</h4>
                <p className="text-white/80">Combines coding practice with HR interview simulation</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-300 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold mb-2">AI-Powered Feedback</h4>
                <p className="text-white/80">Get personalized suggestions to improve your performance</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-300 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold mb-2">Voice-Based Practice</h4>
                <p className="text-white/80">Practice speaking skills with realistic interview simulation</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-300 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold mb-2">Modern Web Platform</h4>
                <p className="text-white/80">Built with cutting-edge technologies for optimal performance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LearningOutcomes;
