// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import DotsVertical from 'mdi-material-ui/DotsVertical'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import { ProductStatistic } from 'src/types/menu'
// ** Custom Components Imports

const ReactApexcharts = dynamic(() => import('react-apexcharts'), { ssr: false })

const RevenueChart = ({ items }: { items: ProductStatistic[] }) => {
  // ** Hook

  const transformData = (data: ProductStatistic[]) => {
    const hihi = [
      { date: '2024-05-23', total_import_quantity: 3, total_export_quantity: 1 },
      { date: '2024-05-24', total_import_quantity: 5, total_export_quantity: 2 }
      // Add more data as needed
    ]

    const dates = data?.map((item, idx) => item?.date || hihi[0].date) ?? hihi.map((item, idx) => item.date)
    const importQuantities = data?.map(item => item?.total_import_quantity)
    const exportQuantities = data?.map(item => item?.total_export_quantity)

    return {
      dates,
      importQuantities,
      exportQuantities
    }
  }
  const { dates, importQuantities, exportQuantities } = transformData(items)
  // const options: ApexOptions = {
  //   chart: {
  //     parentHeightOffset: 0,
  //     toolbar: { show: false }
  //   },
  //   plotOptions: {
  //     bar: {
  //       borderRadius: 9,
  //       distributed: true,
  //       columnWidth: '40%',
  //       endingShape: 'rounded',
  //       startingShape: 'rounded'
  //     }
  //   },
  //   stroke: {
  //     width: 2,
  //     colors: [theme.palette.background.paper]
  //   },
  //   legend: { show: false },
  //   grid: {
  //     strokeDashArray: 7,
  //     padding: {
  //       top: -1,
  //       right: 0,
  //       left: -12,
  //       bottom: 5
  //     }
  //   },
  //   dataLabels: { enabled: false },
  //   colors: [
  //     theme.palette.background.default,
  //     theme.palette.background.default,
  //     theme.palette.background.default,
  //     theme.palette.primary.main,
  //     theme.palette.background.default,
  //     theme.palette.background.default
  //   ],
  //   states: {
  //     hover: {
  //       filter: { type: 'none' }
  //     },
  //     active: {
  //       filter: { type: 'none' }
  //     }
  //   },
  //   xaxis: {
  //     categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  //     tickPlacement: 'on',
  //     labels: { show: false },
  //     axisTicks: { show: false },
  //     axisBorder: { show: false }
  //   },
  //   yaxis: {
  //     show: true,
  //     tickAmount: 4,
  //     labels: {
  //       offsetX: -17,
  //       formatter: value => `${value > 999 ? `${(value / 1000).toFixed(0)}` : value}k`
  //     }
  //   }
  // }
  const options = {
    chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['white'] // Example color for data labels
      }
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: dates,
      labels: {
        style: {
          colors: 'white',
          fontSize: '16px',
          fontWeight: 400
        }
      }
    },
    yaxis: {
      title: {
        text: 'Quantity',
        style: {
          color: 'white' // Green color for y-axis title
        }
      },
      labels: {
        style: {
          colors: 'white', // Blue color for y-axis labels
          fontSize: '16px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 400
        }
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return val
        },
        style: {
          color: 'black'
        }
      }
    }
  }
  const series = [
    {
      name: 'Import Quantity',
      data: importQuantities
    },
    {
      name: 'Export Quantity',
      data: exportQuantities
    }
  ]
  return (
    <Card>
      <CardHeader
        title='Theo dõi thống kê'
        titleTypographyProps={{
          sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important' }
        }}
        action={
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
            <DotsVertical />
          </IconButton>
        }
      />
      <CardContent sx={{ '& .apexcharts-xcrosshairs.apexcharts-active': { opacity: 0 } }}>
        <ReactApexcharts
          type='bar'
          height={205}
          options={options as any}
          // series={[{ data: [37, 57, 45, 75, 57, 40, 65] }]}
          series={series}
        />
      </CardContent>
    </Card>
  )
}

export default RevenueChart
