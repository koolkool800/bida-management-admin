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
import Check from 'mdi-material-ui/Check'
import Cancel from 'mdi-material-ui/Cancel'
import DeleteAlert from 'mdi-material-ui/DeleteAlert'
import { Backdrop, Box, Button, Chip, Fade, Modal, Typography } from '@mui/material'
import { modalStyle } from 'src/configs/modal.config'
import useSWR, { KeyedMutator } from 'swr'
import { API_URL } from 'src/constants/environment'
import { fetcher } from 'src/libs/axios'
import { SettingTable } from 'src/types/setting'
import { formatCurrency } from 'src/utils/price'
import { getColorByMenuType, getColorByTableType } from 'src/utils/color'
import { settingService } from 'src/services/setting'
import toast from 'react-hot-toast'
import { Menu, MenuType } from 'src/types/menu'

interface Column {
  id: keyof Data
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: number) => string
  actions?: React.ReactNode
}

const columns: readonly Column[] = [
  { id: 'code', label: 'code', minWidth: 10 },
  { id: 'name', label: 'Tên', minWidth: 100 },
  {
    id: 'price',
    label: 'Giá',
    minWidth: 170,
    align: 'right',
    format: (value: number) => formatCurrency(value)
  },
  {
    id: 'type',
    label: 'Loại bàn',
    minWidth: 170,
    align: 'right'
  },

  {
    id: 'actions',
    label: 'Hành động',
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
  price: number
  type: MenuType
  actions: React.ReactNode
}

function createData(code: string, name: string, price: number, type: MenuType, actions: any): Data {
  return { code, name, price, type, actions }
}

export const TableList = ({
  items
}: //  mutate
{
  items: Menu[]

  // mutate: KeyedMutator<any>
}) => {
  // ** States
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)
  const [editedRow, setEditedRow] = useState<Data | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [currentDeleteId, setCurrentDeleteId] = useState<string | null>(null)

  const rows = items?.map(item =>
    createData(
      item.id.toString(),
      item.name,
      item.price,
      item.type,
      <>
        <Pencil /> <DeleteAlert />
      </>
    )
  )

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

  const handleOpenDeleteModal = (row: Data) => {
    setDeleteModalOpen(true)
    setCurrentDeleteId(row.code)
  }
  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false)
    setCurrentDeleteId(null)
  }

  const handleSaveEditedRow = (updatedRow: Data) => {
    // Implement logic to save the updated row data
    // For example, you can update the rows array
    // and then close the modal
    handleCloseEditModal()
  }

  const handleDeleteRow = async () => {
    const r = await settingService.delete(Number(currentDeleteId))
    if (r?.message === 'Successfully')
      toast.success('Delete table successfully', {
        position: 'top-right'
      })

    // mutate()
    handleCloseDeleteModal()
  }

  const renderValue = (column: Column, value: any) => {
    if (typeof value === 'boolean') return value ? <Check /> : <Cancel />
    else if (column.format) return column.format(value)
    return value
  }

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
                    if (column.id === 'actions') {
                      return (
                        <TableCell key={column.id} align='right'>
                          <Box>
                            {/* <Button onClick={() => handleOpenEditModal(row)}>
                              <Pencil />
                            </Button> */}
                            <Button onClick={() => handleOpenDeleteModal(row)}>
                              <DeleteAlert />
                            </Button>
                          </Box>
                        </TableCell>
                      )
                    } else if (column.id === 'type') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <Chip
                            label={value}
                            color={getColorByMenuType(value as string) as any}
                            sx={{
                              height: 24,
                              fontSize: '0.75rem',
                              textTransform: 'capitalize',
                              '& .MuiChip-label': { fontWeight: 500 }
                            }}
                          />
                        </TableCell>
                      )
                    }
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {/* {column.format && typeof value === 'number' ? column.format(value) : value} */}
                        {renderValue(column, value)}
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
      {/* Delete Modal*/}
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
                CẢNH BÁO
              </Typography>
              <Typography id='transition-modal-description' sx={{ mt: 2 }}>
                Bạn có chắc chắn muốn xóa bàn này không?
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', pt: '1rem' }}>
                <Button variant='contained' onClick={() => handleCloseDeleteModal()}>
                  Hủy
                </Button>
                <Button variant='outlined' onClick={() => handleDeleteRow()}>
                  Xóa
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
