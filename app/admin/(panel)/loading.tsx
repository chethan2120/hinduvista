export default function AdminLoading() {
  return (
    <div className="max-w-xl" aria-live="polite">
      <p className="text-sm text-mute">Opening this page…</p>
      <div className="mt-6 h-8 w-48 bg-line" />
      <div className="mt-4 h-24 bg-white" />
    </div>
  );
}
