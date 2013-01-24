$(document).ready(function(){
  // default values on selects should be gray then change to black
  $('select').css('color', '#ACACAC').live('change', function() {
    var color = $(this).val() === "0" ? '#ACACAC' : '#242424';
    $(this).css('color', color);
  });

/*

  // setup cost lists
  $('.sortable li ul').parent().addClass('no-sort');
  $('.sortable').sortable({ items: '.sort' });
  var $emptyRow = $('<li class="new"><div class="title"><input type="text" class="input_xlarge" placeholder="Add another"/></div> <div class="amount">$ <input type="text" class="input_tiny" /></div></li>');

  // handle new additions to rows
  $('.new input').live('keypress', function(e) {
    var code = (e.keyCode ? e.keyCode : e.which),
        $this = $(this);
    if(code == 13) {
      // TODO addo some validation here to make sure that the cost title and amount isn't empty, etc
    
      // make the newly created item sortable and add it to the list
      var $newRow = $this.closest('li')
        .removeClass('new')
        .addClass('sort')
        .prepend('<i class="icon-resize-vertical"></i>')
        .append('<i class="icon-remove"></i>');
      $emptyRow.clone().insertAfter($newRow);
    }
  });
  
  */




    
  // hide the support area
  $('.support').hide();
  
  if($('a[rel="popover"]').length > 0) {
    // setup help
    $('a[rel="popover"]').hide();
    $('a[rel="popover"]').popover();    
    $('#help').bind('click', function() {
      $('.support').fadeIn('slow');
      $('a[rel="popover"]').fadeIn('slow');
    });
  }

  // progress bar
  $('.pages ul').hide();
	$('.pages ul[data-phase="2"]').show();
	$('.phase').bind('click', function() {
    var $this = $(this),
  	    phase = $this.data('phase');
    $('.phase').removeClass('active');
    $('.phase[data-phase="' + phase + '"]').addClass('active');
  	$('.pages ul').hide();
  	$('.pages ul[data-phase="' + phase + '"]').show();
	});

});

function setupProfile() {
  $('select:eq(0)').focus();
  $('#about-yourself, #prev').hide();
  $('#next').bind('click', function(e) {
    $('#about-your-business').hide();
    $('#prev').is(':visible') ? $(this).attr('href', 'begin-1.html') : e.preventDefault();
    $('#about-yourself, #prev').show();
    $('textarea:eq(0)').focus();
  });
}

