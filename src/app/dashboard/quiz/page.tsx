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
import { useEffect, useState } from 'react';
import { QuizFormData, QuizFormDialog } from '@/components/dashboard/quiz/dialog';
import axios from 'axios';
import { API_URLS } from '@/api';

const metadata = { title: `Question | Dashboard | ${config.site.name}` } satisfies Metadata;

export interface EditableQuiz extends Quiz {
  id: string;
  isEditing?: boolean;
}

const initialClasses: EditableQuiz[] = [];

export default function Page(): React.JSX.Element {
  const [quizzes, setQuizzes] = useState<EditableQuiz[]>(initialClasses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<QuizFormData | undefined>(undefined);

  const fetchData = async () => {
    try {
      // add token to the header as Bearer token
      const token = localStorage.getItem('custom-auth-token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(API_URLS.getQuizzes, { headers });
      console.log("Quiz Response", response.data);
      setQuizzes(response.data);

      console.log("Quizzes", quizzes);
      console.log("quiz count", quizzes.length);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  }

  useEffect(() => {

    fetchData();

  }, []);


  const updateQuiz = (updatedQuiz: EditableQuiz) => {
    setQuizzes(quizzes.map(q => q.id === updatedQuiz.id ? updatedQuiz : q));
  };

  const deleteQuiz = async (quizId: string) => {
    try{
      const token = localStorage.getItem('custom-auth-token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.delete(`${API_URLS.deleteQuiz}/${quizId}`, { headers });
      console.log("delete Quiz Response", response);
      setQuizzes(quizzes.filter(q => q.id !== quizId));
    } catch (error){
      throw error
    }
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingQuiz(undefined); // Reset editing class
  };
  
  const handleUpdateQuestion = async (formData: QuizFormData) => {
    const token = localStorage.getItem('custom-auth-token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };

    if (editingQuiz && editingQuiz.id) {
      const body = {
        title: formData.title,
        start_time: formData.start_time,
        end_time: formData.end_time,
      }
      console.log("body", body);
      const response = await axios.put(`${API_URLS.updateQuiz}/${editingQuiz.id}`, body, { headers });
      console.log("Backend successfully updated Response", response);
      updateQuiz({ ...formData, id: editingQuiz.id });
    } 
    else {
      console.log("Updated Data not found");
    }
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
  const rowsPerPage = 25;

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
      </Stack>
      <QuizFilters
      onAddQuestion={handleOpenDialog}
       />
      <QuizTable
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
        onSubmit={handleUpdateQuestion}
      />
    </Stack>
  );
}

function applyPagination(rows: Quiz[], page: number, rowsPerPage: number): Quiz[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}


