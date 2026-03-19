import { useNavigate } from "react-router";
import { Button } from "@heroui/react";
import { BiBlock } from "react-icons/bi";
import { MdOutlineArrowBack } from "react-icons/md";

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Animated Icon Container */}
        <div className="relative flex justify-center">
          {/* Pulsing background circles */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-red-100 rounded-full animate-ping opacity-20"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center animation-delay-300">
            <div className="w-24 h-24 bg-red-200 rounded-full animate-ping opacity-30"></div>
          </div>

          {/* Main icon with gentle bounce */}
          <div className="relative z-10 w-24 h-24 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-bounce-slow">
            <BiBlock className="text-white text-5xl" />
          </div>
        </div>

        {/* Error Code with fade-in animation */}
        <div className="space-y-2 animate-fade-in">
          <h1 className="text-8xl font-bold text-red-500 animate-scale-in">
            403
          </h1>
          <h2 className="text-3xl font-semibold text-kidemia-black">
            Access Denied
          </h2>
        </div>

        {/* Description with staggered fade-in */}
        <div className="space-y-3 animate-fade-in-up animation-delay-200">
          <p className="text-lg text-gray-600 font-medium">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-500">
            If you believe this is a mistake, please contact your administrator or try logging in with a different account.
          </p>
        </div>

        {/* Action buttons with staggered animation */}
        <div className="space-y-3 pt-6 animate-fade-in-up animation-delay-400">
          <Button
            size="lg"
            radius="sm"
            className="bg-kidemia-secondary text-white font-semibold w-full hover:opacity-90 transition-all hover:scale-105"
            startContent={<MdOutlineArrowBack className="text-xl" />}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>

          <Button
            size="lg"
            radius="sm"
            variant="flat"
            className="bg-white text-kidemia-black font-semibold w-full border border-gray-200 hover:bg-gray-50 transition-all"
            onClick={() => navigate("/")}
          >
            Return to Home
          </Button>
        </div>

        {/* Floating particles decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-300 rounded-full animate-float"></div>
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-red-200 rounded-full animate-float animation-delay-500"></div>
          <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-red-400 rounded-full animate-float animation-delay-1000"></div>
        </div>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-40px) translateX(-10px);
            opacity: 0.3;
          }
          75% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.6;
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out forwards;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}