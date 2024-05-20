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
import { CourseFilters } from '@/components/dashboard/course/course-filters';
import { ClassesTable } from '@/components/dashboard/course/course-table';
import type { Class } from '@/components/dashboard/course/course-table';
import { useState, useEffect } from 'react';
import { ClassFormData, ClassFormDialog } from '@/components/dashboard/course/dialog';

import axios from 'axios';
import { API_URLS } from '@/api';

const metadata = { title: `Customers | Dashboard | ${config.site.name}` } satisfies Metadata;

export interface EditableClass extends Class {
  _id: string;
  isEditing?: boolean;
}

const initialClasses: EditableClass[] = [
];

export default function Page(): React.JSX.Element {
  const [classes, setClasses] = useState<EditableClass[]>(initialClasses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassFormData | undefined>(undefined);

  const fetchData = async () => {
    try {
      // add token to the header as Bearer token
      const token = localStorage.getItem('custom-auth-token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(API_URLS.classes, { headers });
      setClasses(response.data);
      console.log(response.data);
      console.log("Classes", classes);
      console.log("class count", classes.length);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  }

  useEffect(() => {

    fetchData();

  }, []);

  const updateClass = (updatedClass: EditableClass) => {
    setClasses(classes.map(c => c._id === updatedClass._id ? updatedClass : c));
  };

  // call delete Api
  const deleteClass = async (classId: string) => {
    try{
      const token = localStorage.getItem('custom-auth-token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.delete(`${API_URLS.deleteClass}/${classId}`, { headers });
      console.log("Response", response);
      setClasses(classes.filter(c => c._id !== classId));
    } catch (error){
      throw error
    }
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingClass(undefined); // Reset editing class
  };
  
  const handleAddOrUpdateClass = async (formData: ClassFormData) => {
    try {
      // add token to the header as Bearer token
      const token = localStorage.getItem('custom-auth-token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      if (editingClass && editingClass._id) {  
        const body = {
          name: formData.course_name,
          description: formData.description,
        }
        console.log("body", body);
        const response = await axios.put(`${API_URLS.updateClass}/${editingClass._id}`, body, { headers });
        updateClass({ ...formData, _id: editingClass._id });
         
      } else {
        console.log("formdata", formData);
        const body = {
          name: formData.course_name,
          description: formData.description,
        }
        const response = await axios.post(API_URLS.addClass, body, { headers });
        console.log('add class response', response);
        fetchData();
        console.log("data fetched");
        setEditingClass(undefined); 
        
      }

      
    } catch (error) {

      console.error('Error fetching classes:', error);
    }
  };

  const handleEdit = (classToEdit: EditableClass) => {
    setEditingClass({
      _id: classToEdit._id,
      course_name: classToEdit.course_name,
      description: classToEdit.description,
      studentEnrolledCount: classToEdit.studentEnrolledCount,
      join_code: classToEdit.join_code,
      quizCreated: classToEdit.quizCreated,
    });
    setIsDialogOpen(true); // Open the dialog for editing
  };
  
  

  const page = 0;
  const rowsPerPage = 25;

  const paginatedClasses = applyPagination(classes, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Classes</Typography>
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
      <CourseFilters
      onAddClass={handleOpenDialog}
       />
      <ClassesTable
        deleteClass={deleteClass}
        count={paginatedClasses.length}
        page={page}
        rows={paginatedClasses}
        rowsPerPage={rowsPerPage}
        onEditClass={handleEdit}
      />
      <ClassFormDialog
        open={isDialogOpen}
        classData={editingClass}
        onClose={handleCloseDialog}
        onSubmit={handleAddOrUpdateClass}
      />
    </Stack>
  );
}

// this is not working
function applyPagination(rows: Class[], page: number, rowsPerPage: number): Class[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}


