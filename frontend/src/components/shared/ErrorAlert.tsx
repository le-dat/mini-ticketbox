interface Props {
  message: string | null;
}

export const ErrorAlert = ({ message }: Props) => {
  if (!message) return null;

  return (
    <div className="bg-brand-danger/10 border border-brand-danger/30 p-4 rounded-2xl text-brand-danger text-sm font-semibold flex items-center gap-2.5">
      ⚠️ {message}
    </div>
  );
};
