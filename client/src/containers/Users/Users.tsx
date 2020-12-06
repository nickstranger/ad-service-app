import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { MUIDataTableColumn } from 'mui-datatables';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';

import { axiosInstance } from 'common/axios-instance';
import { routes } from 'common/constants';
import { strings } from 'common/strings';
import { getRoleByString } from 'common/helpers';
import { User, UserRole, UserStatus } from 'entities/User';
import { RootState } from 'store/store';
import { pageLoadingEnd, pageLoadingStart } from 'store/page/page.actions';
import { showErrorNotifier } from 'store/notifier/notifier.actions';
import { Table } from 'components/Table/Table';
import { Status } from 'components/Status/Status';
import { Role } from 'components/Role/Role';
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
        render: (v) =>
          `Статус: ${v === UserStatus.ENABLED ? strings.text.enable : strings.text.disable}`
      },
      filterOptions: {
        renderValue: (value) =>
          value === UserStatus.ENABLED ? strings.text.enable : strings.text.disable
      },
      customBodyRender: (value) => <Status status={value === UserStatus.ENABLED ? 'on' : 'off'} />
    }
  },
  {
    name: 'username',
    label: 'Имя',
    options: {
      customFilterListOptions: { render: (v) => `Имя: ${v}` }
    }
  },
  {
    name: 'email',
    label: 'Email',
    options: {
      customFilterListOptions: { render: (v) => `Email: ${v}` }
    }
  },
  {
    name: 'role',
    label: 'Роль',
    options: {
      searchable: false,
      filterType: 'dropdown',
      customFilterListOptions: {
        render: (value) => {
          const role = getRoleByString(value);
          return `Роль: ${role ? role[1] : value}`;
        }
      },
      filterOptions: {
        renderValue: (value) => {
          const role = getRoleByString(value);
          return role ? role[1] : value;
        }
      },
      customBodyRender: (value) => {
        const role = getRoleByString(value);
        return role ? <Role role={role[0]} /> : value;
      }
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
          <Tooltip title={routes.user.name}>
            <IconButton
              to={`${routes.users.path}/${tableMeta.rowData[0]}`}
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

export const Users = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [users, setUsers] = useState<User[]>([]);
  const loading = useSelector((state: RootState) => state.page.loading);
  const authUser = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        dispatch(pageLoadingStart());
        const response = await axiosInstance.get<User[]>('/users');
        const { data } = response;
        setUsers(data);
      } catch (error) {
        dispatch(showErrorNotifier(strings.error.getUsers, error));
      } finally {
        dispatch(pageLoadingEnd());
      }
    };

    fetchUsers();
  }, [dispatch]);

  const canModify = authUser.role === UserRole.ADMIN;
  const addActionProps = canModify
    ? {
        handleAddClick: () => {
          history.push(routes.createUser.path);
        },
        actionAddText: routes.createUser.name
      }
    : {};

  return loading ? (
    <Loader />
  ) : (
    <Table title={routes.users.name} data={users} columns={columns} {...addActionProps} />
  );
};
