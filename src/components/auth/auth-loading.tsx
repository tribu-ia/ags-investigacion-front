"use client";

export function AuthLoading() {
  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center">
      <div className="relative flex flex-col items-center">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        
        {/* Loader animation */}
        <div className="relative">
          <div className="w-24 h-24">
            <div className="absolute w-full h-full border-4 border-primary rounded-full animate-[spin_3s_linear_infinite]" />
            <div className="absolute w-full h-full border-4 border-primary/30 rounded-full animate-[spin_2s_linear_infinite]" style={{ animationDirection: 'reverse' }} />
            <div className="absolute w-full h-full border-4 border-primary/10 rounded-full animate-ping" />
          </div>
          
          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
        
        {/* Text */}
        <div className="mt-8 text-center z-10">
          <h2 className="text-xl font-semibold mb-2">Cargando</h2>
          <p className="text-muted-foreground text-sm">
            Por favor espera un momento...
          </p>
        </div>
      </div>
    </div>
  );
} 