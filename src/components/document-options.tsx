'use client';

import { Button } from "@/components/ui/button";
import { DocumentOptionsState } from "@/types/document-options-state";
import { Grid2X2, Rows } from "lucide-react";

interface DocumentOptionsProps {
    state: DocumentOptionsState;
    onChange: (change: Partial<DocumentOptionsState>) => void;
    canEdit: boolean;
}

export default function DocumentOptions({ state, onChange, canEdit }: DocumentOptionsProps) {
    return (
        <div className="flex items-center justify-between mb-4 gap-4">
            <div className="flex items-center gap-2">
                <Button
                    variant={state.mode === 'full' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onChange({ mode: 'full' })}
                >
                    <Grid2X2 className="h-4 w-4 mr-2" />
                    Vista Completa
                </Button>
                <Button
                    variant={state.mode === 'section' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onChange({ mode: 'section' })}
                >
                    <Rows className="h-4 w-4 mr-2" />
                    Por Sección
                </Button>
            </div>
            {canEdit && (
                <Button
                    variant={state.editMode ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onChange({ editMode: !state.editMode })}
                >
                    {state.editMode ? 'Guardar Cambios' : 'Editar'}
                </Button>
            )}
        </div>
    );
} 