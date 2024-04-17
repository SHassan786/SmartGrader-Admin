import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

import { useSelection } from '@/hooks/use-selection';
import { Button } from '@mui/material';
import { EditableQuiz } from '@/app/dashboard/quiz/page';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Question } from '../question/question-table';
import { useRouter } from 'next/navigation';


function noop(): void {
  // do nothing
}

export interface Quiz {
  id: string;
  title: String;
  questions: String[];
  start_time: Date;
  end_time: Date;
  is_active: boolean;
  is_relesead: boolean;
  class_id: String;

}

interface QuizTableProps {
  count?: number;
  page?: number;
  rows?: EditableQuiz[];
  rowsPerPage?: number;
  updateQuiz: (updatedClass: EditableQuiz) => void;
  deleteQuiz: (classId: string) => void;
  onEditQuiz: (classData: EditableQuiz) => void;
}

export function QuizTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
  deleteQuiz,
  onEditQuiz,
}: QuizTableProps): React.JSX.Element {
  const router = useRouter();
  const rowIds = React.useMemo(() => {
    return rows.map((question) => question.id);
  }, [rows]);


  const handleViewQuestions = (quizId: string) => {
    localStorage.setItem('currentQuizId', quizId);
    router.push(`/dashboard/question`);
  };

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Active Status</TableCell>
              <TableCell>Released Status</TableCell>
              <TableCell>Questions</TableCell>
              <TableCell><p> Actions </p></TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const isSelected = selected?.has(row.id);

              return (
                <TableRow hover key={row.id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(row.id);
                        } else {
                          deselectOne(row.id);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {row.title.toString()}
                  </TableCell>
                  <TableCell>
                    {row.start_time.toString()}
                  </TableCell>
                  <TableCell>
                    {row.end_time.toString()}
                  </TableCell>
                  <TableCell>
                    {row.is_active.toString()}
                  </TableCell>
                  <TableCell>
                    {row.is_relesead.toString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleViewQuestions(row.id)}
                    >
                      View
                    </Button>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick= {() => onEditQuiz(row)}
                      aria-label="edit" style={{ marginRight: '10px' }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => deleteQuiz(row.id)} aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={count}
        onPageChange={noop}
        onRowsPerPageChange={noop}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}
