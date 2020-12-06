import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MUIDataTableColumn, MUIDataTableOptions } from 'mui-datatables';
import { diff as DiffEditor } from 'react-ace';
import { DateTime } from 'luxon';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import './codeMarker.css';
import { axiosInstance } from 'common/axios-instance';
import { strings } from 'common/strings';
import { HistoryDocumentType, HistoryEntity } from 'entities/HistoryEntity';
import { RootState } from 'store/store';
import { pageLoadingEnd, pageLoadingStart } from 'store/page/page.actions';
import { showErrorNotifier } from 'store/notifier/notifier.actions';
import { Table } from 'components/Table/Table';
import { Loader } from 'components/Loader/Loader';

const getColumns = (documentType: HistoryDocumentType): MUIDataTableColumn[] => [
  {
    name: '_id',
    options: {
      display: 'excluded'
    }
  },
  {
    name: 'document_id',
    options: {
      display: 'excluded'
    }
  },
  {
    name: 'changer_id',
    options: {
      display: 'excluded'
    }
  },
  {
    name: 'changed_at',
    label: 'Дата изменения'
  },
  {
    name: 'name',
    label: 'Название',
    options: {
      customBodyRender: (value, tableMeta, _updateValue) => {
        return (
          <Link component={RouterLink} to={`/${documentType}s/${tableMeta.rowData[1]}`}>
            {value}
          </Link>
        );
      }
    }
  },
  {
    name: 'changer_username',
    label: 'Автор изменения',
    options: {
      customBodyRender: (value, tableMeta, _updateValue) => {
        return (
          <Link component={RouterLink} to={`/users/${tableMeta.rowData[2]}`}>
            {value}
          </Link>
        );
      }
    }
  },
  {
    name: 'previous_value',
    options: {
      display: 'excluded'
    }
  },
  {
    name: 'current_value',
    options: {
      display: 'excluded'
    }
  }
];

const transformDataForRender = (histories: HistoryEntity[]) => {
  return histories.map((history: HistoryEntity) => {
    return {
      ...history,
      changed_at: DateTime.fromISO(history.changed_at).toLocaleString(DateTime.DATETIME_MED),
      name: history.current_value?.name ||
        history.previous_value?.name ||
        history.current_value?.username ||
        history.previous_value?.username,
      previous_value: JSON.stringify(history.previous_value, null, 2),
      current_value: JSON.stringify(history.current_value, null, 2)
    };
  });
};

interface Props {
  tableTitle: string;
  documentType: HistoryDocumentType;
}

export const History: FC<Props> = ({ tableTitle, documentType }) => {
  const dispatch = useDispatch();
  const [historyList, setHistoryList] = useState<HistoryEntity[]>([]);
  const [totalNumberRows, setTotalNumberRows] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(20);
  const loading = useSelector((state: RootState) => state.page.loading);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        dispatch(pageLoadingStart());
        const response = await axiosInstance.get<{ history: HistoryEntity[]; totalCount: number }>(
          `/history?documentType=${documentType}&offset=${
            pageNumber * rowsPerPage
          }&limit=${rowsPerPage}`
        );
        const { history, totalCount } = response.data;
        setHistoryList(history);
        setTotalNumberRows(totalCount);
      } catch (error) {
        dispatch(showErrorNotifier(strings.error.getHistory, error));
      } finally {
        dispatch(pageLoadingEnd());
      }
    };

    fetchHistory();
  }, [documentType, pageNumber, rowsPerPage, dispatch]);

  const options: MUIDataTableOptions = {
    // TODO search, filter и sort пока выключены, т.к. нужно реализовать на бекенде
    search: false,
    filter: false,
    sort: false,
    serverSide: true,
    count: totalNumberRows,
    page: pageNumber,
    rowsPerPage: rowsPerPage,
    onChangePage: (pageNumber) => setPageNumber(pageNumber),
    onChangeRowsPerPage: (rowsPerPage) => setRowsPerPage(rowsPerPage),
    expandableRows: true,
    expandableRowsOnClick: true,
    renderExpandableRow: (rowData: string[]) => {
      return (
        <>
          <TableRow>
            <TableCell variant="head" colSpan={2}>
              Предыдущее значение
            </TableCell>
            <TableCell variant="head" colSpan={2} align="right">
              Обновленное значение
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={4}>
              <DiffEditor
                value={[rowData[6], rowData[7]]}
                mode="json"
                theme="chrome"
                width="100%"
                tabSize={2}
                fontSize={14}
                wrapEnabled
                highlightActiveLine={false}
                readOnly
              />
            </TableCell>
          </TableRow>
        </>
      );
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <Table
      title={tableTitle}
      data={transformDataForRender(historyList)}
      columns={getColumns(documentType)}
      options={options}
    />
  );
};
