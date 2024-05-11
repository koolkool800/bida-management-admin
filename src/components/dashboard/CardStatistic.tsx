// ** MUI Imports
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'

type Props = {
  title: string
  icon: any
  value: string
}

const CardStatistic = (props: Props) => {
  return (
    <Card>
      <CardContent
        sx={{
          display: 'flex',
          textAlign: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          padding: theme => `${theme.spacing(9.75, 5, 9.25)} !important`
        }}
      >
        <Avatar
          sx={{ width: 50, height: 50, marginBottom: 2.25, color: 'common.white', backgroundColor: 'primary.main' }}
        >
          <props.icon />
        </Avatar>
        <Typography variant='h6' sx={{ marginBottom: 2.75 }}>
          {props.title}
        </Typography>
        <Typography variant='h4' sx={{ marginBottom: 6 }}>
          {props.value}
        </Typography>
        {/* <Button variant='contained' sx={{ padding: theme => theme.spacing(1.75, 5.5) }}>
          Contact Now
        </Button> */}
      </CardContent>
    </Card>
  )
}

export default CardStatistic
