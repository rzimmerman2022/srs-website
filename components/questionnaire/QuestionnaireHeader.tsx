'use client';

interface QuestionnaireHeaderProps {
  title: string;
  packageType: string;
  clientName: string;
}

export default function QuestionnaireHeader({
  title,
  packageType,
  clientName
}: QuestionnaireHeaderProps) {
  return (
    <header className="bg-gradient-to-b from-[#0a1628] via-[#0d1f3c] to-[#0a1628] py-12 px-4 text-center border-b border-gold/20">
      {/* Logo */}
      <div className="mb-6">
        <div className="w-24 h-24 mx-auto relative">
          {/* Placeholder for logo - you'd use your actual logo */}
          <div className="w-full h-full rounded-full border-2 border-gold/60 bg-[#0d1f3c] flex items-center justify-center">
            <div className="text-center">
              <div className="text-[10px] text-gold/80 font-semibold tracking-wider">SOUTHWEST</div>
              <div className="text-[10px] text-gold font-bold tracking-wider">RESUME</div>
              <div className="text-[10px] text-gold/80 font-semibold tracking-wider">SERVICES</div>
              <div className="text-gold text-lg mt-0.5">✎</div>
            </div>
          </div>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-serif text-gold mb-3 tracking-wide">
        {title}<span className="text-gold/60">™</span>
      </h1>

      {/* Package Type */}
      <p className="text-gold/80 text-sm md:text-base mb-4">
        {packageType}
      </p>

      {/* Client Name */}
      <p className="text-gold text-lg md:text-xl font-medium tracking-widest uppercase">
        {clientName}
      </p>
    </header>
  );
}
