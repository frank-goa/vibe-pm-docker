'use client';

interface NotesProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

export function Notes({ notes, onNotesChange }: NotesProps) {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide mb-3">
        Notes
      </h2>
      <textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        className="flex-1 w-full bg-zinc-800/50 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 resize-none font-mono leading-relaxed"
        placeholder="Write your notes here..."
      />
    </div>
  );
}
