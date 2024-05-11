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
import { Order } from 'src/types/order'
import { KeyedMutator } from 'swr'
import { formatCurrency } from 'src/utils/price'
import { orderService } from 'src/services/order'
import toast from 'react-hot-toast'
import { getHourMinute } from 'src/utils/date'
import CheckOutline from 'mdi-material-ui/CheckOutline'
import Eye from 'mdi-material-ui/Eye'

import UpdateOrder from 'src/components/table-management/UpdateOrder'
import { useRouter } from 'next/router'

interface Column {
  id: keyof Data
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: any) => any
  actions?: React.ReactNode
}

const columns: readonly Column[] = [
  { id: 'tableName', label: 'Bàn', minWidth: 100 },
  { id: 'employeeName', label: 'Nhân viên', minWidth: 170 },
  {
    id: 'currentPrice',
    label: 'Giá/giờ',
    minWidth: 170,
    align: 'right',
    format: (value: number) => formatCurrency(value)
  },
  {
    id: 'startTime',
    label: 'Giờ bắt đầu',
    minWidth: 170,
    align: 'right',
    format: (value: string) => getHourMinute(value)
  },
  {
    id: 'endTime',
    label: 'Giờ kết thúc',
    minWidth: 170,
    align: 'right',
    format: (value: string) => getHourMinute(value)
  },
  {
    id: 'totalPrice',
    label: 'Tổng giá',
    minWidth: 170,
    align: 'right',
    format: (value: number) => formatCurrency(value)
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
  tableName: string
  employeeName: string
  currentPrice: number
  startTime: Date
  endTime?: Date
  totalPrice?: number
  actions: React.ReactNode
}

function createData(
  tableName: string,
  employeeName: string,
  currentPrice: number,
  startTime: Date,
  actions: React.ReactNode,
  endTime?: Date,
  totalPrice?: number
): Data {
  return {
    tableName,
    employeeName,
    currentPrice,
    startTime,
    endTime,
    totalPrice,
    actions
  }
}

type Props = {
  items: Order[]
  mutate: KeyedMutator<any>
}

export const OrderList = ({ items, mutate }: Props) => {
  // ** States
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)
  const [checkoutRow, setCheckoutRow] = useState<number | null>(null)
  const [openEditOrder, setOpenEditOrder] = useState<boolean>(false)
  const router = useRouter()

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const handleOpenCheckoutModal = (idx: number) => {
    setCheckoutRow(idx)
    setEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setCheckoutRow(null)
    setEditModalOpen(false)
  }

  const handleOpenDeleteModal = () => {
    setOpenEditOrder(true)
  }

  const handleCloseEditOrderModal = () => {
    setOpenEditOrder(false)
  }

  const handleSaveEditedRow = (updatedRow: Data) => {
    // Implement logic to save the updated row data
    // For example, you can update the rows array
    // and then close the modal
    handleCloseEditModal()
  }

  const rows: Data[] = items?.map(item => {
    return createData(
      item.tableName,
      item.employeeName,
      item.current_price,
      item.start_time,
      <>
        <Pencil />
        <DeleteAlert />
      </>,
      item.end_time,
      item.total_price
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

  const handleCheckOutTable = async () => {
    const orderId = items[checkoutRow || 0].id
    const r = await orderService.checkOut({ order_id: orderId })
    if (r?.message === 'Successfully')
      toast.success('Check out table successfully', {
        position: 'top-right'
      })

    mutate()
    handleCloseEditModal()
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
            {rows?.map((row, idx) => {
              return (
                <TableRow hover role='checkbox' tabIndex={-1} key={idx}>
                  {columns.map(column => {
                    const value = row[column.id]
                    if (column.id === 'actions')
                      return (
                        <TableCell key={column.id} align='right'>
                          <Box>
                            <Button
                              onClick={() => {
                                router.push(`/order/${items[idx].id}`)
                              }}
                            >
                              <Eye />
                            </Button>
                            <Button onClick={() => handleOpenCheckoutModal(idx)}>
                              <CheckOutline />
                            </Button>
                            {/* <Button onClick={() => handleOpenDeleteModal()}>
                              <Pencil />
                            </Button> */}
                          </Box>
                        </TableCell>
                      )
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
                Check out bàn
              </Typography>
              <Typography id='transition-modal-description' sx={{ mt: 2 }}>
                Bạn có chắc chắn muốn check out bàn này?
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', pt: '1rem' }}>
                <Button variant='contained' onClick={() => handleCloseEditModal()}>
                  Hủy
                </Button>
                <Button variant='outlined' onClick={() => handleCheckOutTable()}>
                  Check out
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
        open={openEditOrder}
        onClose={handleCloseEditOrderModal}
        closeAfterTransition
        children={
          <Fade in={openEditOrder}>
            <Box sx={modalStyle}>
              <UpdateOrder handleClose={handleCloseEditOrderModal} mutate={mutate} />
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
