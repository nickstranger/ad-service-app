import { FC } from 'react';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import HighlightOffOutlinedIcon from '@material-ui/icons/HighlightOffOutlined';

import { useStatusStyles } from './Status.styles';
import { strings } from 'common/strings';

type Props = {
  status: 'on' | 'off';
};

export const Status: FC<Props> = ({ status }) => {
  const classes = useStatusStyles();

  let icon, text;
  switch (status) {
    case 'on':
      icon = <CheckCircleOutlineOutlinedIcon className={classes.iconOn} />;
      text = strings.text.enable;
      break;
    case 'off':
      icon = <HighlightOffOutlinedIcon className={classes.iconOff} />;
      text = strings.text.disable;
      break;
  }

  return (
    <div className={classes.root}>
      {icon}
      {text}
    </div>
  );
};
