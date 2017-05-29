// @flow
import reduxCrud from 'redux-crud';
import type {CategoryGroup} from '../../src/entities/CategoryGroup';
import {CategoryGroupResource} from '../../src/entities/CategoryGroup';
import type {Category} from '../../src/entities/Category';
import {CategoryResource} from '../../src/entities/Category';
import type {BudgetItem} from '../../src/entities/BudgetItem';
import {BudgetItemResource} from '../../src/entities/BudgetItem';
import type {Transaction} from '../../src/entities/Transaction';
import {TransactionResource} from '../../src/entities/Transaction';
import type {Account} from '../../src/entities/Account';
import {AccountResource} from '../../src/entities/Account';

export const createCategoryGroup = (store: any, uuid: string, name: string, priority: number) => {
  const item: CategoryGroup = {uuid, name, priority};
  store.dispatch(
    reduxCrud.actionCreatorsFor(CategoryGroupResource.path, {key: 'uuid'}).createSuccess(item)
  );
  return item;
};

export const createCategory = (store: any, uuid: string, name: string, priority: number, categoryGroupUuid: string) => {
  const item: Category = {uuid, name, priority, category_group_uuid: categoryGroupUuid};
  store.dispatch(
    reduxCrud.actionCreatorsFor(CategoryResource.path, {key: 'uuid'}).createSuccess(item)
  );
  return item;
};

export const createAccount = (store: any, uuid: string, name: string) => {
  const item: Account = {uuid, name};
  store.dispatch(
    reduxCrud.actionCreatorsFor(AccountResource.path, {key: 'uuid'}).createSuccess(item)
  );
  return item;
};

export const createBudgetItem = (store: any, uuid: string, month: string, category_uuid: string, amount: number) => {
  const item: BudgetItem = {uuid, month, category_uuid, amount};
  store.dispatch(
    reduxCrud.actionCreatorsFor(BudgetItemResource.path, {key: 'uuid'}).createSuccess(item)
  );
  return item;
};

export const createInflowTBB = (store: any, uuid: string, account_uuid: string, date: string, amount: number, payee?: string) => {
  const item: Transaction = {
    uuid,
    date,
    account_uuid,
    amount,
    payee,
    type: 'to_be_budgeted',
    tags: [],
    subtransactions: []
  };
  store.dispatch(
    reduxCrud.actionCreatorsFor(TransactionResource.path, {key: 'uuid'}).createSuccess(item)
  );
  return item;
};

export const createOutflow = (store: any, uuid: string, account_uuid: string, date: string, amount: number, category_uuid: string, payee?: string) => {
  const item: Transaction = {
    uuid,
    date,
    account_uuid,
    category_uuid,
    amount,
    payee,
    type: 'regular',
    tags: [],
    subtransactions: []
  };
  store.dispatch(
    reduxCrud.actionCreatorsFor(TransactionResource.path, {key: 'uuid'}).createSuccess(item)
  );
  return item;
};

export const createTransfer = (store: any, uuid: string, account_uuid: string, transfer_account_uuid: string, date: string, amount: number) => {
  const item: Transaction = {
    uuid,
    date,
    account_uuid,
    transfer_account_uuid: transfer_account_uuid,
    amount,
    type: 'regular',
    tags: [],
    subtransactions: []
  };
  store.dispatch(
    reduxCrud.actionCreatorsFor(TransactionResource.path, {key: 'uuid'}).createSuccess(item)
  );
  return item;
};
