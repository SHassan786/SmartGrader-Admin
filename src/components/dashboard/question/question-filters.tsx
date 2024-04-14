import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { EditableClass } from '@/app/dashboard/course/page';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Button } from '@mui/material';

interface QuestionFiltersProps {
  onAddQuestion: () => void;
}

export function QuestionFilters({
  onAddQuestion
}: QuestionFiltersProps): React.JSX.Element {
  return (
    <Card sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
      <OutlinedInput
        defaultValue=""
        fullWidth
        placeholder="Search Question"
        startAdornment={
          <InputAdornment position="start">
            <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
          </InputAdornment>
        }
        sx={{ maxWidth: '500px' }}
      />
      <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={onAddQuestion}>
        Add
      </Button>
    </Card>
  );
}