function setupPersonalExpenses() {
  // hide the break even point items
  $('.totals').hide();

  // setup the click to move from personal expenses to business expenses
  $('#next[data-step="1"]').live('click', function(e) {
    e.preventDefault();
    $(this).attr('data-step', '2');
    $('h1').text('Business expenses');
    $('.instruction').html('<p>There is a cost to doing business.  Remember these are not your variable costs associated with your units of sales.  These are your hard fixed costs; the ones that you are liable for even if you do not open up for business that year!  On the next page we will explore your variable costs but for now concentrate on the fixed ones like rent, insurance, etc.  These should also be forward looking.  For example, if you rent is to go up by $50 for the coming year, input the price including the increase.</p><p>Again, be honest with these numbers and try to think of everything.  This only works if you are honest.</p>');
    $('.total .title').text('Total business expenses');
  });
  
  // setup the click to move from business expenses to breakeven point
  $('#next[data-step="2"]').live('click', function(e) {
    e.preventDefault();
    $(this).attr('data-step', '3');
    $('.sortable').hide();
    $('h1').text('Breakeven point');
    $('.instruction').html('<p>&nbsp;</p>');
    $('.totals').fadeIn('slow');
    $('.totals .total .title').text('Total expenses');
  });

  // setup cost lists as sortable
  $('.sortable').sortable({ items: '.sort' });
  
  // initialize expenses based on provide monthly amounts
  initializeIncidentalsPercent();
  initializeYearlyAmounts();
  updateTotals();
  
  // spaces are important in the string below as divs are display: inline-block
  var $emptyRow = $(' <li class="new"><div class="title"><input type="text" class="input_xlarge" placeholder="Add another"/></div> <div class="monthly">$ <input type="text" class="input_tiny" /></div> <div class="units"><span>x 12 =</span></div> <div class="yearly">&nbsp;</div></li> ');
  
  // add a new expense
  $('.new .monthly input').live('blur', function() {
    var $li = $('.new'),
        $monthlyInput = $('.new .monthly input'),
        monthlyAmount = $monthlyInput.val(),
        $titleInput = $('.new .title input'),
        expenseTitle = $titleInput.val();

    // remove any previous errors
    $('#notice').hide();
    $('input.error').removeClass('error');

    // make sure the amount is a number
    if(!isNumber(monthlyAmount) && monthlyAmount !== '') {
      $monthlyInput.addClass('error');
      displayError('Monthly amount must be a number', 'error');
    } 
    // make sure the title is not empty
    else if(expenseTitle === '' && monthlyAmount !== '') {
      $titleInput.addClass('error');
      displayError('Expense title cannot be empty', 'error');      
    }
    // make sure the amount has been entered if title has been entered
    else if(expenseTitle !== '' && monthlyAmount === '') {
      $monthlyInput.addClass('error');
      displayError('Monthly amount cannot be empty', 'error');
    }
    // then we can add the expense if something has been entered
    else if(monthlyAmount !== '') {
      // make the newly created item sortable and add it to the list
      var yearlyAmount = parseInt(monthlyAmount) * 12;
      
      // conver the new row to a sortable row and update the yearly total
      $li.removeClass('new')
        .addClass('sort')
        .prepend('<i class="icon-resize-vertical"></i> ')
        .append(' <i class="icon-remove"></i>');
      $li.find('.yearly').html('$ <span>' + yearlyAmount + '</span>');

      // provide a new row for another expense
      $emptyRow.clone().insertAfter($li);
      
      // recalculate incidentals and totals
      updateIncidentals();
      updateTotals();
    }
  });

  // recalculate expenses when monthly amount changes
  $('.sort .monthly input').live('blur', function() {
    var $this = $(this),
        yearlyAmount = parseInt($this.val()) * 12;
    $this.parent().siblings('.yearly').find('span').text(yearlyAmount);
    updateIncidentals();
    updateTotals();
  });
  
  // recalculate expenses when incidentals percentage changes
  $('.incidentals input').live('blur', function() {
    updateIncidentals();
    updateTotals();
  });
  
  // recalculate expenses when an expense is deleted
  $('.incidentals .icon-remove').live('click', function() {
    updateIncidentals();
    updateTotals();
  });

  // handler for deleting rows, delete the expense then update incidentals and totals
  $('.icon-remove').live('click', function() {
    $(this).closest('li').remove();
    updateIncidentals();
    updateTotals();
  });

}

// display a message at the top of the page for form validations
function displayError(message, style) {
  $('#notice p').text(message).parent().addClass(style).fadeIn('slow');
}

// determine if a value is a number
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

// calculate yearly amounts based on stored monthly amounts
function initializeYearlyAmounts() {
  $('li.sort').each(function() {
    $(this).find('.yearly span').text(parseInt($(this).find('.monthly input').val()) * 12);
  });
}

// incidentals are stored as a normal expense, so need to calculate % based on stored monthly amount
function initializeIncidentalsPercent() {
  var incidentalsAmount = parseInt($('.incidentals .monthly span').text());
      monthlyTotal = getMonthlyExpenseTotal(),
      incidentalsPercentage = (incidentalsAmount / monthlyTotal) * 100;
  
  $('.incidentals input').val(incidentalsPercentage);
}

// sum up all monthly expenses excluding incidentals
function getMonthlyExpenseTotal() {
  var monthlyTotal = 0;
  
  $('.sort .monthly input').each(function() {
    monthlyTotal += parseInt($(this).val() === '' ? 0 : $(this).val());
  });
  
  return monthlyTotal;
}

// set incidentals as x% of sum of other expenses
function updateIncidentals() {
  var monthlyTotal = getMonthlyExpenseTotal(),
      percentage = parseInt($('.incidentals input').val()),
      monthlyIncidentals = 0,
      yearlyIncidentals = 0;

  // update the monthly and yearly incidentals values
  monthlyIncidentals = Math.round(monthlyTotal * (percentage / 100));
  yearlyIncidentals = monthlyIncidentals * 12;
  $('.incidentals .monthly span').text(monthlyIncidentals);
  $('.incidentals .yearly span').text(yearlyIncidentals);
}

