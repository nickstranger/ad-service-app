import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MUIDataTableColumnDef, MUIDataTableOptions } from 'mui-datatables';
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

// TODO может быть лучше везде переделать на кортеж вместо енама
enum HistoryColumns {
  ID = 'ID',
  ID_ENTITY = 'ID Entity',
  ID_CHANGER = 'ID Changer',
  DATE = 'Дата изменения',
  NAME = 'Название объекта изменения',
  CHANGER = 'Автор изменения',
  PREVIOUS_VALUE = 'Предыдущее значение',
  CURRENT_VALUE = 'Обновленное значение'
}

const getColumns = (documentType: HistoryDocumentType): MUIDataTableColumnDef[] => [
  {
    name: HistoryColumns.ID,
    options: {
      // filter: false,
      // searchable: false,
      display: 'excluded'
    }
  },
  {
    name: HistoryColumns.ID_ENTITY,
    options: {
      // filter: false,
      // searchable: false,
      display: 'excluded'
    }
  },
  {
    name: HistoryColumns.ID_CHANGER,
    options: {
      // filter: false,
      // searchable: false,
      display: 'excluded'
    }
  },
  {
    name: HistoryColumns.DATE,
    options: {
      // customFilterListOptions: { render: (v: any) => `${HistoryColumns.DATE}: ${v}` }
    }
  },
  {
    name: HistoryColumns.NAME,
    options: {
      // customFilterListOptions: { render: (v: any) => `${HistoryColumns.NAME}: ${v}` }
      customBodyRender: (value, tableMeta, updateValue) => {
        return (
          <Link component={RouterLink} to={`/${documentType}s/${tableMeta.rowData[1]}`}>
            {value}
          </Link>
        );
      }
    }
  },
  {
    name: HistoryColumns.CHANGER,
    options: {
      // customFilterListOptions: { render: (v: any) => `${HistoryColumns.CHANGER}: ${v}` }
      customBodyRender: (value, tableMeta, updateValue) => {
        return (
          <Link component={RouterLink} to={`/users/${tableMeta.rowData[2]}`}>
            {value}
          </Link>
        );
      }
    }
  },
  {
    name: HistoryColumns.PREVIOUS_VALUE,
    options: {
      display: 'excluded'
      // customFilterListOptions: { render: (v: any) => `${HistoryColumns.PREVIOUS_VALUE}: ${v}` }
    }
  },
  {
    name: HistoryColumns.CURRENT_VALUE,
    options: {
      display: 'excluded'
      // customFilterListOptions: { render: (v: any) => `${HistoryColumns.CURRENT_VALUE}: ${v}` }
    }
  }
];

const mapDataToTableData = (data: HistoryEntity[]) => {
  return data.map((item: HistoryEntity) => {
    // Важно, поля должны добавляться в той же последовательности, что перечислены в columns
    return [
      item._id,
      item.document_id,
      item.changer_id,
      DateTime.fromISO(item.changed_at).toLocaleString(DateTime.DATETIME_MED),
      item.current_value?.name ||
        item.previous_value?.name ||
        item.current_value?.username ||
        item.previous_value?.username,
      item.changer_username,
      JSON.stringify(item.previous_value, null, 2),
      JSON.stringify(item.current_value, null, 2)
    ];
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
        const response = await axiosInstance.get(
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
              {HistoryColumns.PREVIOUS_VALUE}
            </TableCell>
            <TableCell variant="head" colSpan={2} align="right">
              {HistoryColumns.CURRENT_VALUE}
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
      data={mapDataToTableData(historyList)}
      columns={getColumns(documentType)}
      options={options}
    />
  );
};
