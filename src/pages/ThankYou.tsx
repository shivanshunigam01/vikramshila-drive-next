import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Home, Clock, Mail } from "lucide-react";
import { useState, useEffect } from "react";

export default function ThankYou() {
  const navigate = () => {
    // In a real app, this would be handled by react-router-dom
    window.location.href = "/";
  };
  const [isVisible, setIsVisible] = useState(false);
  const [confettiVisible, setConfettiVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    setConfettiVisible(true);
    const timer = setTimeout(() => setConfettiVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const confettiPieces = Array.from({ length: 50 }, (_, i) => (
    <div
      key={i}
      className={`absolute w-2 h-2 opacity-80 ${
        confettiVisible ? "animate-pulse" : "opacity-0"
      }`}
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        backgroundColor: [
          "#FF6B6B",
          "#4ECDC4",
          "#45B7D1",
          "#96CEB4",
          "#FECA57",
          "#FF9FF3",
        ][Math.floor(Math.random() * 6)],
        animationDelay: `${Math.random() * 2}s`,
        transform: `rotate(${Math.random() * 360}deg)`,
      }}
    />
  ));

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 overflow-hidden">
      {/* Confetti Effect */}
      <div className="absolute inset-0 pointer-events-none">
        {confettiPieces}
      </div>

      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 py-12">
        {/* Success Icon */}
        <div
          className={`mb-8 transform transition-all duration-1000 ${
            isVisible
              ? "scale-100 rotate-0 opacity-100"
              : "scale-0 rotate-180 opacity-0"
          }`}
        >
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/20">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
            <div className="absolute inset-0 w-32 h-32 bg-blue-500 rounded-full animate-ping opacity-30"></div>
          </div>
        </div>

        {/* Main Content */}
        <div
          className={`transform transition-all duration-1000 delay-300 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent mb-6">
            🎉 Thank You!
          </h1>

          <div className="max-w-md mx-auto mb-8">
            <p className="text-xl text-gray-200 leading-relaxed mb-4">
              Your quote has been submitted successfully!
            </p>
            <p className="text-lg text-gray-300">
              The{" "}
              <span className="font-semibold text-blue-400">
                Vikramshila team
              </span>{" "}
              will get back to you shortly.
            </p>
          </div>
        </div>

        {/* Status Cards */}
        <div
          className={`grid md:grid-cols-3 gap-4 mb-10 max-w-3xl w-full transform transition-all duration-1000 delay-500 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-700/30 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
            <Mail className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-100 mb-2">Quote Received</h3>
            <p className="text-sm text-gray-300">
              Your request is now in our system
            </p>
          </div>

          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-700/30 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
            <Clock className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-100 mb-2">Processing</h3>
            <p className="text-sm text-gray-300">
              Our team is reviewing your requirements
            </p>
          </div>

          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-700/30 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
            <CheckCircle className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-100 mb-2">Response Soon</h3>
            <p className="text-sm text-gray-300">
              Expect to hear from us within 24 hours
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 transform transition-all duration-1000 delay-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <Button
            onClick={navigate}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group"
          >
            <Home className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
            Back to Home
          </Button>

          <Button
            variant="outline"
            onClick={() => (window.location.href = "/services")}
            className="border-2 border-indigo-300 text-indigo-600 hover:bg-indigo-600 hover:text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group"
          >
            Explore Services
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </Button>
        </div>

        {/* Additional Info */}
        <div
          className={`mt-12 max-w-md mx-auto transform transition-all duration-1000 delay-900 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <p className="text-sm text-gray-600 leading-relaxed">
              <strong className="text-gray-800">
                Need immediate assistance?
              </strong>
              <br />
              Contact us directly at{" "}
              <a
                href="mailto:support@vikramshila.com"
                className="text-indigo-600 hover:text-indigo-800 font-medium underline decoration-2 underline-offset-2"
              >
                support@vikramshila.com
              </a>{" "}
              or call us at{" "}
              <a
                href="tel:+1234567890"
                className="text-indigo-600 hover:text-indigo-800 font-medium underline decoration-2 underline-offset-2"
              >
                +91 12345 67890
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
