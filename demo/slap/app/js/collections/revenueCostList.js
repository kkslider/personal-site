define([
    'jquery',
    'underscore',
    'backbone',
    'models/revenueCost'
], function ($, _, Backbone, RevenueCost) {

    var RevenueCostList = Backbone.Collection.extend({
        model: RevenueCost,
        
        // revenuecosts/filter/[revenue_id]
        url:'api/revenueCosts',
        revenueId: undefined,

        // store net revenue = revenue sales price - sum(costs)
        netRevenue: 0,
        
        initialize: function(options) {
            if(options && options.revenue_id) {
                this.url += '/filter/' + options.revenue_id;
                this.revenueId = options.revenue_id;
            }
            if(options && options.netRevenue) {
                this.netRevenue = options.netRevenue;
            }
        },
        
        // when revenue is deleted, then remove all revenue costs
        empty: function() {
            this.models.forEach(function(revenue) {
                revenue.destroy();
            });
        },

        comparator : function(model) {
            return model.get('order');
        }
        
    });

    return RevenueCostList;
});
