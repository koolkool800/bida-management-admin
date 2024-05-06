// ** React Imports
import { useState, ChangeEvent } from 'react'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import Pencil from 'mdi-material-ui/Pencil'
import DeleteAlert from 'mdi-material-ui/DeleteAlert'
import { Backdrop, Box, Button, Fade, Modal, Typography, styled } from '@mui/material'
import { modalStyle } from 'src/configs/modal.config'
import { Employee } from 'src/types/user'

const ImgStyled = styled('img')(({ theme }) => ({
  width: 60,
  height: 60,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

interface Column {
  id: keyof Data
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: number) => string
  actions?: React.ReactNode
}

const columns: readonly Column[] = [
  { id: 'code', label: 'code', minWidth: 100 },
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'avatar', label: 'Avatar', minWidth: 170 },
  {
    id: 'email',
    label: 'Email',
    minWidth: 170,
    align: 'right'
  },
  {
    id: 'actions',
    label: 'Actions',
    minWidth: 170,
    align: 'right',
    actions: (
      <>
        <Pencil />
        <DeleteAlert />
      </>
    )
  }
]

interface Data {
  code: string
  name: string
  avatar: string
  email: string
  actions: React.ReactNode
}

function createData(code: string, avatar: string, name: string, email: string, actions: any): Data {
  return { code, name, avatar, email, actions }
}

type Props = {
  items: Employee[]
}

export const TableList = ({ items }: Props) => {
  // ** States
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)
  const [editedRow, setEditedRow] = useState<Data | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const handleOpenEditModal = (row: Data) => {
    setEditedRow(row)
    setEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setEditedRow(null)
    setEditModalOpen(false)
  }

  const handleOpenDeleteModal = () => {
    setDeleteModalOpen(true)
  }
  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false)
  }

  const handleSaveEditedRow = (updatedRow: Data) => {
    // Implement logic to save the updated row data
    // For example, you can update the rows array
    // and then close the modal
    handleCloseEditModal()
  }

  const rows: Data[] = items?.map(item => {
    return createData(
      item.id.toString(),
      '/images/avatars/1.png',
      item.name,
      item.user_name,
      <>
        <Pencil /> <DeleteAlert />
      </>
    )
  })

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.map(row => {
              return (
                <TableRow hover role='checkbox' tabIndex={-1} key={row.code}>
                  {columns.map(column => {
                    const value = row[column.id]

                    if (column.id === 'actions')
                      return (
                        <TableCell key={column.id} align='right'>
                          <Box>
                            {/* <Button onClick={() => handleOpenEditModal(row)}>
                              <Pencil />
                            </Button> */}
                            <Button onClick={() => handleOpenDeleteModal()}>
                              <DeleteAlert />
                            </Button>
                          </Box>
                        </TableCell>
                      )
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.id === 'avatar' ? (
                          <ImgStyled src={'/images/avatars/1.png'} alt='Profile Pic' />
                        ) : column.format && typeof value === 'number' ? (
                          column.format(value)
                        ) : (
                          value
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        open={editModalOpen}
        onClose={handleCloseEditModal}
        closeAfterTransition
        children={
          <Fade in={editModalOpen}>
            <Box sx={modalStyle}>
              <Typography id='transition-modal-title' variant='h6' component='h2'>
                Text in a modal
              </Typography>
              <Typography id='transition-modal-description' sx={{ mt: 2 }}>
                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
              </Typography>
            </Box>
          </Fade>
        }
      />
      {/* Render the edit modal component and pass editedRow and handleSaveEditedRow */}
      {/* For example: <EditModal row={editedRow} onSave={handleSaveEditedRow} /> */}

      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        closeAfterTransition
        children={
          <Fade in={deleteModalOpen}>
            <Box sx={modalStyle}>
              <Typography id='transition-modal-title' variant='h6' component='h2'>
                WARNING
              </Typography>
              <Typography id='transition-modal-description' sx={{ mt: 2 }}>
                You are coming to delete this employee. Are you sure?
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', pt: '1rem' }}>
                <Button variant='contained' onClick={() => {}}>
                  Cancel
                </Button>
                <Button variant='outlined' onClick={() => {}}>
                  Delete
                </Button>
              </Box>
            </Box>
          </Fade>
        }
      />

      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={rows?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}
