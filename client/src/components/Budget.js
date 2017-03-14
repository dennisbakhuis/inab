import React from 'react';
import BudgetTable from './BudgetTable';
import ui from 'redux-ui';
import Amount from './Amount';
import CategoryGroupFormDialog from './forms/CategoryGroupFormDialog';
import CategoryFormDialog from './forms/CategoryFormDialog';
import MonthSelector from './MonthSelector';
import {connect} from 'react-redux';
import {getAvailableToBudget, getFundsForSelectedMonth, getOverspentLastMonth, getBudgetedThisMonth, getBudgetedInFuture} from '../selectors/budget';
import './Budget.scss';

const mapStateToProps = state => ({
  availableToBudget: getAvailableToBudget(state),
  fundsAvailable: getFundsForSelectedMonth(state),
  overspentLastMonth: getOverspentLastMonth(state),
  budgetedThisMonth: getBudgetedThisMonth(state),
  budgetedInFuture: getBudgetedInFuture(state)
});

@ui({
  state: {
    categoryGroupFormOpen: false,
    categoryGroupSelected: null,
    categoryFormOpen: false,
    categorySelected: null
  }
})
@connect(mapStateToProps)
export default class BudgetPage extends React.Component {
  static propTypes = {
    availableToBudget: React.PropTypes.number.isRequired,
    fundsAvailable: React.PropTypes.number.isRequired,
    overspentLastMonth: React.PropTypes.number.isRequired,
    budgetedThisMonth: React.PropTypes.number.isRequired,
    budgetedInFuture: React.PropTypes.number.isRequired
  };

  render() {
    return (
      <div>
        <div className="budget-header">
          <MonthSelector />
          <div className="budget-header-amounts">

            <div className="budget-header-amounts-available">
              <Amount amount={this.props.availableToBudget} color />
              <div>Available to budget</div>
            </div>

            <div className="budget-header-amounts-details">
              <div>
                <div className="budget-header-amounts-details-amount">
                  <Amount amount={this.props.fundsAvailable} />
                </div>
                <div className="budget-header-amounts-details-amount">
                  <Amount amount={this.props.overspentLastMonth} />
                </div>
                <div className="budget-header-amounts-details-amount">
                  <Amount amount={this.props.budgetedThisMonth} />
                </div>
                <div className="budget-header-amounts-details-amount">
                  <Amount amount={this.props.budgetedInFuture} />
                </div>
              </div>
              <div className="budget-header-amounts-details-names">
                <div>Funds</div>
                <div>Overspent last month</div>
                <div>Budgeted this month</div>
                <div>Budgeted in the future</div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="box-container">
            <CategoryGroupFormDialog />
            <CategoryFormDialog />
          </div>
          <div className="box-container">
            <BudgetTable />
          </div>
        </div>
      </div>
    );
  }
}
