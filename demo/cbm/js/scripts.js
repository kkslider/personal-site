var chart;
var table;
var options;

Highcharts.visualize = function(table, options) {
  // the categories
  options.xAxis.categories = [];
  $('#runs thead th', table).each(function(i) {
    options.xAxis.categories.push(this.innerHTML);
  });
  
  // capture the normalization factors
  var normalizationFactors = [];
  $("#normalization tr").each(function(p) {
    var tr = this;
    $('td.normalization', tr).each(function(q) {
      normalizationFactors.push($(this).text());
    });
    $('th', tr).each(function(r) {
      if (p > 0) {
        $(this).html($('#runs tbody tr:nth-child(' + p + ') th').text());
      }
    });
  });
  
  // capture the normalization offsets
  var offsets = [];
  $("#normalization tr").each(function(p) {
    var tr = this;
    $('td.offset', tr).each(function(q) {
      offsets.push($(this).text());
    });
    $('th', tr).each(function(r) {
      if (p > 0) {
        $(this).html($('#runs tbody tr:nth-child(' + p + ') th').text());
      }
    });
  });
  
  // the data series for runs
  options.series = [];
  $('#runs tr', table).each(function(i) {
    var tr = this;
    $('th, td', tr).each(function(j) {
      if (i > 0) { // skip the first row
        if (j == 0) { // get the C/M name and init the series
          options.series[i - 1] = {
            type: 'column',
            name: this.innerHTML,
            data: []
          };
        } else { // add the values
          var plotValue = parseFloat(normalizationFactors[i - 1]) * parseFloat(this.innerHTML) + parseFloat(offsets[i - 1]);
          options.series[i - 1].data.push(plotValue);
        }
      }            
    });
  });
  
  // get the count of measurements to add levels in the series after
  var measurementCount = $('#runs tr').length - 1;
  
  // get the count of runs to let the level lines extend through them
  var runCount = $('#runs thead th').length;

  // the data series for levels
  $('#levels tr', table).each(function(m) {
    var tr = this;
    $('th, td', tr).each(function(n) {
      if (m > 0) { // skip the first row
        if (n == 0) { // get the level and init the series
          options.series[measurementCount + m - 1] = {
            type: 'line',
            name: this.innerHTML,
            data: []
          };
        } else { // add the values
          for (i = 0; i < runCount; i++) {
            options.series[measurementCount + m - 1].data.push(parseFloat(this.innerHTML));
          }
        }
      }            
    });
  });
  
  chart = new Highcharts.Chart(options);
}

