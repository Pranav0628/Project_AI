
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Mic, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-8 text-white/80 text-sm">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          AI-Powered Interview Preparation
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            CodeSpeak360
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/80 mb-4 max-w-3xl mx-auto leading-relaxed">
          Master DSA Coding & HR Interviews with AI
        </p>
        
        <p className="text-lg text-white/60 mb-12 max-w-2xl mx-auto">
          Practice coding problems, simulate HR interviews with voice AI, and get personalized feedback.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link to="/practice">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 px-8 py-4 text-lg group">
              Start Coding Practice
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/hr-interview">
            <Button size="lg" className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white border-0 px-8 py-4 text-lg group">
              <Mic className="mr-2 h-5 w-5" />
              Try HR Interview
            </Button>
          </Link>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              <Code className="h-8 w-8 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white">DSA</div>
            <div className="text-white/60">Coding Practice</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              <Mic className="h-8 w-8 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">Voice-Based</div>
            <div className="text-white/60">HR Interviews</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white">AI</div>
            <div className="text-white/60">Feedback</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
