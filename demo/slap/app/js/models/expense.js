define([
    'jquery',
    'underscore',
    'backbone',
    'backboneValidation'
], function ($, _, Backbone, BackboneValidation) {

    var Expense = Backbone.Model.extend({
        
        // TODO what are these for? do we need them?
        defaults: {
            id: 0,
            name: '',
            monthly_cost: 0,
            yearly_cost: 0,
            is_personal: 0,
            order: 1,
        },
        
        url: 'api/expenses',

        validation: {

            name: {
                required: true,
                msg: 'Title is required.'
            },

            monthly_cost: function(value) {
                if(value === "")
                    return 'Monthly Cost is required';

                if(isNaN(value))
                    return 'Monthly Cost should be numeric.';

                if(value === "0")
                    return 'Monthly Cost should be greater then zero.';

                var cost = parseFloat(value);
                if(cost < 0)
                    return 'Monthly Cost should not be negative.';

            }
        },
        
        initialize: function(options) {
            // the url for an expense is api/expenses/[id]
            //this.url = this.url + '/' + this.id;
            this.url = this.url + '/' + this.get('id');
            
            // set the yearly amount and recalculate when changed
            this.updateYearly();
            this.bind('change:monthly_cost', this.updateYearly);
            
            // saves the model when a value is changed
            var that = this;
            this.bind('change', function() {
                that.save(null, { silent: true });
            });
        },
        
        // update the yearly amount when the monthly amount is changed
        updateYearly: function() {
            this.set({ yearly_cost: parseInt(this.get('monthly_cost')) * 12 });
        },
        
        // update the url of the model after the first save on a new model
        success: function(m) {
            console.log('success in expense model');
            if (m.get('id') != 0)
                this.url = this.url.replace('/0', '/' + m.get('id'));
        },
        
    });
    
    return Expense;
});