// On document ready, call visualize on the datatable.
$(document).ready(function() {
  table = document.getElementById('datatable'), options = {
    chart: {
      renderTo: 'chart',
      defaultSeriesType: 'column',
      spacingRight: 240,
      width: 1000,
      height: 400
    },
    colors: [
      '#4572A7', 
      '#AA4643', 
      '#89A54E', 
      '#80699B', 
      '#3D96AE', 
      '#DB843D', 
      '#92A8CD', 
      '#A47D7C', 
      '#B5CA92',
      '#2F4F4F'
    ],
    exporting: {
      enabled: false
    },
    title: {
      text: 'Points Accumulated from Runs'
    },
    subtitle: {
      text: 'CBM Group: ABC123'
    },
    xAxis: {
      labels: {
        enabled: true
      }
    },
    yAxis: {
      enabled: true,
      endOnTick: true,
      title: {
        text: 'Points'
      },
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: 'bold',
          color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
        }
      }
    },
    tooltip: {
      enabled: true,
      borderWidth: 1,
      borderColor: '#333333',
      shadow: false,
      style: {
        color: '#333333',
        fontSize: '10px',
        padding: '5px',
        margin: '2px'
      },
      backgroundColor: {
        linearGradient: [0, 0, 0, 60],
        stops: [
          [0, '#FFFFFF'],
          [1, '#E0E0E0']
        ]
      }
    },
    legend: {
      enabled: true,
      layout: 'vertical',
      floating: true,
      align: 'right',
      verticalAlign: 'middle',
      x: 240
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true,
          formatter: function() {
            return Math.round(this.y)
          },
          color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
        }
      }
    },
    series: {
      states: {
        hover: {
          enabled: false
        }
      }
    }
  };
  
  Highcharts.visualize(table, options);
  
  $('.editable').editable(function(value, settings) {
    return(value);
  }, {
    type: 'text',
    submit: 'OK',
    cssclass: 'editableInput',
    tooltip: 'Click to edit',
    style: 'inherit',
    height: '12px',
    callback: function() {
      Highcharts.visualize(table, options);
      chart.redraw();
    }
  });
  
  $('.editableRange').editable(function(value, settings) {
    return(value);
  }, {
    type: 'text',
    submit: 'OK',
    cssclass: 'editableInput',
    tooltip: 'Click to edit',
    style: 'inherit',
    height: '12px',
    callback: function() {
      // could probably do this better instead of setting every min/max value when any are changed
      $("#slider1").slider("option", "max", $('#adjustNormalizations tr:nth-child(1) td.upper').text());
      $("#slider2").slider("option", "max", $('#adjustNormalizations tr:nth-child(2) td.upper').text());
      $("#slider3").slider("option", "max", $('#adjustNormalizations tr:nth-child(3) td.upper').text());
      $("#slider4").slider("option", "max", $('#adjustNormalizations tr:nth-child(4) td.upper').text());
      $("#slider5").slider("option", "max", $('#adjustNormalizations tr:nth-child(5) td.upper').text());
      // setting the minimum value is throwing a javascript error, not allowing an edit to that field and will handle later
      //$("#slider1").slider("option", "min", $('#adjustNormalizations tr:nth-child(1) td.lower').text());
    }
  });
  
  // create the report to save in excel
  $('#ready').click(function() {
    resultTable.fnClearTable();
    resultTable.fnAddData([
      'Name',
      $('#group table #groupName').text(),
      $('#runs tbody tr:nth-child(1) th').text(),
      $('#normalization tbody tr:nth-child(1) td.normalization').text(),
      $('#normalization tbody tr:nth-child(1) td.offset').text(),
      $('#levels tbody tr:nth-child(1) th').text(),
      $('#levels tbody tr:nth-child(1) td').text()
    ]);
    resultTable.fnAddData([
      'Description',
      $('#group table #groupDescription').text(),
      $('#runs tbody tr:nth-child(2) th').text(),
      $('#normalization tbody tr:nth-child(2) td.normalization').text(),
      $('#normalization tbody tr:nth-child(2) td.offset').text(),
      $('#levels tbody tr:nth-child(2) th').text(),
      $('#levels tbody tr:nth-child(2) td').text()
    ]);
    resultTable.fnAddData([
      'CBM Type',
      $('#group table #groupCBMType').val(),
      $('#runs tbody tr:nth-child(3) th').text(),
      $('#normalization tbody tr:nth-child(3) td.normalization').text(),
      $('#normalization tbody tr:nth-child(3) td.offset').text(),
      $('#levels tbody tr:nth-child(3) th').text(),
      $('#levels tbody tr:nth-child(3) td').text()
    ]);
    resultTable.fnAddData([
      'Point Aggregation Type',
      $('#group table #groupPointAggregationType').val(),
      $('#runs tbody tr:nth-child(4) th').text(),
      $('#normalization tbody tr:nth-child(4) td.normalization').text(),
      $('#normalization tbody tr:nth-child(4) td.offset').text(),
      $('#levels tbody tr:nth-child(4) th').text(),
      $('#levels tbody tr:nth-child(4) td').text()
    ]);
    resultTable.fnAddData([
      '',
      '',
      $('#runs tbody tr:nth-child(5) th').text(),
      $('#normalization tbody tr:nth-child(5) td.normalization').text(),
      $('#normalization tbody tr:nth-child(5) td.offset').text(),
      $('#levels tbody tr:nth-child(5) th').text(),
      $('#levels tbody tr:nth-child(5) td').text()
    ]);
    
    $('.DTTT_container button').attr("disabled", false);
  });
  
  // reset the page to start a new CBM group
  $('#reset').click(function() {
    resultTable.fnClearTable();
    $('.DTTT_container button').attr("disabled", true);
    // add code to reset table values, maybe?
  });
  
  TableTools.DEFAULTS.aButtons = ["copy"];
  var resultTable;
  resultTable = $('#configuration table').dataTable({
    "bFilter": false,
    "bInfo": false,
    "bLengthChange": false,
    "bPaginate": false,
    "bSort": false,
    "sDom": 'T<"clear">lfrtip',
    "oTableTools": {
      "sSwfPath": "swf/copy_cvs_xls.swf"
    }
  });
  
  // disable the copy button for the results table until the table is created
  $('.DTTT_container button').attr("disabled", true);

});

