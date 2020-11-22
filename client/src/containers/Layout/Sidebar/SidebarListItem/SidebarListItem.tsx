import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { useSidebarListItemStyles } from './SidebarListItem.styles';

interface Props {
  text: string;
  nested?: boolean;
  to?: string;
  selected?: boolean;
}

export const SidebarListItem: FC<Props> = ({ text, nested, to, children, ...rest }) => {
  const classes = useSidebarListItemStyles();

  if (to) {
    return (
      <ListItem
        component={NavLink}
        button
        to={to}
        className={nested ? classes.nestedListItem : ''}
        {...rest}
      >
        {children}
        <ListItemText primary={text} primaryTypographyProps={{ variant: 'body2' }} />
      </ListItem>
    );
  }

  return (
    <ListItem component="div" className={classes.passiveListItem} {...rest}>
      {children}
      <ListItemText primary={text} />
    </ListItem>
  );
};
