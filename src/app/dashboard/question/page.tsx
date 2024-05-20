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
import { useEffect, useState } from 'react';
import { QuestionFormData, QuestionFormDialog } from '@/components/dashboard/question/dialog';
import axios from 'axios';
import { API_URLS } from '@/api';

const metadata = { title: `Question | Dashboard | ${config.site.name}` } satisfies Metadata;

export interface EditableQuestion extends Question {
  _id: string;
  isEditing?: boolean;
}

const initialClasses: EditableQuestion[] = [];

export default function Page(): React.JSX.Element {
  const [quizId, setQuizId] = useState("");
  const [questions, setQuestions] = useState<EditableQuestion[]>(initialClasses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionFormData | undefined>(undefined);


  const fetchData = async () => {
    try {
      // add token to the header as Bearer token
      const token = localStorage.getItem('custom-auth-token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const storedQuizId = localStorage.getItem('currentQuizId');
      if(storedQuizId){
        setQuizId(storedQuizId);
        // localStorage.removeItem('currentQuizId');
        // console.log("id removed from local storage");
      }
      const response = await axios.get(`${API_URLS.getQuestionsByQuizId}/${storedQuizId}`, { headers });
      console.log("Questions Response", response.data.questions);
      setQuestions(response.data.questions);

      console.log("Questions", questions);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  }

  useEffect(() => {

    fetchData();

  }, []);

  
  // // Implement CRUD operations here
  // const addQuestion = (newClass: EditableQuestion) => {
  //   setQuestions([...questions, newClass]);
  // };

  const updateQuestion = (updatedQuestion: EditableQuestion) => {
    setQuestions(questions.map(q => q._id === updatedQuestion._id ? updatedQuestion : q));
  };

  const deleteQuestion = async (questionId: string) => {
    try{
      const token = localStorage.getItem('custom-auth-token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.delete(`${API_URLS.deleteQuestion}/${questionId}`, { headers });
      console.log("Question delete Response", response);
      setQuestions(questions.filter(q => q._id !== questionId));
    } catch (error){
      throw error
    }
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingQuestion(undefined); // Reset editing class
  };

  
  const handleAddOrUpdateQuestion = async (formData: QuestionFormData) => {
    const token = localStorage.getItem('custom-auth-token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };

    if (editingQuestion && editingQuestion.id) {
      const body = {
        questionId: editingQuestion.id,
        question: formData.question,
        answer: formData.answer,
      }
      console.log("body", body);
      const response = await axios.put(`${API_URLS.updateQuestion}/${editingQuestion.id}`, body, { headers });
      console.log(response);
      updateQuestion({ ...formData, _id: editingQuestion.id });
    } else { 
      console.log("formdata", formData);
      console.log("Quiz Id", quizId);
        const body = {
          quizId: quizId,
          question: formData.question,
          answer: formData.answer,
        }
        const response = await axios.post(`${API_URLS.createQuestion}`, body, { headers });
        console.log('add class response', response);
        fetchData();
        console.log("data fetched");
        setEditingQuestion(undefined); 
    }
  };

  const handleEdit = (questionToEdit: EditableQuestion) => {
    setEditingQuestion({
      id: questionToEdit._id,
      question: questionToEdit.question,
      answer: questionToEdit.answer,
      label: questionToEdit.label,
      true_grade: questionToEdit.true_grade,

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


