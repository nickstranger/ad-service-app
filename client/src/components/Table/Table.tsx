import { FC } from 'react';
import MUIDataTable, { MUIDataTableOptions, MUIDataTableProps } from 'mui-datatables';

import { useTableStyles } from './Table.styles';
import { TableCustomToolbar } from './TableCustomToolbar/TableCustomToolbar';

interface Props extends MUIDataTableProps {
  actionAddText?: string;
  handleAddClick?: () => void;
}

const defaultOptions: MUIDataTableOptions = {
  filterType: 'textField',
  download: false,
  print: false,
  elevation: 2,
  selectableRows: 'none',
  rowsPerPageOptions: [10, 20, 50, 100],
  textLabels: {
    body: {
      noMatch: 'Извините, ни одной записи не найдено',
      toolTip: 'Сортировать',
      columnHeaderTooltip: (column) => `Сортировать по ${column.label}`
    },
    pagination: {
      next: 'Следующая страница',
      previous: 'Предыдущая страница',
      rowsPerPage: 'Элементов на странице:',
      displayRows: 'из'
    },
    toolbar: {
      search: 'Найти',
      viewColumns: 'Показать/Скрыть колонки',
      filterTable: 'Фильтровать'
    },
    filter: {
      all: 'Все',
      title: 'ФИЛЬТРЫ',
      reset: 'СБРОСИТЬ'
    },
    viewColumns: {
      title: 'Показать колонки'
    }
  },
  // По умолчанию поиск по скрытым полям в expandableRows не работает, поэтому пишем свой
  customSearch: (searchQuery, currentRow, columns) => {
    let isFound = false;
    currentRow.forEach((col, index) => {
      if (columns[index].searchable && col.toString().indexOf(searchQuery) >= 0) {
        isFound = true;
      }
    });
    return isFound;
  }
};

export const Table: FC<Props> = ({ options, actionAddText = '', handleAddClick, ...rest }) => {
  const classes = useTableStyles();

  const combinedOptions = { ...defaultOptions, ...options };

  if (handleAddClick) {
    combinedOptions.customToolbar = () => {
      return <TableCustomToolbar handleAddClick={handleAddClick} actionAddText={actionAddText} />;
    };
  }

  if (combinedOptions.expandableRows) {
    combinedOptions.setRowProps = () => {
      return {
        className: classes.cursorPointer
      };
    };
  }

  if (!combinedOptions.search) {
    delete combinedOptions.customSearch;
  }

  return (
    <div className={classes.root}>
      <MUIDataTable options={combinedOptions} {...rest} />
    </div>
  );
};
