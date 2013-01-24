define([
    'jquery',
    'underscore',
    'backbone',
    'collections/revenueCostList',
], function ($, _, Backbone, RevenueCostList) {

    var Revenue = Backbone.Model.extend({
    
        // TODO what are these for? do we need them?
        defaults: {
            id: 0,
            name: '',
            percent: 0,
            revenue: 0,
            sell_price: 0,
            units: 0,
        },
        
        url: 'api/revenue',
        revenueCostList: undefined,
        
        initialize: function(options) {
            // the url for a revenue is api/revenue/[id]
            this.url = this.url + '/' + this.get('id');

            // saves the model when a value is changed
            var that = this;
            this.bind('change', function() {
                that.save(null, { silent: true });
            });
        },
        
        // update the url of the model after the first save on a new model
        success: function(m) {
            if (m.get('id') != 0)
                this.url = this.url.replace('/0', '/' + m.get('id'));
        },
        
        // TODO add validation that monthly amount is a digit
        validation: {
            name: {
                required: true,
                msg: 'Title is required'
            },

            percent: function(value) {

                if(this.step !== undefined && this.step > 4) {

                    if(value === "")
                        return 'Percent is required';

                    if(isNaN(value))
                        return 'Percent should be numeric.';

                    if(value === 0)
                        return 'Percent should be greater then zero.';

                    var cost = parseFloat(value);
                    if(cost < 0)
                        return 'Percent should not be negative.';
                }
            },
                percent: function(value) {

            if(this.step !== undefined && this.step > 4) {

                if(value === "")
                    return 'Percent is required';

                if(isNaN(value))
                    return 'Percent should be numeric.';

                if(value === 0)
                    return 'Percent should be greater then zero.';

                var cost = parseFloat(value);
                if(cost < 0)
                    return 'Percent should not be negative.';
            }
        },
        },
        
        // start building the variable costs for each revenue stream
        getVariableCosts: function() {
            console.log('getVariableCosts');
            var that = this,
                revenueId = this.get('id'),
                sellPrice = this.get('sell_price');
            this.revenueCostList = new RevenueCostList({ revenue_id: revenueId });
            this.revenueCostList.fetch( {
                success: function() {
                    // TODO Not a good way to create Views in model :(.
                    require([
                        'views/build/oneyeargoal/revenueCostList'], function(RevenueCostListView) {
                            var revenueCostListView = new RevenueCostListView({
                                collection: that.revenueCostList,
                                revenueId: revenueId,
                                netRevenue: sellPrice,
                                revenueStream: that,
                            });
                            that.revenueCostListView = revenueCostListView;
                            revenueCostListView.render();
                    });
            }});
        },
        
        // determine the number of units that need to be sold given the sales price and total revenue
        calculateUnitsSold: function() {
            var revenue = this.get('revenue') ? parseInt(this.get('revenue')) : 0,
                netRevenue = this.revenueCostList.netRevenue ? this.revenueCostList.netRevenue : 1;
            console.log('calculate units sold ' + this.get('id') + ' ' + revenue + ' ' + netRevenue);
            this.set({ 'units' : Math.round(revenue / netRevenue) });
            this.save();
        },
    });
    
    return Revenue;
});