// recalculate totals based on new input values
function updateTotals() {
  var monthlyTotal = getMonthlyExpenseTotal();
  
  // include incidentals separately as it is not an input field
  monthlyTotal += parseInt($('.incidentals .monthly span').text());

  // update the monthly and yearly values
  $('.total .monthly span').text(monthlyTotal);
  $('.total .yearly span').text(monthlyTotal * 12);
}

function setupRevenueStreams() {
  // hide the elements we don't need right now
  $('.amount, .units, .revenue, .total').hide();

  // setup the click to move from revenue streams to revenue percentages
  $('[data-step="1"]').live('click', function(e) {
    e.preventDefault();
    $('.new-cost').hide();
    $('h1').text('Revenue Percentages');
    $('.instruction p:nth-child(1)').text('In the percent column below, enter the percentage of your total revenue that each revenue stream contributes.  These percentages should be forward looking.  What are your aims for the particular revenue stream by the year\'s end?  If you are launching a new revenue stream that you hope will become your best selling item, input the goal you ahve for it by year\'s end.  For example, I hope to make 20% of my revenue this year from my new book coming out in a couple of months.');
    $(this).attr('data-step', '2');
    $('.revenue, .total').fadeIn('slow');
  });
  
  // setup the click to move from revenue percentages to total revenue
  $('[data-step="2"]').live('click', function(e) {
    e.preventDefault();
    $('h1').text('Total revenue for each revenue stream');
    $('.instruction p:nth-child(1)').text('Below you can see the total revenue generated by each revenue stream, based on the percentage of total revenue that it represents.  If it doesn\'t look right, go back one page and change the percentages you entered.');
    $(this).attr('data-step', '3');
    $('.new').hide();
    $('.heading.revenue').text('Revenue');
    $('.sort .revenue').each(function() {
      // change <input type="text" class="input_tiny" value="20" />% to $ 20000 <span>( 20% )</span>
      $(this).html('$ 20000 <span>( ' + $(this).find('input').val() + '% )</span>');
    });
    $('.total .revenue').html('$ 2000 <span>( 100% )</span>');
  });
  
  // setup the click to move from total revenue to average selling price
  $('[data-step="3"]').live('click', function(e) {
    e.preventDefault();
    $('h1').text('Average selling price');
    $('.instruction p:nth-child(1)').text('Be honest with your average sell price over a year. Take into account seasonal discounts and sales when calculating your average. In the unit amount column below, enter the average selling price for each of your revenue streams.');
    $(this).attr('data-step', '4');
    $('.amount').fadeIn('slow');
  });
  
  // revenue percentages should not exceed 100%
  $('.revenue input').live('blur', function() {
    var revenueTotal = 0;
    
    // remove any previous errors
    $('#notice').hide();
    $('input.error').removeClass('error');

    // TODO: LEFT OFF HERE    
  });
}

function setupVariableCosts() {
  // hide the units and the units in the formula as we don't need that yet
  $('.units, .formula span:nth-child(2), .formula span:nth-child(3), .formula span:nth-child(4)').css('visibility', 'hidden');

  // hide the goal-check div as that is only for the goal check page
  $('.goal-check').hide();

  // setup the click event to move from variable costs to units of sale
  $('#next[data-step="1"]').live('click', function(e) {
    e.preventDefault();
    $('.units, .formula span:nth-child(2), .formula span:nth-child(3), .formula span:nth-child(4)').css('visibility', 'visible');
    $(this).attr('data-step', '2');
    $('h1').text('Units of sale');
    $('.instruction p:nth-child(1)').text('Voila! Now you can see the total Units of Sale you need to make in order to cover your breakeven. It\'s not unusual to feel that these numbers are high. If so, you have four options. You can play with the Revenue Percentages, if some items have higher net revenues or seem easier to sell. You can charge more for your products/services, so you need fewer units to reach the same revenue level. You can reduce your overhead and your personal expenses, so your breakeven will decline. Or you can reduce your hard costs, so that you keep more of the revenue you receive from customers. Actually, you have a 5th option, which is to accept the fact that your business won\'t breakeven this year, and figure out how to manage the shortfall. Can you take a loan? Stretch out some of your payments due?');
  });

  // setup the click event to move from units of sale to goal check
  $('#next[data-step="2"]').live('click', function(e) {
    e.preventDefault();
    $('h1').text('Goal check');
    $('.instruction p:nth-child(1)').text('Do a final review of your revenue stream and make adjustments if needed.');
    $('.goal-check').show();
    $(this).attr('data-step', '3');
  });
}

