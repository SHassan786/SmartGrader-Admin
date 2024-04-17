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
import { EditableQuestion } from '@/app/dashboard/question/page';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


function noop(): void {
  // do nothing
}

export interface Question {
  _id: string;
  question: String;
  answer: String;
  true_grade: Number;
  label: String;
}

interface QuestionTableProps {
  count?: number;
  page?: number;
  rows?: EditableQuestion[];
  rowsPerPage?: number;
  deleteQuestion: (classId: string) => void;
  onEditQuestion: (classData: EditableQuestion) => void;
}

export function QuestionTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
  deleteQuestion, onEditQuestion,
}: QuestionTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((question) => question._id);
  }, [rows]);

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
              <TableCell>Question</TableCell>
              <TableCell>Answer</TableCell>
              <TableCell>Label</TableCell>
              <TableCell><p> Actions </p></TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const isSelected = selected?.has(row._id);

                return (
                <TableRow hover key={row._id} selected={isSelected}>
                  <TableCell padding="checkbox">
                  <Checkbox
                    checked={isSelected}
                    onChange={(event) => {
                    if (event.target.checked) {
                      selectOne(row._id);
                    } else {
                      deselectOne(row._id);
                    }
                    }}
                  />
                  </TableCell>
                  <TableCell>
                  {row.question.toString()}
                  </TableCell>
                  <TableCell>
                  {row.answer.toString()}
                  </TableCell>
                  <TableCell>
                  {row.label.toString()}
                  </TableCell>
                  <TableCell>
                  <IconButton onClick={() => onEditQuestion(row)} aria-label="edit" style={{ marginRight: '10px'}}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => deleteQuestion(row._id)} aria-label="delete">
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
