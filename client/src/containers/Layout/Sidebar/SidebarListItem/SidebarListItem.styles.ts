import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useSidebarListItemStyles = makeStyles((theme: Theme) =>
  createStyles({
    passiveListItem: {
      cursor: 'default'
    },
    nestedListItem: {
      paddingLeft: theme.spacing(6)
    }
  })
);
