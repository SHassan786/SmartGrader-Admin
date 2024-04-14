'use client';

import * as React  from 'react';
import type { Metadata } from 'next';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import dayjs from 'dayjs';

import { config } from '@/config';
import { QuizFilters } from '@/components/dashboard/quiz/quiz-filters';
import { QuizTable } from '@/components/dashboard/quiz/quiz-table';
import type { Quiz } from '@/components/dashboard/quiz/quiz-table';
import { useState } from 'react';
import { QuizFormData, QuizFormDialog } from '@/components/dashboard/quiz/dialog';

const metadata = { title: `Question | Dashboard | ${config.site.name}` } satisfies Metadata;

export interface EditableQuiz extends Quiz {
  id: string;
  isEditing?: boolean;
}

const initialClasses: EditableQuiz[] = [
  {
    id: '626d5ad8f2a5f3e8c1a7c123',
    title: "Science Quiz 1",
    questions: ["What is the capital of France?", "What is the capital of Germany?"],
    class_id: "626d5ad8f2a5f3e8c1a7c123",
    is_active: true,
    is_relesead: true,
    start_time: dayjs().subtract(1, 'day').toDate(),
    end_time: dayjs().add(1, 'day').toDate(),
  },
  // Add more initial data as needed
];

export default function Page(): React.JSX.Element {
  const [quizzes, setQuizzes] = useState<EditableQuiz[]>(initialClasses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<QuizFormData | undefined>(undefined);

  
  // Implement CRUD operations here
  const addQuiz = (newClass: EditableQuiz) => {
    setQuizzes([...quizzes, newClass]);
  };

  const updateQuiz = (updatedQuiz: EditableQuiz) => {
    setQuizzes(quizzes.map(q => q.id === updatedQuiz.id ? updatedQuiz : q));
  };

  const deleteQuiz = (quizId: string) => {
    setQuizzes(quizzes.filter(q => q.id !== quizId));
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingQuiz(undefined); // Reset editing class
  };

  function generateNewId() {
    // This example generates a random UUID, but you should use a method that
    // makes sense for your application and guarantees uniqueness as needed.
    return 'xxxx-xxxx-4xxx-yxxx-xxxx-xxxx'.replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  
  const handleAddOrUpdateQuestion = (formData: QuizFormData) => {
    if (editingQuiz && editingQuiz.id) {
      updateQuiz({ ...formData, id: editingQuiz.id });
    } else {
      const newId = generateNewId(); // Generate a new ID for the new class
      addQuiz({ ...formData, id: newId });
    }
    // ... rest of your logic
  };

  const handleEdit = (quizToEdit: EditableQuiz) => {
    setEditingQuiz({
      id: quizToEdit.id,
      title: quizToEdit.title,
      start_time: quizToEdit.start_time,
      end_time: quizToEdit.end_time,
      is_active: quizToEdit.is_active,
      is_relesead: quizToEdit.is_relesead,
      questions: quizToEdit.questions,
      class_id: quizToEdit.class_id,
    });
    setIsDialogOpen(true); // Open the dialog for editing
  };
  
  

  const page = 0;
  const rowsPerPage = 5;

  const paginatedQuizzes = applyPagination(quizzes, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Quizzes</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack>
        </Stack>
        {/* <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={handleOpenDialog}>
            Add
          </Button>
        </div> */}
      </Stack>
      <QuizFilters
      onAddQuestion={handleOpenDialog}
       />
      <QuizTable
        addQuiz={addQuiz}
        updateQuiz={updateQuiz}
        deleteQuiz={deleteQuiz}
        count={paginatedQuizzes.length}
        page={page}
        rows={paginatedQuizzes}
        rowsPerPage={rowsPerPage}
        onEditQuiz={handleEdit}
      />
      <QuizFormDialog
        open={isDialogOpen}
        quizData={editingQuiz}
        onClose={handleCloseDialog}
        onSubmit={handleAddOrUpdateQuestion}
      />
    </Stack>
  );
}

function applyPagination(rows: Quiz[], page: number, rowsPerPage: number): Quiz[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}


