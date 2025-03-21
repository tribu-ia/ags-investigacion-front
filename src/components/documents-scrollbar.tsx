'use client';

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Section {
    id: string;
    title: string;
}

interface DocumentsScrollbarProps {
    sections: Section[];
    selectedSectionId?: string | null;
    onSelectSection: (sectionId: string) => void;
}

export function DocumentsScrollbar({ sections, selectedSectionId, onSelectSection }: DocumentsScrollbarProps) {
    return (
        <div className="w-[200px] border-l ml-4 pl-4">
            <ScrollArea className="h-full">
                <div className="space-y-1">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => onSelectSection(section.id)}
                            className={cn(
                                'w-full text-left px-2 py-1 text-sm rounded-md transition-colors',
                                'hover:bg-accent hover:text-accent-foreground',
                                selectedSectionId === section.id
                                    ? 'bg-accent text-accent-foreground'
                                    : 'text-muted-foreground'
                            )}
                        >
                            {section.title}
                        </button>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
} 