function setupIdealClient() {
  // hide the next page
  $('.name').hide();
  
  // update the progress bar
  $('.pages ul').hide();
  $('.pages ul[data-phase="3"]').show();

  // setup the click to move from identifying your ideal client to name your ideal client
  $('#next[data-step="1"]').live('click', function(e) {
    e.preventDefault();
    $('fieldset, .instruction').hide();
    $('.name').show();
    $('h1').text('Let\'s give your ideal client a name');
    $(this).attr('data-step', '2');
  });
}

function setupBeginActionPlan() {
  // hide the next page
  $('.start-date').hide();
  
  // update the progress bar
  $('.pages ul').hide();
  $('.pages ul[data-phase="4"]').show();

  // setup the click to move from identifying your ideal client to name your ideal client
  $('#next[data-step="1"]').live('click', function(e) {
    e.preventDefault();
    $('h1').text('Select your start date');
    $('.instruction').html('<p>Tattooed leggings portland lo-fi typewriter mumblecore, wes anderson cliche DIY polaroid cred freegan. Biodiesel vice +1 aesthetic, odd future mlkshk tumblr cliche kogi gentrify.</p>');
    $('.start-date').show();
    $(this).attr('data-step', '2');
  });
}

function setupWorldEvents() {
  // add a new event
  $('.new-event').hide();
  $('#new-event').bind('click', function() {
    $(this).hide();
    $('.new-event').fadeIn('slow');
  });
  $('.new-event a').bind('click', function() {
    $(this).parent().hide();
    $('#new-event').fadeIn('slow');
  });
  
  // hide and show events
  $('.quarter a').bind('click', function() {
    var text = $(this).text();
    if(text === 'Hide events') {
      $(this).parent().siblings('.events').fadeOut('slow');
      $(this).text('Show events');
    } else {
      $(this).parent().siblings('.events').fadeIn('slow');
      $(this).text('Hide events');
    }
  });
  
  // don't show impact questions initially
  $('.impact').hide();
  
  // setup the click to move from world events to ideal client events
  $('#next[data-step="1"]').live('click', function(e) {
    e.preventDefault();
    $('.quarter, #new-event, .new-event').hide();
    $('.quarter:eq(0), .impact').fadeIn('slow');
    $('h1').text('Ideal Client Events');
    $('.instruction p').text('Think through how the world events you\'ve identified will impact your ideal client. Will it influence their financial status, their motivation, their aviailable time? What will that mean for your business. If, for example, you own a gym, January 1 might create a new-founded motivation for your ideal client. Take your time on this exercise as it will put you in the right mindset for choosing the best connection strategies by quarter.');
    $(this).attr('data-step', '2');
  });
  
  $('#next[data-step="2"], #next[data-step="3"], #next[data-step="4"]').live('click', function(e) {
    e.preventDefault();
    var quarter = parseInt($(this).attr('data-step'));
    $(this).attr('data-step', quarter + 1);
    $('.quarter').hide();
    $('.quarter:eq(' + (quarter - 1) + ')').fadeIn('slow');
  });
}

function setupQuarterlyGoals() {
  // all events should be hidden to start
  $('.quarter a').text('Show events');
  $('.events').hide();

  // hide and show events
  $('.quarter a').bind('click', function() {
    var text = $(this).text();
    if(text === 'Hide events') {
      $(this).parent().siblings('.events').fadeOut('slow');
      $(this).text('Show events');
    } else {
      $(this).parent().siblings('.events').fadeIn('slow');
      $(this).text('Hide events');
    }
  });
}

