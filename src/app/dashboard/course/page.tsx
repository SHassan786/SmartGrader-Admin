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
import { CustomersFilters } from '@/components/dashboard/course/course-filters';
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
  // {
  //   _id: '626d5ad8f2a5f3e8c1a7c123',
  //   course_name: "Introduction to Computer Science",
  //   avg_rating: {
  //     $numberDecimal: "4.5"
  //   },
  //   join_code: 123456,
  //   quizCreated: 2,
  //   studentEnrolledCount: 2,
  // },
  // Add more initial data as needed
];

export default function Page(): React.JSX.Element {
  const [classes, setClasses] = useState<EditableClass[]>(initialClasses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassFormData | undefined>(undefined);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        // add token to the header as Bearer token
        const token = localStorage.getItem('custom-auth-token');
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.get(API_URLS.classes, { headers });
        setClasses(response.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    }

    fetchData();

  }, []);
  
  // Implement CRUD operations here
  const addClass = (newClass: EditableClass) => {
    setClasses([...classes, newClass]);
  };

  const updateClass = (updatedClass: EditableClass) => {
    // setClasses(classes.map(c => c.id === updatedClass.id ? updatedClass : c));
  };

  const deleteClass = (classId: string) => {
    // setClasses(classes.filter(c => c.id !== classId));
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingClass(undefined); // Reset editing class
  };

  function generateNewId() {
    // This example generates a random UUID, but you should use a method that
    // makes sense for your application and guarantees uniqueness as needed.
    return 'xxxx-xxxx-4xxx-yxxx-xxxx-xxxx'.replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  
  const handleAddOrUpdateClass = (formData: ClassFormData) => {
    // if (editingClass && editingClass._id) {
    //   updateClass({ ...formData, _id: editingClass._id });
    // } else {
    //   const newId = generateNewId(); // Generate a new ID for the new class
    //   addClass({ ...formData, _id: newId });
    // }
    // ... rest of your logic
  };

  const handleEdit = (classToEdit: EditableClass) => {
    // setEditingClass({
    //   id: classToEdit.id,
    //   course_name: classToEdit.course_name,
    //   studentEnrolledCount: classToEdit.studentEnrolledCount,
    //   avg_rating: classToEdit.avg_rating,
    //   join_code: classToEdit.join_code,
    //   quizCreated: classToEdit.quizCreated,
    // });
    setIsDialogOpen(true); // Open the dialog for editing
  };
  
  

  const page = 0;
  const rowsPerPage = 5;

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
      <CustomersFilters
      onAddClass={handleOpenDialog}
       />
      <ClassesTable
        addClass={addClass}
        updateClass={updateClass}
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

function applyPagination(rows: Class[], page: number, rowsPerPage: number): Class[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}


