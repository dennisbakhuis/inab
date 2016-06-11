import React from 'react';
import DatePicker from 'react-datepicker';
require('react-datepicker/dist/react-datepicker.css');
import moment from 'moment';
import {reduxForm} from 'redux-form';
import Button from './Button';
import asyncActionCreatorsFor from '../actions/asyncActionCreatorsFor';
import { getCategories } from '../reducers/categories';
import FontAwesome from 'react-fontawesome';

class EditableTransaction extends React.Component {
  static propTypes = {
    fields: React.PropTypes.object.isRequired,
    create: React.PropTypes.func.isRequired,
    handleSubmit: React.PropTypes.func.isRequired,
    categories: React.PropTypes.array.isRequired
  };

  onSubmit(data) {
    this.props.create({
      date: data.datee.format("YYYY-MM-DD"),
      payee: data.payee,
      category_id: data.category,
      description: data.description,
      amount: data.amount
    });
  }

  render() {
    const {fields: {datee, payee, category, description, amount}, handleSubmit} = this.props;
    return (
      <tr>
        <td>
          <Button onClick={handleSubmit(::this.onSubmit)}>
            <FontAwesome name='plus' />
          </Button>
        </td>
        <td>
          {/* TODO Should this be dropped in favor of input type=date?*/}
          <DatePicker className="form-control" selected={datee.value} onChange={param => {
            return datee.onChange(param);
          }} />
        </td>
        <td><input className="form-control" type="text" placeholder="Payee" {...payee} /></td>
        <td>
          <select className="form-control" {...category} value={category.value || ''}>
            <option></option>
            {this.props.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </td>
        <td><input className="form-control" type="text" placeholder="Description" {...description}/></td>
        <td><input className="form-control" type="text" placeholder="Amount" {...amount} /></td>
      </tr>
    );
  }
}

const mapStateToProps = (state) => ({
  categories: getCategories(state)
});

export default reduxForm({
  form: 'transaction',
  fields: ['datee', 'payee', 'category', 'description', 'amount'],
  initialValues: {'datee': moment()}
}, mapStateToProps, asyncActionCreatorsFor('transactions'))(EditableTransaction);
