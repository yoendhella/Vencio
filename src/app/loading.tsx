import Image from 'next/image';

export default function Loading() {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center gap-6 z-50"
      style={{ backgroundColor: '#060D1A' }}
    >
      <div className="flex flex-col items-center gap-3">
        <Image
          src="/brand/vencio_icon_128.png"
          alt="Vencio"
          width={64}
          height={64}
          className="object-contain animate-pulse"
          priority
          unoptimized
        />
        <span
          className="text-xl font-extrabold tracking-tight"
          style={{
            background: 'linear-gradient(135deg, #1E5FD4, #2EB8E6, #00C97A)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          VENCIO
        </span>
      </div>

      <div
        className="w-32 h-1 rounded-full overflow-hidden"
        style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
      >
        <div
          className="h-full rounded-full animate-loading-bar"
          style={{ background: 'linear-gradient(90deg, #1E5FD4, #2EB8E6, #00C97A)' }}
        />
      </div>
    </div>
  );
}
