define([
    'jquery',
    'underscore',
    'backbone',
    'models/revenueCost',
    'views/build/oneyeargoal/revenueCost',
    'text!templates/build/oneyeargoal/revenueCosts.html',
    'jqueryUISortable'
], function ($, _, Backbone, RevenueCost, RevenueCostView, RevenueCostsTemplate) {

    var RevenueCostListView = Backbone.View.extend({

        el: '',
        template: _.template(RevenueCostsTemplate),
        revenueId: '',
        revenueStream: undefined,
        
        events: {
            'keypress .new-cost input': 'createNew',
        },

        initialize: function(options) {
            this.collection.on('add', this.addOne, this);
            this.collection.on('reset', this.addAll, this);
            this.collection.on('remove', this.update, this);

            // events triggered on a model in a collection will also be triggered on the collection
            this.collection.on('change', this.update, this);
            
            if(options && options.revenueId) {
                this.revenueId = options.revenueId;
            }
            if(options && options.revenueStream) {
                this.revenueStream = options.revenueStream;
            }
        },

        render: function() {
            $('.sortable li#revenue-' + this.revenueId)
                .after($('<li id="revenueCosts-' + this.revenueId + '"></li>')
                    .html(this.$el.html(this.template({ netRevenue: this.netRevenue }))));
            this.addAll();

            // Attaching sorting.
            var that = this;
            $('li#revenueCosts-' + that.revenueId + ' .sortable').sortable({

                items: '.sort',
                update: function (event, ui) {

                    // Loop all to get the latest position of each items.
                    $('li#revenueCosts-' + that.revenueId + ' .sortable').children().each(function(order, li) {

                        // Get the id of the current li, after removing 'revenueCosts-'
                        var id = li.id.substring(13, li.id.length);
                        console.log('li.id: ' + li.id);
                        that.collection.forEach(function(model) {
                            console.log(model.get('order') + ' ' + model.get('cost_name'));
                            console.log(model.get('id') + ' ' + id);

                            // Match and update the model by id, order 0 = fixed.
                            if(model.get('id') === id && model.get('order') !== "0") {
                                model.set({ 'order': parseInt(order) + 1});
                            }
                        });
                    });
                }
            });
        },

        addOne: function(revenueCost) {
            // don't render a revenue cost without a name, also resolves need to remove collection.at(0)
            if(revenueCost.get('cost_name') == '') {
                return;
            }
        
            // create the revenue cost view and attach it to the list
            var revenueCostView = new RevenueCostView({
                model: revenueCost,
                id: 'revenueCosts-' + revenueCost.get('id')
            });
            revenueCostView.render();
            $('li#revenueCosts-' + revenueCost.get('revenue_id') + ' .new').before(revenueCostView.el);
        },

        addAll: function() {
            this.collection.forEach(this.addOne, this);
            this.update();
        },
        
        update: function() {
            // get the sales price for this revenue stream
            var $revenueStreamLi = $('li#revenue-' + this.revenueId),
                revenueStreamAmount = $revenueStreamLi.find('.amount input').val();
            
            // sum up all variable costs in the collection
            var total = 0;
            this.collection.forEach(function(m) {
                total += m.get('amount') ? parseInt(m.get('amount')) : 0;
            }, this);
            
            // update the total with the difference
            //console.log(this.collection.netRevenue);
            //console.log(revenueStreamAmount);
            //console.log(total);
            this.collection.netRevenue = revenueStreamAmount - total;
            // TODO netRevenue should bind with the template so we don't have to use jQuery here
            $('li#revenueCosts-' + this.revenueId + ' .total .amount span')
                .text(this.collection.netRevenue);
            
            // TODO update the units sold
            this.revenueStream.calculateUnitsSold();
        },

        // create a new revenue using the form fields provided and user input
        createNew: function(e) {
            // create a new revenue on return
            if(e.keyCode !== 13) {
                return;
            }

            // validate title.
            var $input = this.$('.new .title input');
            var errorMessage = 'Title is required.';
            var validate = this.validateRequired($input, errorMessage);
            if(!validate)
                return;

            // Validate Duplicates.
            $input = this.$('.new .title input');
            errorMessage = 'Title already exists, please use different name.';
            validate = this.validateDuplicates($input, errorMessage);
            if(!validate)
                return;

            // validate Amount required.
            $input = this.$('.new .amount input');
            errorMessage = 'Amount is required required.';
            validate = this.validateRequired($input, errorMessage);
            if(!validate)
                return;

            // validate Amount numeric.
            errorMessage = 'Amount should be a numeric.';
            validate = this.validateNumeric($input, errorMessage);
            if(!validate)
                return;

            // validate Amount numeric.
            errorMessage = 'Amount should be greater then zero.';
            validate = this.validateZero($input, errorMessage);
            if(!validate)
                return;



            var revenueCost = new RevenueCost({
                cost_name: $('li#revenueCosts-' + this.revenueId + ' .new .title input').val(),
                amount: $('li#revenueCosts-' + this.revenueId + ' .new .amount input').val(),
                revenue_id: this.revenueId,
                order: this.collection.length + 1
            });

            // only add the revenue to the collection after the id has been updated
            var that = this;
            revenueCost.save(null, {
                silent: true,
                success: function(m) {
                    revenueCost.url = revenueCost.url.replace('/0', '/' + m.get('id'));
                    that.collection.add(revenueCost);
                    that.update();
                }
            });

            // reset the input fields on the new row
            $('li#revenueCosts-' + this.revenueId + ' .new .title input').val('');
            $('li#revenueCosts-' + this.revenueId + ' .new .amount input').val('');
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
            }
            else
            {
                if ($input.length && !$input.hasClass('invalid')) {
                    $input.addClass('invalid').focus();
                    $('.instruction').after('<div id="errorMessage" class="error">'+errorMessage+'</div>');
                    return false;
                }
            }
        },

        validateZero: function($input, errorMessage) {
            if(parseFloat($input.val()) !== 0) {
                if ($input.length) {
                    $input.removeClass('invalid');
                    $('#errorMessage').remove();
                    return true;
                }
            }
            else
            {
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
            }
            else
            {
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
            }
            else
            {
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
            if(this.collection != undefined) {
                this.collection.sort();
                this.collection.off();
            }
            this.collection = undefined;
            $('input').val('');
        }
    });
    
    return RevenueCostListView;
});
