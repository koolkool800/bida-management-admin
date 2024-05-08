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
import { TableType } from 'src/types/table'
import { tableService } from 'src/services/table'
import toast from 'react-hot-toast'
import { KeyedMutator } from 'swr'
import { orderService } from 'src/services/order'
import { getColorByTableType } from 'src/utils/color'
import { API_URL } from 'src/constants/environment'
import { formatCurrency } from 'src/utils/price'
import { getUserLocal } from 'src/utils/localStorage'

interface Column {
  id: keyof Data
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: any) => any
  actions?: React.ReactNode
}

const columns: readonly Column[] = [
  { id: 'code', label: 'code', minWidth: 100 },
  { id: 'name', label: 'Tên bàn', minWidth: 170 },
  {
    id: 'avatar',
    label: 'Bida',
    minWidth: 170,
    format: (value: string) => <img src={value} alt='bida' style={{ width: '200px', height: '100px' }} />
  },
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
    id: 'is_available',
    label: 'Có sẵn',
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
  avatar: string
  price: number
  type: string // VIP || NORMAL
  is_available: boolean
  actions: React.ReactNode
}

function createData(
  code: string,
  name: string,
  avatar: string,
  price: number,
  type: string,
  is_available: boolean,
  actions: any
): Data {
  return { code, name, avatar, price, type, is_available, actions }
}

type Props = {
  items: TableType[]
  mutate: KeyedMutator<any>
  mutateOrder: KeyedMutator<any>
  mutateBooking: KeyedMutator<any>
  setQueryParams: (params: string) => void
}
export const TableList = ({ items, mutate, mutateOrder, setQueryParams, mutateBooking }: Props) => {
  // ** States
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)
  const [checkInRow, setCheckInRow] = useState<Data | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [currentDeleteId, setCurrentDeleteId] = useState<string | null>(null)
  const user = getUserLocal()

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
    setQueryParams(`pageSize=${+event.target.value}&pageIndex=${1}`)
    // mutate([`${API_URL}/tables`, `?pageSize=${rowsPerPage}&pageIndex=${1}`])
  }

  const handleOpenEditModal = (row: Data) => {
    setCheckInRow(row)
    setEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setCheckInRow(null)
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
    const r = await tableService.delete(Number(currentDeleteId))
    if (r?.message === 'Successfully')
      toast.success('Delete table successfully', {
        position: 'top-right'
      })

    mutate()
    handleCloseDeleteModal()
  }

  const handleCheckInTable = async () => {
    const r = await orderService.checkIn({
      table_id: Number(checkInRow?.code),
      user_id: user?.id as number
    })

    if (r?.message === 'Successfully')
      toast.success('Check in table successfully', {
        position: 'top-right'
      })

    mutate()
    mutateOrder()
    mutateBooking()
    handleCloseEditModal()
  }

  const rows: Data[] = items?.map(item => {
    return createData(
      item.id.toString(),
      item.name,
      'https://scontent.fsgn8-4.fna.fbcdn.net/v/t1.15752-9/438270987_6858749857560668_8307698790179701267_n.png?_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_ohc=C0bzvp88GdoQ7kNvgHO4eyX&_nc_ht=scontent.fsgn8-4.fna&oh=03_Q7cD1QHdBre8BoS-eyLlY1i2Im-AuRLO3ThD-cOGlqUtret2UQ&oe=6662AEA2',
      item.price,
      item.type,
      Boolean(item.is_available),
      <>
        <Pencil /> <DeleteAlert />
      </>
    )
  })

  const renderValue = (column: Column, value: any) => {
    if (typeof value === 'boolean')
      return (
        <Chip
          label={value ? 'Available' : 'Not available'}
          color={value ? 'success' : 'error'}
          sx={{
            height: 24,
            fontSize: '0.75rem',
            textTransform: 'capitalize',
            '& .MuiChip-label': { fontWeight: 500 }
          }}
        />
      )
    if (column.format) return column.format(value)
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
                    if (column.id === 'actions')
                      return (
                        <TableCell key={column.id} align='right'>
                          <Box>
                            <Button disabled={!Boolean(row['is_available'])} onClick={() => handleOpenEditModal(row)}>
                              <Pencil />
                            </Button>
                            <Button onClick={() => handleOpenDeleteModal(row)}>
                              <DeleteAlert />
                            </Button>
                          </Box>
                        </TableCell>
                      )
                    else if (column.id === 'type') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <Chip
                            label={value}
                            color={getColorByTableType(value as string) as any}
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
                Check in bàn
              </Typography>
              <Typography id='transition-modal-description' sx={{ mt: 2 }}>
                Bạn có muốn check in bàn này không?
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', pt: '1rem' }}>
                <Button variant='contained' onClick={() => handleCloseEditModal()}>
                  Hủy
                </Button>
                <Button variant='outlined' onClick={() => handleCheckInTable()}>
                  Check in
                </Button>
              </Box>
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
                Bạn đang thực hiện xóa bàn này. Bạn có chắc chắn muốn xóa không?
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
        rowsPerPageOptions={[2, 10, 25, 100]}
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
