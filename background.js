var BetterNetbank = {
  inject: function(table) {
    if ($("#" + table).length > 0) {
      $('#' + table + ' thead tr').prepend('<th>X</th>'); 
      $('#' + table + 'Body > tr').map(function() { 
        $(this).prepend('<td><input type="checkbox" /></td>'); 
      });
    }
  }
}

BetterNetbank.inject('transactionsTable');
BetterNetbank.inject('outstandingAuthorizationsTable');

var theShizzle = function() {
  var transactions = window.transactions;
  if (transactions.updateDisplay2 == null) {
    transactions.updateDisplay2 = transactions.updateDisplay
    transactions.updateDisplay = function() {
      transactions.updateDisplay2();

      BetterNetbank.inject('transactionsTable');
      BetterNetbank.inject('outstandingAuthorizationsTable');
    }
  }
}

$('#ctl00_BodyPlaceHolder_btnSearch_field').bind('click', theShizzle);
