var BetterNetbank = function() {
  injectTransactionCheckboxes = function() {
    inject('transactionsTable');
    inject('outstandingAuthorizationsTable');
  };

  inject = function(table) {
    if ($("#" + table).length > 0) {
      $('#' + table + ' thead tr').prepend('<th><a href="#"><input type="checkbox" id="checkboxAll' + table + '" onclick="checkAll' + table + '()"></input></a></th>');
      $('#' + table + 'Body > tr').map(function() {
        $(this).prepend('<td><input type="checkbox" name="bnbTransactionCheckbox" onclick="update' + table + 'Total();" /></td>');
      });
    }
  };

  return {
    injectTransactionCheckboxes : injectTransactionCheckboxes
  }
}();

function pagePayload() {
  var c = 0;
  $('body').append('<div id="bnb" style="display:none">This element was created for the BetterNetbak extension</div>');
  var customEvent = document.createEvent('Event');
  customEvent.initEvent('bnbInject', true, true);

  $(function() {
    if (typeof transactions !== "undefined") {
      transactions.setClass2 = transactions.setClass;
      transactions.setClass = function(x) {
        transactions.setClass2(x);
        if (x == '') {
          c++;
          if (c % 2 == 1) { injectBnb(); }
        }
      }
    }
  });

  function updatetransactionsTableTotal() {
    updateTable('transactionsTable');
  }

  function updateoutstandingAuthorizationsTableTotal() {
    updateTable('outstandingAuthorizationsTable');
  }

  function checkAlltransactionsTable() {
    checkAll('transactionsTable');
  }

  function checkAlloutstandingAuthorizationsTable() {
    checkAll('outstandingAuthorizationsTable');
  }

  function checkAll(table) {
    $('#' + table + 'Body :checkbox').attr('checked', $('#checkboxAll' + table).attr('checked'));
    updateTable(table);
  }

  function updateTable(table) {
    var sum = calculateTotal(table);
    var numberOfCols = $('#' + table + ' thead tr th').not('[class*="Hide"]').length
    if ($('#' + table + ' tr[id="rollingSummary"]').length == 0) {
      $('#' + table + ' tbody').append($('<tr id="rollingSummary"><th colspan="' + (numberOfCols-1) + '" style="text-align:right;"><a href="javascript:window.prompt(\'Total:\', getRollingTotalFormula(\'' + table  + '\'));">Rolling Total:</a></th><th id="rollingTotal" style="text-align:right;">$0</th></tr>'));
    }
    $('#' + table + ' th[id="rollingTotal"]').text('$' + sum.toFixed(2));
  }

  function calculateTotal(table) {
    var sum = 0;
    fromSelectedTransactionsIn(table, function(num) { sum += parseFloat(num) });
    return sum;
  }

  function getRollingTotalFormula(table) {
    var formula = "=0";
    fromSelectedTransactionsIn(table, function(num) { formula += "+" + num });
    return formula;
  }

  function fromSelectedTransactionsIn(table, accumulator) {
    var txRows = $('#' + table + 'Body tr td input[name="bnbTransactionCheckbox"]:checked').parents('tr');
    $('td[class="currency"],[class="currencyCredit"]', txRows).each(function(i, e) {
      accumulator($(this).text().replace('$', '').replace(',', ''))
    });
  }

  function injectBnb() {
    $('#bnb').get(0).dispatchEvent(customEvent);
  }
}


$(function() {
  injectionPacket = pagePayload.toString().replace("function pagePayload() {", "").replace(/}$/, "");
  script = "<script type='text/javascript'>" + injectionPacket + "</script>";

  $("body").append(script);

  BetterNetbank.injectTransactionCheckboxes();

  document.getElementById('bnb').addEventListener('bnbInject', function() {
    setTimeout(function() { BetterNetbank.injectTransactionCheckboxes(); }, 1);
  });
});

