type CliffProgressProps = {
  progress: number;
};

export function CliffProgress({ progress }: CliffProgressProps) {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <div
      className="cliff-progress"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
    >
      <div className="cliff-progress-track">
        <div className="cliff-progress-fill" style={{ height: `${clamped}%` }} />
        <div className="cliff-progress-marker" />
      </div>
      <div className="cliff-progress-label">{Math.round(clamped)}%</div>
    </div>
  );
}

export default CliffProgress;

