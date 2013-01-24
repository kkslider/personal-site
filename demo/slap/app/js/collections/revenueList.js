define([
    'jquery',
    'underscore',
    'backbone',
    'models/revenue'
], function ($, _, Backbone, Revenue) {

    var RevenueList = Backbone.Collection.extend({
        model: Revenue,
        url:'api/revenues',
        
        getVariableCosts: function() {
            this.models.forEach(function(revenue) {
                revenue.getVariableCosts();
            });
        },
        
        getUnitsSold: function() {
            this.models.forEach(function(revenue) {
                revenue.calculateUnitsSold();
            });
        },

        comparator : function(model) {
            return model.get('display_order');
        }
    });
    
    return RevenueList;
});
