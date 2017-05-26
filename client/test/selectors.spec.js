/*eslint-env mocha*/
import expect from 'expect';
import reducer from '../src/reducers';
import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import * as utils from './utils';
import {selectBalanceByAccountId} from '../src/selectors/budget';
import {arraySelector, byIdSelector} from 'hw-react-shared';
import {AccountResource, BudgetItemResource, transactionsUpToMonth} from 'inab-shared';

describe('Selectors', function() {
  let store;

  beforeEach(() => {
    store = createStore(reducer, applyMiddleware(thunk));
  });

  describe('Account selectors', function() {
    describe('#getAccounts', function() {
      it('should be empty by default', function() {
        const accounts = arraySelector(AccountResource)(store.getState());
        expect(accounts).toEqual([]);
      });

      it('should return one account', function() {
        utils.createAccount(store, 1, 'Checking');
        const accounts = arraySelector(AccountResource)(store.getState());
        expect(accounts).toEqual([{uuid: 1, name: 'Checking'}]);
      });

      it('should return two accounts', function() {
        utils.createAccount(store, 1, 'Checking');
        utils.createAccount(store, 2, 'Savings');
        const accounts = arraySelector(AccountResource)(store.getState());
        expect(accounts).toEqual([{uuid: 1, name: 'Checking'}, {uuid: 2, name: 'Savings'}]);
      });
    });

    describe('#getAccountsById', function() {
      it('should be empty by default', function() {
        const accounts = byIdSelector(AccountResource)(store.getState());
        expect(accounts).toEqual({});
      });

      it('should return one account', function() {
        utils.createAccount(store, 1, 'Checking');
        const accounts = byIdSelector(AccountResource)(store.getState());
        expect(accounts).toEqual({1: {uuid: 1, name: 'Checking'}});
      });

      it('should return two accounts', function() {
        utils.createAccount(store, 1, 'Checking');
        utils.createAccount(store, 2, 'Savings');
        const accounts = byIdSelector(AccountResource)(store.getState());
        expect(accounts).toEqual({
          1: {uuid: 1, name: 'Checking'},
          2: {uuid: 2, name: 'Savings'}
        });
      });
    });

    describe('#getBalanceByAccountId', function() {
      it('should be empty by default', function() {
        const accounts = selectBalanceByAccountId(store.getState());
        expect(accounts).toEqual({});
      });

      it('should return 0 for one account', function() {
        utils.createAccount(store, 1, 'Checking');
        const accounts = selectBalanceByAccountId(store.getState());
        expect(accounts).toEqual({1: 0});
      });

      it('should return 0 for two accounts', function() {
        utils.createAccount(store, 1, 'Checking');
        utils.createAccount(store, 2, 'Savings');
        const accounts = selectBalanceByAccountId(store.getState());
        expect(accounts).toEqual({1: 0, 2: 0});
      });

      it('should include one inflow', function() {
        utils.createAccount(store, 1, 'Checking');
        utils.createAccount(store, 2, 'Savings');
        utils.createInflowTBB(store, 1, 1, 100000, '2016-06-01');
        const accounts = selectBalanceByAccountId(store.getState());
        expect(accounts).toEqual({1: 100000, 2: 0});
      });

      it('should handle transfers', function() {
        utils.createAccount(store, 1, 'Checking');
        utils.createAccount(store, 2, 'Savings');
        utils.createInflowTBB(store, 1, 1, 100000, '2016-06-01');
        utils.createTransfer(store, 2, 1, 2, -50000, '2016-06-02');
        const accounts = selectBalanceByAccountId(store.getState());
        const expected = new Map();
        expected.set(1, 50000);
        expected.set(2, 50000);
        expect(accounts).toEqual({1: 50000, 2: 50000});
      });
    });
  });

  describe('Budget Item selectors', function() {
    beforeEach(() => {
      utils.selectMonth(store, 2016, 5);
    });

    describe('#getBudgetItems', function() {
      it('should be empty by default', function() {
        const bi = arraySelector(BudgetItemResource)(store.getState());
        expect(bi).toEqual([]);
      });

      it('should return one budget item', function() {
        utils.createBudgetItem(store, 1, '2016-06-01', 1, 10000);
        const bi = arraySelector(BudgetItemResource)(store.getState());
        expect(bi).toEqual([{uuid: 1, month: '2016-06-01', category_uuid: 1, amount: 10000}]);
      });
    });
  });

  describe('Transaction selectors', function() {
    beforeEach(() => {
      utils.selectMonth(store, 2016, 5);
    });

    it('should select transaction up to selected month', function() {
      utils.createInflowTBB(store, 1, 1, 3, '2016-05-05');
      utils.createInflowTBB(store, 2, 1, 5, '2016-06-06');
      utils.createInflowTBB(store, 3, 1, 7, '2016-07-07');
      const items = transactionsUpToMonth.selected(store.getState());
      expect(items).toEqual([
        {
          account_uuid: 1,
          amount: 3,
          category_uuid: null,
          date: '2016-05-05',
          description: null,
          uuid: 1,
          payee: 'Payee',
          transfer_account_uuid: null,
          type: 'to_be_budgeted',
          subtransactions: []
        },
        {
          account_uuid: 1,
          amount: 5,
          category_uuid: null,
          date: '2016-06-06',
          description: null,
          uuid: 2,
          payee: 'Payee',
          transfer_account_uuid: null,
          type: 'to_be_budgeted',
          subtransactions: []
        }
      ]);
    });
  });
});
