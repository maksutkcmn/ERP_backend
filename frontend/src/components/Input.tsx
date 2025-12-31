type InputProps = {
    label: string,
    type?: string,
    value: string,
    onChange: (v: string) => void;
    name?: string;
    autoComplete?: string;
};

export function Input({
    label,
    type = "text",
    value,
    onChange,
    name,
    autoComplete
}: InputProps) {
    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-zinc-300 mb-2">
                {label}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                autoComplete={autoComplete}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-600/50 transition-all"
            />
        </div>
    );
}