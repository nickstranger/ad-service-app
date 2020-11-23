import { FC } from 'react';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

type Props = {
  actionAddText: string;
  handleAddClick: () => void;
};

export const TableCustomToolbar: FC<Props> = ({ actionAddText, handleAddClick }) => {
  return (
    <Tooltip title={actionAddText}>
      <IconButton onClick={handleAddClick}>
        <AddIcon />
      </IconButton>
    </Tooltip>
  );
};
