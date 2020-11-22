import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useSidebarStyles = makeStyles((theme: Theme) =>
  createStyles({
    sidebar: {
      flexShrink: 0,
      width: theme.sizes.drawer
    },
    sidebarPaper: {
      width: theme.sizes.drawer
    },
    listItemIcon: {
      color: theme.palette.primary.main,
      marginRight: theme.spacing()
    }
  })
);
