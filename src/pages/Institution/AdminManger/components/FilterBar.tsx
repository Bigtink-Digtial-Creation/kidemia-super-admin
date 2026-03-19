import { Search } from "lucide-react";

interface FilterBarProps {
    search: string;
    onSearch: (v: string) => void;
    filterTier: string;
    onFilterTier: (v: string) => void;
    filterActive: '' | boolean;
    onFilterActive: (v: '' | boolean) => void;
    count: number;
}

export default function FilterBar({
    search,
    onSearch,
    filterTier,
    onFilterTier,
    filterActive,
    onFilterActive,
    count
}: FilterBarProps) {

    const selectCls =
        "border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 bg-gray-50 focus:outline-none w-full sm:w-auto";

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                    type="text"
                    placeholder="Search by name or code…"
                    value={search}
                    onChange={(e) => onSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e07b39]/30"
                />
            </div>

            <div className="flex gap-2">
                <select
                    value={filterTier}
                    onChange={(e) => onFilterTier(e.target.value)}
                    className={selectCls}
                >
                    <option value="">All Tiers</option>
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                    <option value="enterprise">Enterprise</option>
                </select>

                <select
                    value={filterActive === '' ? '' : String(filterActive)}
                    onChange={(e) => {
                        const value = e.target.value;

                        if (value === '') onFilterActive('');
                        else if (value === 'true') onFilterActive(true);
                        else onFilterActive(false);
                    }}
                    className={selectCls}
                >
                    <option value="">All Status</option>
                    <option value="true">Public</option>
                    <option value="false">Private</option>
                </select>
            </div>

            <span className="text-xs text-gray-400 text-right sm:ml-auto whitespace-nowrap">
                {count} institution{count !== 1 ? "s" : ""}
            </span>
        </div>
    );
}