define([
    'jquery',
    'underscore',
    'backbone',
    'models/revenue',
    'views/build/oneyeargoal/revenue',
    'text!templates/build/oneyeargoal/revenues.html',
    'jqueryUISortable'
], function ($, _, Backbone, Revenue, RevenueView, RevenuesTemplate) {

    var RevenueListView = Backbone.View.extend({
        
        el: '.page',
        template: _.template(RevenuesTemplate),
        
        // TODO how do we get the breakeven point from the expenses on the previous pages?
        breakeven: 0,

        events: {
            'keypress .new-revenue input': 'createNew',
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

                        // Get the id of the current li, after removing 'revenue-'
                        var id = li.id.substring(8, li.id.length);
                        that.collection.forEach(function(model) {

                            // Match and update the model by id, order 0 = fixed.
                            if(model.get('id') === id && model.get('display_order') !== "0") {
                                model.set({ 'display_order': parseInt(order) + 1});
                            }
                        });
                    });
                }
            });
        },

        addOne: function(revenue) {
            // TODO we will calculate and store breakeven locally, remove it from the yii app
            if(revenue.get('name') == 'BREAKEVEN') {
                // TODO once removed from yii app, then don't need to remove from collection
                this.collection.remove(revenue);
                return;
            }
            
            // don't render a revenue without a name, also resolves need to remove collection.at(0)
            console.log(revenue.get('name'));
            if(revenue.get('name') == '') {
                // TODO why are there sometimes revenues without names created?
                console.log('removing ' + revenue.get('id'));
                this.collection.remove(revenue);
                return;
            }
        
            // create the revenue view and attach it to the list
            var revenueView = new RevenueView({
                model: revenue,
                id: "revenue-" + revenue.get('id')
            });
            revenueView.render();
            $('.sortable .new').before(revenueView.el);
        },

        addAll: function() {
            this.collection.forEach(this.addOne, this);
        },
        
        // determine the total percentage provided by all revenue streams entered
        calculateTotalPercent: function() {
            // loop over all revenues and sum up the total percentage
            var total = 0,
                percent = 0;
            this.collection.forEach(function(m) {
                percent = m.get('percent') ? parseInt(m.get('percent')) : 0;
                total += percent;
            }, this);

            this.totalPercent = total;

            // set the on screen total percentage
            $('.total .percent span').text(total);
        },
        
        // calculate the total revenue based on the breakeven point and revenue stream percentages
        calculateTotalRevenues: function(breakeven) {
            // previously validated that all percentages sum to 100%
            var totalRevenue = 0,
                totalPercent = 0,
                thisRevenue = 0,
                thisPercent = 0;
                
            this.breakeven = breakeven;
            
            this.collection.forEach(function(m) {
                thisPercent = m.get('percent') ? parseInt(m.get('percent')) : 0;
                thisRevenue = Math.round(thisPercent / 100 * this.breakeven);
                m.set({ 'revenue': thisRevenue });
                totalRevenue += thisRevenue;
                totalPercent += thisPercent;
            }, this);
            
            // set the on screen total revenue
            $('.total .revenue span:eq(0)').text(totalRevenue);
            $('.total .revenue span:eq(1) span').text(totalPercent);
        },
        
        update: function() {
            this.calculateTotalPercent();
        },

        setBreakEven: function(model) {
            var n = parseInt(model.get('sell_price'), 10);
            $('#breakeven').html('$ ' + n.toLocaleString());
        },
        
        // display the variable costs for each revenue stream
        showVariableCosts: function() {
            this.collection.getVariableCosts();
        },
        
        // display the units sold for each revenue stream
        showUnitsSold: function() {
            this.collection.getUnitsSold();
        },

        // create a new revenue using the form fields provided and user input
        createNew: function(e) {
            // create a new revenue on return
            if(e.keyCode !== 13) {
                return;
            }

            var revenue = new Revenue({
                name: $('.new .title input').val(),
                percent: $('.new .percent input').val(),
                display_order: this.collection.length + 1
            });

            // only add the revenue to the collection after the id has been updated
            var that = this;
            revenue.save(null, {
                silent: true,
                success: function(m) {
                    revenue.url = revenue.url.replace('/0', '/' + m.get('id'));
                    that.collection.add(revenue);
                    that.update();
                }
            });

            // reset the input fields on the new row
            $('.new .title input, .new .percent input').val('');
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
    
    return RevenueListView;
});