function setupConnectionStrategies() {
  // all quarters and events should be hidden to start
  $('.quarter a').text('Show events');
  $('.events, .quarter, .choose-mine').hide();

  // top 4 connection strategies
  $('#target').sortable({
    items: '.sort',
    connectWith: '.connected',
    cancel: '.placeholder',
    receive: function(event, ui) {
      // maximum of 4 top connection strategies
      if($(this).children(':not(.placeholder)').length > 4) {
        $(ui.sender).sortable('cancel');
      } else {
        $(this).children('.placeholder').last().detach();
      }
    },
    remove: function(event, ui) {
      // append a placeholder when one is removed
      $(this).append($('<li class="sort placeholder">Select a connection strategy</li>'));
    }
  }).disableSelection();
  
  // complete list of connection strategies
  $('#available').sortable({
    items: '.sort',
    connectWith: '.connected'
  }).disableSelection();
  
  // identify a connection strategy for a quarter
  $('.single').sortable({
    items: '.sort',
    connectWith: '.connected',
    cancel: '.placeholder',
    receive: function(event, ui) {
      // maximum of 1 connection strategies
      if($(this).children(':not(.placeholder)').length > 1) {
        $(ui.sender).sortable('cancel');
      } else {
        $(this).children('.placeholder').hide();
      }
    },
    remove: function(event, ui) {
      // show the placeholder when the connection strategy is removed
      $(this).children('.placeholder').show();
    }
  }).disableSelection();

  // hide and show events
  $('.quarter a').bind('click', function() {
    var text = $(this).text();
    if(text === 'Hide events') {
      $(this).parent().siblings('.events').fadeOut('slow');
      $(this).text('Show events');
    } else {
      $(this).parent().siblings('.events').fadeIn('slow');
      $(this).text('Hide events');
    }
  });

  // setup the click to move from connection strategies overview to my connection strategies
  $('#next[data-step="1"]').live('click', function(e) {
    e.preventDefault();
    $('#diagram').hide();
    $('.choose-mine').fadeIn('slow');
    $('h1').text('My Connection Strategies');
    $('.instruction').html('<p>Now that you have good understanding of each connection strategy and you have a good sense of the world events that will affect your ideal client each quarter, choose the top four connection strategies for your business. Which four make the most sense for your year to come? List those in order below.</p><p>Select the top 4 connection strategies for your ideal client and drag them over in order of importance.</p>');
    $(this).attr('data-step', '2');
  });

  // setup the click to move from my connection strategies to quarterly connection strategies
  $('#next[data-step="2"]').live('click', function(e) {
    e.preventDefault();
    $('#available, #target + h3').hide();
    $('.quarter').fadeIn('slow');
    $('h1').text('Quarterly Connection Strategies');
    $('.instruction p').text('You\'ve identified the top four connection strategies for your business and you\'ve identified the quarterly events that affect your ideal client. With this knowledge, you\'re ready to choose which connection strategy you would like to implement by quarter. Drag and drop below.');
    $(this).attr('data-step', '3');
  });

  
}

function setupActionItems() {
  // hide the quarters that aren't active now
  $('.quarter').hide();
  $('.quarter:eq(0)').show();
  
  // all events should be hidden to start
  $('.quarter a').text('Show events');
  $('.events').hide();
  
  // add an action item
  $('.new-action').hide();
  $('#new-action').bind('click', function() {
    $(this).hide();
    $('.new-action').fadeIn('slow');
  });
  $('.new-action a').bind('click', function() {
    $(this).parent().hide();
    $('#new-action').fadeIn('slow');
  });
  
  // hide and show events
  $('.quarter a').bind('click', function() {
    var text = $(this).text();
    if(text === 'Hide events') {
      $(this).parent().siblings('.events').fadeOut('slow');
      $(this).text('Show events');
    } else {
      $(this).parent().siblings('.events').fadeIn('slow');
      $(this).text('Hide events');
    }
  });
  
  // hide and show action items
  $('.actions a').bind('click', function() {
    var text = $(this).text();
    if(text === 'Hide action items') {
      $(this).parent().next('ul').fadeOut('slow');
      $(this).text('Show action items');
    } else {
      $(this).parent().next('ul').fadeIn('slow');
      $(this).text('Hide action items');
    }
  });

  // setup the click to through action items for each quarter
  $('#next[data-step="1"], #next[data-step="2"], #next[data-step="3"]').live('click', function(e) {
    e.preventDefault();
    var quarter = parseInt($(this).attr('data-step'));
    $(this).attr('data-step', quarter + 1);
    $('.quarter').hide();
    $('.quarter:eq(' + quarter + ')').fadeIn('slow');
  });
}







