import { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MUIDataTableColumnDef, MUIDataTableOptions } from 'mui-datatables';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';

import { useBannersStyles } from './Banners.styles';
import { axiosInstance } from 'common/axios-instance';
import { routes } from 'common/constants';
import { strings } from 'common/strings';
import { Banner, BannerStatus } from 'entities/Banner';
import { UserRole } from 'entities/User';
import { RootState } from 'store/store';
import { pageLoadingEnd, pageLoadingStart } from 'store/page/page.actions';
import { showErrorNotifier } from 'store/notifier/notifier.actions';
import { Table } from 'components/Table/Table';
import { Status } from 'components/Status/Status';
import { CodeEditor } from 'components/CodeEditor/CodeEditor';
import { Loader } from 'components/Loader/Loader';

enum BannerColumns {
  ID = 'ID',
  STATUS = 'Статус',
  NAME = 'Имя баннера',
  PLACEHOLDER = 'Плейсхолдер',
  LAYOUT = 'Разметка',
  CONFIG = 'Конфигурация'
}

const columns: MUIDataTableColumnDef[] = [
  {
    name: BannerColumns.ID,
    options: {
      filter: false,
      searchable: false,
      display: 'excluded'
    }
  },
  {
    name: BannerColumns.STATUS,
    options: {
      searchable: false,
      filterType: 'dropdown',
      customFilterListOptions: {
        render: (value) =>
          `${BannerColumns.STATUS}: ${
            value === BannerStatus.ENABLED ? strings.text.enable : strings.text.disable
          }`
      },
      filterOptions: {
        renderValue: (value) =>
          value === BannerStatus.ENABLED ? strings.text.enable : strings.text.disable
      },
      customBodyRender: (value) => <Status status={value === BannerStatus.ENABLED ? 'on' : 'off'} />
    }
  },
  {
    name: BannerColumns.NAME,
    options: {
      customFilterListOptions: { render: (v: any) => `${BannerColumns.NAME}: ${v}` }
    }
  },
  {
    name: BannerColumns.PLACEHOLDER,
    options: {
      customFilterListOptions: { render: (v: any) => `${BannerColumns.PLACEHOLDER}: ${v}` }
    }
  },
  {
    name: BannerColumns.LAYOUT,
    options: {
      display: 'excluded',
      customFilterListOptions: { render: (v: any) => `${BannerColumns.LAYOUT}: ${v}` }
    }
  },
  {
    name: BannerColumns.CONFIG,
    options: {
      display: 'excluded',
      customFilterListOptions: { render: (v: any) => `${BannerColumns.CONFIG}: ${v}` }
    }
  },
  {
    name: 'Действия',
    options: {
      filter: false,
      searchable: false,
      sort: false,
      empty: true,
      setCellHeaderProps: () => ({
        style: {
          textAlign: 'right'
        }
      }),
      setCellProps: () => ({
        style: {
          textAlign: 'right'
        }
      }),
      customBodyRender: (value, tableMeta) => {
        return (
          <Tooltip title={routes.banner.name}>
            <IconButton
              to={`${routes.banners.path}/${tableMeta.rowData[0]}`}
              component={Link}
              size="small"
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        );
      }
    }
  }
];

// Индексы колонок, который прячем в expandableRows
const layoutIdx = columns.findIndex(
  (column) => typeof column === 'object' && column.name === BannerColumns.LAYOUT
);
const configIdx = columns.findIndex(
  (column) => typeof column === 'object' && column.name === BannerColumns.CONFIG
);

const mapDataToTableData = (data: Banner[]) => {
  return data.map((item: Banner) => {
    // Важно, поля должны добавляться в той же последовательности, что перечислены в columns
    return [
      item._id,
      item.status,
      item.name,
      item.placeholder,
      item.layout,
      JSON.stringify(item.config, null, 2)
    ];
  });
};

export const Banners = () => {
  const classes = useBannersStyles();

  const dispatch = useDispatch();
  const history = useHistory();
  const [banners, setBanners] = useState<Banner[]>([]);
  const loading = useSelector((state: RootState) => state.page.loading);
  const authUser = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        dispatch(pageLoadingStart());
        const response = await axiosInstance.get<Banner[]>('/banners');
        const { data } = response;
        setBanners(data);
      } catch (error) {
        dispatch(showErrorNotifier(strings.error.getBanners, error));
      } finally {
        dispatch(pageLoadingEnd());
      }
    };

    fetchBanners();
  }, [dispatch]);

  const canModify = authUser.role === UserRole.ADMIN || authUser.role === UserRole.USER;
  const addActionProps = canModify
    ? {
        handleAddClick: () => {
          history.push(routes.createBanner.path);
        },
        actionAddText: routes.createBanner.name
      }
    : {};

  const options: MUIDataTableOptions = {
    expandableRows: true,
    expandableRowsOnClick: true,
    renderExpandableRow: (rowData: string[]) => {
      return (
        <>
          <TableRow>
            <TableCell />
            <TableCell variant="head" className={classes.valignTop}>
              {BannerColumns.LAYOUT}
            </TableCell>
            <TableCell colSpan={3}>
              <CodeEditor name="" mode="html" maxLines={5} value={rowData[layoutIdx]} readOnly />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell />
            <TableCell variant="head" className={classes.valignTop}>
              {BannerColumns.CONFIG}
            </TableCell>
            <TableCell colSpan={3}>
              <CodeEditor name="" mode="json" maxLines={20} value={rowData[configIdx]} readOnly />
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
      title={routes.banners.name}
      data={mapDataToTableData(banners)}
      columns={columns}
      options={options}
      {...addActionProps}
    />
  );
};