$(function(){
  $('#slider1').slider({
    // setting the minimum value is throwing a javascript error, forcing to zero now and will handle later
    //min: $('#adjustNormalizations tr:nth-child(1) td.lower').text(),
    min: 0,
    max: $('#adjustNormalizations tr:nth-child(1) td.upper').text(),
    slide: function(event, ui) {
      $('#normalization tr:nth-child(1) td').html(ui.value);
    },
    step: .1,
    stop: function(event, ui) {
      Highcharts.visualize(table, options);
      chart.redraw();
    },
    value: parseFloat($('#normalization tr:nth-child(1) td').text())
  });
  
  $('#slider2').slider({
    // setting the minimum value is throwing a javascript error, forcing to zero now and will handle later
    //min: $('#adjustNormalizations tr:nth-child(2) td.lower').text(),
    min: 0,
    max: $('#adjustNormalizations tr:nth-child(2) td.upper').text(),
    slide: function(event, ui) {
      $('#normalization tr:nth-child(2) td').html(ui.value);
    },
    step: .1,
    stop: function(event, ui) {
      Highcharts.visualize(table, options);
      chart.redraw();
    },
    value: parseFloat($('#normalization tr:nth-child(2) td').text())
  });
  
  $('#slider3').slider({
    // setting the minimum value is throwing a javascript error, forcing to zero now and will handle later
    //min: $('#adjustNormalizations tr:nth-child(3) td.lower').text(),
    min: 0,
    max: $('#adjustNormalizations tr:nth-child(3) td.upper').text(),
    slide: function(event, ui) {
      $('#normalization tr:nth-child(3) td').html(ui.value);
    },
    step: .1,
    stop: function(event, ui) {
      Highcharts.visualize(table, options);
      chart.redraw();
    },
    value: parseFloat($('#normalization tr:nth-child(3) td').text())
  });
  
  $('#slider4').slider({
    // setting the minimum value is throwing a javascript error, forcing to zero now and will handle later
    //min: $('#adjustNormalizations tr:nth-child(4) td.lower').text(),
    min: 0,
    max: $('#adjustNormalizations tr:nth-child(4) td.upper').text(),
    slide: function(event, ui) {
      $('#normalization tr:nth-child(4) td').html(ui.value);
    },
    step: .1,
    stop: function(event, ui) {
      Highcharts.visualize(table, options);
      chart.redraw();
    },
    value: parseFloat($('#normalization tr:nth-child(4) td').text())
  });
  
  $('#slider5').slider({
    // setting the minimum value is throwing a javascript error, forcing to zero now and will handle later
    //min: $('#adjustNormalizations tr:nth-child(5) td.lower').text(),
    min: 0,
    max: $('#adjustNormalizations tr:nth-child(5) td.upper').text(),
    slide: function(event, ui) {
      $('#normalization tr:nth-child(5) td').html(ui.value);
    },
    step: .1,
    stop: function(event, ui) {
      Highcharts.visualize(table, options);
      chart.redraw();
    },
    value: parseFloat($('#normalization tr:nth-child(5) td').text())
  });
});

