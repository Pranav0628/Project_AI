
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Code2, 
  Mic, 
  BarChart3, 
  Shuffle, 
  Clock,
  Brain,
  Trophy
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Code2,
      title: "DSA Coding Pad",
      description: "In-browser code editor with paste disabled. Supports C++, Java, Python.",
      detail: "Get feedback on errors, logic, and improvement areas",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Shuffle,
      title: "Random Problem Generator",
      description: "AI selects questions by difficulty (beginner, intermediate, advanced)",
      detail: "Generate unique DSA questions tailored to your level",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Clock,
      title: "Performance Tracker",
      description: "Logs time taken, error count, code success/failure",
      detail: "Track your coding performance and improvement metrics",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: Mic,
      title: "English HR Interview Bot",
      description: "Voice-based interview questions like 'Why should we hire you?'",
      detail: "Evaluate grammar, structure, and get fluency feedback",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: BarChart3,
      title: "Feedback Dashboard",
      description: "Shows past performance, coding history, and speaking evaluations",
      detail: "Visual dashboard with performance suggestions and scores",
      color: "from-indigo-500 to-purple-500"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 rounded-full px-4 py-2 mb-6 text-sm font-medium">
            <Brain className="h-4 w-4" />
            Core Features
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything you need to 
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> ace interviews</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI-powered platform combines technical coding practice with soft skills development
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-2"
            >
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-100">
                  <p className="text-sm text-purple-800 font-medium flex items-start gap-2">
                    <Trophy className="h-4 w-4 mt-0.5 text-purple-600" />
                    {feature.detail}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
