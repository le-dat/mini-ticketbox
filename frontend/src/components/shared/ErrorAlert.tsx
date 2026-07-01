interface Props {
  message: string | null;
}

export const ErrorAlert = ({ message }: Props) => {
  if (!message) return null;

  return (
    <div className="bg-brand-danger/10 border border-amber-500/20 p-4 rounded-2xl text-sm font-semibold flex items-center gap-2.5">
      ⚠️ {message}
    </div>
  );
};
