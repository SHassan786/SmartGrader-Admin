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
import { QuestionFilters } from '@/components/dashboard/question/question-filters';
import { QuestionTable } from '@/components/dashboard/question/question-table';
import type { Question } from '@/components/dashboard/question/question-table';
import { useState } from 'react';
import { QuestionFormData, QuestionFormDialog } from '@/components/dashboard/question/dialog';

const metadata = { title: `Question | Dashboard | ${config.site.name}` } satisfies Metadata;

export interface EditableQuestion extends Question {
  id: string;
  isEditing?: boolean;
}

const initialClasses: EditableQuestion[] = [
  {
    id: '626d5ad8f2a5f3e8c1a7c123',
    question: "What is data mining?",
    answer: "this is my answerthis is my answerthis is my answerthis is my answerthis is my answerthis is mythis is my answerthis is my answerthis is my answerthis is my answerthis is my answerthis is m ",
    label: "Mining",
  },
  // Add more initial data as needed
];

export default function Page(): React.JSX.Element {
  const [questions, setQuestions] = useState<EditableQuestion[]>(initialClasses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionFormData | undefined>(undefined);

  
  // Implement CRUD operations here
  const addQuestion = (newClass: EditableQuestion) => {
    setQuestions([...questions, newClass]);
  };

  const updateQuestion = (updatedQuestion: EditableQuestion) => {
    setQuestions(questions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q));
  };

  const deleteQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingQuestion(undefined); // Reset editing class
  };

  function generateNewId() {
    // This example generates a random UUID, but you should use a method that
    // makes sense for your application and guarantees uniqueness as needed.
    return 'xxxx-xxxx-4xxx-yxxx-xxxx-xxxx'.replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  
  const handleAddOrUpdateQuestion = (formData: QuestionFormData) => {
    if (editingQuestion && editingQuestion.id) {
      updateQuestion({ ...formData, id: editingQuestion.id });
    } else {
      const newId = generateNewId(); // Generate a new ID for the new class
      addQuestion({ ...formData, id: newId });
    }
    // ... rest of your logic
  };

  const handleEdit = (questionToEdit: EditableQuestion) => {
    setEditingQuestion({
      id: questionToEdit.id,
      question: questionToEdit.question,
      answer: questionToEdit.answer,
      label: questionToEdit.label,

    });
    setIsDialogOpen(true); // Open the dialog for editing
  };
  
  

  const page = 0;
  const rowsPerPage = 5;

  const paginatedQuestions = applyPagination(questions, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Questions</Typography>
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
      <QuestionFilters
      onAddQuestion={handleOpenDialog}
       />
      <QuestionTable
        addQuestion={addQuestion}
        updateQuestion={updateQuestion}
        deleteQuestion={deleteQuestion}
        count={paginatedQuestions.length}
        page={page}
        rows={paginatedQuestions}
        rowsPerPage={rowsPerPage}
        onEditQuestion={handleEdit}
      />
      <QuestionFormDialog
        open={isDialogOpen}
        questionData={editingQuestion}
        onClose={handleCloseDialog}
        onSubmit={handleAddOrUpdateQuestion}
      />
    </Stack>
  );
}

function applyPagination(rows: Question[], page: number, rowsPerPage: number): Question[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}


