import { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MUIDataTableColumn, MUIDataTableOptions } from 'mui-datatables';
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

const columns: MUIDataTableColumn[] = [
  {
    name: '_id',
    options: {
      filter: false,
      searchable: false,
      display: 'excluded'
    }
  },
  {
    name: 'status',
    label: 'Статус',
    options: {
      searchable: false,
      filterType: 'dropdown',
      customFilterListOptions: {
        render: (value) =>
          `Статус: ${value === BannerStatus.ENABLED ? strings.text.enable : strings.text.disable}`
      },
      filterOptions: {
        renderValue: (value) =>
          value === BannerStatus.ENABLED ? strings.text.enable : strings.text.disable
      },
      customBodyRender: (value) => <Status status={value === BannerStatus.ENABLED ? 'on' : 'off'} />
    }
  },
  {
    name: 'name',
    label: 'Название',
    options: {
      customFilterListOptions: { render: (v) => `Название: ${v}` }
    }
  },
  {
    name: 'placeholder',
    label: 'Плейсхолдер',
    options: {
      customFilterListOptions: { render: (v) => `Плейсхолдер: ${v}` }
    }
  },
  {
    name: 'layout',
    options: {
      display: 'excluded',
      customFilterListOptions: { render: (v) => `Разметка: ${v}` }
    }
  },
  {
    name: 'config',
    options: {
      display: 'excluded',
      customFilterListOptions: { render: (v) => `Конфигурация: ${v}` }
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

const transformDataForRender = (banners: Banner[]) => {
  return banners.map((banner: Banner) => {
    return {
      ...banner,
      config: JSON.stringify(banner.config, null, 2)
    };
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
              Разметка
            </TableCell>
            <TableCell colSpan={3}>
              <CodeEditor name="" mode="html" maxLines={5} value={rowData[4]} readOnly />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell />
            <TableCell variant="head" className={classes.valignTop}>
              Конфигурация
            </TableCell>
            <TableCell colSpan={3}>
              <CodeEditor name="" mode="json" maxLines={20} value={rowData[5]} readOnly />
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
      data={transformDataForRender(banners)}
      columns={columns}
      options={options}
      {...addActionProps}
    />
  );
};
