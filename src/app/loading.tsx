import { VencioIcon } from '@/components/ui/VencioLogo';

export default function Loading() {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center gap-5 z-50"
      style={{ backgroundColor: '#060D1A' }}
    >
      <div className="animate-pulse-brand">
        <VencioIcon variant="square-navy" size={64} />
      </div>
      <span
        className="text-gradient text-xl font-extrabold tracking-tight"
        style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
      >
        VENCIO
      </span>
      <div
        className="w-36 h-1 rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.08)' }}
      >
        <div
          className="h-full rounded-full animate-loading-bar"
          style={{ background: 'linear-gradient(90deg, #1E5FD4, #2EB8E6, #00C97A)' }}
        />
      </div>
    </div>
  );
}
