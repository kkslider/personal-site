define([
    'jquery',
    'underscore',
    'backbone',
    'models/expense',
    'views/build/oneyeargoal/expense',
    'text!templates/build/oneyeargoal/expenses.html',
    'jqueryUISortable'
], function ($, _, Backbone, Expense, ExpenseView, ExpensesTemplate) {

    var ExpenseListView = Backbone.View.extend({

        el: '.page',
        template: _.template(ExpensesTemplate),
    
        // special handling for incidental expenses where input is % and amount is stored
        incidental: undefined,
        $incidentalField: undefined,
        incidentalPercent: undefined,

        // store current total.
        totalMonthly: 0,

        // Actual rows in view.
        rowCount: 0,
        
        events: {
            'keypress .new input': 'createNew',
            'blur .new .monthly input': 'createNew',
            'keypress .incidentals input': 'updateIncidentals',
            'blur .incidentals input': 'updateIncidentals',
        },

        initialize: function(options) {
            this.collection.on('add', this.addOne, this);
            this.collection.on('reset', this.addAll, this);
            this.collection.on('remove', this.update, this);

            // events triggered on a model in a collection will also be triggered on the collection
            this.collection.on('change', this.update, this);
        },

        render: function() {
            this.$el.html(this.template({ dataType : $('li.new').attr('data-type') }));
            this.addAll();

            // Attaching sorting.
            var that = this;
            $('.sortable').sortable({

                items: '.sort',
                update: function (event, ui) {

                    // Loop all to get the latest position of each items.
                    $('.sortable').children().each(function(order, li) {

                        // Get the id of the current li
                        var id = li.id;
                        that.collection.forEach(function(model) {

                            // Match and update the model by id, order 0 = fixed.
                            if(model.get('id') === id && model.get('order') !== "0") {
                                model.set({ order: parseInt(order) + 1});
                            }
                        });
                    });
                }
            });
        },

        addOne: function(expense) {
            // special handling for incidental expenses
            if(expense.get('name') == 'INCIDENTALS') {
                this.initializeIncidentals(expense);
                return;
            }
            
            // don't render an expense without a name, also resolves need to remove collection.at(0)
            if(expense.get('name') == '') {
                return;
            }

            // create the expense view and attach it to the list
            var expenseView = new ExpenseView({ model: expense, id: expense.get('id') });
            expenseView.render();
            $('.sortable .new').before(expenseView.el);
            
            if(expense.get('name') === 'Owner\'s Salary') {
                $(expenseView.el).removeClass('sort').find('i').detach();
            }

        },

        addAll: function() {
            this.collection.forEach(this.addOne, this);
            this.displayIncidentalsPercent();
        },
        
        update: function() {
            console.log('collection updated.');
            this.updateTotalExpenses();
            this.updateIncidentals();
        },

        // compute total expenses including incidentals and update monthly and yearly to screen
        updateTotalExpenses: function() {
            // loop over all expenses and sum up the total monthly amounts
            this.total = 0;
            this.collection.forEach(function(m) {
                this.total += parseInt(m.get('monthly_cost'));
            }, this);

            // set the on screen totals including incidentals
            $('.total .monthly span').text(this.total);
            $('.total .yearly span').text(parseInt(this.total) * 12);
        },

        // display an updated incidentals percentage based on all known expenses        
        displayIncidentalsPercent: function() {
            // if we don't have the incidentals expense yet, exit
            if(this.incidental === undefined) {
                return;
            }
            
            // get the current total expenses then compute the incidentals percentage
            this.updateTotalExpenses();
            if(this.incidental.get('monthly_cost') == 0) {
                $('.incidentals input').val('10');
            } else {
                var incidentalMonthly = Math.floor(parseFloat(this.incidental.get('monthly_cost')));
                $('.incidentals input').val(Math.round((incidentalMonthly / (this.total - incidentalMonthly)) * 100));              
            }
            
        },
        
        // update the incidentals monthly amounts
        updateIncidentals: function(e) {
            if(e && e.keyCode && e.keyCode !== 13) {
                return;
            }
            
            // if the incidental hasn't been fetched yet, then return
            // no reason why this should happen, but let's be safe
            if(this.incidental === undefined) {
                return;
            }

            // Validate required.
            this.$incidentalField = $('li.incidentals[data-type="' +  $('li.new').attr('data-type') + '"] input');
            var validate = this.validateRequired(this.$incidentalField, 'Incidental is required.');
            if (!validate)
                return;

            // Validate numeric.
            var validate = this.validateNumeric(this.$incidentalField, 'Incidental should be numeric.');
            if(!validate)
                return

            //
            var previousIncidentalPercent = this.incidentalPercent,
                newIncidentalPercent = this.$incidentalField.val();

            // if the new incidental percentage isn't a number, then revert the value
            if(isNaN(parseFloat(newIncidentalPercent)) || !isFinite(newIncidentalPercent)) {
                this.$incidentalField.val(previousIncidentalPercent);
                // TODO highlight the error and alert the user
                return;
            }
            
            // update the incidental percentage and set the monthly and yearly amounts
            var newMonthlyAmount = Math.round((parseFloat(newIncidentalPercent) / 100) * (this.total - this.incidental.get('monthly_cost')), 2);
            this.incidental.set({ 'monthly_cost' : newMonthlyAmount });
            $('.incidentals .monthly span').html(newMonthlyAmount);
            $('.incidentals .yearly span').html(newMonthlyAmount * 12);
        },

        // set incidentals when expenses are initially fetched
        initializeIncidentals: function(expense) {
            this.incidental = expense;
            this.$incidentalField = $('li.incidentals[data-type="' +  $('li.new').attr('data-type') + '"] input');
            var incidentalMonthly = parseInt(this.incidental.get('monthly_cost'));
            $('.incidentals .monthly span').html(incidentalMonthly);
            $('.incidentals .yearly span').html(incidentalMonthly * 12);
        },
        
        // create a new expense using the form fields provided and user input
        createNew: function(e) {
            // create a new expense on return, or on amount input blur, per event above
            if(e.keyCode && e.keyCode !== 13) {
                return;
            }
            
            // don't do anything if nothing was entered
            if($('.new .title input').val() === '' && $('.new .title input').val() === '') {
                $('.new .title input').removeClass('invalid');
                $('.new .monthly input').removeClass('invalid');
                return;
            }

            // validate title.
            var $input = $('.new .title input');
            var errorMessage = 'Title is required.';
            var validate = this.validateRequired($input, errorMessage);
            if(!validate)
                return;

            // validate Monthly Cost required.
            $input = $('.new .monthly input');
            errorMessage = 'Monthly Cost is required.';
            validate = this.validateRequired($input, errorMessage);
            if(!validate)
                return;

            // validate Monthly Cost numeric.
            errorMessage = 'Monthly cost should be a numeric.';
            validate = this.validateNumeric($input, errorMessage);
            if(!validate)
                return;

            // Validate Duplicates.
            $input = $('.new .title input');
            errorMessage = 'Title already exists, please use different name.';
            validate = this.validateDuplicates($input, errorMessage);
            if(!validate)
                return;

            var expense = new Expense({
                name: $('.new .title input').val(),
                monthly_cost: $('.new .monthly input').val(),
                is_personal: $('li.new').attr('data-type') === 'personal' ? 1 : 0,
            });

            // only add the expense to the collection after the id has been updated
            var that = this;
            expense.save(null, {
                silent: true,
                success: function(m) {
                    expense.url = expense.url.replace('/0', '/' + m.get('id'));
                    that.collection.add(expense);
                    that.update();
                }
            });
            
            // reset the input fields on the new row
            $('.new .title input, .new .monthly input').val('');
        },

        validateDuplicates: function($input, errorMessage) {
            var validate = true;
            this.collection.forEach(function(m) {
                if(m.get('name') === $input.val()) {
                    validate = false;
                    return;
                }
            });
            if (validate) {
                if ($input.length) {
                    $input.removeClass('invalid');
                    $('#errorMessage').remove();
                    return true;
                }
            } else {
                if ($input.length && !$input.hasClass('invalid')) {
                    $input.addClass('invalid').focus();
                    $('.instruction').after('<div id="errorMessage" class="error">'+errorMessage+'</div>');
                    return false;
                }
            }
        },

        validateNumeric: function($input, errorMessage) {
            if(!isNaN($input.val())) {
                if ($input.length) {
                    $input.removeClass('invalid');
                    $('#errorMessage').remove();
                    return true;
                }
            } else {
                if ($input.length && !$input.hasClass('invalid')) {
                    $input.addClass('invalid').focus();
                    $('.instruction').after('<div id="errorMessage" class="error">'+errorMessage+'</div>');
                    return false;
                }
            }
        },

        validateRequired: function($input, errorMessage) {
            if($input.val() !== '') {
                if ($input.length) {
                    $input.removeClass('invalid');
                    $('#errorMessage').remove();
                    return true;
                }
            } else {
                if ($input.length && !$input.hasClass('invalid')) {
                    $input.addClass('invalid').focus();
                    $('.instruction').after('<div id="errorMessage" class="error">'+errorMessage+'</div>');
                    return false;
                }
            }
        },

        // remove the events on current view when page changes
        clean: function() {
            this.undelegateEvents();
            this.incidental = undefined;
            if(this.collection != undefined) {
                this.collection.sort();
                this.collection.off();
            }
            this.collection = undefined;
            $('input').val('');
        }
    });
    
    return ExpenseListView;
});
