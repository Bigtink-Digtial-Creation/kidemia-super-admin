import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { ApiSDK } from "../../../sdk";
import { QueryKeys } from "../../../utils/queryKeys";


interface Topic {
    id: string;
    name: string;
}

interface TopicsSelectProps {
    selectedTopicIds: string[];
    onChange: (ids: string[]) => void;
    subjectId: string;
}

export default function TopicsSelect({
    selectedTopicIds,
    onChange,
    subjectId,
}: TopicsSelectProps) {

    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { data: topicsData } = useQuery({
        queryKey: [QueryKeys.singleSubject, subjectId],
        queryFn: () => ApiSDK.SubjectTopicsService.getTopicsBySubjectApiV1TopicsSubjectSubjectIdGet(subjectId || ''),
        enabled: !!subjectId,
    });

    const topicsForSubject = topicsData?.items || [];

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredTopics = topicsForSubject.filter((t: Topic) =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedTopics = topicsForSubject.filter((t: Topic) =>
        selectedTopicIds.includes(t.id)
    );

    const toggleTopic = (topicId: string) => {
        if (selectedTopicIds.includes(topicId)) {
            onChange(selectedTopicIds.filter(id => id !== topicId));
        } else {
            onChange([...selectedTopicIds, topicId]);
        }
    };

    const removeTopic = (topicId: string) => {
        onChange(selectedTopicIds.filter(id => id !== topicId));
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <label className="text-sm font-semibold text-gray-900 block mb-2">
                Topics (optional)
            </label>

            {/* Selected topics pills */}
            {selectedTopics.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                    {selectedTopics.map(topic => (
                        <span
                            key={topic.id}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                            {topic.name}
                            <button
                                type="button"
                                onClick={() => removeTopic(topic.id)}
                                className="hover:bg-blue-200 rounded-full p-0.5"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* Dropdown trigger */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <span className="text-gray-700">
                    {selectedTopics.length > 0
                        ? `${selectedTopics.length} topic${selectedTopics.length > 1 ? 's' : ''} selected`
                        : 'Select topics'}
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown menu */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 flex flex-col">
                    {/* Search input */}
                    <div className="p-2 border-b border-gray-200">
                        <input
                            type="text"
                            placeholder="Search topics..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>

                    {/* Topics list */}
                    <div className="overflow-y-auto flex-1">
                        {filteredTopics.length > 0 ? (
                            filteredTopics.map(topic => {
                                const isSelected = selectedTopicIds.includes(topic.id);
                                return (
                                    <button
                                        key={topic.id}
                                        type="button"
                                        onClick={() => toggleTopic(topic.id)}
                                        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 text-left"
                                    >
                                        <span className="text-gray-900">{topic.name}</span>
                                        {isSelected && (
                                            <Check className="w-5 h-5 text-blue-600" />
                                        )}
                                    </button>
                                );
                            })
                        ) : (
                            <div className="px-4 py-8 text-center text-gray-500">
                                No topics found
                            </div>
                        )}
                    </div>

                    {/* Footer with count */}
                    {filteredTopics.length > 0 && (
                        <div className="p-2 border-t border-gray-200 text-sm text-gray-600 text-center">
                            {filteredTopics.length} topic{filteredTopics.length > 1 ? 's' : ''} available
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

