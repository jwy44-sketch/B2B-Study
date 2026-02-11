'use client';

type QuestionFiltersProps = {
  search: string;
  onSearch: (value: string) => void;
  farPart: string;
  onFarPart: (value: string) => void;
  status: 'all' | 'mastered' | 'unmastered' | 'missed';
  onStatus: (value: 'all' | 'mastered' | 'unmastered' | 'missed') => void;
  farParts: number[];
};

export function QuestionFilters({ search, onSearch, farPart, onFarPart, status, onStatus, farParts }: QuestionFiltersProps) {
  return (
    <div className="card grid gap-3 md:grid-cols-3">
      <label className="text-sm">
        Search
        <input
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="keyword"
          className="mt-1 w-full rounded border border-slate-700 bg-slate-800 p-2"
        />
      </label>

      <label className="text-sm">
        FAR Part
        <select value={farPart} onChange={(event) => onFarPart(event.target.value)} className="mt-1 w-full rounded border border-slate-700 bg-slate-800 p-2">
          <option value="all">All</option>
          {farParts.map((part) => <option key={part} value={String(part)}>Part {part}</option>)}
        </select>
      </label>

      <label className="text-sm">
        Status
        <select value={status} onChange={(event) => onStatus(event.target.value as QuestionFiltersProps['status'])} className="mt-1 w-full rounded border border-slate-700 bg-slate-800 p-2">
          <option value="all">All</option>
          <option value="mastered">Mastered</option>
          <option value="unmastered">Unmastered</option>
          <option value="missed">Missed</option>
        </select>
      </label>
    </div>
  );
}
