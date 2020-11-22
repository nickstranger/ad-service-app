import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export const useTableStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& .MuiPaper-root': {
        maxWidth: '1060px',
        margin: '0 auto',
        padding: theme.spacing(2, 3)
      },
      '& .MuiToolbar-gutters': {
        paddingLeft: 0,
        '@media (min-width: 600px)': {
          paddingLeft: theme.spacing(2)
        }
      },
      '& .MuiTypography-h6': {
        fontSize: '1.5rem',
        fontWeight: 400,
        color: theme.palette.primary.main
      },
      '& .MuiTableCell-root': {
        whiteSpace: 'pre'
      },
      '& .MuiTableCell-root.top': {
        verticalAlign: 'top'
      },
      '& .MuiTableCell-footer': {
        borderBottom: 'none'
      }
    },
    cursorPointer: {
      cursor: 'pointer'
    }
  })
);
