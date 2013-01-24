define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    var RevenueCost = Backbone.Model.extend({

        defaults: {
            id: 0,
            cost_name: 'Add another',
            amount: 0,
            revenue_id: 0,
            order: 1,
        },
        
        url: 'api/revenueCosts',
        
        initialize: function(options) {
            // the url for a revenue is api/revenueCosts/[id]
            this.url = this.url + '/' + this.get('id');
            
            // saves the model when a value is changed
            var that = this;
            this.bind('change', function() {
                that.save(null, { silent: true });
            });
        },
        
        // update the url of the model after the first save on a new model
        success: function(m) {
            if (m.get('id') != 0) {
                this.url = this.url.replace('/0', '/' + m.get('id'));
            }
        },
        
        // TODO add validation that monthly amount is a digit
        // TODO add validation that monthly amount is a digit
        validation: {
            cost_name: {
                required: true,
                msg: 'Title is required'
            },

            amount: function(value) {

//                if(this.step !== undefined && this.step > 4) {

                    if(value === "")
                        return 'Amount is required';

                    var cost = parseFloat(value);
                    if(isNaN(cost))
                        return 'Amount should be numeric.';

                    if(cost === 0)
                        return 'Amount should be greater then zero.';

                    if(cost < 0)
                        return 'Amount should not be negative.';
//                }
            },
        },
    });
    
    return RevenueCost;
});
